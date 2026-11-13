(function () {
  const H = window.HDAH;
  const f = (n) => (+n).toFixed(1);
  const rnd = (seed) => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
  const DEG = Math.PI / 180;

  const WARM = "#ffc477", SOFT = "#ffe2ad", NEUT = "#fff1d6", DAY = "#eef4ff", ICE = "#bfe4ff", AMBER = "#ffa94d",
    VIOLET = "#b197fc", BLUE = "#4dabf7", ROSE = "#ff7eb6", GREEN = "#69db7c", RED = "#ff6b6b";

  function ctx(o) {
    const c = o.color || WARM, on = !!o.on, lv = o.level == null ? 1 : o.level;
    const L = on ? .3 + .7 * lv : 0;
    const id = (s) => `${o.uid}-${s}`, url = (s) => `url(#${o.uid}-${s})`;
    return { c, on, L, id, url, n: 0, hot: H.mix(c, "#ffffff", .6), op: (k) => Math.min(1, k * L).toFixed(2) };
  }
  const stops = (a) => a.map(([o, c, op]) => `<stop offset="${o}" stop-color="${c}"${op == null ? "" : ` stop-opacity="${op}"`}/>`).join("");
  const lg = (id, a, x1, y1, x2, y2) => `<linearGradient id="${id}" x1="${x1 || 0}" y1="${y1 || 0}" x2="${x2 == null ? 1 : x2}" y2="${y2 || 0}">${stops(a)}</linearGradient>`;
  const rg = (id, a, cx, cy, r) => `<radialGradient id="${id}" cx="${cx == null ? .5 : cx}" cy="${cy == null ? .5 : cy}" r="${r || .5}">${stops(a)}</radialGradient>`;

  function defs(x, extra) {
    const { c, id, hot } = x;
    return `<defs>
<clipPath id="${id("wc")}"><rect x="8" y="8" width="184" height="184" rx="16"/></clipPath>
${rg(id("vig"), [[0, "#000", 0], [.62, "#000", .06], [1, "#000", .5]], .5, .48, .74)}
${rg(id("halo"), [[0, c, .85], [.45, c, .3], [1, c, 0]])}
${rg(id("spt"), [[0, hot, .85], [.5, c, .5], [.78, c, .3], [.92, c, .1], [1, c, 0]])}
${rg(id("pool"), [[0, hot, .75], [.35, c, .42], [1, c, 0]])}
${lg(id("cd"), [[0, c, .75], [.45, c, .28], [1, c, 0]], 0, 0, 0, 1)}
${lg(id("cu"), [[0, c, .75], [.45, c, .28], [1, c, 0]], 0, 1, 0, 0)}
${rg(id("sh"), [[0, "#000", .65], [.6, "#000", .24], [1, "#000", 0]])}
${lg(id("ceil"), [[0, "#24232c"], [1, "#3c3a44"]], 0, 0, 0, 1)}
${lg(id("floor"), [[0, "#4a3626"], [1, "#2a1d14"]], 0, 0, 0, 1)}
${lg(id("fb"), [[0, "#55566a"], [.3, "#2a2b34"], [.7, "#141419"], [1, "#050507"]], 0, 0, 0, 1)}
${lg(id("fw"), [[0, "#ffffff"], [.45, "#e4e2e8"], [1, "#8e8b98"]], 0, 0, 0, 1)}
${lg(id("fc"), [[0, "#f4f6fb"], [.3, "#9aa0b0"], [.55, "#e9ecf4"], [1, "#4a4f5c"]], 0, 0, 0, 1)}
${lg(id("fbr"), [[0, "#fbe7a6"], [.3, "#c99a48"], [.7, "#8a5d1f"], [1, "#4d3210"]], 0, 0, 0, 1)}
${lg(id("fn"), [[0, "#e6e7ea"], [.35, "#a7abb2"], [.7, "#d0d3d8"], [1, "#5b5f66"]], 0, 0, 0, 1)}
${lg(id("brs"), [[0, "#6e4a17"], [.22, "#c99a48"], [.38, "#fbe7a6"], [.58, "#b07f33"], [.82, "#7a5118"], [1, "#4d3210"]])}
${lg(id("gold"), [[0, "#5a3e12"], [.3, "#d9b25c"], [.5, "#fff0b8"], [.7, "#b48a36"], [1, "#4a3010"]])}
${lg(id("wood"), [[0, "#3b2718"], [.4, "#7a5434"], [1, "#2d1d11"]])}
${lg(id("leaf"), [[0, "#5e9a4a"], [1, "#1f4a24"]])}
${rg(id("marb"), [[0, "#ffffff"], [.55, "#dcd8d2"], [1, "#8d8880"]], .38, .3, .8)}
${rg(id("lens"), [[0, "#7a8399"], [.6, "#2b3140"], [1, "#0d1016"]], .4, .35, .7)}
<filter id="${id("bl")}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.2"/></filter>
<filter id="${id("bl2")}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3.4"/></filter>
${extra || ""}</defs>`;
  }
  function svg(x, s, extra) {
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs(x, extra)}
<g clip-path="${x.url("wc")}"><g class="hda-bg"><rect x="8" y="8" width="184" height="184" fill="#1c1b24"/>${s.bg || ""}</g>${x.on ? s.light || "" : ""}<g class="hda-bg"><rect x="8" y="8" width="184" height="184" fill="${x.url("vig")}"/></g>${s.fx || ""}${x.on ? s.over || "" : ""}</g>
<g class="hda-bg"><rect x="8.5" y="8.5" width="183" height="183" rx="15.5" fill="none" stroke="#fff" stroke-opacity=".08"/></g></svg>`;
  }

  const E = (cx, cy, rx, ry, fill, more) => `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}" ${more || ""}/>`;
  const WS = (s) => `<g class="hda-bg">${s}</g>`;
  const glo = (x, cx, cy, rx, ry, k) => x.on ? E(cx, cy, rx, ry, x.url("halo"), `opacity="${x.op(k)}"`) : "";
  const spot = (x, cx, cy, rx, ry, k) => x.on ? WS(E(cx, cy, rx, ry, x.url("spt"), `opacity="${x.op(k == null ? .9 : k)}"`)) : "";
  const shadow = (x, cx, cy, rx, ry, k) => E(cx, cy, rx, ry, x.url("sh"), `opacity="${k == null ? .8 : k}"`);
  const drop = (x, shape, dx, dy, k) => `<g transform="translate(${dx == null ? 3 : dx} ${dy == null ? 5 : dy})" fill="#000" opacity="${k == null ? .45 : k}" filter="${x.url("bl")}">${shape}</g>`;
  const hl = (d, o, w) => `<path d="${d}" fill="none" stroke="#fff" stroke-opacity="${o == null ? .35 : o}" stroke-width="${w || 1.2}" stroke-linecap="round"/>`;
  const aim = (px, py, tx, ty) => Math.atan2(ty - py, tx - px) / DEG;
  const tip = (px, py, ang, len) => [px + Math.cos(ang * DEG) * len, py + Math.sin(ang * DEG) * len];
  function cone(x, lx, ly, tx, ty, w0, w1, k) {
    if (!x.on) return "";
    k = k == null ? 1 : k;
    const dx = tx - lx, dy = ty - ly, D = Math.hypot(dx, dy) || 1, nx = -dy / D, ny = dx / D, gid = x.id("b" + (x.n++));
    const P = (a, b) => `M${f(lx + nx * a)} ${f(ly + ny * a)} L${f(tx + nx * b)} ${f(ty + ny * b)} L${f(tx - nx * b)} ${f(ty - ny * b)} L${f(lx - nx * a)} ${f(ly - ny * a)} Z`;
    return `<linearGradient id="${gid}" gradientUnits="userSpaceOnUse" x1="${f(lx)}" y1="${f(ly)}" x2="${f(tx)}" y2="${f(ty)}">${stops([[0, x.hot, .85], [.3, x.c, .34], [1, x.c, .05]])}</linearGradient>
<path d="${P(w0 * 1.3, w1 * 1.18)}" fill="url(#${gid})" opacity="${x.op(.32 * k)}"/><path d="${P(w0, w1)}" fill="url(#${gid})" opacity="${x.op(.48 * k)}"/><path d="${P(w0 * .5, w1 * .5)}" fill="url(#${gid})" opacity="${x.op(.36 * k)}"/>`;
  }
  function can(x, px, py, ang, len, r, fin, o) {
    o = o || {};
    const lensOn = `<ellipse cx="${len}" cy="0" rx="${f(r * .3)}" ry="${f(r * .82)}" fill="${x.hot}" opacity="${(.6 + .4 * x.L).toFixed(2)}"/><ellipse cx="${len + .3}" cy="0" rx="${f(r * .16)}" ry="${f(r * .45)}" fill="#fff" opacity="${x.op(1.1)}"/><ellipse cx="${len + 2}" cy="0" rx="${f(r * 1.2)}" ry="${f(r * 1.6)}" fill="${x.url("halo")}" opacity="${x.op(1)}"/>`;
    const lensOff = `<ellipse cx="${len}" cy="0" rx="${f(r * .3)}" ry="${f(r * .82)}" fill="${x.url("lens")}"/><ellipse cx="${len}" cy="${f(-r * .3)}" rx="${f(r * .1)}" ry="${f(r * .22)}" fill="#fff" fill-opacity=".35"/>`;
    const rings = (o.fins ? Array.from({ length: o.fins }, (_, i) => `<path d="M${f(len * (.12 + i * .1))} ${f(-r)} V${f(r)}" stroke="#000" stroke-opacity=".35" stroke-width=".8"/>`).join("") : "");
    const snoot = o.snoot ? `<rect x="${len - 1}" y="${f(-r * 1.08)}" width="${o.snoot}" height="${f(r * 2.16)}" rx="1" fill="url(#${x.id(fin)})"/>` : "";
    const L2 = len + (o.snoot ? o.snoot - 1 : 0);
    return `<g transform="translate(${f(px)} ${f(py)}) rotate(${f(ang)})">
<rect x="0" y="${f(-r)}" width="${len}" height="${f(r * 2)}" rx="${f(r * (o.round || .3))}" fill="url(#${x.id(fin)})"/>${rings}
<rect x="${len - 2.4}" y="${f(-r * 1.06)}" width="2.6" height="${f(r * 2.12)}" rx=".8" fill="url(#${x.id(fin)})"/><path d="M${len - 2.4} ${f(-r)} V${f(r)}" stroke="#000" stroke-opacity=".4" stroke-width=".7"/>${snoot}
${hl(`M${f(r * .4)} ${f(-r * .62)} H${f(len - 3)}`, o.gloss == null ? .3 : o.gloss, 1)}
<g transform="translate(${L2 - len} 0)">${x.on ? lensOn : lensOff}</g></g>`;
  }
  const lensAt = (px, py, ang, len, snoot) => tip(px, py, ang, len + (snoot ? snoot - 1 : 0));

  function wall(x, y0, y1, col, seed, n) {
    const r = rnd(seed || 3); let s = `<rect x="8" y="${y0}" width="184" height="${y1 - y0}" fill="${col}"/><rect x="8" y="${y0}" width="184" height="${y1 - y0}" fill="url(#${x.id("wfade")})"/>`;
    for (let i = 0; i < (n == null ? 40 : n); i++) s += `<circle cx="${f(10 + r() * 180)}" cy="${f(y0 + 2 + r() * (y1 - y0 - 4))}" r="${f(.3 + r() * .6)}" fill="${r() > .5 ? "#000" : "#fff"}" fill-opacity="${(.04 + r() * .07).toFixed(2)}"/>`;
    return s;
  }
  const WFADE = (x) => lg(x.id("wfade"), [[0, "#000", .28], [.5, "#000", .05], [1, "#000", .3]], 0, 0, 0, 1);
  const ceiling = (x, y1) => `<rect x="8" y="8" width="184" height="${y1 - 8}" fill="${x.url("ceil")}"/><rect x="8" y="${y1 - 1}" width="184" height="2.4" fill="#000" fill-opacity=".45"/><path d="M8 ${y1 + 1.6} H192" stroke="#fff" stroke-opacity=".06"/>`;
  function floor(x, y0) {
    let s = `<rect x="8" y="${y0}" width="184" height="${192 - y0}" fill="${x.url("floor")}"/><rect x="8" y="${y0 - 3}" width="184" height="3.4" fill="#d8d4cc" fill-opacity=".55"/>`;
    for (let i = -6; i <= 26; i++) { const bx = 8 + i * 9; s += `<path d="M${f(100 + (bx - 100) * .6)} ${y0} L${f(bx + (bx - 100) * .35)} 192" stroke="#000" stroke-opacity=".3" stroke-width=".8"/>`; }
    return s;
  }
  function painting(x, x0, y0, w, h, kind, frame, seed) {
    const r = rnd(seed || 7), fw = frame === "gold" ? 6 : frame === "black" ? 2.6 : 4.4;
    const ix = x0 + fw, iy = y0 + fw, iw = w - 2 * fw, ih = h - 2 * fw, gid = x.id("pt" + (x.n++));
    let art = "";
    if (kind === "land") {
      art = `${lg(gid, [[0, "#3c5c86"], [.55, "#e8a66a"], [1, "#f3cf8e"]], 0, 0, 0, 1)}<rect x="${ix}" y="${iy}" width="${iw}" height="${ih}" fill="url(#${gid})"/>
<circle cx="${f(ix + iw * .7)}" cy="${f(iy + ih * .46)}" r="${f(ih * .09)}" fill="#fff4cf"/>
<path d="M${ix} ${f(iy + ih * .62)} Q${f(ix + iw * .3)} ${f(iy + ih * .44)} ${f(ix + iw * .6)} ${f(iy + ih * .6)} T${ix + iw} ${f(iy + ih * .56)} V${iy + ih} H${ix} Z" fill="#4c6a46"/>
<path d="M${ix} ${f(iy + ih * .78)} Q${f(ix + iw * .45)} ${f(iy + ih * .64)} ${ix + iw} ${f(iy + ih * .8)} V${iy + ih} H${ix} Z" fill="#2e4630"/>
<path d="M${f(ix + iw * .22)} ${f(iy + ih * .74)} v${f(-ih * .2)}" stroke="#1d2a1a" stroke-width="1.2"/><circle cx="${f(ix + iw * .22)}" cy="${f(iy + ih * .5)}" r="${f(ih * .08)}" fill="#24371f"/>`;
    } else if (kind === "sea") {
      art = `${lg(gid, [[0, "#9cc0d8"], [.5, "#e9dcc6"], [.52, "#3d6b8a"], [1, "#1f3f58"]], 0, 0, 0, 1)}<rect x="${ix}" y="${iy}" width="${iw}" height="${ih}" fill="url(#${gid})"/>
${[.62, .72, .84].map((t) => `<path d="M${f(ix + iw * .1)} ${f(iy + ih * t)} q${f(iw * .1)} -2 ${f(iw * .2)} 0 t${f(iw * .2)} 0" stroke="#fff" stroke-opacity=".45" fill="none" stroke-width=".8"/>`).join("")}
<path d="M${f(ix + iw * .55)} ${f(iy + ih * .5)} l${f(iw * .14)} 0 l${f(-iw * .02)} ${f(ih * .05)} l${f(-iw * .1)} 0 Z" fill="#3a2a20"/><path d="M${f(ix + iw * .62)} ${f(iy + ih * .5)} V${f(iy + ih * .3)} L${f(ix + iw * .7)} ${f(iy + ih * .48)} Z" fill="#fffaf0"/>`;
    } else if (kind === "abstract") {
      const pal = ["#e4572e", "#f3a712", "#29335c", "#a8c686", "#669bbc", "#f0e6d8"];
      art = `<rect x="${ix}" y="${iy}" width="${iw}" height="${ih}" fill="#efe7da"/>`;
      for (let i = 0; i < 5; i++) art += `<rect x="${f(ix + r() * iw * .6)}" y="${f(iy + r() * ih * .6)}" width="${f(iw * (.2 + r() * .35))}" height="${f(ih * (.15 + r() * .35))}" fill="${pal[i]}" fill-opacity=".9"/>`;
      art += `<circle cx="${f(ix + iw * .66)}" cy="${f(iy + ih * .34)}" r="${f(Math.min(iw, ih) * .16)}" fill="#1d1d24" fill-opacity=".85"/>`;
    } else if (kind === "portrait") {
      art = `${rg(gid, [[0, "#6b4a2e"], [1, "#1e140c"]], .5, .4, .7)}<rect x="${ix}" y="${iy}" width="${iw}" height="${ih}" fill="url(#${gid})"/>
<path d="M${f(ix + iw * .18)} ${iy + ih} C${f(ix + iw * .2)} ${f(iy + ih * .72)} ${f(ix + iw * .38)} ${f(iy + ih * .66)} ${f(ix + iw * .5)} ${f(iy + ih * .66)} C${f(ix + iw * .62)} ${f(iy + ih * .66)} ${f(ix + iw * .8)} ${f(iy + ih * .72)} ${f(ix + iw * .82)} ${iy + ih} Z" fill="#2a1f2c"/>
<ellipse cx="${f(ix + iw * .5)}" cy="${f(iy + ih * .44)}" rx="${f(iw * .14)}" ry="${f(ih * .17)}" fill="#d9ab86"/><path d="M${f(ix + iw * .35)} ${f(iy + ih * .42)} C${f(ix + iw * .36)} ${f(iy + ih * .2)} ${f(ix + iw * .64)} ${f(iy + ih * .2)} ${f(ix + iw * .65)} ${f(iy + ih * .42)} C${f(ix + iw * .58)} ${f(iy + ih * .3)} ${f(ix + iw * .42)} ${f(iy + ih * .3)} ${f(ix + iw * .35)} ${f(iy + ih * .42)} Z" fill="#3b2516"/>`;
    } else {
      art = `<rect x="${ix}" y="${iy}" width="${iw}" height="${ih}" fill="#efe8d6"/><path d="M${f(ix + iw / 2)} ${f(iy + ih * .9)} V${f(iy + ih * .2)}" stroke="#4d6b3a" stroke-width="1.2"/>`;
      for (let i = 0; i < 6; i++) { const yy = iy + ih * (.28 + i * .1), s2 = i % 2 ? 1 : -1;
        art += `<path d="M${f(ix + iw / 2)} ${f(yy)} q${f(s2 * iw * .2)} ${f(-ih * .06)} ${f(s2 * iw * .3)} ${f(-ih * .02)} q${f(-s2 * iw * .12)} ${f(ih * .08)} ${f(-s2 * iw * .3)} ${f(ih * .02)} Z" fill="#6f9a52"/>`; }
    }
    const fr = frame === "gold" ? x.url("gold") : frame === "black" ? "#121216" : frame === "white" ? "#ecebe6" : x.url("wood");
    return drop(x, `<rect x="${x0}" y="${y0}" width="${w}" height="${h}"/>`, 2, 5, .5) + art +
      `<rect x="${f(x0 + fw / 2)}" y="${f(y0 + fw / 2)}" width="${f(w - fw)}" height="${f(h - fw)}" fill="none" stroke="${fr}" stroke-width="${fw}"/>
<rect x="${f(ix - .4)}" y="${f(iy - .4)}" width="${f(iw + .8)}" height="${f(ih + .8)}" fill="none" stroke="#000" stroke-opacity=".4" stroke-width=".9"/>
<path d="M${x0 + .6} ${y0 + h - .6} V${y0 + .6} H${x0 + w - .6}" fill="none" stroke="#fff" stroke-opacity="${frame === "black" ? .15 : .35}" stroke-width=".9"/>`;
  }
  function fig(x, cx, by, s, seed, potCol) {
    const r = rnd(seed || 5); let leaves = "";
    const pts = [];
    for (let i = 0; i < 17; i++) { const t = i / 16, yy = -46 - t * 92, side = i % 2 ? 1 : -1, a = side * (40 + r() * 55) - 90; pts.push([side * (1 + r() * 6), yy, a, 8.5 + r() * 3.5]); }
    pts.forEach(([lx, ly, a, sz]) => { leaves += `<g transform="translate(${f(lx)} ${f(ly)}) rotate(${f(a + 90)})"><path d="M0 0 C${f(-sz * .8)} ${f(-sz * .6)} ${f(-sz * .9)} ${f(-sz * 1.7)} 0 ${f(-sz * 2)} C${f(sz * .9)} ${f(-sz * 1.7)} ${f(sz * .8)} ${f(-sz * .6)} 0 0 Z" fill="url(#${x.id("leaf")})"/><path d="M0 -1 V${f(-sz * 1.8)}" stroke="#b9d89a" stroke-opacity=".45" stroke-width=".7"/></g>`; });
    const pc = potCol || "#d9d4ca";
    return `<g transform="translate(${cx} ${by}) scale(${s})"><path d="M0 -24 C-1 -60 2 -100 0 -140" stroke="#5a4030" stroke-width="2.6" fill="none"/>${leaves}
<path d="M-16 -26 L16 -26 L12 0 L-12 0 Z" fill="${pc}"/><path d="M-16 -26 L16 -26 L12 0 L-12 0 Z" fill="url(#${x.id("potsh")})"/><rect x="-17" y="-28" width="34" height="4" rx="1.4" fill="${H.shade(pc, .08)}"/></g>`;
  }
  const POTSH = (x) => lg(x.id("potsh"), [[0, "#000", .35], [.35, "#fff", .18], [.6, "#000", 0], [1, "#000", .45]]);
  function books(x0, x1, by, seed, hmax) {
    const r = rnd(seed), pal = ["#8c2f39", "#2f4858", "#c9a227", "#3e5641", "#d6c9b0", "#5b3758", "#1f2933", "#b5651d"]; let s = "";
    for (let bx = x0; bx < x1 - 3;) { const w = 3.5 + r() * 4, h = hmax * (.65 + r() * .35), col = pal[Math.floor(r() * pal.length)];
      s += `<rect x="${f(bx)}" y="${f(by - h)}" width="${f(w)}" height="${f(h)}" fill="${col}"/><rect x="${f(bx)}" y="${f(by - h)}" width="${f(w * .3)}" height="${f(h)}" fill="#fff" fill-opacity=".12"/><path d="M${f(bx + .6)} ${f(by - h * .8)} h${f(w - 1.2)}" stroke="#f3e2b0" stroke-opacity=".5" stroke-width=".6"/>`;
      bx += w + .4; }
    return s;
  }

  const base = (o) => Object.assign({ picker: true, colorLabel: "Light", cast: "side" }, o);
  const COLS = [WARM, SOFT, NEUT, DAY, ICE];
  const ART = [NEUT, WARM, SOFT, DAY, AMBER];
  const RGB = [VIOLET, BLUE, ROSE, GREEN, AMBER, DAY];

  const icons = [
    base({ id: "track", name: "Track, 3 heads", colors: COLS, cast: "down", glow: { x: .5, y: .2, r: 1.25 }, render(o) {
      const x = ctx(o);
      const tg = [[50, 98, 22, 20], [118, 128, 20, 9], [160, 92, 18, 18]];
      const bg = ceiling(x, 22) + wall(x, 22, 170, "#5c564d", 11) + floor(x, 170) + painting(x, 24, 76, 52, 44, "land", "gold", 3) +
        `<rect x="88" y="138" width="64" height="5" fill="${x.url("wood")}"/><rect x="92" y="143" width="3" height="27" fill="#2a1d12"/><rect x="145" y="143" width="3" height="27" fill="#2a1d12"/>
<path d="M112 138 C108 130 110 122 118 118 C126 122 128 130 124 138 Z" fill="#d6cfc2"/><path d="M118 118 L114 96 M118 118 L124 92 M118 118 L118 100" stroke="#4a3a2a" stroke-width="1"/><circle cx="114" cy="96" r="2.4" fill="#f2c4ce"/><circle cx="124" cy="92" r="2.4" fill="#f2c4ce"/><circle cx="118" cy="100" r="2" fill="#fff"/>` +
        painting(x, 142, 74, 36, 38, "abstract", "black", 9);
      let light = "", fx = `<rect x="22" y="22" width="156" height="5" rx="1" fill="${x.url("fb")}"/>${hl("M24 23 H176", .2, .8)}`;
      [50, 100, 150].forEach((px, i) => {
        const [tx, ty, rx, ry] = tg[i], py = 34, a = aim(px, py, tx, ty), [lx, ly] = lensAt(px, py, a, 20);
        light += cone(x, lx, ly, tx, ty, 4.4, rx * .9) + spot(x, tx, ty, rx * 1.4, ry * 1.4);
        fx += `<rect x="${px - 4}" y="25" width="8" height="5" rx="1" fill="${x.url("fb")}"/><path d="M${px} 30 V34" stroke="#111" stroke-width="2"/>${can(x, px, py, a, 20, 5.6, "fb", { fins: 3 })}`;
      });
      return svg(x, { bg, light, fx }, WFADE(x));
    } }),

    base({ id: "monorail", name: "Monorail spots", colors: COLS, cast: "down", glow: { x: .5, y: .3, r: 1.25 }, render(o) {
      const x = ctx(o);
      let tile = `<rect x="8" y="64" width="184" height="66" fill="#d9d6d0"/>`;
      for (let y = 64, row = 0; y < 130; y += 8, row++) { tile += `<path d="M8 ${y} H192" stroke="#8b877f" stroke-width=".9"/>`; for (let xx = 8 - (row % 2) * 8; xx < 192; xx += 16) tile += `<path d="M${xx} ${y} v8" stroke="#8b877f" stroke-width=".9"/>`; }
      tile += `<rect x="8" y="64" width="184" height="66" fill="#000" fill-opacity=".38"/>`;
      const bg = ceiling(x, 18) + wall(x, 18, 64, "#4f5258", 4) + tile +
        `<rect x="8" y="130" width="184" height="9" fill="#cfccc6"/><rect x="8" y="130" width="184" height="2" fill="#fff" fill-opacity=".4"/><rect x="8" y="139" width="184" height="53" fill="#2f3a44"/>
${[8, 70, 132].map((a) => `<rect x="${a + 3}" y="145" width="56" height="44" rx="2" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="1.4"/><rect x="${a + 26}" y="150" width="10" height="2" rx="1" fill="url(#${x.id("fn")})"/>`).join("")}
<ellipse cx="52" cy="129" rx="16" ry="4" fill="#e8e2d6"/><path d="M36 126 Q52 136 68 126 Z" fill="#c9c1b2"/><circle cx="46" cy="124" r="4.6" fill="#f0d23a"/><circle cx="55" cy="123" r="4.6" fill="#e6c52c"/><circle cx="51" cy="119" r="4.4" fill="#f3da55"/>
<path d="M92 130 L94 116 H106 L108 130 Z" fill="#b5653f"/><path d="M100 116 C94 106 92 100 96 96 M100 116 C104 104 108 100 106 94 M100 116 V98" stroke="#4e8a3c" stroke-width="2.2" fill="none"/>
<path d="M140 130 C138 118 142 110 152 110 C162 110 166 118 164 130 Z" fill="url(#${x.id("fc")})"/><path d="M164 116 C172 114 172 126 164 126" fill="none" stroke="#888" stroke-width="2"/><path d="M146 110 Q152 104 158 110" stroke="#222" stroke-width="2" fill="none"/>`;
      const rail = "M8 40 C40 28 60 50 100 40 C140 30 160 50 192 38";
      const pts = [[52, 40.5, 52, 120], [100, 40, 100, 120], [150, 40.5, 152, 118]];
      let light = "", fx = [30, 100, 170].map((a) => `<path d="M${a} 18 V${a === 100 ? 40 : 36}" stroke="url(#${x.id("fc")})" stroke-width="1.6"/>`).join("") +
        `<path d="${rail}" fill="none" stroke="#5b5f68" stroke-width="3.4"/><path d="${rail}" fill="none" stroke="#f0f2f6" stroke-width="1.1" transform="translate(0 -.8)"/>`;
      pts.forEach(([px, py, tx, ty]) => {
        light += cone(x, px, py + 16, tx, ty, 3.4, 16) + spot(x, tx, ty, 24, 8);
        fx += `<path d="M${px} ${py} V${py + 7}" stroke="url(#${x.id("fc")})" stroke-width="1.4"/><circle cx="${px}" cy="${py + 7}" r="1.6" fill="#ddd"/>
<path d="M${px - 6} ${py + 8} L${px + 6} ${py + 8} L${px + 4.4} ${py + 16} L${px - 4.4} ${py + 16} Z" fill="url(#${x.id("fc")})"/>${x.on ? `<ellipse cx="${px}" cy="${py + 16}" rx="4.4" ry="1.4" fill="${x.hot}"/>${glo(x, px, py + 17, 10, 4, 1)}` : `<ellipse cx="${px}" cy="${py + 16}" rx="4.4" ry="1.3" fill="#1c1f26"/>`}`;
      });
      return svg(x, { bg, light, fx }, WFADE(x));
    } }),

    base({ id: "runner", name: "Runner wall spot", colors: [NEUT, WARM, SOFT, DAY, ICE], glow: { x: .34, y: .32, r: 1.1 }, render(o) {
      const x = ctx(o);
      const bg = wall(x, 8, 170, "#5c5862", 21) + floor(x, 170) + `<rect x="110" y="150" width="44" height="6" fill="${x.url("wood")}"/><path d="M114 156 L110 172 M150 156 L154 172" stroke="#2a1d12" stroke-width="2.6"/>` + fig(x, 132, 150, .62, 3, "#f2efe9");
      const px = 62, py = 58, a = aim(px, py, 130, 108), [lx, ly] = lensAt(px, py, a, 26);
      const light = cone(x, lx, ly, 130, 108, 6, 30) + spot(x, 130, 106, 44, 48);
      const fx = drop(x, `<rect x="50" y="46" width="22" height="22" rx="6"/>`, 2, 4, .45) + `<rect x="50" y="46" width="22" height="22" rx="6" fill="${x.url("fw")}"/><rect x="50.5" y="46.5" width="21" height="21" rx="5.5" fill="none" stroke="#fff" stroke-opacity=".6"/>
<rect x="58" y="54" width="8" height="8" rx="2" fill="#cfccd5"/>${can(x, px, py, a, 26, 8, "fw", { round: .45, gloss: .6 })}`;
      return svg(x, { bg, light, fx }, WFADE(x) + POTSH(x));
    } }),

    base({ id: "plugin", name: "Plug-in wall spot", colors: [WARM, SOFT, NEUT, DAY, AMBER], glow: { x: .44, y: .33, r: 1.05 }, render(o) {
      const x = ctx(o);
      const bg = wall(x, 8, 172, "#2f463d", 31) + floor(x, 172) +
        `<rect x="47" y="66" width="7" height="104" rx="1.4" fill="#3a5248"/><path d="M47.6 66 V170" stroke="#fff" stroke-opacity=".1"/><path d="M53.4 66 V170" stroke="#000" stroke-opacity=".3"/>
<rect x="38" y="150" width="14" height="20" rx="2" fill="#e9e6df"/><rect x="42" y="154" width="6" height="4" rx="1" fill="#2a2a2a"/><rect x="42" y="162" width="6" height="4" rx="1" fill="#1a1a1a"/><rect x="44" y="160" width="10" height="5" rx="1" fill="#111"/>` +
        painting(x, 98, 96, 54, 62, "botan", "wood", 4);
      const px = 88, py = 54, a = aim(px, py, 125, 124), [lx, ly] = lensAt(px, py, a, 22);
      const light = cone(x, lx, ly, 125, 124, 5, 28) + spot(x, 125, 124, 40, 42);
      const fx = drop(x, `<circle cx="50" cy="56" r="9"/>`, 2, 4, .45) + `<circle cx="50" cy="56" r="9" fill="${x.url("fb")}"/><circle cx="50" cy="56" r="9" fill="none" stroke="#fff" stroke-opacity=".12"/>
<path d="M50 56 H88" stroke="#111" stroke-width="3"/><path d="M52 55 H86" stroke="#fff" stroke-opacity=".2" stroke-width=".8"/><circle cx="88" cy="54.6" r="3" fill="${x.url("brs")}"/>
<path d="M50 65 V68" stroke="#111" stroke-width="2"/>${can(x, px, py, a, 22, 6.5, "fb", { round: .2 })}<rect x="${px - 3}" y="${py - 3}" width="6" height="6" rx="1" fill="${x.url("brs")}" transform="rotate(${f(a)} ${px} ${py})"/>`;
      return svg(x, { bg, light, fx }, WFADE(x));
    } }),

    base({ id: "cylinder", name: "Surface cylinder", colors: COLS, cast: "down", glow: { x: .5, y: .27, r: 1.1 }, render(o) {
      const x = ctx(o), r = rnd(5);
      let conc = wall(x, 26, 172, "#5f6064", 41, 90);
      [[40, 60], [160, 60], [40, 130], [160, 130]].forEach(([a, b]) => { conc += `<circle cx="${a}" cy="${b}" r="2.4" fill="#2a2b2e"/>`; });
      const bg = ceiling(x, 26) + conc + floor(x, 172) + `<rect x="46" y="140" width="108" height="6" fill="${x.url("wood")}"/><rect x="50" y="146" width="100" height="10" fill="#3a2717"/><path d="M52 156 L50 172 M148 156 L150 172" stroke="#2a1d12" stroke-width="3"/>
<path d="M92 140 C86 128 88 118 100 112 C112 118 114 128 108 140 Z" fill="#20242c"/><path d="M95 120 C94 116 96 113 100 112" stroke="#fff" stroke-opacity=".25" fill="none"/>
<path d="M100 112 C96 92 86 76 78 66 M100 112 C104 90 116 78 122 70 M100 112 C100 96 102 84 100 72" stroke="#3b2a1c" stroke-width="1.4" fill="none"/>${[[78, 66], [122, 70], [100, 72], [88, 78], [112, 82]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="2.6" fill="#f3e9d8"/>`).join("")}`;
      const light = cone(x, 100, 60, 100, 136, 10, 46, 1.1) + WS(E(100, 92, 44, 52, x.url("spt"), `opacity="${x.op(.45)}"`)) + spot(x, 100, 140, 54, 7);
      const fx = drop(x, `<rect x="88" y="26" width="24" height="34"/>`, 2, 4, .45) + `<rect x="88" y="26" width="24" height="34" fill="url(#${x.id("fwv")})"/><rect x="85" y="25" width="30" height="4" rx="1.4" fill="url(#${x.id("fwv")})"/><path d="M88 29.4 H112" stroke="#000" stroke-opacity=".25"/>${hl("M92 30 V57", .6, 1.4)}
<ellipse cx="100" cy="60" rx="12" ry="2.2" fill="${x.on ? x.hot : "#2a2c33"}" ${x.on ? `opacity="${(.6 + .4 * x.L).toFixed(2)}"` : ""}/>${glo(x, 100, 62, 22, 8, 1)}`;
      return svg(x, { bg, light, fx }, WFADE(x) + lg(x.id("fwv"), [[0, "#8a8794"], [.3, "#f4f3f6"], [.5, "#ffffff"], [.8, "#cfccd5"], [1, "#7c7986"]]));
    } }),

    base({ id: "gimbal", name: "Recessed gimbal", colors: ART, glow: { x: .36, y: .14, r: 1.1 }, render(o) {
      const x = ctx(o);
      const bg = ceiling(x, 34) + wall(x, 34, 176, "#283149", 51) + floor(x, 176) + painting(x, 94, 64, 76, 80, "land", "gold", 6);
      const tx = 132, ty = 104;
      const light = cone(x, 74, 26, tx, ty, 5, 38) + spot(x, tx, ty, 58, 56);
      const fx = `<ellipse cx="70" cy="24" rx="19" ry="6" fill="#d9d6de"/><ellipse cx="70" cy="24" rx="15" ry="4.4" fill="#141419"/>
<ellipse cx="72" cy="25" rx="11" ry="3.6" fill="${x.url("fw")}"/>${x.on ? `<ellipse cx="74.5" cy="26" rx="6.2" ry="2.4" fill="${x.hot}" opacity="${(.6 + .4 * x.L).toFixed(2)}"/><ellipse cx="75" cy="26.2" rx="3" ry="1.2" fill="#fff" opacity="${x.op(1)}"/>${glo(x, 75, 27, 18, 8, 1)}` : `<ellipse cx="74.5" cy="26" rx="6.2" ry="2.4" fill="${x.url("lens")}"/>`}
<path d="M52 23 Q70 16 88 23" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width=".8"/>`;
      return svg(x, { bg, light, fx }, WFADE(x));
    } }),

    base({ id: "washer", name: "Wall washer", colors: [WARM, SOFT, NEUT, DAY, AMBER], cast: "down", glow: { x: .5, y: .14, r: 1.15 }, render(o) {
      const x = ctx(o), r = rnd(13);
      let br = `<rect x="8" y="30" width="184" height="144" fill="#5b3729"/>`, edges = "";
      for (let row = 0, y = 30; y < 174; y += 10, row++) {
        for (let bx = 8 - (row % 2) * 11; bx < 192; bx += 22) { const v = r();
          br += `<rect x="${f(bx + .8)}" y="${f(y + .8)}" width="20.4" height="8.4" rx="1" fill="${v > .5 ? "#000" : "#e3a07f"}" fill-opacity="${(.05 + v * .12).toFixed(2)}"/>`; edges += `M${f(bx + 1.5)} ${f(y + 1.2)} h18.6 `; }
        br += `<path d="M8 ${y} H192" stroke="#b7a898" stroke-opacity=".22" stroke-width="1.4"/>`;
      }
      const cp = `<clipPath id="${x.id("wb")}"><path d="M84 30 L20 174 L180 174 L116 30 Z"/></clipPath>`;
      const bg = ceiling(x, 30) + br + `<path d="${edges}" stroke="#000" stroke-opacity=".0"/>` + floor(x, 174);
      const light = cone(x, 100, 30, 100, 168, 18, 82, 1.1) + `<g class="hda-bg"><g clip-path="${x.url("wb")}"><path d="${edges}" stroke="${x.hot}" stroke-opacity="${x.op(.75)}" stroke-width="1.1"/></g></g>` + E(100, 40, 70, 18, x.url("halo"), `opacity="${x.op(.7)}"`);
      const fx = `<ellipse cx="100" cy="22" rx="22" ry="6.4" fill="${x.url("fw")}"/><ellipse cx="100" cy="22.6" rx="17" ry="4.6" fill="#141419"/>
<ellipse cx="100" cy="24" rx="12" ry="3" fill="${x.on ? x.hot : "#2a2c34"}" ${x.on ? `opacity="${(.6 + .4 * x.L).toFixed(2)}"` : ""}/><path d="M83 22 Q84 14 100 13 Q116 14 117 22 Q100 19 83 22 Z" fill="${x.url("fw")}"/><path d="M85 21 Q100 18 115 21" fill="none" stroke="#000" stroke-opacity=".3"/>${glo(x, 100, 28, 30, 6, 1)}`;
      return svg(x, { bg, light, fx }, cp);
    } }),

    base({ id: "wafer", name: "Canless wafer", colors: [DAY, NEUT, SOFT, WARM, ICE], cast: "down", glow: { x: .5, y: .16, r: 1.2 }, render(o) {
      const x = ctx(o);
      const bg = ceiling(x, 36) + wall(x, 36, 160, "#6a6660", 61) + floor(x, 160) +
        `<path d="M70 192 L84 160 H116 L130 192 Z" fill="#6e2f2a"/><path d="M73 186 L86 163 H114 L127 186" fill="none" stroke="#d8b483" stroke-opacity=".55" stroke-width="1.2"/>` +
        painting(x, 76, 66, 48, 38, "sea", "white", 3) + `<rect x="60" y="128" width="80" height="5" fill="${x.url("wood")}"/><path d="M64 133 V160 M136 133 V160" stroke="#2a1d12" stroke-width="2.6"/><rect x="70" y="116" width="14" height="12" rx="2" fill="#c9b79c"/><circle cx="124" cy="122" r="6" fill="#2d4a2c"/>`;
      const light = cone(x, 100, 30, 100, 160, 20, 78, .9) + WS(E(100, 104, 60, 52, x.url("spt"), `opacity="${x.op(.45)}"`)) + spot(x, 100, 172, 70, 14, .7);
      const fx = `<ellipse cx="100" cy="27" rx="30" ry="6.4" fill="url(#${x.id("fwv2")})"/><ellipse cx="100" cy="28.4" rx="26" ry="4.6" fill="${x.on ? x.hot : "#d4d2da"}" ${x.on ? `opacity="${(.65 + .35 * x.L).toFixed(2)}"` : ""}/>${x.on ? `<ellipse cx="100" cy="28.6" rx="18" ry="3" fill="#fff" opacity="${x.op(1)}"/>` : `<ellipse cx="100" cy="28" rx="18" ry="2.6" fill="#fff" fill-opacity=".35"/>`}${glo(x, 100, 30, 44, 10, .9)}`;
      return svg(x, { bg, light, fx }, WFADE(x) + lg(x.id("fwv2"), [[0, "#ffffff"], [1, "#8e8b98"]], 0, 0, 0, 1));
    } }),

    base({ id: "colorspot", name: "Smart color spot", colors: RGB, glow: { x: .32, y: .18, r: 1.2 }, render(o) {
      const x = ctx(o), r = rnd(71);
      let slats = `<rect x="8" y="24" width="184" height="124" fill="#1c140e"/>`, edges = "";
      for (let sx = 10; sx < 192; sx += 9) { const col = H.mix("#5a3c26", "#7a5434", r()); slats += `<rect x="${sx}" y="24" width="6" height="124" fill="${col}"/><rect x="${sx}" y="24" width="1.6" height="124" fill="#fff" fill-opacity=".12"/>`; edges += `M${sx + .8} 24 V148 `; }
      const bg = ceiling(x, 24) + slats + `<rect x="8" y="148" width="184" height="44" fill="#26252c"/><rect x="34" y="150" width="132" height="24" fill="#3b3a43"/><rect x="34" y="150" width="132" height="2" fill="#fff" fill-opacity=".12"/><path d="M100 152 V174" stroke="#000" stroke-opacity=".35"/><rect x="34" y="174" width="132" height="18" fill="#1a1920"/>`;
      const px = 54, py = 34, tx = 118, ty = 92, a = aim(px, py, tx, ty), [lx, ly] = lensAt(px, py, a, 24);
      const cp = `<clipPath id="${x.id("cs")}"><ellipse cx="${tx}" cy="${ty}" rx="70" ry="60"/></clipPath>`;
      const light = cone(x, lx, ly, tx, ty, 6, 40) + spot(x, tx, ty, 72, 62, 1) + `<g class="hda-bg"><g clip-path="${x.url("cs")}"><path d="${edges}" stroke="${x.hot}" stroke-opacity="${x.op(.5)}" stroke-width="1"/></g></g>`;
      const fx = `<ellipse cx="54" cy="24.6" rx="10" ry="2.6" fill="${x.url("fb")}"/><rect x="51" y="24" width="6" height="8" fill="#141418"/>${can(x, px, py, a, 24, 8, "fb", { round: .5 })}
<circle cx="${f(px - 2)}" cy="${py}" r="3" fill="#2a2b33"/>`;
      return svg(x, { bg, light, fx }, cp);
    } }),

    base({ id: "brasspic", name: "Brass picture light", colors: ART, cast: "down", glow: { x: .5, y: .3, r: 1.1 }, render(o) {
      const x = ctx(o);
      const bg = wall(x, 8, 140, "#4a2329", 81) + `<rect x="8" y="140" width="184" height="52" fill="#3a1b20"/><rect x="8" y="138" width="184" height="4" fill="#5e3036"/>${[30, 70, 110, 150].map((a) => `<rect x="${a - 14}" y="148" width="40" height="36" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="1.4"/>`).join("")}` +
        painting(x, 42, 66, 116, 92, "portrait", "gold", 9);
      const light = cone(x, 100, 62, 100, 124, 38, 64, 1) + WS(E(100, 96, 66, 40, x.url("spt"), `opacity="${x.op(.6)}"`));
      const fx = drop(x, `<rect x="64" y="54" width="72" height="9" rx="4"/>`, 1, 5, .5) + `<circle cx="100" cy="38" r="7" fill="${x.url("fbr")}"/><circle cx="100" cy="38" r="4.4" fill="none" stroke="#fff" stroke-opacity=".3"/>
<path d="M100 44 C100 50 100 52 100 56" fill="none" stroke="#7a5118" stroke-width="3"/><path d="M99.2 44 V55" stroke="#fbe7a6" stroke-opacity=".6" stroke-width=".8"/>
<rect x="62" y="54" width="76" height="9" rx="4.5" fill="${x.url("fbr")}"/><rect x="60" y="53" width="4" height="11" rx="1.6" fill="${x.url("brs")}"/><rect x="136" y="53" width="4" height="11" rx="1.6" fill="${x.url("brs")}"/>${hl("M66 56 H134", .6, 1)}
<rect x="66" y="61.4" width="68" height="2" rx="1" fill="${x.on ? x.hot : "#3a2a10"}" ${x.on ? `opacity="${(.6 + .4 * x.L).toFixed(2)}"` : ""}/>${glo(x, 100, 64, 44, 6, 1)}`;
      return svg(x, { bg, light, fx }, WFADE(x));
    } }),

    base({ id: "ledbar", name: "LED bar picture light", colors: ART, cast: "down", glow: { x: .5, y: .25, r: 1.15 }, render(o) {
      const x = ctx(o);
      const bg = wall(x, 8, 176, "#6a6b70", 91) + floor(x, 176) + painting(x, 30, 62, 140, 104, "abstract", "black", 21);
      const light = cone(x, 100, 54, 100, 120, 52, 70, .9) + WS(E(100, 98, 76, 52, x.url("spt"), `opacity="${x.op(.55)}"`));
      const fx = drop(x, `<rect x="44" y="46" width="112" height="6" rx="3"/>`, 1, 4, .5) + `<rect x="96" y="34" width="8" height="8" rx="1.4" fill="${x.url("fb")}"/><path d="M100 42 V48" stroke="#111" stroke-width="2.4"/>
<rect x="44" y="46" width="112" height="6.4" rx="3" fill="${x.url("fb")}"/>${hl("M47 47.4 H153", .25, .8)}
<rect x="48" y="51" width="104" height="1.8" rx=".9" fill="${x.on ? x.hot : "#0a0a0d"}" ${x.on ? `opacity="${(.6 + .4 * x.L).toFixed(2)}"` : ""}/>${glo(x, 100, 54, 64, 6, 1)}`;
      return svg(x, { bg, light, fx }, WFADE(x));
    } }),

    base({ id: "battery", name: "Battery picture light", colors: [WARM, NEUT, SOFT, DAY, AMBER], cast: "down", glow: { x: .5, y: .36, r: 1 }, render(o) {
      const x = ctx(o);
      const bg = wall(x, 8, 172, "#6b5f50", 101) + floor(x, 172) + painting(x, 64, 88, 72, 64, "sea", "wood", 5) +
        `<rect x="30" y="156" width="140" height="6" fill="${x.url("wood")}"/><rect x="34" y="162" width="132" height="10" fill="#3a2717"/>`;
      const light = cone(x, 100, 76, 100, 116, 22, 40) + WS(E(100, 106, 42, 32, x.url("spt"), `opacity="${x.op(.65)}"`));
      const fx = drop(x, `<circle cx="100" cy="54" r="9"/>`, 1, 4, .45) + `<circle cx="100" cy="54" r="9" fill="${x.url("fbr")}"/><circle cx="100" cy="54" r="6" fill="none" stroke="#fff" stroke-opacity=".25"/><circle cx="100" cy="58.6" r=".9" fill="${x.on ? "#7dff9a" : "#2d3a2d"}"/>
<path d="M100 63 C100 68 100 70 100 72" stroke="#8a5d1f" stroke-width="2.2"/><rect x="76" y="70" width="48" height="7" rx="3.5" fill="${x.url("fbr")}"/>${hl("M79 72 H121", .55, .9)}
<rect x="80" y="75.4" width="40" height="1.6" rx=".8" fill="${x.on ? x.hot : "#3a2a10"}" ${x.on ? `opacity="${(.6 + .4 * x.L).toFixed(2)}"` : ""}/>${glo(x, 100, 77, 28, 5, 1)}
<path d="M100 63 V40" stroke="#111" stroke-opacity="0"/>`;
      return svg(x, { bg, light, fx }, WFADE(x));
    } }),

    base({ id: "museum", name: "Museum accent spot", colors: [NEUT, DAY, WARM, SOFT, ICE], glow: { x: .24, y: .16, r: 1.1 }, render(o) {
      const x = ctx(o);
      const bust = `<path d="M82 130 C82 118 90 112 100 112 C110 112 118 118 118 130 Z"/><rect x="96" y="102" width="8" height="12"/><ellipse cx="100" cy="94" rx="9.5" ry="12"/>`;
      const bg = ceiling(x, 18) + wall(x, 18, 176, "#2c2c31", 111) + floor(x, 176) +
        (x.on ? `<g transform="translate(18 -2) scale(1.08)" fill="#000" opacity="${x.op(.55)}" filter="${x.url("bl")}">${bust}</g>` : "");
      const tx = 100, ty = 100, px = 34, py = 30, a = aim(px, py, tx, ty), [lx, ly] = lensAt(px, py, a, 18, 10);
      const light = cone(x, lx, ly, tx, ty, 5, 26) + spot(x, tx + 6, ty, 42, 46);
      const fx = `<rect x="76" y="134" width="48" height="58" fill="url(#${x.id("plin")})"/><rect x="74" y="130" width="52" height="5" fill="#eceae4"/>` + `<g fill="url(#${x.id("marb")})">${bust}</g><path d="M93 88 C94 84 97 82 100 82" stroke="#fff" stroke-opacity=".6" fill="none"/><rect x="88" y="126" width="24" height="5" fill="#cfcac2"/>
${x.on ? `<g fill="${x.c}" opacity="${x.op(.25)}">${bust}</g>` : ""}
<rect x="14" y="18" width="40" height="4" fill="${x.url("fb")}"/><path d="M34 22 V30" stroke="#111" stroke-width="2"/>${can(x, px, py, a, 18, 6, "fb", { snoot: 10, fins: 2 })}`;
      return svg(x, { bg, light, fx }, WFADE(x) + lg(x.id("plin"), [[0, "#bdb9b1"], [.4, "#f2f0ea"], [1, "#9a968e"]]));
    } }),

    base({ id: "mirror", name: "Over-mirror bar", colors: [DAY, NEUT, SOFT, WARM, ICE], cast: "down", glow: { x: .5, y: .25, r: 1.2 }, render(o) {
      const x = ctx(o);
      let tile = `<rect x="8" y="8" width="184" height="160" fill="#8e9196"/>`;
      for (let y = 8; y < 168; y += 20) tile += `<path d="M8 ${y} H192" stroke="#5c5f64" stroke-width="1"/>`;
      for (let xx = 8; xx < 192; xx += 20) tile += `<path d="M${xx} 8 V168" stroke="#5c5f64" stroke-width="1"/>`;
      tile += `<rect x="8" y="8" width="184" height="160" fill="#000" fill-opacity=".35"/>`;
      const bg = tile + `<rect x="8" y="164" width="184" height="10" fill="#e9e6e0"/><rect x="8" y="174" width="184" height="18" fill="#3e4a52"/>
<path d="M96 164 V156 Q96 150 104 150 H112" fill="none" stroke="url(#${x.id("fc")})" stroke-width="3.4"/><rect x="92" y="160" width="8" height="5" fill="url(#${x.id("fc")})"/>
<rect x="44" y="58" width="112" height="86" rx="3" fill="#cfd0d4"/><rect x="47" y="61" width="106" height="80" rx="2" fill="url(#${x.id("mir")})"/><path d="M60 64 L100 64 L60 120 Z" fill="#fff" fill-opacity=".12"/><path d="M120 138 L150 100 L150 138 Z" fill="#fff" fill-opacity=".06"/>`;
      const light = cone(x, 100, 54, 100, 120, 50, 76, .8) + WS(E(100, 80, 70, 34, x.url("spt"), `opacity="${x.op(.7)}"`)) + spot(x, 100, 166, 70, 6, .8);
      const fx = drop(x, `<rect x="52" y="46" width="96" height="7" rx="3.5"/>`, 1, 4, .45) + `<rect x="90" y="38" width="20" height="8" rx="2" fill="url(#${x.id("fc")})"/>
<rect x="56" y="46" width="88" height="7" rx="3.5" fill="${x.on ? x.hot : "#e8e8ec"}" ${x.on ? `opacity="${(.7 + .3 * x.L).toFixed(2)}"` : ""}/><rect x="56" y="46" width="88" height="2.4" rx="1.2" fill="#fff" fill-opacity=".5"/><rect x="50" y="45" width="7" height="9" rx="2" fill="url(#${x.id("fc")})"/><rect x="143" y="45" width="7" height="9" rx="2" fill="url(#${x.id("fc")})"/>${glo(x, 100, 54, 58, 7, 1)}`;
      return svg(x, { bg, light, fx }, lg(x.id("mir"), [[0, "#5d6a78"], [.5, "#323b47"], [1, "#1e252e"]], 0, 0, 1, 1));
    } }),

    base({ id: "shelfpuck", name: "Bookshelf puck", colors: [WARM, SOFT, NEUT, DAY, VIOLET], cast: "down", glow: { x: .5, y: .45, r: 1.15 }, render(o) {
      const x = ctx(o);
      const comps = [[14, 62], [70, 118], [126, 174]];
      let bg = `<rect x="8" y="8" width="184" height="184" fill="#24170e"/>`;
      comps.forEach(([t, b], i) => {
        bg += `<rect x="20" y="${t}" width="160" height="${b - t}" fill="#3a271a"/><rect x="20" y="${t}" width="160" height="${b - t}" fill="url(#${x.id("back")})"/>`;
        bg += books(24, i === 1 ? 70 : 74, b, 5 + i * 7, 40) + books(i === 2 ? 132 : 134, 176, b, 17 + i * 3, 36);
      });
      bg += `<path d="M92 62 C88 52 90 44 100 40 C110 44 112 52 108 62 Z" fill="#2c4f6e"/><path d="M95 48 C96 44 98 42 100 41" stroke="#fff" stroke-opacity=".3" fill="none"/>
<rect x="84" y="108" width="32" height="10" fill="#c9b79c"/><rect x="86" y="100" width="28" height="8" fill="#8a3b2e"/><rect x="88" y="94" width="24" height="6" fill="#d8cdb6"/>
<path d="M92 174 L94 160 H106 L108 174 Z" fill="#e7e2d8"/><path d="M100 160 C96 152 90 150 88 146 M100 160 C104 150 110 148 112 144 M100 160 V146" stroke="#4e8a3c" stroke-width="2.4" fill="none"/>`;
      [8, 62, 118, 174].forEach((y) => { bg += `<rect x="8" y="${y}" width="184" height="${y === 8 ? 6 : 8}" fill="url(#${x.id("wood")})"/><path d="M8 ${y + .6} H192" stroke="#fff" stroke-opacity=".15"/>`; });
      bg += `<rect x="8" y="8" width="12" height="184" fill="url(#${x.id("wood")})"/><rect x="180" y="8" width="12" height="184" fill="url(#${x.id("wood")})"/>`;
      let light = "", fx = "";
      comps.forEach(([t, b]) => { light += cone(x, 100, t + 2, 100, b, 6, 46, .9) + spot(x, 100, b - 6, 56, 14, .8) + glo(x, 100, t + 14, 50, 22, .4);
        fx += `<ellipse cx="100" cy="${t + .6}" rx="9" ry="2.2" fill="url(#${x.id("fn")})"/><ellipse cx="100" cy="${t + 1.6}" rx="6.4" ry="1.3" fill="${x.on ? x.hot : "#2a2c33"}" ${x.on ? `opacity="${(.6 + .4 * x.L).toFixed(2)}"` : ""}/>${glo(x, 100, t + 2, 14, 4, 1)}`; });
      return svg(x, { bg, light, fx }, lg(x.id("back"), [[0, "#000", .5], [1, "#000", 0]], 0, 0, 0, 1));
    } }),

    base({ id: "upcan", name: "Uplight can", colors: [WARM, SOFT, NEUT, GREEN, VIOLET], cast: "up", glow: { x: .58, y: .82, r: 1.2 }, render(o) {
      const x = ctx(o);
      const bg = wall(x, 8, 170, "#57534e", 121) + `<path d="M8 8 L40 8 L40 170 L8 170 Z" fill="#000" fill-opacity=".2"/>` + floor(x, 170);
      const leafShadow = x.on ? `<g transform="translate(118 168) scale(1.5 1.25)" opacity="${x.op(.4)}" filter="${x.url("bl2")}"><g transform="translate(-100 -170)">${fig(x, 100, 170, .8, 9, "#000").replace(/url\(#[^)]+\)/g, "#000")}</g></g>` : "";
      const light = cone(x, 116, 164, 128, 16, 8, 64, 1) + WS(E(124, 70, 60, 70, x.url("spt"), `opacity="${x.op(.6)}"`)) + leafShadow;
      const fx = fig(x, 96, 176, .9, 9, "#2f3238") + `<path d="M108 174 V160 L126 150 V174 Z" fill="url(#${x.id("fbh")})"/><ellipse cx="117" cy="155" rx="10" ry="3.4" transform="rotate(-29 117 155)" fill="#c9a24a"/><ellipse cx="117.4" cy="155.4" rx="7.4" ry="2.2" transform="rotate(-29 117 155)" fill="${x.on ? x.hot : "#15161b"}" ${x.on ? `opacity="${(.6 + .4 * x.L).toFixed(2)}"` : ""}/>${glo(x, 117, 156, 18, 7, 1)}<path d="M126 170 C134 172 140 172 150 170" stroke="#111" stroke-width="1.2" fill="none"/>`;
      return svg(x, { bg, light, fx }, WFADE(x) + POTSH(x) + lg(x.id("fbh"), [[0, "#0a0a0d"], [.35, "#3e3f4a"], [.6, "#1d1e25"], [1, "#050507"]]));
    } }),

    base({ id: "sconcepair", name: "Gallery spot pair", colors: ART, glow: { x: .5, y: .3, r: 1.25 }, render(o) {
      const x = ctx(o);
      const bg = wall(x, 8, 176, "#77756f", 131) + floor(x, 176) + painting(x, 64, 74, 72, 78, "land", "black", 4) +
        painting(x, 16, 96, 32, 40, "botan", "white", 3) + painting(x, 152, 92, 32, 30, "abstract", "wood", 8) + painting(x, 156, 128, 26, 26, "sea", "black", 2);
      let light = "", fx = "";
      [[30, 52, 92, 108], [170, 52, 108, 108]].forEach(([px, py, tx, ty]) => {
        const a = aim(px, py, tx, ty), [lx, ly] = lensAt(px, py, a, 18);
        light += cone(x, lx, ly, tx, ty, 4.6, 30) + spot(x, tx, ty, 38, 46, .75);
        fx += drop(x, `<circle cx="${px}" cy="${py - 6}" r="7"/>`, 2, 4, .4) + `<circle cx="${px}" cy="${py - 6}" r="7" fill="${x.url("fb")}"/><path d="M${px} ${py - 2} V${py}" stroke="#111" stroke-width="3"/>${can(x, px, py, a, 18, 5.4, "fb", { round: .5 })}`;
      });
      return svg(x, { bg, light, fx }, WFADE(x));
    } }),

    base({ id: "spotbar", name: "3-light spot bar", colors: COLS, cast: "down", glow: { x: .5, y: .2, r: 1.25 }, render(o) {
      const x = ctx(o);
      const bg = ceiling(x, 22) + wall(x, 22, 172, "#495a52", 141) + floor(x, 172) +
        `<rect x="30" y="140" width="140" height="8" fill="${x.url("wood")}"/><rect x="34" y="148" width="132" height="24" fill="#2f2015"/>${[34, 78, 122].map((a) => `<rect x="${a + 2}" y="150" width="40" height="20" fill="none" stroke="#000" stroke-opacity=".35"/>`).join("")}` +
        `<path d="M44 140 L50 112 L56 140 Z" fill="#d6c7a8"/><ellipse cx="50" cy="110" rx="12" ry="7" fill="#e9e1cf"/><path d="M50 117 V140" stroke="#444"/>` +
        books(86, 116, 140, 3, 22) + `<path d="M140 140 C136 130 138 122 150 118 C162 122 164 130 160 140 Z" fill="#9b5530"/><path d="M144 126 C146 122 148 120 150 119" stroke="#fff" stroke-opacity=".3" fill="none"/>` +
        painting(x, 76, 52, 48, 36, "abstract", "white", 31);
      let light = "", fx = drop(x, `<rect x="40" y="22" width="120" height="7" rx="2"/>`, 1, 4, .4) + `<rect x="40" y="22" width="120" height="7" rx="2" fill="url(#${x.id("fn")})"/>${hl("M43 23.4 H157", .5, .8)}`;
      [[60, 50, 128], [100, 100, 70], [140, 150, 128]].forEach(([px, tx, ty]) => {
        const py = 34, a = aim(px, py, tx, ty);
        const [lx, ly] = tip(px, py, a, 12);
        light += cone(x, lx, ly, tx, ty, 6, 22) + spot(x, tx, ty, 30, 26, .85);
        fx += `<path d="M${px} 29 V34" stroke="#888" stroke-width="2"/><g transform="translate(${px} ${py}) rotate(${f(a - 90)})"><circle r="7.4" fill="url(#${x.id("fn")})"/><path d="M-7.4 0 L-6 12 H6 L7.4 0 Z" fill="url(#${x.id("fn")})"/>
${x.on ? `<ellipse cy="12" rx="6" ry="1.8" fill="${x.hot}"/><ellipse cy="13" rx="10" ry="5" fill="${x.url("halo")}" opacity="${x.op(1)}"/>` : `<ellipse cy="12" rx="6" ry="1.8" fill="#1c1f26"/>`}${hl("M-4.6 -4 C-6 0 -5.4 6 -4.4 10", .5, 1)}</g>`;
      });
      return svg(x, { bg, light, fx }, WFADE(x));
    } }),

    base({ id: "tripod", name: "Tripod floor spot", colors: [WARM, NEUT, DAY, SOFT, AMBER], glow: { x: .64, y: .42, r: 1.1 }, render(o) {
      const x = ctx(o);
      const bg = wall(x, 8, 160, "#4d4a55", 151) + floor(x, 160) + `<path d="M8 8 L8 160 L28 160 L28 8 Z" fill="#000" fill-opacity=".18"/>` + painting(x, 30, 40, 54, 66, "portrait", "black", 6);
      const px = 128, py = 84, tx = 58, ty = 74, a = aim(px, py, tx, ty), [lx, ly] = lensAt(px, py, a, 30);
      const light = cone(x, lx, ly, tx, ty, 11, 34) + spot(x, tx, ty, 50, 54);
      const fx = shadow(x, 128, 178, 34, 4, .6) + `<path d="M128 100 L100 178 M128 100 L158 178 M128 100 L132 184" stroke="url(#${x.id("wood")})" stroke-width="4" stroke-linecap="round"/>
<path d="M128 100 L100 178 M128 100 L158 178" stroke="#fff" stroke-opacity=".12" stroke-width="1"/><circle cx="128" cy="100" r="4.4" fill="${x.url("brs")}"/><path d="M128 100 V92" stroke="#222" stroke-width="3"/>
<path d="M114 84 Q128 104 142 84" fill="none" stroke="url(#${x.id("fbr")})" stroke-width="2.6"/>${can(x, px, py, a, 30, 12.5, "fbr", { round: .25, fins: 4 })}<circle cx="${px}" cy="${py}" r="3" fill="${x.url("brs")}"/>
<path d="M132 184 C140 186 150 186 170 184" stroke="#111" stroke-width="1.2" fill="none"/>`;
      return svg(x, { bg, light, fx }, WFADE(x));
    } }),
  ];

  const C2T = {"track": {"l": "Housing", "ids": ["fb"], "c": ["#2a2b33", "#eceae6", "#a7abb2", "#c9a24a", "#5a4636", "#6a6e76"]}, "monorail": {"l": "Finish", "ids": ["fc", "fn"], "c": ["#e9ecf4", "#c9a24a", "#2a2b33", "#5a4636", "#eceae6"]}, "runner": {"l": "Housing", "ids": ["fw"], "c": ["#eceae6", "#2a2b33", "#a7abb2", "#c9a24a", "#5a4636", "#6a6e76"]}, "plugin": {"l": "Housing", "ids": ["fb"], "c": ["#2a2b33", "#eceae6", "#a7abb2", "#c9a24a", "#5a4636", "#6a6e76"]}, "cylinder": {"l": "Housing", "ids": ["fwv"], "c": ["#eceae6", "#2a2b33", "#a7abb2", "#c9a24a", "#5a4636", "#6a6e76"]}, "gimbal": {"l": "Trim", "ids": ["fw"], "c": ["#eceae6", "#2a2b33", "#a7abb2", "#c9a24a", "#5a4636", "#6a6e76"]}, "washer": {"l": "Trim", "ids": ["fw"], "c": ["#eceae6", "#2a2b33", "#a7abb2", "#c9a24a", "#5a4636", "#6a6e76"]}, "wafer": {"l": "Trim", "ids": ["fwv2"], "c": ["#eceae6", "#2a2b33", "#a7abb2", "#c9a24a", "#5a4636", "#6a6e76"]}, "colorspot": {"l": "Housing", "ids": ["fb"], "c": ["#2a2b33", "#eceae6", "#a7abb2"]}, "brasspic": {"l": "Finish", "ids": ["fbr"], "c": ["#c99a48", "#2a2b33", "#a7abb2", "#5a4636", "#eceae6"]}, "ledbar": {"l": "Finish", "ids": ["fb"], "c": ["#2a2b33", "#c9a24a", "#a7abb2", "#eceae6"]}, "battery": {"l": "Finish", "ids": ["fbr"], "c": ["#c99a48", "#2a2b33", "#a7abb2", "#eceae6"]}, "museum": {"l": "Housing", "ids": ["fb"], "c": ["#2a2b33", "#eceae6", "#a7abb2"]}, "mirror": {"l": "Finish", "ids": ["fc"], "c": ["#e9ecf4", "#2a2b33", "#c9a24a", "#5a4636"]}, "shelfpuck": {"l": "Trim", "ids": ["fn"], "c": ["#a7abb2", "#eceae6", "#2a2b33", "#c9a24a"]}, "upcan": {"l": "Housing", "ids": ["fbh"], "c": ["#2a2b33", "#eceae6", "#a7abb2", "#5a4636"]}, "sconcepair": {"l": "Housing", "ids": ["fb"], "c": ["#2a2b33", "#eceae6", "#a7abb2", "#c9a24a", "#5a4636", "#6a6e76"]}, "spotbar": {"l": "Finish", "ids": ["fn"], "c": ["#a7abb2", "#2a2b33", "#eceae6", "#c9a24a"]}, "tripod": {"l": "Head", "ids": ["fbr"], "c": ["#c99a48", "#2a2b33", "#a7abb2", "#eceae6"]}};
  const H2 = window.HDAH;
  function retint(svg, uid, t, c2, on) {
    if (!c2 || c2.toLowerCase() === t.c[0].toLowerCase() || (t.off && on)) return svg;
    const lum = (h) => { const v = H2.hx(h); return (0.299 * v[0] + 0.587 * v[1] + 0.114 * v[2]) / 255; };
    const map = (cols) => { const m = cols.reduce((a, c) => a + lum(c), 0) / cols.length; return (h) => H2.shade(c2, Math.max(-0.78, Math.min(0.78, (lum(h) - m) * 1.3))); };
    (t.ids || []).forEach((gid) => {
      const re = new RegExp("(<(linear|radial)Gradient id=\"" + uid + "-" + gid + "\"[^>]*>)([\\s\\S]*?)(</\\2Gradient>)");
      svg = svg.replace(re, (all, open, kind, body, close) => {
        const cols = (body.match(/stop-color="#[0-9a-fA-F]{6}"/g) || []).map((q) => q.slice(12, 19)); if (!cols.length) return all;
        const fn = map(cols); return open + body.replace(/stop-color="(#[0-9a-fA-F]{6})"/g, (q, h) => 'stop-color="' + fn(h) + '"') + close;
      });
    });
    if (t.hex && t.hex.length) { const fn = map(t.hex); t.hex.forEach((h) => { svg = svg.split('"' + h + '"').join('"' + fn(h) + '"'); }); }
    return svg;
  }
  icons.forEach((ic) => { const t = C2T[ic.id]; if (!t) return; const r = ic.render; ic.colors2 = t.c; ic.picker2 = true; ic.colorLabel2 = t.l;
    ic.render = (o) => retint(r(o), o.uid, t, o.color2, o.on); });
  (window.HDA = window.HDA || []).push({
    id: "spotlights",
    tab: "Spot & picture lights",
    group: "Lights",
    kind: "light",
    intro: "Track, recessed, wall and picture lights, each aimed at what it lights: a painting, a sculpture, a plant, books, brick or wood slats. Lit fixtures throw a beam in the light color and leave a lit spot.",
    
    css: "",
    icons,
  });
})();
