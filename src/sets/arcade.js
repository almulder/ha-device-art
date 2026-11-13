(function () {
  const P_ = "hda-arcade-";
  const N = () => window.HDAH;
  const f = (n) => (+n).toFixed(1);
  const n3 = (n) => (+n).toFixed(3);
  const rnd = (seed) => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
  const RED = "#c8303a", BLU = "#2a5cc4", BLK = "#2a2b31", PUR = "#6a3db3", ORG = "#e2762b", TEAL = "#18898a", WOOD = "#8a5a33", YEL = "#e8b923", PNK = "#d63c8c";
  const NEON = ["#ff3fa4", "#3fd0ff", "#ffd23f", "#7bff6a", "#b77bff"];

  const stops = (a) => a.map(([o, c, op]) => `<stop offset="${o}" stop-color="${c}"${op == null ? "" : ` stop-opacity="${op}"`}/>`).join("");
  const lg = (id, a, x1, y1, x2, y2) => `<linearGradient id="${id}" x1="${x1 || 0}" y1="${y1 || 0}" x2="${x2 == null ? 1 : x2}" y2="${y2 || 0}">${stops(a)}</linearGradient>`;
  const rg = (id, a, cx, cy, r) => `<radialGradient id="${id}" cx="${cx == null ? .5 : cx}" cy="${cy == null ? .5 : cy}" r="${r || .5}">${stops(a)}</radialGradient>`;
  const poly = (pts) => "M" + pts.map((p) => f(p[0]) + " " + f(p[1])).join("L") + "Z";
  const M = (O, U, V) => `matrix(${n3(U[0])} ${n3(U[1])} ${n3(V[0])} ${n3(V[1])} ${n3(O[0])} ${n3(O[1])})`;
  const mk = (kx, ky, X0) => (xf, d, h) => [X0 + xf + kx * d, -h - ky * d];
  const sub = (a, b, k) => [(a[0] - b[0]) / k, (a[1] - b[1]) / k];
  const BGW = (t) => `<g class="hda-bg">${t}</g>`;
  const room = (...a) => BGW(room_(...a));

  function ctx(o) {
    const u = o.uid, on = !!o.on, lv = o.level == null ? .7 : o.level;
    return { o, u, on, lv, c: o.color || RED, id: (s) => `${u}-${s}`, url: (s) => `url(#${u}-${s})`, n: 0 };
  }
  const gid = (x, s) => x.id(s + (x.n++));

  function defs(x, extra) {
    const h = N(), c = x.c, id = x.id;
    return `<defs>
${lg(id("sd"), [[0, h.shade(c, .22)], [.5, c], [1, h.shade(c, -.42)]], 0, 0, 1, 1)}
${lg(id("lam"), [[0, "#3a3b42"], [1, "#16171b"]], 0, 0, 0, 1)}
${lg(id("tp"), [[0, "#4a4b52"], [1, "#2a2b30"]], 0, 0, 0, 1)}
${lg(id("chr"), [[0, "#5f666d"], [.45, "#eef1f3"], [.6, "#b6bcc2"], [1, "#4e545b"]])}
${lg(id("glr"), [[0, "#fff", .22], [.4, "#fff", .04], [.41, "#fff", 0]], 0, 0, 1, 1)}
${lg(id("dn"), [[0, "#000", .55], [1, "#000", 0]], 0, 0, 0, 1)}
${lg(id("off"), [[0, "#1d232b"], [1, "#07090c"]], 0, 0, 0, 1)}
${lg(id("wd"), [[0, "#a36d3e"], [.5, "#7a4b28"], [1, "#4f2e17"]], 0, 0, 1, 1)}
${rg(id("cs"), [[0, "#000", .65], [1, "#000", 0]])}
${rg(id("ball"), [[0, "#fff"], [.4, "#c9d0d6"], [1, "#4b525a"]], .35, .3, .7)}
${rg(id("vig"), [[0, "#000", 0], [.66, "#000", .06], [1, "#000", .5]], .5, .45, .75)}
${rg(id("scv"), [[0, "#000", 0], [.7, "#000", .1], [1, "#000", .55]])}
<clipPath id="${id("wc")}"><rect x="8" y="8" width="184" height="184" rx="16"/></clipPath>
<clipPath id="${id("sc")}"><rect width="100" height="75"/></clipPath>
<filter id="${id("bl")}" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="2"/></filter>
${extra || ""}</defs>`;
  }
  function svg(x, body) {
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs(x)}<g clip-path="${x.url("wc")}">${body}<g class="hda-bg"><rect x="8" y="8" width="184" height="184" fill="${x.url("vig")}"/></g></g><rect class="hda-bg" x="8.5" y="8.5" width="183" height="183" rx="15.5" fill="none" stroke="#fff" stroke-opacity=".08"/></svg>`;
  }

  function room_(x, fy, wallC, neon, seed) {
    const h = N(), g = gid(x, "wl"), r = rnd(seed || 9); wallC = wallC || "#241c3a"; neon = neon || NEON[(seed || 0) % 5];
    let s = `${lg(g, [[0, h.shade(wallC, .1)], [1, h.shade(wallC, -.35)]], 0, 0, 0, 1)}<rect x="8" y="8" width="184" height="${fy - 8}" fill="url(#${g})"/>`;
    let d = ""; for (let xx = 20; xx < 192; xx += 24) d += `M${xx} 30V${fy}`;
    s += `<path d="${d}" stroke="#000" stroke-opacity=".18"/><rect x="8" y="${fy - 22}" width="184" height="3" fill="#000" fill-opacity=".25"/>`;
    s += `<path d="M8 26H192" stroke="${neon}" stroke-width="7" stroke-opacity="${x.on ? .25 : .08}"/><path d="M8 26H192" stroke="${x.on ? h.shade(neon, .5) : h.shade(neon, -.5)}" stroke-width="2"/>`;
    const cg = gid(x, "cp");
    s += `${lg(cg, [[0, "#0d0b18"], [1, "#1c1830"]], 0, 0, 0, 1)}<rect x="8" y="${fy}" width="184" height="${192 - fy}" fill="url(#${cg})"/><rect x="8" y="${fy}" width="184" height="6" fill="${x.url("dn")}" opacity=".6"/>`;
    for (let i = 0; i < 46; i++) {
      const cx = 8 + r() * 184, cy = fy + 3 + r() * (192 - fy), col = NEON[(r() * 5) | 0], t = r();
      s += t < .35 ? `<circle cx="${f(cx)}" cy="${f(cy)}" r="1.1" fill="${col}" opacity=".45"/>` : t < .7 ? `<path d="M${f(cx)} ${f(cy)}l2.4 -1.6l-.4 2.6z" fill="${col}" opacity=".4"/>` : `<path d="M${f(cx)} ${f(cy)}q1.5 -2 3 0t3 0" fill="none" stroke="${col}" stroke-width=".8" opacity=".4"/>`;
    }
    return s;
  }

  const carS = (cx, cy, s, col, cls) => `<g transform="translate(${cx} ${cy}) scale(${s})"><g${cls ? ` class="${cls}"` : ""}><rect x="-12" y="-6" width="24" height="7" rx="2" fill="${col}"/><path d="M-8 -6L-5 -11H5L8 -6Z" fill="${N().shade(col, -.35)}"/><rect x="-5" y="-10" width="10" height="3" fill="#9fd8ff"/><rect x="-13" y="0" width="6" height="3.4" rx="1" fill="#111"/><rect x="7" y="0" width="6" height="3.4" rx="1" fill="#111"/><rect x="-11" y="-4" width="3" height="1.6" fill="#ff4a4a"/><rect x="8" y="-4" width="3" height="1.6" fill="#ff4a4a"/></g></g>`;
  const GAMES = {
    road(x, night) {
      const g = gid(x, "sk");
      return `${lg(g, night ? [[0, "#0b1030"], [1, "#3c2a6c"]] : [[0, "#ff6f61"], [.6, "#ffad6b"], [1, "#ffd98a"]], 0, 0, 0, 1)}<rect width="100" height="35" fill="url(#${g})"/>
${night ? `<circle cx="80" cy="9" r="4" fill="#f4f0d8"/>${[6, 14, 20, 28, 60, 68, 76, 88].map((a, i) => `<rect x="${a}" y="${24 - (i % 3) * 4}" width="6" height="${11 + (i % 3) * 4}" fill="#1b1840"/><rect x="${a + 1.5}" y="${27 - (i % 3) * 4}" width="1.4" height="1.4" fill="#ffd36b"/>`).join("")}` : `<circle cx="50" cy="27" r="11" fill="#fff1a0"/><path d="M38 24H62M39 28H61M41 32H59" stroke="#ff8a5c" stroke-width="1.4"/>`}
<path d="M0 35L12 25L24 31L38 21L52 31L66 23L80 30L100 22V35Z" fill="${night ? "#16133a" : "#874070"}"/><rect y="35" width="100" height="40" fill="${night ? "#0c2618" : "#3f8f3a"}"/>
<path d="M47 35H53L96 75H4Z" fill="#383a42"/><path d="M47 35L4 75M53 35L96 75" stroke="#d6283b" stroke-width="2.6"/><path class="${P_}dash" d="M47 35L4 75M53 35L96 75" stroke="#fff" stroke-width="2.6" stroke-dasharray="3 3"/>
<path class="${P_}dash" d="M50 35V75" stroke="#f5e663" stroke-width="1.3" stroke-dasharray="4 5"/>${carS(53, 45, .38, "#3a7bff")}${carS(50, 67, 1, night ? "#ff3fa4" : "#e02b2b", P_ + "bob")}`;
    },
    space(x) {
      const r = rnd(31); let st = "";
      for (let i = 0; i < 34; i++) { const cx = r() * 100, cy = r() * 75, rr = .3 + r() * .7, op = (.4 + r() * .6).toFixed(2); st += `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(rr)}" fill="#fff" opacity="${op}"/><circle cx="${f(cx)}" cy="${f(cy - 75)}" r="${f(rr)}" fill="#fff" opacity="${op}"/>`; }
      let sau = ""; for (let i = 0; i < 5; i++) sau += `<ellipse cx="${18 + i * 16}" cy="16" rx="4.4" ry="1.7" fill="#c3c9d4"/><path d="M${15.6 + i * 16} 15.4A2.4 2.4 0 0 1 ${20.4 + i * 16} 15.4Z" fill="#6ff0c2"/>`;
      return `<rect width="100" height="75" fill="#05060f"/><circle cx="20" cy="40" r="26" fill="#5b2a9a" opacity=".18"/><g class="${P_}sy">${st}</g><circle cx="84" cy="12" r="7" fill="#d9773a"/><path d="M75 14Q84 9 93 12" stroke="#f7c98a" stroke-width="1.2" fill="none"/>
<g class="${P_}bob">${sau}</g><rect class="${P_}blink" x="49.4" y="30" width="1.2" height="26" fill="#ff5ad1"/>
<g transform="translate(50 64)"><path d="M-1.5 -8h3v3h2v3h3v4h-3v2h-2v-2h-3v2h-2v-2h-3v-4h3v-3h2z" fill="#5fd0ff"/><rect x="-1" y="-6" width="2" height="2" fill="#fff"/><rect class="${P_}blink" x="-1" y="4" width="2" height="3" fill="#ffa53a"/></g>`;
    },
    fight(x) {
      const g = gid(x, "fs");
      const ft = (px, col, dir, cls) => `<g transform="translate(${px} 60) scale(${dir} 1)"><g class="${cls}"><path d="M-3 0L-1 -12L3 0" fill="none" stroke="${col}" stroke-width="3" stroke-linejoin="round"/><rect x="-3.4" y="-24" width="6.8" height="13" rx="2" fill="${col}"/><circle cx="0" cy="-27.5" r="3.6" fill="${N().shade(col, .3)}"/><path d="M2 -21L11 -22" stroke="${col}" stroke-width="2.6" stroke-linecap="round"/><circle cx="11.5" cy="-22" r="1.8" fill="#fff"/><path d="M-2 -20L-6 -14" stroke="${col}" stroke-width="2.4" stroke-linecap="round"/><rect x="-3.4" y="-13" width="6.8" height="1.4" fill="#111"/></g></g>`;
      return `${lg(g, [[0, "#3a1760"], [.7, "#d1527a"], [1, "#ffb36b"]], 0, 0, 0, 1)}<rect width="100" height="75" fill="url(#${g})"/><circle cx="50" cy="40" r="14" fill="#ffd27a" opacity=".7"/>
${[0, 9, 17, 27, 64, 72, 82, 91].map((a, i) => `<rect x="${a}" y="${30 + (i % 3) * 5}" width="9" height="30" fill="#24123c"/>`).join("")}<rect y="58" width="100" height="17" fill="#3a2a2a"/><path d="M50 58L20 75M50 58L80 75M0 64H100" stroke="#000" stroke-opacity=".3"/>
${ft(36, "#3fa8ff", 1, P_ + "bob")}${ft(64, "#ff4a4a", -1, P_ + "bob2")}<rect x="5" y="5" width="38" height="4.4" fill="#111" stroke="#fff" stroke-width=".6"/><rect x="5.6" y="5.6" width="30" height="3.2" fill="#ffd23f"/><rect x="57" y="5" width="38" height="4.4" fill="#111" stroke="#fff" stroke-width=".6"/><rect x="66" y="5.6" width="28.4" height="3.2" fill="#ffd23f"/><circle cx="50" cy="7.2" r="3.4" fill="#111" stroke="#ffd23f" stroke-width=".8"/>`;
    },
    golf(x) {
      const g = gid(x, "gs");
      return `${lg(g, [[0, "#58b4ff"], [1, "#bfe6ff"]], 0, 0, 0, 1)}<rect width="100" height="40" fill="url(#${g})"/><ellipse cx="22" cy="10" rx="9" ry="3" fill="#fff" opacity=".85"/><ellipse cx="70" cy="14" rx="12" ry="3" fill="#fff" opacity=".7"/>
<rect y="30" width="100" height="45" fill="#2f7a2e"/>${[4, 12, 20, 82, 90, 97].map((a) => `<circle cx="${a}" cy="30" r="5" fill="#1d5521"/>`).join("")}<path d="M0 75C20 60 30 50 50 46S80 40 100 42V75Z" fill="#4fae3e"/><ellipse cx="68" cy="42" rx="15" ry="4.6" fill="#7fd45e"/><ellipse cx="72" cy="42.6" rx="1.4" ry=".6" fill="#111"/>
<path d="M72 42.4V27" stroke="#fff" stroke-width=".8"/><path class="${P_}wave" d="M72 27L80 29.5L72 32Z" fill="#ff3b3b"/><path d="M20 66Q44 6 70 40" fill="none" stroke="#fff" stroke-dasharray="1 2" stroke-width=".7" opacity=".8"/>
<g class="${P_}golfb"><circle r="1.6" fill="#fff"/></g><rect x="4" y="22" width="5" height="44" fill="#111" stroke="#fff" stroke-width=".5"/><rect class="${P_}pow" x="4.6" y="40" width="3.8" height="25.4" fill="#ffd23f"/>`;
    },
    maze(x) {
      let dots = ""; [10, 27, 52, 66].forEach((y) => { for (let xx = 9; xx < 92; xx += 6) dots += `<circle cx="${xx}" cy="${y}" r=".8" fill="#ffd9a0"/>`; });
      return `<rect width="100" height="75" fill="#030308"/><g fill="none" stroke="#3d6cff" stroke-width="1.8"><rect x="3" y="3" width="94" height="69" rx="3"/><rect x="13" y="14" width="22" height="8" rx="2"/><rect x="42" y="14" width="16" height="8" rx="2"/><rect x="65" y="14" width="22" height="8" rx="2"/><rect x="13" y="33" width="12" height="13" rx="2"/><rect x="31" y="33" width="38" height="13" rx="2"/><rect x="75" y="33" width="12" height="13" rx="2"/><rect x="24" y="57" width="52" height="4" rx="2"/></g>
${dots}<circle class="${P_}blink" cx="9" cy="66" r="2" fill="#ffd9a0"/><circle class="${P_}blink" cx="91" cy="10" r="2" fill="#ffd9a0"/>
<g class="${P_}mz"><circle cx="10" cy="27" r="3.6" fill="#ffb02e"/><rect x="8" y="25.6" width="5" height="1.8" rx=".8" fill="#2a1a40"/></g><g class="${P_}mz2"><path d="M86 55l3.4 0l0 -3.6a3.4 3.4 0 0 0 -6.8 0l0 3.6z" fill="#ff5ad1"/><path d="M76 55l3.4 0l0 -3.6a3.4 3.4 0 0 0 -6.8 0l0 3.6z" fill="#3fe0e0"/></g>`;
    },
    gun(x) {
      let pl = ""; for (let y = 44; y < 75; y += 6) pl += `<rect y="${y}" width="100" height="5.6" fill="${y % 12 ? "#7a4d2a" : "#6a4122"}"/>`;
      const tg = (cx, cy, d) => `<g class="${P_}pop" style="animation-delay:${d}s"><rect x="${cx - .6}" y="${cy}" width="1.2" height="${44 - cy}" fill="#3a2a1a"/><circle cx="${cx}" cy="${cy}" r="7" fill="#fff"/><circle cx="${cx}" cy="${cy}" r="5" fill="#e3262f"/><circle cx="${cx}" cy="${cy}" r="3" fill="#fff"/><circle cx="${cx}" cy="${cy}" r="1.3" fill="#e3262f"/></g>`;
      return `<rect width="100" height="46" fill="#2a3a5a"/><circle cx="80" cy="12" r="4" fill="#f6efd0"/><path d="M0 40L18 30L36 36L60 26L82 34L100 28V46H0Z" fill="#1a2238"/>${pl}${tg(22, 36, 0)}${tg(50, 28, .7)}${tg(78, 37, 1.4)}
<g class="${P_}aim"><circle r="5.5" fill="none" stroke="#39ff8a" stroke-width="1"/><path d="M-8 0h5M3 0h5M0 -8v5M0 3v5" stroke="#39ff8a" stroke-width="1"/></g>${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${4 + i * 3}" y="66" width="1.8" height="5" rx=".6" fill="#ffd23f"/>`).join("")}`;
    },
    beat(x) {
      const r = rnd(12); let b = "";
      for (let xx = 0; xx < 100;) { const w = 8 + r() * 8, hh = 14 + r() * 22; let wn = ""; for (let wy = 54 - hh + 3; wy < 50; wy += 4) for (let wx = xx + 2; wx < xx + w - 2; wx += 3) if (r() > .4) wn += `<rect x="${f(wx)}" y="${f(wy)}" width="1.3" height="1.6" fill="#ffd36b"/>`; const one = `<rect x="${f(xx)}" y="${f(54 - hh)}" width="${f(w)}" height="${f(hh)}" fill="${r() > .5 ? "#2a2650" : "#1e1b3e"}"/>${wn}`; b += one + `<g transform="translate(100 0)">${one}</g>`; xx += w + .5; }
      const hero = (px, col, d) => `<g class="${P_}bob" style="animation-delay:${d}s"><rect x="${px - 2.4}" y="56" width="4.8" height="7" rx="1.4" fill="${col}"/><circle cx="${px}" cy="54" r="2.4" fill="#f2c9a0"/><path d="M${px - 1.6} 63L${px - 2.4} 68M${px + 1.6} 63L${px + 2.6} 68" stroke="#222" stroke-width="1.6"/></g>`;
      return `<rect width="100" height="75" fill="#140f2e"/><circle cx="18" cy="12" r="3.4" fill="#f4f0d8"/><g class="${P_}sx">${b}</g><rect y="54" width="100" height="21" fill="#2e2f3a"/><path d="M0 60H100" stroke="#ffd23f" stroke-dasharray="6 5" stroke-width=".8"/>${hero(18, "#3fa8ff", 0)}${hero(36, "#ff4a4a", .15)}${hero(54, "#7bff6a", .3)}${hero(72, "#ffd23f", .45)}<g class="${P_}bob2"><rect x="85" y="55" width="5.4" height="8" rx="1.6" fill="#7a3a9a"/><circle cx="87.7" cy="53" r="2.6" fill="#b78ad8"/></g>`;
    },
    bugs(x) {
      const r = rnd(44); let m = "", w = "";
      for (let i = 0; i < 20; i++) { const cx = 6 + r() * 88, cy = 6 + r() * 52, col = ["#ff5a5a", "#ffd23f", "#ff8ad8"][(r() * 3) | 0]; m += `<path d="M${f(cx - 2.4)} ${f(cy)}A2.4 2.2 0 0 1 ${f(cx + 2.4)} ${f(cy)}Z" fill="${col}"/><rect x="${f(cx - .8)}" y="${f(cy)}" width="1.6" height="1.8" fill="#e8dcc0"/>`; }
      for (let i = 0; i < 9; i++) w += `<circle cx="${8 + i * 4.6}" cy="22" r="2.4" fill="${i ? (i % 2 ? "#7bff6a" : "#3fd0ff") : "#ff3fa4"}"/>`;
      return `<rect width="100" height="75" fill="#08150c"/>${m}<g class="${P_}mz">${w}</g><rect class="${P_}blink" x="49.5" y="40" width="1" height="24" fill="#fff"/><path d="M46 70L50 63L54 70Z" fill="#3fd0ff"/>`;
    },
    blocks(x) {
      let b = ""; ["#ff4a4a", "#ff9b3a", "#ffd23f", "#6be06b", "#3fa8ff", "#b77bff"].forEach((c, row) => { for (let i = 0; i < 8; i++) b += `<rect x="${6.5 + i * 11}" y="${8 + row * 4.4}" width="10" height="3.6" fill="${c}"/>`; });
      return `<rect width="100" height="75" fill="#06060c"/><path d="M3 3V75M97 3V75M3 3H97" stroke="#8a8f99" stroke-width="2"/>${b}<g class="${P_}pad"><rect x="38" y="68" width="20" height="2.6" rx="1.2" fill="#e0e4ea"/></g><g class="${P_}bnc"><rect x="-1.2" y="-1.2" width="2.4" height="2.4" fill="#fff"/></g>`;
    },
    gems(x) {
      const r = rnd(66), C = ["#ff4a6e", "#3fd0ff", "#ffd23f", "#7bff6a", "#c77bff"]; let gm = "";
      const gem = (cx, cy, c) => `<path d="M${cx} ${cy - 3}L${cx + 3} ${cy}L${cx} ${cy + 3}L${cx - 3} ${cy}Z" fill="${c}"/><path d="M${cx} ${cy - 3}L${cx + 3} ${cy}L${cx} ${cy}Z" fill="#fff" opacity=".35"/>`;
      for (let row = 0; row < 6; row++) for (let col = 0; col < 7; col++) if (row > 1 || r() > .6) gm += gem(28 + col * 7, 32 + row * 7, C[(r() * 5) | 0]);
      return `<rect width="100" height="75" fill="#1a0d33"/><rect x="23" y="4" width="54" height="70" fill="#0d0620" stroke="#c77bff" stroke-width=".8"/>${gm}<g class="${P_}fall">${gem(49, 6, C[0])}${gem(49, 13, C[2])}${gem(49, 20, C[1])}</g><rect x="81" y="8" width="15" height="10" rx="1" fill="#0d0620" stroke="#c77bff" stroke-width=".6"/><rect x="4" y="8" width="15" height="24" rx="1" fill="#0d0620" stroke="#c77bff" stroke-width=".6"/>`;
    },
    runner(x) {
      let t = ""; for (let i = 0; i < 20; i++) t += `<rect x="${i * 10}" y="60" width="10" height="15" fill="${i % 2 ? "#a0603a" : "#8f5230"}"/><rect x="${i * 10}" y="60" width="10" height="2.4" fill="#5bd04a"/>`;
      let cn = ""; [12, 30, 62, 80].forEach((a) => { cn += `<circle cx="${a}" cy="44" r="2.2" fill="#ffd23f"/><circle cx="${a + 100}" cy="44" r="2.2" fill="#ffd23f"/>`; });
      return `<rect width="100" height="75" fill="#6fc6ff"/><ellipse cx="20" cy="14" rx="8" ry="3" fill="#fff"/><ellipse cx="72" cy="10" rx="10" ry="3" fill="#fff"/><path d="M0 60Q15 38 30 60Q50 34 72 60Q86 44 100 60Z" fill="#3c9a4a" opacity=".7"/>
<g class="${P_}sx">${t}${cn}<rect x="48" y="48" width="8" height="8" fill="#d98a3a" stroke="#6a3a10" stroke-width=".8"/><rect x="148" y="48" width="8" height="8" fill="#d98a3a" stroke="#6a3a10" stroke-width=".8"/></g>
<g class="${P_}bob"><rect x="27" y="50" width="6" height="7" rx="1" fill="#e2453a"/><circle cx="30" cy="48" r="2.6" fill="#f2c9a0"/><rect x="27.4" y="57" width="2" height="3" fill="#2a3a8a"/><rect x="30.6" y="57" width="2" height="3" fill="#2a3a8a"/></g>`;
    },
    rocks(x) {
      const rk = (cx, cy, s) => `<path d="M${cx - 6 * s} ${cy - 2 * s}L${cx - 2 * s} ${cy - 6 * s}L${cx + 4 * s} ${cy - 5 * s}L${cx + 6 * s} ${cy}L${cx + 3 * s} ${cy + 5 * s}L${cx - 3 * s} ${cy + 4 * s}Z" fill="none" stroke="#e8f4ff" stroke-width=".9"/>`;
      return `<rect width="100" height="75" fill="#020306"/><g class="${P_}drift">${rk(18, 18, 1.4)}${rk(80, 22, 1)}${rk(70, 58, 1.6)}${rk(24, 58, .8)}${rk(46, 12, .6)}</g><g class="${P_}spin"><path d="M50 32L54 44L50 41L46 44Z" fill="none" stroke="#e8f4ff" stroke-width=".9"/></g><circle class="${P_}blink" cx="50" cy="26" r=".8" fill="#fff"/><circle class="${P_}blink" cx="50" cy="20" r=".8" fill="#fff"/>`;
    },
    climb(x) {
      let gd = "", ld = "";
      [[10, 66, 90, 62], [10, 46, 90, 50], [10, 34, 90, 30], [10, 18, 90, 22]].forEach(([a, b, c, d]) => { gd += `<path d="M${a} ${b}L${c} ${d}" stroke="#e0353f" stroke-width="3"/><path d="M${a} ${b}L${c} ${d}" stroke="#fff" stroke-opacity=".5" stroke-width=".7" stroke-dasharray="1.5 2.5"/>`; });
      [[76, 50, 62], [28, 34, 46], [70, 22, 30]].forEach(([xx, y0, y1]) => { ld += `<path d="M${xx - 2} ${y0}V${y1}M${xx + 2} ${y0}V${y1}" stroke="#3fd0ff" stroke-width=".8"/><path d="M${xx - 2} ${y0 + 3}h4M${xx - 2} ${y0 + 6}h4M${xx - 2} ${y0 + 9}h4" stroke="#3fd0ff" stroke-width=".6"/>`; });
      return `<rect width="100" height="75" fill="#05050a"/>${ld}${gd}<g class="${P_}roll"><circle cx="20" cy="45" r="2.4" fill="#ff9b3a"/><path d="M18.4 45h3.2" stroke="#6a3a10" stroke-width=".6"/></g><g class="${P_}bob"><rect x="14" y="58" width="4" height="5" rx="1" fill="#3fa8ff"/><circle cx="16" cy="56.6" r="1.8" fill="#f2c9a0"/></g><rect x="40" y="9" width="6" height="6" fill="#ff5ad1"/>`;
    },
  };
  const GLOW = { road: "#ff9b6b", space: "#6f8bff", fight: "#ff6b9a", golf: "#7fd45e", maze: "#4a7bff", gun: "#ffcf6b", beat: "#9a7bff", bugs: "#5bff8a", blocks: "#ffb36b", gems: "#c77bff", runner: "#7fd0ff", rocks: "#cfe6ff", climb: "#ff6b5b" };
  function screen(x, game, night) {
    if (!x.on) return `<rect width="100" height="75" fill="${x.url("off")}"/><path d="M0 75L0 30Q40 6 100 4V0H0Z" fill="${x.url("glr")}"/><rect width="100" height="75" fill="${x.url("scv")}"/>`;
    let sl = ""; for (let y = 1; y < 75; y += 2) sl += `M0 ${y}H100`;
    return `<g clip-path="${x.url("sc")}">${GAMES[game](x, night)}<path d="${sl}" stroke="#000" stroke-opacity=".12" stroke-width=".7"/><rect width="100" height="75" fill="${x.url("scv")}"/><path d="M0 40Q40 10 100 6V0H0Z" fill="#fff" opacity=".07"/></g>`;
  }

  function marq(x, type, acc) {
    const h = N(), lit = x.on, c = x.c; acc = acc || YEL;
    const g = gid(x, "mq"); let s = "";
    if (type === "sun") s = `${lg(g, [[0, "#2a0f4a"], [.55, "#c42d78"], [1, "#ffb84a"]], 0, 0, 0, 1)}<rect width="100" height="24" fill="url(#${g})"/><circle cx="50" cy="22" r="13" fill="#ffd36b"/><path d="M36 15H64M36 18H64M36 21H64" stroke="#c42d78" stroke-width="1.4"/><path d="M0 22H100" stroke="${acc}" stroke-width="1.2"/>`;
    else if (type === "stars") { const r = rnd(5); s = `<rect width="100" height="24" fill="#070a24"/>`; for (let i = 0; i < 26; i++) s += `<circle cx="${f(r() * 100)}" cy="${f(r() * 24)}" r="${f(.3 + r() * .7)}" fill="#fff"/>`; s += `<path d="M10 18Q50 -2 90 18" fill="none" stroke="${acc}" stroke-width="2.4"/><circle cx="50" cy="8" r="4" fill="${acc}"/>`; }
    else if (type === "chev") { s = `<rect width="100" height="24" fill="${h.shade(c, -.5)}"/>`; for (let i = -1; i < 9; i++) s += `<path d="M${i * 12} 4L${i * 12 + 8} 12L${i * 12} 20H${i * 12 + 5}L${i * 12 + 13} 12L${i * 12 + 5} 4Z" fill="${i % 2 ? acc : "#fff"}" opacity=".9"/>`; }
    else if (type === "check") { s = `<rect width="100" height="24" fill="#111"/>`; for (let i = 0; i < 25; i++) for (let j = 0; j < 6; j++) if ((i + j) % 2) s += `<rect x="${i * 4}" y="${j * 4}" width="4" height="4" fill="#eee"/>`; s += `<path d="M0 24L30 0H62L32 24Z" fill="${acc}"/><path d="M40 24L70 0H78L48 24Z" fill="${c}"/>`; }
    else if (type === "neon") s = `<rect width="100" height="24" fill="#0b0716"/><g fill="none" stroke-width="1.6"><circle cx="22" cy="12" r="6" stroke="${NEON[0]}"/><path d="M38 18L44 6L50 18Z" stroke="${NEON[1]}"/><rect x="58" y="7" width="10" height="10" stroke="${NEON[2]}"/><path d="M74 12h12M80 6v12" stroke="${NEON[3]}"/></g>`;
    else if (type === "wood") s = `<rect width="100" height="24" fill="#3a2414"/><rect x="6" y="4" width="88" height="16" rx="3" fill="#f3e6c4"/><path d="M12 12H88" stroke="${acc}" stroke-width="5"/><path d="M12 12H88" stroke="#c0392b" stroke-width="1.6"/><circle cx="50" cy="12" r="5" fill="#f3e6c4" stroke="#c0392b" stroke-width="1.4"/>`;
    else if (type === "wave") { s = `<rect width="100" height="24" fill="#071a2a"/>`; for (let i = 0; i < 3; i++) s += `<path d="M0 ${8 + i * 5}Q12 ${3 + i * 5} 25 ${8 + i * 5}T50 ${8 + i * 5}T75 ${8 + i * 5}T100 ${8 + i * 5}" fill="none" stroke="${[acc, "#3fd0ff", "#ff3fa4"][i]}" stroke-width="1.6"/>`; }
    else s = `<rect width="100" height="24" fill="#120a1e"/>${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => `<circle cx="${7 + i * 9.5}" cy="12" r="3" fill="${NEON[i % 5]}"/>`).join("")}`;
    s += `<rect width="100" height="24" fill="#000" opacity="${lit ? 0 : .66}"/>`;
    if (lit) s += `<rect class="${P_}flick" width="100" height="24" fill="#fff" opacity=".12"/><rect width="100" height="6" fill="#fff" opacity=".18"/>`;
    return s + `<rect x=".5" y=".5" width="99" height="23" fill="none" stroke="#000" stroke-opacity=".6"/>`;
  }

  function side(x, type, D, top, acc) {
    const h = N(), c = x.c; acc = acc || YEL; let s = `<rect x="-2" y="-2" width="${D + 4}" height="${top + 4}" fill="${type === "wood" ? x.url("wd") : x.url("sd")}"/>`;
    if (type === "stripes") s += `<path d="M-2 ${top * .2}L${D + 2} ${top * .55}V${top * .66}L-2 ${top * .31}Z" fill="#fff" opacity=".9"/><path d="M-2 ${top * .34}L${D + 2} ${top * .69}V${top * .75}L-2 ${top * .4}Z" fill="${acc}"/><path d="M-2 ${top * .43}L${D + 2} ${top * .78}V${top * .81}L-2 ${top * .46}Z" fill="#111" opacity=".6"/>`;
    else if (type === "grid") { s += `<circle cx="${D * .55}" cy="${top * .72}" r="${D * .32}" fill="${acc}"/>`; for (let i = 0; i < 4; i++) s += `<rect x="0" y="${top * .62 + i * 3.2}" width="${D}" height="1.4" fill="${h.shade(c, -.2)}"/>`; let g = ""; for (let i = 0; i < 8; i++) g += `M${D * .55} ${top * .55}L${i * D / 7} 0`; for (let y = top * .5; y > 0; y -= top * .08) g += `M0 ${f(y)}H${D}`; s += `<rect x="0" y="0" width="${D}" height="${top * .55}" fill="#120a24" opacity=".6"/><path d="${g}" stroke="${NEON[0]}" stroke-width=".8" opacity=".8"/>`; }
    else if (type === "stars") { const r = rnd(8); for (let i = 0; i < 30; i++) s += `<circle cx="${f(r() * D)}" cy="${f(r() * top)}" r="${f(.4 + r())}" fill="#fff" opacity="${(.4 + r() * .6).toFixed(2)}"/>`; s += `<circle cx="${D * .5}" cy="${top * .7}" r="${D * .22}" fill="${acc}"/><ellipse cx="${D * .5}" cy="${top * .7}" rx="${D * .4}" ry="${D * .08}" fill="none" stroke="#fff" stroke-width="1.6" transform="rotate(-15 ${D * .5} ${top * .7})"/>`; }
    else if (type === "burst") { let g = ""; for (let i = 0; i < 14; i++) { const a0 = i / 14 * Math.PI * 2, a1 = a0 + Math.PI / 14, cx = D * .3, cy = top * .78, R = top * 1.5; g += `M${f(cx)} ${f(cy)}L${f(cx + R * Math.cos(a0))} ${f(cy + R * Math.sin(a0))}L${f(cx + R * Math.cos(a1))} ${f(cy + R * Math.sin(a1))}Z`; } s += `<path d="${g}" fill="#fff" opacity=".18"/><circle cx="${D * .3}" cy="${top * .78}" r="${D * .25}" fill="${acc}"/><circle cx="${D * .3}" cy="${top * .78}" r="${D * .15}" fill="#fff" opacity=".8"/>`; }
    else if (type === "wood") { let g = ""; const r = rnd(3); for (let xx = 1; xx < D; xx += 1.6 + r() * 2) g += `M${f(xx)} 0C${f(xx + 1)} ${top * .3} ${f(xx - 1)} ${top * .6} ${f(xx + .5)} ${top}`; s += `<path d="${g}" stroke="#2a1606" stroke-opacity=".25" stroke-width=".6" fill="none"/><path d="M-2 ${top * .5}L${D + 2} ${top * .6}V${top * .66}L-2 ${top * .56}Z" fill="${c}"/><path d="M-2 ${top * .58}L${D + 2} ${top * .68}V${top * .71}L-2 ${top * .61}Z" fill="${acc}"/>`; }
    else if (type === "splat") { const r = rnd(21); for (let i = 0; i < 9; i++) s += `<circle cx="${f(r() * D)}" cy="${f(r() * top)}" r="${f(4 + r() * 9)}" fill="${NEON[i % 5]}" opacity=".75"/>`; s += `<path d="M0 ${top * .3}Q${D * .5} ${top * .5} ${D} ${top * .25}" stroke="#fff" stroke-width="3" fill="none"/>`; }
    else if (type === "check") { for (let i = 0; i < 12; i++) for (let j = 0; j < 4; j++) if ((i + j) % 2) s += `<rect x="${f(i * D / 6)}" y="${f(top * .78 + j * 4)}" width="${f(D / 6)}" height="4" fill="#fff" opacity=".85"/>`; s += `<path d="M-2 ${top * .2}L${D + 2} ${top * .4}M-2 ${top * .26}L${D + 2} ${top * .46}M-2 ${top * .32}L${D + 2} ${top * .52}" stroke="${acc}" stroke-width="2.4"/>`; }
    else if (type === "wave") { for (let i = 0; i < 4; i++) s += `<path d="M-2 ${top * (.25 + i * .14)}Q${D * .3} ${top * (.15 + i * .14)} ${D * .55} ${top * (.25 + i * .14)}T${D + 4} ${top * (.25 + i * .14)}" stroke="${i % 2 ? acc : "#fff"}" stroke-width="3" fill="none" opacity=".85"/>`; }
    return s + `<rect x="-2" y="-2" width="${D + 4}" height="${top + 4}" fill="${x.url("glr")}" opacity=".5"/>`;
  }

  const stick = (x, p, col, bat) => `<ellipse cx="${f(p[0])}" cy="${f(p[1])}" rx="3.4" ry="1.6" fill="#0c0c0e"/><path d="M${f(p[0])} ${f(p[1])}V${f(p[1] - 6)}" stroke="#bfc4c9" stroke-width="1.2"/>${bat ? `<ellipse cx="${f(p[0])}" cy="${f(p[1] - 7)}" rx="1.6" ry="2.6" fill="${col}"/>` : `<circle cx="${f(p[0])}" cy="${f(p[1] - 7)}" r="2.6" fill="${col}"/>`}<circle cx="${f(p[0] - .8)}" cy="${f(p[1] - 7.9)}" r=".8" fill="#fff" opacity=".7"/>`;
  const btn = (p, col, r) => { r = r || 2.2; return `<ellipse cx="${f(p[0])}" cy="${f(p[1] + .7)}" rx="${r + .5}" ry="${f(r * .55 + .4)}" fill="#0c0c0e"/><ellipse cx="${f(p[0])}" cy="${f(p[1])}" rx="${r}" ry="${f(r * .55)}" fill="${col}"/><ellipse cx="${f(p[0] - r * .3)}" cy="${f(p[1] - r * .15)}" rx="${f(r * .4)}" ry="${f(r * .18)}" fill="#fff" opacity=".6"/>`; };
  const tball = (x, p, r) => `<ellipse cx="${f(p[0])}" cy="${f(p[1])}" rx="${r + 2}" ry="${f((r + 2) * .5)}" fill="#0c0c0e"/><path d="M${f(p[0] - r)} ${f(p[1])}A${r} ${r} 0 0 1 ${f(p[0] + r)} ${f(p[1])}Z" fill="${x.url("ball")}"/><path d="M${f(p[0] - r)} ${f(p[1])}A${r} ${r} 0 0 1 ${f(p[0] + r)} ${f(p[1])}Z" fill="#c0392b" opacity=".45"/>`;
  const CTL = {
    one: (x, c, P) => stick(x, P(c.W * .28, 7, c.deckH), "#e0262f") + btn(P(c.W * .58, 6, c.deckH), "#ffd23f") + btn(P(c.W * .72, 8, c.deckH), "#3fa8ff"),
    two: (x, c, P) => stick(x, P(c.W * .2, 7, c.deckH), "#e0262f") + btn(P(c.W * .36, 6, c.deckH), "#fff") + btn(P(c.W * .46, 7, c.deckH), "#fff") + stick(x, P(c.W * .64, 7, c.deckH), "#3fa8ff") + btn(P(c.W * .8, 6, c.deckH), "#fff") + btn(P(c.W * .9, 7, c.deckH), "#fff"),
    fight: (x, c, P) => {
      let s = ""; const col = ["#e0262f", "#ffd23f", "#3fa8ff", "#7bff6a"];
      [0, .5].forEach((o, pl) => { s += stick(x, P(c.W * (o + .08), 8, c.deckH), pl ? "#3fa8ff" : "#e0262f", true); for (let r = 0; r < 2; r++) for (let k = 0; k < 4; k++) s += btn(P(c.W * (o + .19 + k * .075), 4 + r * 6, c.deckH), col[k], 1.7); });
      return s;
    },
    four: (x, c, P) => { let s = ""; ["#e0262f", "#3fa8ff", "#7bff6a", "#ffd23f"].forEach((col, i) => { const o = .03 + i * .245; s += stick(x, P(c.W * (o + .05), 8, c.deckH), col) + btn(P(c.W * (o + .13), 5, c.deckH), "#fff", 1.8) + btn(P(c.W * (o + .19), 7, c.deckH), "#fff", 1.8); }); return s; },
    golf: (x, c, P) => tball(x, P(c.W * .5, 8, c.deckH), 6.4) + btn(P(c.W * .18, 7, c.deckH), "#7bff6a") + btn(P(c.W * .82, 7, c.deckH), "#7bff6a"),
    tball: (x, c, P) => tball(x, P(c.W * .42, 8, c.deckH), 4.6) + btn(P(c.W * .72, 6, c.deckH), "#e0262f", 2.6),
    gun: (x, c, P) => {
      const gun = (p, col, dir) => `<g transform="translate(${f(p[0])} ${f(p[1])}) scale(${dir} 1)"><path d="M-2 -1C-6 4 -12 6 -14 10" fill="none" stroke="#111" stroke-width="1" stroke-dasharray="1.5 .8"/><path d="M-1 -3H14L15 -1H6L4 4H0L1 -1H-1Z" fill="${col}"/><path d="M0 -3H14" stroke="#fff" stroke-opacity=".5" stroke-width=".7"/><rect x="2" y="-1" width="2" height="2.4" fill="#111"/></g>`;
      return `<path d="${poly([P(2, 2, c.deckH), P(14, 2, c.deckH), P(14, 12, c.deckH), P(2, 12, c.deckH)])}" fill="#0c0c0e" opacity=".5"/>` + gun(P(4, 7, c.deckH + 1), "#ff7a1a", 1) + gun(P(c.W - 4, 7, c.deckH + 1), "#2aa8ff", -1) + btn(P(c.W * .5, 7, c.deckH), "#ffd23f");
    },
    wheel: (x, c, P) => {
      const p = P(c.W * .5, -2, c.deckH - 6), sh = P(c.W * .82, 10, c.deckH);
      return `<path d="M${f(p[0])} ${f(p[1] + 4)}l4 -5" stroke="#222" stroke-width="3"/><ellipse cx="${f(p[0])}" cy="${f(p[1])}" rx="13" ry="11.5" fill="none" stroke="#111" stroke-width="4.4"/><ellipse cx="${f(p[0])}" cy="${f(p[1])}" rx="13" ry="11.5" fill="none" stroke="#4a4b52" stroke-width="1.4"/><path d="M${f(p[0] - 12)} ${f(p[1])}H${f(p[0] + 12)}M${f(p[0])} ${f(p[1])}V${f(p[1] + 11)}" stroke="#222" stroke-width="2.6"/><circle cx="${f(p[0])}" cy="${f(p[1])}" r="4" fill="#2a2b31"/><circle cx="${f(p[0])}" cy="${f(p[1])}" r="2" fill="${x.c}"/><path d="M${f(p[0] - 9)} ${f(p[1] - 8)}A13 11.5 0 0 1 ${f(p[0] + 4)} ${f(p[1] - 11.4)}" stroke="#fff" stroke-opacity=".35" fill="none"/>` +
        `<ellipse cx="${f(sh[0])}" cy="${f(sh[1])}" rx="3" ry="1.4" fill="#0c0c0e"/><path d="M${f(sh[0])} ${f(sh[1])}l1 -8" stroke="#bfc4c9" stroke-width="1.4"/><circle cx="${f(sh[0] + 1)}" cy="${f(sh[1] - 9)}" r="2.6" fill="#111"/><circle cx="${f(sh[0] + .3)}" cy="${f(sh[1] - 9.8)}" r=".8" fill="#fff" opacity=".6"/>`;
    },
  };

  const KX = .55, KY = .32;
  const UPR = { W: 62, D: 40, riser: 16, kickD: 8, deckFH: 64, deckH: 72, deckD: 14, s0d: 16, s0h: 76, s1d: 24, s1h: 118, mD: 10, mH: 120, top: 136, sc: 1, cx: 100, floor: 184 };
  function cabinet(x, cfg) {
    const c = Object.assign({}, UPR, cfg), h = N(), P = mk(KX, KY, -(c.W + c.D * KX) / 2), on = x.on, B = .45 + .55 * x.lv, gl = GLOW[c.game] || "#9ab";
    let s = "";
    if (!c.wall) s += `<ellipse cx="${f(P(c.W / 2, c.D / 2, 0)[0] + 3)}" cy="${f(P(c.W / 2, c.D / 2, 0)[1])}" rx="${f((c.W + c.D * KX) * .66)}" ry="${f(c.D * KY * .9 + 5)}" fill="${x.url("cs")}"/>`;
    else s += `<path d="${poly([P(0, c.D, c.top), P(c.W, c.D, c.top), P(c.W, c.D, 0), P(0, c.D, 0)])}" transform="translate(6 8)" fill="#000" opacity=".5" filter="${x.url("bl")}"/>`;
    if (on && !c.wall) { const p = P(c.W / 2, -16, 0), g = gid(x, "fg"); s += `${rg(g, [[0, gl, .6], [1, gl, 0]])}<ellipse class="${P_}glow" cx="${f(p[0])}" cy="${f(p[1])}" rx="${f(c.W * .85)}" ry="12" fill="url(#${g})"/>`; }
    if (c.back) s += c.back(P, c);
    if (c.riser) {
      const rd = c.kickD - 3;
      s += `<path d="${poly([P(0, rd, 0), P(c.W, rd, 0), P(c.W, rd, c.riser), P(0, rd, c.riser)])}" fill="#1d1e23"/><path d="${poly([P(0, rd, c.riser * .35), P(c.W, rd, c.riser * .35), P(c.W, rd, c.riser * .55), P(0, rd, c.riser * .55)])}" fill="${x.c}" opacity=".8"/><path d="${poly([P(c.W, rd, 0), P(c.W, c.D, 0), P(c.W, c.D, c.riser), P(c.W, rd, c.riser)])}" fill="#121317"/><path d="M${f(P(0, rd, c.riser)[0])} ${f(P(0, rd, c.riser)[1])}L${f(P(c.W, rd, c.riser)[0])} ${f(P(c.W, rd, c.riser)[1])}" stroke="#fff" stroke-opacity=".15"/>`;
    }
    const pr = (c.deckFH > c.riser ? [[c.kickD, c.riser], [c.kickD, c.deckFH], [0, c.deckFH]] : [[0, c.riser]]).concat([[0, c.deckH], [c.deckD, c.deckH], [c.s0d, c.s0h], [c.s1d, c.s1h], [c.mD, c.mH], [c.mD, c.top], [c.D, c.top], [c.D, c.riser]]);
    const sk = gid(x, "sp"), so = P(c.W, 0, 0);
    s += `<g transform="${M(so, [KX, -KY], [0, -1])}"><clipPath id="${sk}"><path d="${poly(pr)}"/></clipPath><g clip-path="url(#${sk})">${side(x, c.art, c.D, c.top, c.acc)}</g><path d="${poly(pr)}" fill="none" stroke="${c.mold || "#111"}" stroke-width="2"/></g>`;
    s += `<path d="${poly([P(0, c.mD, c.top), P(c.W, c.mD, c.top), P(c.W, c.D, c.top), P(0, c.D, c.top)])}" fill="${x.url("tp")}"/>`;
    if (on) { const p = P(c.W / 2, c.mD, c.top), g = gid(x, "mg"); s += `${rg(g, [[0, "#fff", .35], [1, "#fff", 0]])}<ellipse cx="${f(p[0])}" cy="${f(p[1] - 2)}" rx="${f(c.W * .7)}" ry="10" fill="url(#${g})"/>`; }
    if (c.deckFH > c.riser) {
      s += `<path d="${poly([P(0, c.kickD, c.riser), P(c.W, c.kickD, c.riser), P(c.W, c.kickD, c.deckFH), P(0, c.kickD, c.deckFH)])}" fill="${x.url("lam")}"/>`;
      const o = P(0, c.kickD, c.deckFH), kh = c.deckFH - c.riser;
      s += `<g transform="${M(o, [c.W / 100, 0], [0, kh / 100])}"><rect x="36" y="12" width="28" height="44" rx="1.5" fill="#2c2d33" stroke="#55585e" stroke-width="1"/><rect x="40" y="17" width="20" height="8" rx="1" fill="${on ? "#ff4a3a" : "#4a1a16"}"/><rect x="48.8" y="18.5" width="2.4" height="5" fill="#111"/><rect x="40" y="29" width="20" height="2" fill="#55585e"/><circle cx="57" cy="45" r="1.6" fill="#9aa0a6"/><rect x="40" y="48" width="9" height="3.4" rx=".8" fill="#111"/>${c.kickArt ? `<path d="M0 70L100 60V68L0 78Z" fill="${x.c}"/>` : ""}</g>`;
    }
    s += `<path d="${poly([P(0, c.deckD, c.deckH), P(c.W, c.deckD, c.deckH), P(c.W, c.s0d, c.s0h), P(0, c.s0d, c.s0h)])}" fill="#111215"/>`;
    const so1 = P(0, c.s1d, c.s1h), V = sub(P(0, c.s0d, c.s0h), so1, 75);
    let waves = "";
    if (on) for (let i = 0; i < 3; i++) waves += `<path d="M${10 - i * 3} ${64 - i * 2}a${4 + i * 3} ${4 + i * 3} 0 0 0 0 ${8 + i * 4}M${90 + i * 3} ${64 - i * 2}a${4 + i * 3} ${4 + i * 3} 0 0 1 0 ${8 + i * 4}" fill="none" stroke="#fff" stroke-width="1" opacity="${f(B * (.7 - i * .2))}" class="${P_}blink" style="animation-delay:${i * .15}s"/>`;
    const bez = c.bezel || "#141419";
    s += `<g transform="${M(so1, [c.W / 100, 0], V)}"><rect width="100" height="75" fill="${bez}"/><rect x="2" y="2" width="96" height="71" fill="none" stroke="${h.shade(x.c, -.2)}" stroke-width="1.6" opacity=".7"/><g transform="translate(9 5) scale(.82 .8)">${screen(x, c.game, c.night)}</g><rect x="9" y="5" width="82" height="60" fill="none" stroke="#000" stroke-width="1.2"/>
<circle cx="14" cy="70" r="3.4" fill="#0a0a0c"/><circle cx="86" cy="70" r="3.4" fill="#0a0a0c"/><path d="M12 70h4M14 68v4M84 70h4M86 68v4" stroke="#333" stroke-width=".6"/>${waves}<path d="M0 0H100L60 75H0Z" fill="#fff" opacity=".04"/></g>`;
    if (on) { const p = P(c.W / 2, c.s0d - 3, c.s0h), g = gid(x, "sg"); s += `${rg(g, [[0, gl, f(.35 * B)], [1, gl, 0]])}<ellipse cx="${f(p[0])}" cy="${f(p[1])}" rx="${f(c.W * .6)}" ry="14" fill="url(#${g})"/>`; }
    const mo = P(0, c.mD, c.top);
    s += `<g transform="${M(mo, [c.W / 100, 0], [0, (c.top - c.mH) / 24])}">${marq(x, c.mq, c.acc)}</g>`;
    s += `<path d="${poly([P(0, 0, c.deckFH), P(c.W, 0, c.deckFH), P(c.W, 0, c.deckH), P(0, 0, c.deckH)])}" fill="${h.shade(x.c, -.45)}"/><path d="M${f(P(0, 0, c.deckH)[0])} ${f(P(0, 0, c.deckH)[1])}H${f(P(c.W, 0, c.deckH)[0])}" stroke="#fff" stroke-opacity=".3"/>`;
    const dk = gid(x, "dk"), dg = gid(x, "dg");
    s += `${lg(dg, [[0, "#2b2c33"], [1, "#16171b"]], 0, 0, 0, 1)}<path d="${poly([P(0, 0, c.deckH), P(c.W, 0, c.deckH), P(c.W, c.deckD, c.deckH), P(0, c.deckD, c.deckH)])}" fill="url(#${dg})"/><g transform="${M(P(0, 0, c.deckH), [1, 0], [KX, -KY])}"><path d="M0 ${c.deckD * .3}L${c.W} ${c.deckD * .1}V${c.deckD * .28}L0 ${c.deckD * .48}Z" fill="${x.c}" opacity=".55"/><path d="M0 ${c.deckD * .55}L${c.W} ${c.deckD * .35}V${c.deckD * .4}L0 ${c.deckD * .6}Z" fill="${c.acc || YEL}" opacity=".5"/></g>`;
    s += CTL[c.ctl](x, c, P);
    if (c.front) s += c.front(P, c);
    return `<g transform="translate(${c.cx} ${c.floor}) scale(${c.sc})">${s}</g>`;
  }

  function stool(x, p, col) {
    return `<ellipse cx="${f(p[0])}" cy="${f(p[1] + 1)}" rx="13" ry="4" fill="${x.url("cs")}"/><path d="M${f(p[0] - 8)} ${f(p[1])}L${f(p[0] - 5)} ${f(p[1] - 28)}M${f(p[0] + 8)} ${f(p[1])}L${f(p[0] + 5)} ${f(p[1] - 28)}M${f(p[0])} ${f(p[1] + 2)}V${f(p[1] - 28)}" stroke="url(#${x.u}-chr)" stroke-width="2"/><ellipse cx="${f(p[0])}" cy="${f(p[1] - 14)}" rx="7" ry="2.2" fill="none" stroke="url(#${x.u}-chr)" stroke-width="1.3"/>
<path d="M${f(p[0] - 10)} ${f(p[1] - 30)}V${f(p[1] - 27)}A10 3.4 0 0 0 ${f(p[0] + 10)} ${f(p[1] - 27)}V${f(p[1] - 30)}Z" fill="${N().shade(col, -.45)}"/><ellipse cx="${f(p[0])}" cy="${f(p[1] - 30)}" rx="10" ry="3.4" fill="${col}"/><ellipse cx="${f(p[0] - 3)}" cy="${f(p[1] - 31)}" rx="4" ry="1.1" fill="#fff" opacity=".3"/>`;
  }
  function seat(x, p) {
    const g = gid(x, "st");
    return `${lg(g, [[0, "#3a3b42"], [.5, "#1d1e22"], [1, "#0b0b0d"]])}<ellipse cx="${f(p[0] + 4)}" cy="${f(p[1] + 2)}" rx="24" ry="5" fill="${x.url("cs")}"/><rect x="${f(p[0] - 16)}" y="${f(p[1] - 6)}" width="34" height="6" rx="1" fill="#26272c"/>
<path d="M${f(p[0] - 14)} ${f(p[1] - 6)}Q${f(p[0] - 18)} ${f(p[1] - 44)} ${f(p[0] - 6)} ${f(p[1] - 52)}Q${f(p[0] + 4)} ${f(p[1] - 56)} ${f(p[0] + 12)} ${f(p[1] - 48)}Q${f(p[0] + 18)} ${f(p[1] - 30)} ${f(p[0] + 16)} ${f(p[1] - 6)}Z" fill="url(#${g})"/>
<path d="M${f(p[0] - 9)} ${f(p[1] - 10)}Q${f(p[0] - 11)} ${f(p[1] - 38)} ${f(p[0] - 3)} ${f(p[1] - 44)}" stroke="${x.c}" stroke-width="2.6" fill="none"/><path d="M${f(p[0] + 11)} ${f(p[1] - 10)}Q${f(p[0] + 13)} ${f(p[1] - 34)} ${f(p[0] + 7)} ${f(p[1] - 44)}" stroke="${x.c}" stroke-width="2.6" fill="none"/>
<path d="M${f(p[0] - 4)} ${f(p[1] - 46)}h8v4h-8z" fill="#0b0b0d"/><path d="M${f(p[0] - 12)} ${f(p[1] - 30)}Q${f(p[0] - 10)} ${f(p[1] - 48)} ${f(p[0] - 2)} ${f(p[1] - 52)}" stroke="#fff" stroke-opacity=".2" stroke-width="1.4" fill="none"/>`;
  }
  const pedals = (x, P, c) => [.38, .58].map((t) => { const p = P(c.W * t, -10, 0); return `<path d="M${f(p[0] - 4)} ${f(p[1])}L${f(p[0] - 3)} ${f(p[1] - 7)}H${f(p[0] + 3)}L${f(p[0] + 4)} ${f(p[1])}Z" fill="#2a2b31"/><path d="M${f(p[0] - 3)} ${f(p[1] - 6)}H${f(p[0] + 3)}" stroke="#9aa0a6"/>`; }).join("") + `<path d="${poly([P(c.W * .3, -14, 0), P(c.W * .68, -14, 0), P(c.W * .68, 0, 0), P(c.W * .3, 0, 0)])}" fill="#1a1b1f" opacity=".7"/>`;

  const icons = [];
  const G = (id, name, colors, fn) => icons.push({ id, name, colors, picker: true, colorLabel: "Cabinet", render(o) { return fn(ctx(o)); } });

  G("racing", "Racing cabinet", [RED, BLU, BLK, ORG, YEL], (x) => svg(x, room(x, 132, "#1f2440", "#ff3fa4", 1) +
    cabinet(x, { W: 66, D: 44, riser: 0, kickD: 12, deckFH: 52, deckH: 68, deckD: 20, s0d: 22, s0h: 74, s1d: 28, s1h: 114, mD: 14, mH: 116, top: 132, floor: 182, cx: 104, game: "road", art: "check", mq: "check", ctl: "wheel", acc: YEL, front: (P, c) => pedals(x, P, c) })));
  G("deluxe", "Deluxe racer", [RED, BLK, BLU, TEAL, PUR], (x) => {
    let seatSvg = ""; const cab = cabinet(x, { W: 66, D: 44, riser: 0, kickD: 12, deckFH: 52, deckH: 68, deckD: 20, s0d: 22, s0h: 74, s1d: 28, s1h: 114, mD: 14, mH: 116, top: 132, floor: 160, cx: 118, sc: .84, game: "road", night: true, art: "grid", mq: "sun", ctl: "wheel", acc: PNK, front: (P, c) => pedals(x, P, c) });
    seatSvg = `<path d="M40 186L80 166H150L118 190Z" fill="#17181c"/><path d="M60 182L150 164" stroke="url(#${x.u}-chr)" stroke-width="2"/>` + seat(x, [64, 186]);
    return svg(x, room(x, 120, "#161a33", "#3fd0ff", 2) + cab + seatSvg);
  });
  G("gun", "Light-gun shooter", [ORG, RED, BLK, BLU, TEAL], (x) => svg(x, room(x, 138, "#2a1d1a", "#ffd23f", 3) +
    cabinet(x, { W: 68, game: "gun", art: "burst", mq: "chev", ctl: "gun", acc: YEL })));
  G("fighter", "Fighting cabinet", [PUR, RED, BLK, BLU, PNK], (x) => svg(x, room(x, 138, "#24163a", "#ff3fa4", 4) +
    cabinet(x, { W: 70, game: "fight", art: "splat", mq: "neon", ctl: "fight", acc: "#ff3fa4" })));
  G("golf", "Golf trackball", ["#2e7d4a", BLU, BLK, WOOD, "#c9b27a"], (x) => svg(x, room(x, 138, "#1d2a24", "#7bff6a", 5) +
    cabinet(x, { W: 64, game: "golf", art: "wave", mq: "wave", ctl: "golf", acc: "#7bff6a", mold: "#d8dcdf" })));
  G("maze", "Maze classic", [YEL, BLU, RED, BLK, PUR], (x) => svg(x, room(x, 138, "#1b1d3a", "#3fd0ff", 6) +
    cabinet(x, { W: 58, game: "maze", art: "stripes", mq: "dots", ctl: "one", acc: BLU })));
  G("space", "Space shooter", [BLK, BLU, PUR, TEAL, RED], (x) => svg(x, room(x, 138, "#0f1430", "#b77bff", 7) +
    cabinet(x, { W: 60, game: "space", art: "stars", mq: "stars", ctl: "one", acc: ORG })));
  G("brawler", "4-player brawler", [RED, BLU, BLK, ORG, PUR], (x) => svg(x, room(x, 140, "#251a30", "#ffd23f", 8) +
    cabinet(x, { W: 92, D: 40, sc: .86, game: "beat", art: "splat", mq: "neon", ctl: "four", acc: YEL })));
  G("tall", "Tall trackball", [TEAL, "#7bbf3a", BLK, RED, YEL], (x) => svg(x, room(x, 136, "#13281f", "#7bff6a", 9) +
    cabinet(x, { W: 56, riser: 20, kickD: 8, deckFH: 70, deckH: 78, s0d: 16, s0h: 82, s1d: 24, s1h: 130, mD: 10, mH: 132, top: 150, floor: 186, game: "bugs", art: "wave", mq: "dots", ctl: "tball", acc: "#ff3fa4" })));
  G("retro", "Wood-grain retro", [ORG, RED, "#2e6a4a", BLU, YEL], (x) => svg(x, room(x, 138, "#3a2a20", "#ffb36b", 10) +
    cabinet(x, { W: 58, game: "blocks", art: "wood", mq: "wood", ctl: "one", acc: YEL, mold: "#2a1606", bezel: "#2a1a10" })));
  G("party", "Party cabinet", [PNK, PUR, BLU, BLK, TEAL], (x) => svg(x, room(x, 138, "#2a1a38", "#ff3fa4", 11) +
    cabinet(x, { W: 54, cx: 88, game: "gems", art: "burst", mq: "neon", ctl: "two", acc: "#3fd0ff" }) + stool(x, [158, 186], x.c)));
  G("countertop-cabinet", "Countertop cabinet", [RED, BLU, YEL, BLK, TEAL], (x) => {
    const wood = `<rect x="8" y="140" width="184" height="10" fill="url(#${x.u}-wd)"/><path d="M8 140H192" stroke="#fff" stroke-opacity=".3"/><rect x="8" y="150" width="184" height="42" fill="#3a2414"/><rect x="8" y="150" width="184" height="6" fill="${x.url("dn")}"/>`;
    return svg(x, room(x, 150, "#202a3a", "#3fd0ff", 12) + BGW(wood) + cabinet(x, { W: 62, D: 36, riser: 0, kickD: 8, deckFH: 0, deckH: 10, deckD: 14, s0d: 16, s0h: 14, s1d: 22, s1h: 56, mD: 10, mH: 58, top: 72, sc: 1.4, floor: 148, cx: 100, game: "runner", art: "stripes", mq: "chev", ctl: "one", acc: YEL }));
  });
  G("wall", "Wall-mounted", [BLK, RED, BLU, PUR, TEAL], (x) => svg(x, room(x, 176, "#2a2236", "#b77bff", 13) +
    `<rect x="94" y="150" width="12" height="26" fill="#1a1a1e" opacity=".5"/><path d="M100 152V176" stroke="#111" stroke-width="1.4"/>` +
    cabinet(x, { wall: true, W: 62, D: 30, riser: 0, kickD: 8, deckFH: 0, deckH: 10, deckD: 13, s0d: 15, s0h: 14, s1d: 20, s1h: 62, mD: 9, mH: 64, top: 80, sc: 1.4, floor: 150, cx: 100, game: "climb", art: "grid", mq: "sun", ctl: "two", acc: PNK })));
  G("cocktail", "Cocktail table", [BLK, RED, BLU, WOOD, PUR], (x) => {
    const W = 58, D = 48, Ht = 60, P = mk(.6, .42, -(W + D * .6) / 2), h = N(), on = x.on;
    let s = `<ellipse cx="${f(P(W / 2, D / 2, 0)[0])}" cy="${f(P(W / 2, D / 2, 0)[1])}" rx="58" ry="20" fill="${x.url("cs")}"/>`;
    if (on) { const g = gid(x, "cg"); s += `${rg(g, [[0, GLOW.rocks, .4], [1, GLOW.rocks, 0]])}<ellipse class="${P_}glow" cx="${f(P(W / 2, D / 2, Ht)[0])}" cy="${f(P(W / 2, D / 2, Ht)[1])}" rx="60" ry="30" fill="url(#${g})"/>`; }
    s += `<path d="${poly([P(4, 4, 0), P(W - 4, 4, 0), P(W - 4, 4, 8), P(4, 4, 8)])}" fill="#111"/><path d="${poly([P(W - 4, 4, 0), P(W - 4, D - 4, 0), P(W - 4, D - 4, 8), P(W - 4, 4, 8)])}" fill="#0a0a0c"/>`;
    const sk = gid(x, "cs");
    s += `<g transform="${M(P(W, 0, 0), [.6, -.42], [0, -1])}"><clipPath id="${sk}"><rect x="0" y="8" width="${D}" height="${Ht - 8}"/></clipPath><g clip-path="url(#${sk})">${side(x, "stars", D, Ht, ORG)}</g></g>`;
    s += `<g transform="${M(P(0, 0, 0), [1, 0], [0, -1])}"><clipPath id="${sk}f"><rect x="0" y="8" width="${W}" height="${Ht - 8}"/></clipPath><g clip-path="url(#${sk}f)"><rect width="${W}" height="${Ht}" fill="${h.shade(x.c, -.2)}"/><path d="M0 ${Ht * .55}H${W}" stroke="${ORG}" stroke-width="3"/></g></g>`;
    s += `<path d="${poly([P(W * .2, -10, Ht - 12), P(W * .8, -10, Ht - 12), P(W * .8, 0, Ht - 12), P(W * .2, 0, Ht - 12)])}" fill="#16171b"/><path d="${poly([P(W * .2, -10, Ht - 12), P(W * .8, -10, Ht - 12), P(W * .8, -10, Ht - 4), P(W * .2, -10, Ht - 4)])}" fill="${h.shade(x.c, -.5)}"/><path d="${poly([P(W * .2, -10, Ht - 4), P(W * .8, -10, Ht - 4), P(W * .8, 0, Ht - 4), P(W * .2, 0, Ht - 4)])}" fill="#2b2c33"/>`;
    s += stick(x, P(W * .35, -5, Ht - 4), "#e0262f") + btn(P(W * .58, -6, Ht - 4), "#fff") + btn(P(W * .7, -4, Ht - 4), "#fff");
    s += `<path d="${poly([P(0, 0, Ht), P(W, 0, Ht), P(W, D, Ht), P(0, D, Ht)])}" fill="#141419"/>`;
    const so = P(7, D - 6, Ht), V = sub(P(7, 6, Ht), so, 75);
    s += `<g transform="${M(so, [(W - 14) / 100, 0], V)}">${screen(x, "rocks")}<rect width="100" height="75" fill="none" stroke="#000" stroke-width="1.4"/></g>`;
    s += `<path d="${poly([P(0, 0, Ht), P(W, 0, Ht), P(W, D, Ht), P(0, D, Ht)])}" fill="${x.url("glr")}"/><path d="M${f(P(0, 0, Ht)[0])} ${f(P(0, 0, Ht)[1])}L${f(P(W, 0, Ht)[0])} ${f(P(W, 0, Ht)[1])}L${f(P(W, D, Ht)[0])} ${f(P(W, D, Ht)[1])}" fill="none" stroke="url(#${x.u}-chr)" stroke-width="1.6"/>`;
    return svg(x, room(x, 128, "#1d1a30", "#3fd0ff", 14) + `<g transform="translate(96 176) scale(1.05)">${s}</g>` + stool(x, [166, 188], x.c));
  });

  const SEG = { 0: "abcdef", 1: "bc", 2: "abdeg", 3: "abcdg", 4: "bcfg", 5: "acdfg", 6: "acdefg", 7: "abc", 8: "abcdefg", 9: "abcdfg" };
  function seg7(str, x0, y0, w, hh, col, dim) {
    let s = "";
    String(str).split("").forEach((ch, i) => {
      const X = x0 + i * w * 1.5, on = SEG[ch] || "", t = w * .2;
      const L = { a: [X, y0, X + w, y0], b: [X + w, y0, X + w, y0 + hh / 2], c: [X + w, y0 + hh / 2, X + w, y0 + hh], d: [X, y0 + hh, X + w, y0 + hh], e: [X, y0 + hh / 2, X, y0 + hh], f: [X, y0, X, y0 + hh / 2], g: [X, y0 + hh / 2, X + w, y0 + hh / 2] };
      Object.keys(L).forEach((k) => { const q = L[k], lit = on.indexOf(k) >= 0; s += `<path d="M${f(q[0])} ${f(q[1])}L${f(q[2])} ${f(q[3])}" stroke="${lit ? col : dim}" stroke-width="${f(t)}" stroke-linecap="round"/>`; });
    });
    return s;
  }
  const F5 = { 0: "111101101101111", 1: "010110010010111", 2: "111001111100111", 3: "111001111001111", 4: "101101111001001", 5: "111100111001111", 6: "111100111101111", 7: "111001001001001", 8: "111101111101111", 9: "111101111001111" };
  function dots(str, x0, y0, p, col) {
    let s = "";
    String(str).split("").forEach((ch, i) => { const m = F5[ch]; if (!m) return; for (let k = 0; k < 15; k++) if (m[k] === "1") s += `<circle cx="${f(x0 + i * p * 4 + (k % 3) * p)}" cy="${f(y0 + ((k / 3) | 0) * p)}" r="${f(p * .42)}" fill="${col}"/>`; });
    return s;
  }
  function field(x, W, D, st) {
    const on = x.on, h = N(), g = gid(x, "pf");
    const base = st.digital ? [["0", "#0b1030"], ["1", "#2a1260"]] : st.em ? [["0", "#f2e2b8"], ["1", "#d9a85a"]] : st.mini ? [["0", "#3fd0ff"], ["1", "#ff8ad8"]] : [["0", "#1a1a4a"], ["1", "#6a2a8a"]];
    let s = `${lg(g, [[0, base[0][1]], [1, base[1][1]]], 0, 0, 0, 1)}<rect width="${W}" height="${D}" fill="url(#${g})"/>`;
    if (st.em) s += `<path d="M0 ${D * .5}L${W} ${D * .7}V${D * .8}L0 ${D * .6}Z" fill="${x.c}" opacity=".5"/>`;
    else s += `<path d="M${W / 2} ${D * .45}L0 ${D}H${W}Z" fill="#fff" opacity=".07"/>`;
    const ap = st.em ? "#e8e2d0" : "#20202a";
    s += `<path d="M0 0H${W}V${D * .1}L${W * .66} ${D * .07}H${W * .34}L0 ${D * .1}Z" fill="${ap}"/>`;
    const fl = (px, dir) => `<path d="M${px} ${D * .13}L${f(px + dir * W * .2)} ${D * .095}" stroke="${st.em ? "#fff" : "#f2f2f2"}" stroke-width="2.6" stroke-linecap="round"/><path d="M${px} ${D * .13}L${f(px + dir * W * .2)} ${D * .095}" stroke="#e0262f" stroke-width=".9" stroke-linecap="round"/>`;
    s += fl(W * .26, 1) + fl(W * .74, -1);
    s += `<path d="M${W * .12} ${D * .2}L${W * .12} ${D * .32}L${W * .26} ${D * .18}Z" fill="#fff" stroke="#e0262f"/><path d="M${W * .88} ${D * .2}L${W * .88} ${D * .32}L${W * .74} ${D * .18}Z" fill="#fff" stroke="#e0262f"/>`;
    const ins = [[.5, .3, "#ffd23f"], [.42, .38, "#3fd0ff"], [.58, .38, "#ff3fa4"], [.5, .46, "#7bff6a"], [.2, .5, "#ffd23f"], [.8, .5, "#ff3fa4"]];
    ins.forEach(([u, v, col], i) => { s += `<path d="M${f(W * u)} ${f(D * v + 2.4)}L${f(W * u + 2)} ${f(D * v - 1.4)}H${f(W * u - 2)}Z" fill="${on ? col : h.shade(col, -.6)}"${on ? ` class="${P_}blink" style="animation-delay:${(i * .17).toFixed(2)}s"` : ""}/>`; });
    [[.35, .72], [.65, .72], [.5, .82]].forEach(([u, v], i) => {
      const cx = W * u, cy = D * v;
      s += `<circle cx="${f(cx)}" cy="${f(cy)}" r="5.4" fill="#111" opacity=".5" transform="translate(.8 -1)"/><circle cx="${f(cx)}" cy="${f(cy)}" r="5" fill="${st.em ? x.c : "#e0262f"}"/><circle cx="${f(cx)}" cy="${f(cy)}" r="3.2" fill="${on ? "#fff6c8" : "#cfcfcf"}"${on ? ` class="${P_}blink" style="animation-delay:${i * .25}s"` : ""}/>`;
    });
    for (let i = 1; i < 4; i++) s += `<path d="M${f(W * i / 4)} ${D * .9}V${D * .97}" stroke="#ccc" stroke-width="1"/>`;
    [.125, .375, .625, .875].forEach((u, i) => { s += `<circle cx="${f(W * u)}" cy="${D * .93}" r="1.4" fill="${on ? "#ffd23f" : "#6a5a2a"}"${on ? ` class="${P_}blink" style="animation-delay:${i * .1}s"` : ""}/>`; });
    if (st.ramp) s += `<path d="M${W * .18} ${D * .42}C${W * .1} ${D * .8} ${W * .5} ${D * .98} ${W * .78} ${D * .62}" fill="none" stroke="#dfe6ec" stroke-width="3.2" opacity=".8"/><path d="M${W * .18} ${D * .42}C${W * .1} ${D * .8} ${W * .5} ${D * .98} ${W * .78} ${D * .62}" fill="none" stroke="#5b6670" stroke-width="1.2"/>`;
    s += `<path d="M${W - 4} 0V${D * .85}" stroke="#000" stroke-opacity=".3"/>`;
    s += on ? `<g class="${P_}pball"><circle r="1.8" fill="${x.url("ball")}"/></g>` : `<circle cx="${W - 2}" cy="${D * .06}" r="1.8" fill="${x.url("ball")}"/>`;
    if (st.digital) { let sl = ""; for (let y = 1; y < D; y += 2) sl += `M0 ${y}H${W}`; s += `<path d="${sl}" stroke="#000" stroke-opacity=".12" stroke-width=".6"/>`; if (!on) s = `<rect width="${W}" height="${D}" fill="${x.url("off")}"/>`; }
    return s;
  }
  function pinball(x, cfg) {
    const c = Object.assign({ W: 46, D: 96, leg: 48, body: 20, rise: 8, bbD: 12, bbH: 56, sc: .9, cx: 100, floor: 188, kx: .5, ky: .46 }, cfg), h = N(), on = x.on;
    const P = mk(c.kx, c.ky, -(c.W + (c.D + c.bbD) * c.kx) / 2), hf = c.leg + c.body, hb = hf + c.rise, tb = hb + c.bbH;
    const cab = c.wood ? x.url("wd") : x.url("sd");
    let s = `<ellipse cx="${f(P(c.W / 2, c.D / 2, 0)[0])}" cy="${f(P(c.W / 2, c.D / 2, 0)[1])}" rx="${f(c.W * .6 + c.D * c.kx * .6)}" ry="${f(c.D * c.ky * .55 + 6)}" fill="${x.url("cs")}"/>`;
    if (on) { const g = gid(x, "pg"), p = P(c.W / 2, c.D * .3, 0); s += `${rg(g, [[0, c.glow || "#ffb36b", .45], [1, c.glow || "#ffb36b", 0]])}<ellipse class="${P_}glow" cx="${f(p[0])}" cy="${f(p[1])}" rx="${f(c.W * 1.4)}" ry="22" fill="url(#${g})"/>`; }
    const leg = (xf, d) => { const a = P(xf, d, 0), b = P(xf, d, c.leg); return `<path d="M${f(a[0])} ${f(a[1])}L${f(b[0])} ${f(b[1])}" stroke="#1a1b1e" stroke-width="${c.legW || 4.4}"/><path d="M${f(a[0])} ${f(a[1])}L${f(b[0])} ${f(b[1])}" stroke="url(#${x.u}-chr)" stroke-width="${(c.legW || 4.4) - 1.6}"/><ellipse cx="${f(a[0])}" cy="${f(a[1])}" rx="3.6" ry="1.4" fill="#111"/>`; };
    if (c.leg > 6) s += leg(c.W - 3, c.D - 4) + leg(3, c.D - 4);
    const bd0 = c.D - 2, bd1 = c.D + c.bbD;
    s += `<path d="${poly([P(c.W, bd0, hb), P(c.W, bd1, hb), P(c.W, bd1, tb), P(c.W, bd0, tb)])}" fill="${cab}"/><path d="${poly([P(c.W, bd0, hb), P(c.W, bd1, hb), P(c.W, bd1, tb), P(c.W, bd0, tb)])}" fill="#000" opacity=".25"/>`;
    s += `<path d="${poly([P(0, bd0, tb), P(c.W, bd0, tb), P(c.W, bd1, tb), P(0, bd1, tb)])}" fill="${c.wood ? "#5a3a20" : h.shade(x.c, -.3)}"/>`;
    if (c.topper) { const a = P(c.W * .1, bd0 + 3, tb), b = P(c.W * .9, bd0 + 3, tb); s += `<path d="M${f(a[0])} ${f(a[1])}Q${f((a[0] + b[0]) / 2)} ${f(a[1] - 16)} ${f(b[0])} ${f(b[1])}Z" fill="#16171b"/><path d="M${f(a[0] + 3)} ${f(a[1] - 1)}Q${f((a[0] + b[0]) / 2)} ${f(a[1] - 13)} ${f(b[0] - 3)} ${f(b[1] - 1)}" fill="none" stroke="${on ? "#3fd0ff" : "#2a4a5a"}" stroke-width="2"${on ? ` class="${P_}blink"` : ""}/>`; }
    const bo = P(0, bd0, tb);
    s += `<g transform="${M(bo, [c.W / 100, 0], [0, c.bbH / 75])}"><rect width="100" height="75" fill="${c.wood ? "#4a2e18" : "#16171b"}"/>${c.head(x)}<rect x="1" y="1" width="98" height="73" fill="none" stroke="${c.wood ? "#2a1606" : h.shade(x.c, -.2)}" stroke-width="2.4"/></g>`;
    s += `<path d="${poly([P(c.W * .3, bd0, hb - 2), P(c.W * .7, bd0, hb - 2), P(c.W * .7, bd0, hb + 1), P(c.W * .3, bd0, hb + 1)])}" fill="#111"/>`;
    const sk = gid(x, "ps"), prof = [[0, c.leg], [0, hf], [c.D, hb], [c.D, c.leg]];
    s += `<g transform="${M(P(c.W, 0, 0), [c.kx, -c.ky], [0, -1])}"><clipPath id="${sk}"><path d="${poly(prof)}"/></clipPath><g clip-path="url(#${sk})">${c.wood ? `<rect x="0" y="0" width="${c.D}" height="${hb}" fill="${x.url("wd")}"/><path d="M0 ${c.leg + c.body * .45}L${c.D} ${c.leg + c.body * .45 + c.rise}" stroke="${x.c}" stroke-width="5"/>` : side(x, c.art || "stripes", c.D, hb + 4, c.acc)}</g><path d="M0 ${hf}L${c.D} ${hb}" stroke="${c.rail || "#c9ced3"}" stroke-width="2.6"/><path d="${poly(prof)}" fill="none" stroke="#111" stroke-width=".8"/></g>`;
    { const p = P(c.W, 7, hf - 5); s += `<ellipse cx="${f(p[0] + 1.6)}" cy="${f(p[1])}" rx="1.6" ry="2.6" fill="${on ? "#ffd23f" : "#c9a020"}"/><ellipse cx="${f(p[0] + 1)}" cy="${f(p[1] - .6)}" rx=".6" ry="1" fill="#fff" opacity=".6"/>`; }
    s += `<path d="${poly([P(0, 0, c.leg), P(c.W, 0, c.leg), P(c.W, 0, hf), P(0, 0, hf)])}" fill="${cab}"/><path d="${poly([P(0, 0, c.leg), P(c.W, 0, c.leg), P(c.W, 0, hf), P(0, 0, hf)])}" fill="#000" opacity=".2"/>`;
    if (!c.mini) s += `<g transform="${M(P(0, 0, hf), [c.W / 100, 0], [0, c.body / 100])}"><rect x="33" y="16" width="34" height="74" rx="2" fill="${x.url("chr")}"/><rect x="37" y="22" width="26" height="12" rx="1" fill="${on ? "#ff4a3a" : "#4a1a16"}"/><rect x="42" y="24" width="2.4" height="8" fill="#111"/><rect x="55.6" y="24" width="2.4" height="8" fill="#111"/><circle cx="62" cy="60" r="2" fill="#4a4f55"/><rect x="40" y="76" width="20" height="5" rx="1" fill="#1a1a1c"/></g>`;
    { const p = P(0, 1, hf - 5); s += `<ellipse cx="${f(p[0] - 1.4)}" cy="${f(p[1])}" rx="1.4" ry="2.4" fill="${on ? "#ffd23f" : "#c9a020"}"/>`; }
    { const p = P(c.W * .9, 0, hf - 6); s += `<path d="M${f(p[0])} ${f(p[1])}l-3 3" stroke="url(#${x.u}-chr)" stroke-width="1.6"/><circle cx="${f(p[0] - 3.4)}" cy="${f(p[1] + 3.4)}" r="1.8" fill="#e0262f"/>`; }
    const V = [c.kx, -c.ky - c.rise / c.D];
    s += `<path d="${poly([P(0, 0, hf), P(c.W, 0, hf), P(c.W, c.D, hb), P(0, c.D, hb)])}" fill="#111"/>`;
    s += `<g transform="${M(P(0, 0, hf), [1, 0], V)}"><g transform="translate(2.4 0) scale(${n3((c.W - 4.8) / c.W)} 1)">${field(x, c.W, c.D - 2, c)}</g><rect x="0" y="0" width="2.4" height="${c.D}" fill="${c.wood ? "#7a4b28" : "#9aa0a6"}"/><rect x="${c.W - 2.4}" y="0" width="2.4" height="${c.D}" fill="${c.wood ? "#5a3a20" : "#7a8086"}"/><rect width="${c.W}" height="3" fill="url(#${x.u}-chr)"/><path d="M0 ${c.D}L${c.W} ${c.D * .55}V${c.D * .7}L0 ${c.D}Z" fill="#fff" opacity=".07"/></g>`;
    if (c.toy) { const p = P(c.W * .72, c.D * .5, hf + c.rise * .5); s += `<path d="M${f(p[0])} ${f(p[1] - 16)}L${f(p[0] + 3.4)} ${f(p[1] - 8)}V${f(p[1])}H${f(p[0] - 3.4)}V${f(p[1] - 8)}Z" fill="#e8ecf0"/><path d="M${f(p[0] - 3.4)} ${f(p[1])}l-2.4 3h4.2zM${f(p[0] + 3.4)} ${f(p[1])}l2.4 3h-4.2z" fill="#e0262f"/><circle cx="${f(p[0])}" cy="${f(p[1] - 8)}" r="1.4" fill="#3fd0ff"/>${on ? `<path class="${P_}blink" d="M${f(p[0] - 2)} ${f(p[1] + 3)}L${f(p[0])} ${f(p[1] + 8)}L${f(p[0] + 2)} ${f(p[1] + 3)}Z" fill="#ffb03a"/>` : ""}`; }
    if (c.leg > 6) s += leg(3, 4) + leg(c.W - 3, 4);
    return `<g transform="translate(${c.cx} ${c.floor}) scale(${c.sc})">${s}</g>`;
  }
  const bulbs = (x, n) => { let s = ""; for (let i = 0; i < n; i++) { const t = i / n, px = 4 + t * 92; s += `<circle cx="${f(px)}" cy="4" r="1.6" fill="${x.on ? "#ffe79a" : "#6a5a3a"}"${x.on ? ` class="${P_}blink" style="animation-delay:${(i % 3) * .3}s"` : ""}/>`; } return s; };

  G("pinem", "Classic EM pinball", [RED, BLU, "#2e6a4a", ORG, YEL], (x) => svg(x, room(x, 120, "#2e2018", "#ffb36b", 15) +
    pinball(x, { wood: true, rail: "#a36d3e", glow: "#ffcf6b", em: true, leg: 46, bbH: 60, head: (x) => {
      const on = x.on; let r = "";
      for (let i = 0; i < 4; i++) r += `<rect x="${24 + i * 13}" y="52" width="11" height="15" rx="1" fill="#f4f0e2"/><rect x="${24 + i * 13}" y="52" width="11" height="15" fill="url(#${x.u}-glr)"/>` + seg7([3, 4, 7, 0][i], 26.5 + i * 13, 54.6, 6, 10, "#1a1a1a", "rgba(0,0,0,0)");
      return `<rect x="6" y="6" width="88" height="42" fill="${on ? "#f6d58a" : "#8a7550"}"/><circle cx="50" cy="30" r="16" fill="${x.c}" opacity=".85"/><path d="M14 44L50 10L86 44" fill="none" stroke="#1a1a6a" stroke-width="3"/><path d="M20 20h14M66 20h14" stroke="#c0392b" stroke-width="3"/>${bulbs(x, 9)}<rect x="20" y="49" width="60" height="21" rx="2" fill="#1a1208"/>${r}${on ? `<rect x="6" y="6" width="88" height="42" fill="#fff" opacity=".12" class="${P_}flick"/>` : ""}`;
    } })));
  G("pindmd", "90s dot-matrix", [BLK, PUR, RED, BLU, TEAL], (x) => svg(x, room(x, 120, "#1d1830", "#ff9b3a", 16) +
    pinball(x, { art: "stripes", acc: ORG, glow: "#ff9b3a", head: (x) => {
      const on = x.on; let g = "";
      for (let yy = 0; yy < 8; yy++) for (let xx = 0; xx < 44; xx++) g += `<circle cx="${f(9 + xx * 1.88)}" cy="${f(54 + yy * 1.88)}" r=".55" fill="#ff8a1a" opacity="${on ? .1 : .05}"/>`;
      return `<rect x="5" y="5" width="90" height="42" fill="${on ? "#2a0f4a" : "#120720"}"/><path d="M5 47L50 12L95 47Z" fill="${on ? "#c42d78" : "#4a1430"}"/><circle cx="50" cy="26" r="9" fill="${on ? "#ffd36b" : "#5a4a2a"}"/><path d="M5 40H95" stroke="${on ? "#3fd0ff" : "#1a3a4a"}" stroke-width="2"/>${on ? `<rect x="5" y="5" width="90" height="42" fill="#fff" opacity=".1" class="${P_}flick"/>` : ""}
<rect x="6" y="50" width="88" height="20" rx="1.5" fill="#0c0805"/>${g}${on ? dots("2486150", 18, 55.6, 1.88, "#ff8a1a") : ""}<circle cx="4" cy="60" r="0" fill="none"/>`;
    } })));
  G("pinwide", "Modern widebody", [BLU, BLK, RED, PUR, ORG], (x) => svg(x, room(x, 118, "#14182e", "#3fd0ff", 17) +
    pinball(x, { W: 54, sc: .84, cx: 98, art: "grid", acc: "#3fd0ff", glow: "#6fb8ff", ramp: true, toy: true, topper: true, bbH: 58, head: (x) => {
      const on = x.on;
      return `<rect x="4" y="4" width="92" height="10" fill="${x.c}"/><path d="M4 14L96 4V10L4 20Z" fill="#fff" opacity=".2"/><rect x="8" y="18" width="84" height="52" rx="2" fill="#000"/><g transform="translate(9 19) scale(.82 .667)">${screen(x, "space")}</g>${on ? dots("9031", 60, 22, 1.4, "#ffffff") : ""}<circle cx="6" cy="44" r="2.6" fill="#0a0a0c"/><circle cx="94" cy="44" r="2.6" fill="#0a0a0c"/>`;
    } })));
  G("pindigital", "Digital pinball", [BLK, RED, BLU, PUR, TEAL], (x) => svg(x, room(x, 120, "#1a1f30", "#b77bff", 18) +
    pinball(x, { digital: true, leg: 44, body: 14, rise: 6, bbH: 40, bbD: 7, legW: 3, art: "splat", glow: "#9a7bff", head: (x) => {
      const on = x.on;
      return `<rect x="6" y="8" width="88" height="56" rx="2" fill="${on ? "#0a0420" : "#07080b"}"/>${on ? `<path d="M6 64L50 20L94 64Z" fill="#6a2a8a" opacity=".6"/>${dots("15200", 28, 26, 2.6, "#ffd23f")}<rect x="6" y="8" width="88" height="56" fill="#fff" opacity=".06" class="${P_}flick"/>` : `<path d="M6 40L60 8H94V14L6 60Z" fill="#fff" opacity=".05"/>`}`;
    } })));
  G("pinmini", "Kids tabletop", [YEL, PNK, BLU, RED, "#7bbf3a"], (x) => {
    const tbl = `<rect x="8" y="150" width="184" height="12" fill="url(#${x.u}-wd)"/><path d="M8 150H192" stroke="#fff" stroke-opacity=".35"/><rect x="8" y="162" width="184" height="30" fill="#3a2414"/><rect x="8" y="162" width="184" height="6" fill="${x.url("dn")}"/>`;
    return svg(x, room(x, 160, "#2a2a44", "#ff8ad8", 19) + BGW(tbl) + pinball(x, { mini: true, W: 50, D: 80, leg: 4, body: 12, rise: 12, bbH: 40, bbD: 8, sc: 1.08, floor: 158, cx: 100, art: "splat", glow: "#ff8ad8", rail: "#fff", head: (x) => {
      const on = x.on;
      return `<rect x="4" y="4" width="92" height="67" rx="6" fill="${x.c}"/><circle cx="30" cy="26" r="12" fill="#fff" opacity=".85"/><circle cx="70" cy="22" r="8" fill="#3fd0ff"/><path d="M10 40Q50 24 90 40" stroke="#ff3fa4" stroke-width="3" fill="none"/><rect x="18" y="48" width="64" height="18" rx="3" fill="#160606"/>${seg7("0420", 26, 51, 7, 12, on ? "#ff3030" : "#3a1010", on ? "#3a1010" : "#2a0c0c")}${bulbs(x, 6)}`;
    } }));
  });

  const css = `
.hda-arcade-bob,.hda-arcade-bob2,.hda-arcade-spin,.hda-arcade-pop,.hda-arcade-pow{transform-box:fill-box;transform-origin:center}
.hda-arcade-pow{transform-origin:50% 100%}
.hda-anim .hda-arcade-dash{animation:hda-arcade-dash .45s linear infinite}
@keyframes hda-arcade-dash{to{stroke-dashoffset:-9}}
.hda-anim .hda-arcade-sy{animation:hda-arcade-sy 4s linear infinite}
@keyframes hda-arcade-sy{from{transform:translateY(0)}to{transform:translateY(75px)}}
.hda-anim .hda-arcade-sx{animation:hda-arcade-sx 6s linear infinite}
@keyframes hda-arcade-sx{from{transform:translateX(0)}to{transform:translateX(-100px)}}
.hda-anim .hda-arcade-bob{animation:hda-arcade-bob .5s ease-in-out infinite alternate}
@keyframes hda-arcade-bob{from{transform:translateY(0)}to{transform:translateY(-1.6px)}}
.hda-anim .hda-arcade-bob2{animation:hda-arcade-bob2 .6s ease-in-out infinite alternate}
@keyframes hda-arcade-bob2{from{transform:translateX(0)}to{transform:translateX(-3px)}}
.hda-anim .hda-arcade-blink{animation:hda-arcade-blink .9s ease-in-out infinite}
@keyframes hda-arcade-blink{0%,100%{opacity:1}50%{opacity:.2}}
.hda-anim .hda-arcade-flick{animation:hda-arcade-flick 2.4s ease-in-out infinite}
@keyframes hda-arcade-flick{0%,100%{opacity:.12}50%{opacity:.03}}
.hda-anim .hda-arcade-glow{animation:hda-arcade-glow 1.6s ease-in-out infinite}
@keyframes hda-arcade-glow{0%,100%{opacity:1}50%{opacity:.7}}
.hda-anim .hda-arcade-mz{animation:hda-arcade-mz 4s linear infinite alternate}
@keyframes hda-arcade-mz{from{transform:translateX(0)}to{transform:translateX(52px)}}
.hda-anim .hda-arcade-mz2{animation:hda-arcade-mz2 4s linear infinite alternate}
@keyframes hda-arcade-mz2{from{transform:translateX(0)}to{transform:translateX(-56px)}}
.hda-anim .hda-arcade-pop{animation:hda-arcade-pop 2.1s ease-in-out infinite}
@keyframes hda-arcade-pop{0%,60%,100%{opacity:1}75%{opacity:.1}}
.hda-anim .hda-arcade-wave{animation:hda-arcade-blink .5s infinite}
.hda-arcade-aim{transform:translate(50px,30px)}
.hda-anim .hda-arcade-aim{animation:hda-arcade-aim 2.1s ease-in-out infinite}
@keyframes hda-arcade-aim{0%,100%{transform:translate(22px,36px)}33%{transform:translate(50px,28px)}66%{transform:translate(78px,37px)}}
.hda-arcade-golfb{transform:translate(70px,40px)}
.hda-anim .hda-arcade-golfb{animation:hda-arcade-golfb 2.4s ease-out infinite}
@keyframes hda-arcade-golfb{0%{transform:translate(20px,66px)}50%{transform:translate(42px,26px)}90%,100%{transform:translate(70px,40px)}}
.hda-anim .hda-arcade-pow{animation:hda-arcade-pow 1.2s ease-in-out infinite alternate}
@keyframes hda-arcade-pow{from{transform:scaleY(.3)}to{transform:scaleY(1)}}
.hda-anim .hda-arcade-pad{animation:hda-arcade-pad 1.4s ease-in-out infinite alternate}
@keyframes hda-arcade-pad{from{transform:translateX(-20px)}to{transform:translateX(22px)}}
.hda-arcade-bnc{transform:translate(50px,50px)}
.hda-anim .hda-arcade-bnc{animation:hda-arcade-bnc 2.8s linear infinite}
@keyframes hda-arcade-bnc{0%,100%{transform:translate(30px,66px)}25%{transform:translate(60px,36px)}50%{transform:translate(85px,52px)}75%{transform:translate(58px,66px)}}
.hda-anim .hda-arcade-fall{animation:hda-arcade-fall 2.2s linear infinite}
@keyframes hda-arcade-fall{from{transform:translateY(0)}to{transform:translateY(16px)}}
.hda-anim .hda-arcade-drift{animation:hda-arcade-drift 7s ease-in-out infinite alternate}
@keyframes hda-arcade-drift{from{transform:translate(0,0)}to{transform:translate(6px,-4px)}}
.hda-anim .hda-arcade-spin{animation:hda-arcade-spin 3s linear infinite}
@keyframes hda-arcade-spin{to{transform:rotate(360deg)}}
.hda-anim .hda-arcade-roll{animation:hda-arcade-roll 3s linear infinite}
@keyframes hda-arcade-roll{from{transform:translate(0,0)}to{transform:translate(64px,3px)}}
.hda-arcade-pball{transform:translate(23px,40px)}
.hda-anim .hda-arcade-pball{animation:hda-arcade-pball 3.2s ease-in-out infinite}
@keyframes hda-arcade-pball{0%,100%{transform:translate(23px,14px)}20%{transform:translate(14px,48px)}35%{transform:translate(17px,70px)}50%{transform:translate(32px,78px)}65%{transform:translate(26px,62px)}80%{transform:translate(34px,36px)}}
@media (prefers-reduced-motion:reduce){.hda-anim [class*="hda-arcade-"]{animation:none!important}}`;

  (window.HDA = window.HDA || []).push({
    id: "arcade",
    tab: "Arcade cabinets",
    group: "Home",
    kind: "device",
    levelLabel: "Volume",
    onWord: "Playing",
    offWord: "Off",
    intro: "Home arcade cabinets and pinball machines in a game room: 3/4-scale uprights on risers with marquee, bezel, control deck and side art, plus a countercade, cocktail table, wall-mount and five pinball styles. Playing lights the marquee and backbox, runs an original game on the screen and casts a glow on the floor; the slider is volume. The color is the cabinet side art.",
    
    css,
    icons,
  });
})();
