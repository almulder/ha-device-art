(function () {
  const P = "hda-consoles-";
  const H = () => window.HDAH;
  const n1 = (v) => (+v).toFixed(1);
  let DEF = [], N = 0;
  const WHITE = "#f3f3f1", BLACK = "#1b1c1f";
  const GLOSSY = ["#111216"], WOODS = ["#6b4a30"];
  const has = (a, c) => a.indexOf(String(c).toLowerCase()) >= 0;

  function pal(c) {
    const h = H(), x = h.hx(c), lt = (x[0] * .3 + x[1] * .59 + x[2] * .11) / 255 > .7;
    return { l: h.shade(c, lt ? .7 : .38), m: c, d: h.shade(c, lt ? -.12 : -.3), k: h.shade(c, lt ? -.3 : -.55), lt };
  }
  const lg = (id, v, st, xy) => `<linearGradient id="${id}" ${xy || (v ? 'x1="0" y1="0" x2="0" y2="1"' : 'x1="0" x2="1"')}>${st.map((s) => `<stop offset="${s[0]}" stop-color="${s[1]}"${s[2] != null ? ` stop-opacity="${s[2]}"` : ""}/>`).join("")}</linearGradient>`;
  const rad = (id, st, at) => `<radialGradient id="${id}" ${at || ""}>${st.map((s) => `<stop offset="${s[0]}" stop-color="${s[1]}"${s[2] != null ? ` stop-opacity="${s[2]}"` : ""}/>`).join("")}</radialGradient>`;
  const halo = (id, c, a) => rad(id, [[0, c, a || .85], [.45, c, (a || .85) * .3], [1, c, 0]]);
  function mat(o, c, k) {
    const id = o.uid + "-m" + (N++), p = pal(c);
    if (k === "h") DEF.push(lg(id, 0, [[0, p.k], [.25, p.l], [.6, p.m], [1, p.d]]));
    else if (k === "t") DEF.push(lg(id, 0, [[0, p.m], [.45, p.l], [1, p.m]]));
    else if (k === "s") DEF.push(lg(id, 1, [[0, p.d], [1, p.k]]));
    else if (k === "r") DEF.push(rad(id, [[0, p.l], [.6, p.m], [1, p.k]], 'cx=".38" cy=".32" r=".75"'));
    else DEF.push(lg(id, 1, [[0, p.l], [.35, p.m], [1, p.d]]));
    return `url(#${id})`;
  }
  const gl = (o, d, a) => `<path d="${d}" fill="url(#${o.uid}-g)" opacity="${a || .35}"/>`;
  const M4 = (a, b, c, d) => "M" + [a, b, c, d].map((p) => n1(p[0]) + " " + n1(p[1])).join("L") + "Z";
  const R = (x, y, w, h) => `M${n1(x)} ${n1(y)}h${n1(w)}v${n1(h)}h${n1(-w)}Z`;

  function defs(o) {
    const u = o.uid;
    return `<defs>
${lg(u + "-wall", 1, [[0, "#fff", .09], [1, "#fff", .035]])}${lg(u + "-flr", 1, [[0, "#5e3e27"], [1, "#2a1a10"]])}${lg(u + "-fls", 1, [[0, "#000", .5], [1, "#000", 0]])}
${rad(u + "-sh", [[0, "#000", .6], [1, "#000", 0]])}
<linearGradient id="${u}-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".6"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/></linearGradient>
${lg(u + "-blk", 1, [[0, "#3a3e46"], [.45, "#17191d"], [1, "#08090b"]])}${lg(u + "-blkh", 0, [[0, "#08090b"], [.5, "#2c3036"], [1, "#0b0c0e"]])}
<linearGradient id="${u}-gls" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#232833"/><stop offset=".55" stop-color="#0a0c11"/><stop offset="1" stop-color="#151920"/></linearGradient>
<linearGradient id="${u}-ref" x1="0" y1="0" x2="1" y2=".7"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".34" stop-color="#fff" stop-opacity=".12"/><stop offset=".4" stop-color="#fff" stop-opacity="0"/></linearGradient>
${halo(u + "-tvg", "#8fb8ff", .7)}${halo(u + "-hw", "#ffffff", .9)}${halo(u + "-hg", "#3dff6a", .9)}${halo(u + "-hb", "#3fa9ff", .9)}${halo(u + "-hr", "#ff3b30", .9)}${halo(u + "-ha", "#ffb347", .9)}
<pattern id="${u}-grain" width="44" height="7" patternUnits="userSpaceOnUse"><path d="M0 2C11 1 22 3.2 44 2M0 5C15 6 28 4.2 44 5.2" fill="none" stroke="#2a170a" stroke-opacity=".32" stroke-width=".6"/></pattern>
<pattern id="${u}-dot" width="2.6" height="2.6" patternUnits="userSpaceOnUse"><circle cx="1.3" cy="1.3" r=".75" fill="#000" fill-opacity=".7"/></pattern>
<pattern id="${u}-slot" width="3" height="3" patternUnits="userSpaceOnUse"><rect width="3" height="1.4" fill="#000" fill-opacity=".55"/></pattern>
<pattern id="${u}-vslot" width="3" height="3" patternUnits="userSpaceOnUse"><rect width="1.3" height="3" fill="#000" fill-opacity=".5"/></pattern>
${DEF.join("")}</defs>`;
  }
  function svg(o, body) {
    const s = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs(o)}<clipPath id="${o.uid}-all"><rect width="200" height="200" rx="6"/></clipPath><g clip-path="url(#${o.uid}-all)">${body}</g></svg>`;
    DEF = [];
    return s;
  }
  const sh = (o, cx, cy, rx, ry) => `<ellipse cx="${n1(cx)}" cy="${n1(cy)}" rx="${n1(rx)}" ry="${n1(ry || 4)}" fill="url(#${o.uid}-sh)"/>`;
  const LC = { w: ["#ffffff", "hw"], g: ["#45ff7a", "hg"], b: ["#4fb2ff", "hb"], r: ["#ff3b30", "hr"], a: ["#ffb347", "ha"] };
  function led(o, x, y, on, off, r) {
    r = r || 1.1;
    if (o.on) { const c = LC[on]; return `<circle cx="${n1(x)}" cy="${n1(y)}" r="${n1(r * 4.5)}" fill="url(#${o.uid}-${c[1]})"/><circle cx="${n1(x)}" cy="${n1(y)}" r="${n1(r)}" fill="${c[0]}"/>`; }
    if (off) return `<circle cx="${n1(x)}" cy="${n1(y)}" r="${n1(r * 2.4)}" fill="url(#${o.uid}-${LC[off][1]})" opacity=".35"/><circle cx="${n1(x)}" cy="${n1(y)}" r="${n1(r * .8)}" fill="${LC[off][0]}" opacity=".85"/>`;
    return `<circle cx="${n1(x)}" cy="${n1(y)}" r="${n1(r * .8)}" fill="#000" opacity=".35"/>`;
  }
  function strip(o, d, c, w) {
    if (!o.on) return `<path d="${d}" fill="none" stroke="#000" stroke-opacity=".45" stroke-width="${w || 1.2}" stroke-linecap="round"/>`;
    return `<g class="${P}glow"><path d="${d}" fill="none" stroke="${c}" stroke-opacity=".3" stroke-width="${(w || 1.2) * 4.5}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${w || 1.2}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#fff" stroke-width="${(w || 1.2) * .4}" stroke-linecap="round"/></g>`;
  }

  const G = (s) => s ? `<g class="hda-bg">${s}</g>` : "";
  function stage(o) { return G(stage0(o)); }
  function stage0(o) {
    const u = o.uid, fy = 178, c = "#6b4a30", x = 6, y = 152, w = 188, h = 24;
    let s = `<rect width="200" height="200" fill="url(#${u}-wall)"/>` + (o.on ? `<ellipse cx="100" cy="-6" rx="120" ry="70" fill="url(#${u}-tvg)" class="${P}tv"/>` : "") +
      `<rect x="20" y="0" width="160" height="10" fill="url(#${u}-gls)"/><rect x="20" y="9" width="160" height="1.5" fill="#000" opacity=".5"/>` +
      `<rect y="${fy}" width="200" height="${200 - fy}" fill="url(#${u}-flr)"/><rect y="${fy}" width="200" height="${200 - fy}" fill="url(#${u}-grain)"/><path d="M0 ${fy + 9}H200M0 ${fy + 19}H200" stroke="#000" stroke-opacity=".28" stroke-width=".8"/><rect y="${fy}" width="200" height="12" fill="url(#${u}-fls)"/>` +
      `<rect y="${fy - 6}" width="200" height="6" fill="#ece8e0" fill-opacity=".13"/>`;
    s += sh(o, 100, fy, 96, 4) + `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${mat(o, c, "v")}"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${u}-grain)"/>`;
    [1, 2].forEach((i) => { s += `<path d="M${n1(x + w * i / 3)} ${y + 2}V${y + h}" stroke="#000" stroke-opacity=".38"/>`; });
    [0, 1, 2].forEach((i) => { s += `<rect x="${n1(x + w * (i + .5) / 3 - 5)}" y="${y + 5}" width="10" height="1.6" rx=".8" fill="#e2d2a8" opacity=".85"/>`; });
    s += `<rect x="${x}" y="${y}" width="${w}" height="2.5" fill="#000" opacity=".3"/><rect x="${x - 2}" y="${y - 4}" width="${w + 4}" height="4.5" rx="1" fill="${mat(o, "#7d5638", "t")}"/><rect x="${x - 2}" y="${y - 4}" width="${w + 4}" height="4.5" fill="url(#${u}-grain)"/><rect x="${x - 2}" y="${y - 4}" width="${w + 4}" height=".8" fill="#fff" opacity=".25"/>`;
    return s;
  }
  const B = 148;

  function box3(o, c, x, y, w, h, dx, dy, op) {
    op = op || {};
    const t = `M${n1(x)} ${n1(y)}L${n1(x + dx)} ${n1(y - dy)}H${n1(x + w + dx)}L${n1(x + w)} ${n1(y)}Z`, sd = `M${n1(x + w)} ${n1(y)}L${n1(x + w + dx)} ${n1(y - dy)}V${n1(y + h - dy)}L${n1(x + w)} ${n1(y + h)}Z`;
    return sh(o, x + w / 2 + dx / 2, y + h, w * .62, 4) + `<path d="${t}" fill="${mat(o, H().shade(c, .1), "t")}"/>` + gl(o, t, op.gloss || .3) + `<path d="${sd}" fill="${mat(o, c, "s")}"/>` +
      `<rect x="${n1(x)}" y="${n1(y)}" width="${n1(w)}" height="${n1(h)}" rx="${op.r || .8}" fill="${mat(o, c, "v")}"/>` + `<path d="M${n1(x + .5)} ${n1(y + .4)}H${n1(x + w - .5)}" stroke="#fff" stroke-opacity=".35" stroke-width=".7"/><path d="M${n1(x + dx * .5)} ${n1(y - dy * .5)}" />`;
  }

  const padPath = (x, y, w, h) => `M${n1(x + .2 * w)} ${n1(y)}H${n1(x + .8 * w)}C${n1(x + .96 * w)} ${n1(y)} ${n1(x + w)} ${n1(y + .35 * h)} ${n1(x + w)} ${n1(y + .62 * h)}C${n1(x + w)} ${n1(y + .96 * h)} ${n1(x + .9 * w)} ${n1(y + 1.02 * h)} ${n1(x + .82 * w)} ${n1(y + .9 * h)}L${n1(x + .66 * w)} ${n1(y + .7 * h)}H${n1(x + .34 * w)}L${n1(x + .18 * w)} ${n1(y + .9 * h)}C${n1(x + .1 * w)} ${n1(y + 1.02 * h)} ${n1(x)} ${n1(y + .96 * h)} ${n1(x)} ${n1(y + .62 * h)}C${n1(x)} ${n1(y + .35 * h)} ${n1(x + .04 * w)} ${n1(y)} ${n1(x + .2 * w)} ${n1(y)}Z`;
  const stick = (cx, cy, r, ring) => `<circle cx="${n1(cx)}" cy="${n1(cy)}" r="${n1(r * 1.25)}" fill="#000" opacity=".4"/>${ring ? `<circle cx="${n1(cx)}" cy="${n1(cy)}" r="${n1(r * 1.15)}" fill="none" stroke="${ring}" stroke-width="${n1(r * .3)}"/>` : ""}<circle cx="${n1(cx)}" cy="${n1(cy)}" r="${n1(r)}" fill="#2a2d33"/><circle cx="${n1(cx - r * .25)}" cy="${n1(cy - r * .25)}" r="${n1(r * .5)}" fill="#4a4e56"/>`;
  const cross = (cx, cy, s, c) => `<path d="M${n1(cx - s * .33)} ${n1(cy - s)}h${n1(s * .66)}v${n1(s * .67)}h${n1(s * .67)}v${n1(s * .66)}h${n1(-s * .67)}v${n1(s * .67)}h${n1(-s * .66)}v${n1(-s * .67)}h${n1(-s * .67)}v${n1(-s * .66)}h${n1(s * .67)}Z" fill="${c || "#26282d"}"/>`;
  const four = (cx, cy, d, r, cs) => [[0, -1], [1, 0], [0, 1], [-1, 0]].map((p, i) => `<circle cx="${n1(cx + p[0] * d)}" cy="${n1(cy + p[1] * d)}" r="${n1(r)}" fill="${cs[i] || cs[0]}"/><circle cx="${n1(cx + p[0] * d - r * .3)}" cy="${n1(cy + p[1] * d - r * .3)}" r="${n1(r * .4)}" fill="#fff" opacity=".35"/>`).join("");
  function xpad(o, x, y, w, c) {
    y = y - w * .66; const h = w * .66, d = padPath(x, y, w, h);
    return sh(o, x + w / 2, y + h * .95, w * .55, 3) + `<path d="${d}" fill="${mat(o, c, "v")}"/>` + gl(o, d, .3) +
      stick(x + .27 * w, y + .3 * h, w * .075) + cross(x + .38 * w, y + .58 * h, w * .07) + stick(x + .62 * w, y + .58 * h, w * .075) +
      four(x + .74 * w, y + .3 * h, w * .065, w * .034, ["#f2c230", "#e24a3b", "#3fae49", "#2f74d0"]) +
      `<circle cx="${n1(x + .5 * w)}" cy="${n1(y + .16 * h)}" r="${n1(w * .05)}" fill="${o.on ? "#fff" : "#3a3d42"}"/>` + (o.on ? `<circle cx="${n1(x + .5 * w)}" cy="${n1(y + .16 * h)}" r="${n1(w * .12)}" fill="url(#${o.uid}-hw)"/>` : "") +
      `<circle cx="${n1(x + .44 * w)}" cy="${n1(y + .32 * h)}" r="${n1(w * .018)}" fill="#000" opacity=".5"/><circle cx="${n1(x + .56 * w)}" cy="${n1(y + .32 * h)}" r="${n1(w * .018)}" fill="#000" opacity=".5"/>`;
  }
  function wiimote(o, x, y, l, c) {
    y = y - l * .25; const h = l * .25, d = `M${n1(x + h / 2)} ${n1(y)}H${n1(x + l - h / 2)}A${n1(h / 2)} ${n1(h / 2)} 0 0 1 ${n1(x + l - h / 2)} ${n1(y + h)}H${n1(x + h / 2)}A${n1(h / 2)} ${n1(h / 2)} 0 0 1 ${n1(x + h / 2)} ${n1(y)}Z`;
    let leds = "";
    for (let i = 0; i < 4; i++) leds += `<rect x="${n1(x + l * .82 + i * 2.6)}" y="${n1(y + h * .7)}" width="1.6" height="1" fill="${o.on && i === 0 ? "#5fc0ff" : "#9aa0a8"}"/>`;
    return sh(o, x + l / 2, y + h, l * .55, 2.5) + `<path d="${d}" fill="${mat(o, c, "v")}"/>` + gl(o, d, .35) + cross(x + l * .16, y + h / 2, h * .3, "#33363c") +
      `<circle cx="${n1(x + l * .33)}" cy="${n1(y + h / 2)}" r="${n1(h * .26)}" fill="${mat(o, H().shade(c, -.05), "r")}" stroke="#000" stroke-opacity=".25" stroke-width=".5"/>` +
      `<g fill="#9aa0a8"><circle cx="${n1(x + l * .48)}" cy="${n1(y + h / 2)}" r="1.1"/><circle cx="${n1(x + l * .53)}" cy="${n1(y + h / 2)}" r="1.3"/><circle cx="${n1(x + l * .58)}" cy="${n1(y + h / 2)}" r="1.1"/><circle cx="${n1(x + l * .68)}" cy="${n1(y + h / 2)}" r="1.6"/><circle cx="${n1(x + l * .75)}" cy="${n1(y + h / 2)}" r="1.6"/></g>` + leds +
      (o.on ? `<circle cx="${n1(x + l * .82 + .8)}" cy="${n1(y + h * .7 + .5)}" r="3" fill="url(#${o.uid}-hb)"/>` : "");
  }
  function gcpad(o, x, y, w, c) {
    y = y - w * .7; const h = w * .7, d = padPath(x, y, w, h);
    return sh(o, x + w / 2, y + h * .95, w * .55, 3) + `<path d="${d}" fill="${mat(o, c, "v")}"/>` + gl(o, d, .3) +
      stick(x + .24 * w, y + .32 * h, w * .08) + cross(x + .36 * w, y + .62 * h, w * .055, "#9aa0a8") +
      `<circle cx="${n1(x + .64 * w)}" cy="${n1(y + .62 * h)}" r="${n1(w * .06)}" fill="#e8c12a"/><circle cx="${n1(x + .64 * w)}" cy="${n1(y + .62 * h)}" r="${n1(w * .035)}" fill="#c9a114"/>` +
      `<circle cx="${n1(x + .76 * w)}" cy="${n1(y + .32 * h)}" r="${n1(w * .075)}" fill="#2fae5a"/><circle cx="${n1(x + .74 * w)}" cy="${n1(y + .3 * h)}" r="${n1(w * .03)}" fill="#fff" opacity=".35"/>` +
      `<circle cx="${n1(x + .66 * w)}" cy="${n1(y + .44 * h)}" r="${n1(w * .038)}" fill="#d8373b"/><path d="M${n1(x + .84 * w)} ${n1(y + .22 * h)}q${n1(w * .06)} ${n1(h * .1)} 0 ${n1(h * .22)}" stroke="#c9ccd1" stroke-width="${n1(w * .045)}" stroke-linecap="round" fill="none"/><path d="M${n1(x + .68 * w)} ${n1(y + .15 * h)}q${n1(w * .08)} ${n1(-h * .06)} ${n1(w * .14)} 0" stroke="#c9ccd1" stroke-width="${n1(w * .045)}" stroke-linecap="round" fill="none"/>` +
      `<circle cx="${n1(x + .5 * w)}" cy="${n1(y + .36 * h)}" r="${n1(w * .025)}" fill="#c9ccd1"/>`;
  }
  function snespad(o, x, y, w, c, cols) {
    y = y - w * .44; const h = w * .44, d = `M${n1(x + h / 2)} ${n1(y)}H${n1(x + w - h / 2)}A${n1(h / 2)} ${n1(h / 2)} 0 0 1 ${n1(x + w - h / 2)} ${n1(y + h)}H${n1(x + h / 2)}A${n1(h / 2)} ${n1(h / 2)} 0 0 1 ${n1(x + h / 2)} ${n1(y)}Z`;
    return sh(o, x + w / 2, y + h, w * .55, 2.5) + `<path d="${d}" fill="${mat(o, c, "v")}"/>` + gl(o, d, .3) + `<ellipse cx="${n1(x + w * .8)}" cy="${n1(y + h / 2)}" rx="${n1(h * .42)}" ry="${n1(h * .42)}" fill="#000" opacity=".12"/>` +
      cross(x + h / 2, y + h / 2, h * .3, "#2a2c31") + four(x + w - h / 2, y + h / 2, h * .22, h * .11, cols || ["#b9a9e6", "#6d4fb3", "#6d4fb3", "#b9a9e6"]) +
      `<g fill="#6a6c72"><rect x="${n1(x + w * .4)}" y="${n1(y + h * .55)}" width="${n1(w * .07)}" height="${n1(h * .1)}" rx="1" transform="rotate(-30 ${n1(x + w * .43)} ${n1(y + h * .6)})"/><rect x="${n1(x + w * .52)}" y="${n1(y + h * .55)}" width="${n1(w * .07)}" height="${n1(h * .1)}" rx="1" transform="rotate(-30 ${n1(x + w * .55)} ${n1(y + h * .6)})"/></g>`;
  }
  function joy(o, x, y, w, h, c, side, ring) {
    const r = w * .9, d = side === "L" ? `M${n1(x + w)} ${n1(y)}H${n1(x + r * .5)}Q${n1(x)} ${n1(y)} ${n1(x)} ${n1(y + r)}V${n1(y + h - r)}Q${n1(x)} ${n1(y + h)} ${n1(x + r * .5)} ${n1(y + h)}H${n1(x + w)}Z`
      : `M${n1(x)} ${n1(y)}H${n1(x + w - r * .5)}Q${n1(x + w)} ${n1(y)} ${n1(x + w)} ${n1(y + r)}V${n1(y + h - r)}Q${n1(x + w)} ${n1(y + h)} ${n1(x + w - r * .5)} ${n1(y + h)}H${n1(x)}Z`;
    const cx = x + w / 2;
    let s = `<path d="${d}" fill="${mat(o, c, "v")}"/>` + gl(o, d, .3) + `<path d="${d}" fill="none" stroke="#000" stroke-opacity=".2" stroke-width=".5"/>`;
    if (side === "L") s += stick(cx, y + h * .28, w * .26, ring) + four(cx, y + h * .62, w * .2, w * .09, ["#2a2c31"]) + `<rect x="${n1(x + w * .55)}" y="${n1(y + h * .07)}" width="${n1(w * .22)}" height="${n1(w * .07)}" fill="#2a2c31"/><rect x="${n1(cx + w * .1)}" y="${n1(y + h * .84)}" width="${n1(w * .16)}" height="${n1(w * .16)}" rx=".5" fill="#2a2c31"/>`;
    else s += four(cx, y + h * .3, w * .2, w * .09, ["#2a2c31"]) + stick(cx, y + h * .64, w * .26, ring) + cross(x + w * .35, y + h * .09, w * .1, "#2a2c31") + `<circle cx="${n1(cx - w * .14)}" cy="${n1(y + h * .86)}" r="${n1(w * .11)}" fill="#3a3d42" stroke="#9aa0a8" stroke-width=".4"/>`;
    return s;
  }
  function game(o, x, y, w, h, kind) {
    const u = o.uid;
    if (!o.on) return `<rect x="${n1(x)}" y="${n1(y)}" width="${n1(w)}" height="${n1(h)}" fill="url(#${u}-gls)"/><rect x="${n1(x)}" y="${n1(y)}" width="${n1(w)}" height="${n1(h)}" fill="url(#${u}-ref)"/>`;
    let s;
    if (kind === "kart") {
      DEF.push(lg(u + "-gk", 1, [[0, "#3a8ee6"], [1, "#bfe4ff"]]));
      s = `<rect width="160" height="90" fill="url(#${u}-gk)"/><path d="M0 46C30 34 60 40 90 34S140 38 160 32V56H0Z" fill="#6bbf5a"/><rect y="50" width="160" height="40" fill="#58a848"/>
<path d="M66 50H94L140 90H20Z" fill="#6e6e78"/><path d="M80 50V56M80 62V70M80 76V90" stroke="#fff" stroke-width="1.6"/><path d="M66 50L20 90M94 50L140 90" stroke="#f04a3a" stroke-width="2.4" stroke-dasharray="4 4"/>
<g class="${P}bob"><rect x="70" y="70" width="20" height="10" rx="3" fill="#e8402e"/><rect x="74" y="64" width="12" height="8" rx="4" fill="#ffd36b"/><rect x="68" y="78" width="6" height="4" rx="1" fill="#222"/><rect x="86" y="78" width="6" height="4" rx="1" fill="#222"/></g>
<rect x="88" y="54" width="8" height="5" rx="1.5" fill="#3a6bd6"/><circle cx="30" cy="44" r="6" fill="#3f8a35"/><circle cx="130" cy="42" r="7" fill="#3f8a35"/><g class="${P}pan" fill="#fff"><ellipse cx="40" cy="14" rx="12" ry="4"/><ellipse cx="118" cy="20" rx="10" ry="3.4"/></g>`;
    } else {
      DEF.push(lg(u + "-gp", 1, [[0, "#5aa8f5"], [1, "#c8ecff"]]));
      s = `<rect width="160" height="90" fill="url(#${u}-gp)"/><g class="${P}pan" fill="#fff"><ellipse cx="30" cy="16" rx="12" ry="4.5"/><ellipse cx="36" cy="12" rx="7" ry="4.5"/><ellipse cx="112" cy="22" rx="11" ry="3.8"/></g>
<path d="M0 64C20 50 40 52 60 62S100 50 130 58 160 54 160 54V90H0Z" fill="#8fd17a"/>
<rect y="72" width="160" height="18" fill="#7a4a2a"/><rect y="70" width="160" height="5" fill="#4fbf4a"/><path d="M0 80H160M20 75V90M60 75V90M100 75V90M140 75V90" stroke="#5a341c" stroke-width="1"/>
<g><rect x="56" y="40" width="40" height="8" fill="#c8823e"/><path d="M56 40H96M66 40V48M76 40V48M86 40V48" stroke="#7a4a1c" stroke-width="1"/></g>
<g class="${P}bob" fill="#ffd23f"><circle cx="64" cy="32" r="3"/><circle cx="76" cy="32" r="3"/><circle cx="88" cy="32" r="3"/></g>
<g class="${P}hop"><rect x="30" y="56" width="12" height="14" rx="5" fill="#ff6a3d"/><circle cx="34" cy="60" r="1.6" fill="#fff"/><circle cx="39" cy="60" r="1.6" fill="#fff"/><circle cx="34.4" cy="60" r=".8" fill="#222"/><circle cx="39.4" cy="60" r=".8" fill="#222"/></g>
<path d="M118 70l6-12 6 12Z" fill="#3a7a30"/><path d="M128 70l5-9 5 9Z" fill="#4a8a3a"/>`;
    }
    return `<svg x="${n1(x)}" y="${n1(y)}" width="${n1(w)}" height="${n1(h)}" viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice">${s}</svg><rect x="${n1(x)}" y="${n1(y)}" width="${n1(w)}" height="${n1(h)}" fill="url(#${u}-ref)" opacity=".6"/>`;
  }

  function genpad(o, x, yb, w, c) {
    const h = w * .5, y = yb - h, d = `M${n1(x)} ${n1(y + h * .35)}Q${n1(x + w / 2)} ${n1(y - h * .12)} ${n1(x + w)} ${n1(y + h * .35)}Q${n1(x + w * 1.03)} ${n1(y + h)} ${n1(x + w * .8)} ${n1(y + h)}Q${n1(x + w / 2)} ${n1(y + h * .7)} ${n1(x + w * .2)} ${n1(y + h)}Q${n1(x - w * .03)} ${n1(y + h)} ${n1(x)} ${n1(y + h * .35)}Z`;
    return sh(o, x + w / 2, yb - 1, w * .55, 3) + `<path d="${d}" fill="${mat(o, c, "v")}"/>` + gl(o, d, .35) +
      `<circle cx="${n1(x + .25 * w)}" cy="${n1(y + .5 * h)}" r="${n1(w * .13)}" fill="#000" opacity=".35"/>` + cross(x + .25 * w, y + .5 * h, w * .09, "#2a2c31") +
      [[.64, .66], [.75, .54], [.86, .42]].map((p) => `<circle cx="${n1(x + p[0] * w)}" cy="${n1(y + p[1] * h)}" r="${n1(w * .05)}" fill="#2a2c31" stroke="#55585f" stroke-width=".5"/>`).join("") +
      `<rect x="${n1(x + .46 * w)}" y="${n1(y + .62 * h)}" width="${n1(.08 * w)}" height="${n1(.06 * h)}" rx="1" fill="#55585f"/>`;
  }
  function dcpad(o, x, yb, w, c) {
    const h = w * .74, y = yb - h, d = padPath(x, y, w, h);
    let lcd = `<rect x="${n1(x + .36 * w)}" y="${n1(y + .05 * h)}" width="${n1(.28 * w)}" height="${n1(.34 * h)}" rx="1.5" fill="#2a2c31"/>`;
    const lx = x + .39 * w, ly = y + .09 * h, lw = .22 * w, lh = .24 * h;
    lcd += o.on ? `<rect x="${n1(lx)}" y="${n1(ly)}" width="${n1(lw)}" height="${n1(lh)}" fill="#a9c99a"/><path d="M${n1(lx)} ${n1(ly + lh * .75)}h${n1(lw * .3)}v${n1(-lh * .25)}h${n1(lw * .3)}v${n1(lh * .15)}h${n1(lw * .4)}V${n1(ly + lh)}H${n1(lx)}Z" fill="#2f4a2a"/><rect x="${n1(lx + lw * .45)}" y="${n1(ly + lh * .2)}" width="${n1(lw * .14)}" height="${n1(lh * .3)}" fill="#2f4a2a"/>`
      : `<rect x="${n1(lx)}" y="${n1(ly)}" width="${n1(lw)}" height="${n1(lh)}" fill="#55605a"/>`;
    return sh(o, x + w / 2, yb - 1, w * .55, 3) + `<path d="${d}" fill="${mat(o, c, "v")}"/>` + gl(o, d, .35) + lcd +
      stick(x + .2 * w, y + .3 * h, w * .07) + cross(x + .24 * w, y + .6 * h, w * .07, "#6a6c72") +
      four(x + .78 * w, y + .4 * h, w * .065, w * .036, ["#3fae6a", "#3f6fd6", "#e2504a", "#f2c230"]);
  }
  const icons = [
    {
      id: "big-black-box-console", name: "Big black box console", colors: ["#1b1c1f", "#3f6b3a", "#2a2d33"], picker: true, colorLabel: "Body",
      render(o) {
        const u = o.uid, c = o.color, x = 54, w = 118, h = 36, y = B - h, dx = 14, dy = 36;
        const T = (uu, vv) => [x + w * uu + dx * vv, y - dy * vv];
        DEF.push(rad(u + "-jw", [[0, "#b6ff9a"], [.5, "#3fbf3a"], [1, "#1a5a1a"]], 'cx=".4" cy=".35"'));
        let s = stage(o) + box3(o, c, x, y, w, h, dx, dy, { gloss: .15, r: 3 });
        for (let i = 1; i < 8; i++) s += `<path d="M${n1(x + w + dx * i / 8)} ${n1(y - dy * i / 8 + 3)}V${n1(y + h - dy * i / 8 - 3)}" stroke="#000" stroke-opacity=".45" stroke-width="1"/>`;
        [[0, 0], [1, 0], [1, 1], [0, 1]].forEach((k) => { const a = T(k[0] * .9 + .05, k[1] * .86 + .07), z = T(.5 + (k[0] - .5) * .3, .5 + (k[1] - .5) * .3); s += `<path d="M${n1(a[0])} ${n1(a[1])}L${n1(z[0])} ${n1(z[1])}" stroke="#000" stroke-opacity=".45" stroke-width="6" stroke-linecap="round"/><path d="M${n1(a[0])} ${n1(a[1] - 1.5)}L${n1(z[0])} ${n1(z[1] - 1.5)}" stroke="#fff" stroke-opacity=".12" stroke-width="1.4" stroke-linecap="round"/>`; });
        const jc = T(.5, .5);
        s += `<ellipse cx="${n1(jc[0])}" cy="${n1(jc[1])}" rx="15" ry="6.4" fill="#0a0b0c"/><ellipse cx="${n1(jc[0])}" cy="${n1(jc[1] - .6)}" rx="12" ry="5" fill="url(#${u}-jw)" opacity="${o.on ? 1 : .55}"/>` +
          (o.on ? `<ellipse cx="${n1(jc[0])}" cy="${n1(jc[1] - 3)}" rx="22" ry="10" fill="url(#${u}-hg)" class="${P}fan"/>` : "") + `<ellipse cx="${n1(jc[0] - 3)}" cy="${n1(jc[1] - 2.2)}" rx="4" ry="1.4" fill="#fff" opacity=".45"/>`;
        s += `<rect x="${x + 30}" y="${y + 8}" width="58" height="10" rx="1.5" fill="${H().shade(c, .08)}" stroke="#000" stroke-opacity=".5" stroke-width=".7"/><path d="M${x + 31} ${y + 8.6}H${x + 87}" stroke="#fff" stroke-opacity=".2"/>` +
          `<rect x="${x + 90}" y="${y + 11}" width="6" height="3" rx="1" fill="#2a2d33"/>` + led(o, x + 99, y + 12.5, "g", null, .8) +
          `<circle cx="${x + 59}" cy="${y + 26}" r="3.2" fill="#2a2d33" stroke="${o.on ? "#45ff7a" : "#000"}" stroke-opacity="${o.on ? 1 : .4}" stroke-width="1"/>` + (o.on ? `<circle cx="${x + 59}" cy="${y + 26}" r="9" fill="url(#${u}-hg)"/>` : "") +
          [x + 6, x + 20, x + w - 32, x + w - 18].map((px) => `<rect x="${px}" y="${y + h - 12}" width="12" height="6" rx="2" fill="#07080a"/><rect x="${px + 2}" y="${y + h - 10.5}" width="8" height="3" rx="1" fill="#2a2d33"/>`).join("");
        return svg(o, s + xpad(o, 4, 151, 58, c === "#3f6b3a" ? "#1b1c1f" : c));
      }
    },
    {
      id: "glossy-curved-console", name: "Glossy curved console", colors: ["#111216", "#c0c4ca", "#ecedef"], picker: true, colorLabel: "Body",
      render(o) {
        const u = o.uid, c = o.color, x = 70, w = 108, h = 28, y = B - h, dx = 10, dy = 24;
        let s = stage(o) + xpad(o, 14, 151, 46, c) + box3(o, c, x, y, w, h, dx, dy, { gloss: .5, r: 3 });
        const vent = (x0) => `<path d="M${x0} ${y - 2}L${x0 + dx * .9} ${y - dy * .9}h18L${x0 + 18} ${y - 2}Z" fill="#050506"/><path d="M${x0} ${y - 2}L${x0 + dx * .9} ${y - dy * .9}h18L${x0 + 18} ${y - 2}Z" fill="url(#${u}-vslot)"/>`;
        s += vent(x + 4) + vent(x + w - 24) + `<path d="M${x + 1} ${y + 3}H${x + w - 1}" stroke="#fff" stroke-opacity=".25"/>` +
          `<path d="M${x + 2} ${y + 6}q4 9 0 18M${x + w - 2} ${y + 6}q-4 9 0 18" stroke="#000" stroke-opacity=".5" stroke-width="3" fill="none"/>` +
          `<rect x="${x + 22}" y="${y + 10}" width="52" height="1.5" rx=".7" fill="#000" opacity=".85"/><rect x="${x + 80}" y="${y + 10}" width="5" height="1.5" rx=".5" fill="#000" opacity=".5"/>` +
          (o.on ? `<circle cx="${x + w - 14}" cy="${y + 11}" r="11" fill="url(#${u}-hg)"/><circle cx="${x + w - 14}" cy="${y + 11}" r="3" fill="none" stroke="#7dff9a" stroke-width="1.1"/><circle cx="${x + w - 14}" cy="${y + 11}" r="1.1" fill="#d8ffe2"/>` : `<circle cx="${x + w - 14}" cy="${y + 11}" r="3" fill="none" stroke="#000" stroke-opacity=".5" stroke-width="1.1"/>`);
        return svg(o, s);
      }
    },
    {
      id: "white-slim-console", name: "White slim console", colors: ["#f3f3f1", "#2b4f8a", "#1b1c1f", "#8a1e22"], picker: true, colorLabel: "Body",
      render(o) {
        const u = o.uid, c = o.color, x = 68, w = 112, h = 24, y = B - h, dx = 10, dy = 26;
        let s = stage(o) + xpad(o, 14, 151, 46, c) + box3(o, c, x, y, w, h, dx, dy, { gloss: .25 });
        s += `<path d="M${x + 4} ${y - 2}L${x + 4 + dx * .85} ${y - dy * .9}H${x + 52 + dx * .85}L${x + 52} ${y - 2}Z" fill="url(#${u}-dot)" opacity=".6"/>` +
          `<rect x="${x}" y="${y + h - 6}" width="${w}" height="6" fill="#000" opacity=".22"/><path d="M${x} ${y + h - 6}H${x + w}" stroke="#000" stroke-opacity=".3" stroke-width=".6"/>` +
          `<rect x="${x + 8}" y="${y + 7}" width="48" height="1.4" rx=".7" fill="#000" opacity=".7"/><rect x="${x + 8}" y="${y + 12.5}" width="5" height="1.6" rx=".4" fill="#000" opacity=".8"/>` +
          `<circle cx="${x + w - 10}" cy="${y + 8}" r="2.2" fill="#000" opacity=".12"/>` + (o.on ? `<circle cx="${x + w - 10}" cy="${y + 8}" r="9" fill="url(#${u}-hw)"/><circle cx="${x + w - 10}" cy="${y + 8}" r="1.7" fill="#fff"/>` : `<circle cx="${x + w - 10}" cy="${y + 8}" r="1.6" fill="#000" opacity=".25"/>`);
        return svg(o, s);
      }
    },
    {
      id: "black-slim-console", name: "Black slim console", colors: ["#1b1c1f", "#efefed"], picker: true, colorLabel: "Body",
      render(o) {
        const u = o.uid, c = o.color, x = 68, w = 112, h = 23, y = B - h - 2, dx = 10, dy = 26;
        let s = stage(o) + xpad(o, 14, 151, 46, c) + box3(o, c, x, y, w, h, dx, dy, { gloss: .1 });
        s += `<path d="M${x + w * .5 + 10} ${y - 1}L${x + w * .5 + 10 + dx * .9} ${y - dy * .9}H${x + w + dx * .9 - 3}L${x + w - 3} ${y - 1}Z" fill="url(#${u}-vslot)"/>` +
          `<rect x="${x + 2}" y="${y + h - .2}" width="${w - 4}" height="2.4" fill="#050506"/>` +
          `<rect x="${x + 8}" y="${y + 8}" width="50" height="1.4" rx=".7" fill="#000" opacity=".8"/><circle cx="${x + 62}" cy="${y + 8.7}" r="1" fill="#000" opacity=".5"/>` +
          `<rect x="${x + 8}" y="${y + 16}" width="5" height="1.6" rx=".4" fill="#000"/>` +
          `<circle cx="${x + w - 9}" cy="${y + 9}" r="2.6" fill="${H().shade(c, -.08)}" stroke="#000" stroke-opacity=".3" stroke-width=".5"/>` + (o.on ? `<circle cx="${x + w - 9}" cy="${y + 9}" r="10" fill="url(#${u}-hw)"/><circle cx="${x + w - 9}" cy="${y + 9}" r="1.8" fill="#fff"/>` : "");
        return svg(o, s);
      }
    },
    {
      id: "small-white-console", name: "Small white console", colors: ["#f2f2f0", "#1c1d20"], picker: true, colorLabel: "Body",
      render(o) {
        const u = o.uid, c = o.color, x = 66, w = 112, h = 26, y = B - h, dx = 11, dy = 24;
        let s = stage(o) + xpad(o, 14, 151, 44, c) + box3(o, c, x, y, w, h, dx, dy, { gloss: .2 });
        const vx = x + w * .72 + dx / 2, vy = y - dy / 2;
        s += `<ellipse cx="${vx}" cy="${vy + .6}" rx="25" ry="10.4" fill="#000" opacity=".25"/><ellipse cx="${vx}" cy="${vy}" rx="24" ry="10" fill="#0c0d10"/><ellipse cx="${vx}" cy="${vy}" rx="22" ry="9" fill="url(#${u}-dot)"/><ellipse cx="${vx}" cy="${vy}" rx="24" ry="10" fill="none" stroke="#fff" stroke-opacity=".15" stroke-width=".6"/>` +
          (o.on ? `<ellipse cx="${vx}" cy="${vy - 4}" rx="26" ry="10" fill="url(#${u}-hw)" opacity=".18" class="${P}fan"/>` : "") +
          `<circle cx="${x + 9}" cy="${y + 10}" r="2.6" fill="${H().shade(c, -.08)}" stroke="#000" stroke-opacity=".3" stroke-width=".5"/>` + (o.on ? `<circle cx="${x + 9}" cy="${y + 10}" r="10" fill="url(#${u}-hw)"/><circle cx="${x + 9}" cy="${y + 10}" r="1.8" fill="#fff"/>` : "") +
          `<rect x="${x + 18}" y="${y + 9}" width="5" height="1.8" rx=".4" fill="#000"/><circle cx="${x + 28}" cy="${y + 10}" r="1" fill="#000" opacity=".45"/><rect x="${x + 1}" y="${y + h - 2.5}" width="${w - 2}" height="2.5" fill="#000" opacity=".22"/>`;
        return svg(o, s);
      }
    },
    {
      id: "black-tower-console", name: "Black tower console", colors: ["#1c1d20", "#eeeeec", "#25262e"], picker: true, colorLabel: "Body",
      render(o) {
        const u = o.uid, c = o.color, x = 92, w = 50, h = 100, y = B - h, dx = 9, dy = 9;
        DEF.push(rad(u + "-vg", [[0, "#3dff6a", o.on ? .95 : .55], [.55, "#169a2a", o.on ? .85 : .6], [1, "#0a3a12"]]));
        let s = stage(o) + xpad(o, 22, 151, 48, c === "#eeeeec" ? "#eeeeec" : "#1c1d20") + box3(o, c, x, y, w, h, dx, dy, { gloss: .12 });
        s += `<ellipse cx="${x + w / 2 + dx / 2}" cy="${y - dy / 2}" rx="22" ry="4.1" fill="#07080a"/><ellipse cx="${x + w / 2 + dx / 2}" cy="${y - dy / 2 + .4}" rx="19.5" ry="3.4" fill="url(#${u}-vg)"/><ellipse cx="${x + w / 2 + dx / 2}" cy="${y - dy / 2 + .4}" rx="19.5" ry="3.4" fill="url(#${u}-dot)"/>`;
        if (o.on) s += `<ellipse cx="${x + w / 2 + dx / 2}" cy="${y - dy / 2 - 3}" rx="26" ry="9" fill="url(#${u}-hg)" opacity=".55" class="${P}fan"/>`;
        s += `<rect x="${x + 6.5}" y="${y + 18}" width="1.6" height="58" rx=".8" fill="#000" opacity=".75"/><circle cx="${x + 7.3}" cy="${y + 82}" r="1.1" fill="#000" opacity=".5"/>` +
          `<circle cx="${x + 8}" cy="${y + 8}" r="3.4" fill="#000" opacity=".35"/><circle cx="${x + 8}" cy="${y + 8}" r="2.8" fill="${H().shade(c, -.1)}" stroke="#000" stroke-opacity=".35" stroke-width=".5"/>` + (o.on ? `<circle cx="${x + 8}" cy="${y + 8}" r="12" fill="url(#${u}-hw)"/><circle cx="${x + 8}" cy="${y + 8}" r="2" fill="#fff"/>` : "") +
          `<rect x="${x + w - 12}" y="${y + h - 8}" width="5" height="1.8" rx=".4" fill="#000"/><circle cx="${x + w - 18}" cy="${y + h - 7.1}" r="1.1" fill="#000" opacity=".5"/><rect x="${x + 2}" y="${y + h - 2}" width="${w - 4}" height="2" fill="#000" opacity=".4"/>`;
        return svg(o, s);
      }
    },
    {
      id: "16-bit-black-console", name: "16-bit black console", colors: ["#151517", "#2a2a2e"], picker: true, colorLabel: "Body",
      render(o) {
        const u = o.uid, c = o.color, x = 44, w = 132, h = 20, y = B - h, dx = 16, dy = 44;
        const T = (uu, vv) => [x + w * uu + dx * vv, y - dy * vv];
        let s = stage(o) + box3(o, c, x, y, w, h, dx, dy, { gloss: .35, r: 2 });
        const vent = M4(T(.04, .45), T(.04, .95), T(.36, .95), T(.36, .45));
        s += `<path d="${vent}" fill="url(#${u}-slot)"/><path d="${vent}" fill="none" stroke="#000" stroke-opacity=".4"/>`;
        const cc = T(.68, .52);
        s += `<ellipse cx="${n1(cc[0])}" cy="${n1(cc[1] + 1)}" rx="33" ry="15.4" fill="#000" opacity=".4"/><ellipse cx="${n1(cc[0])}" cy="${n1(cc[1])}" rx="32" ry="15" fill="${mat(o, H().shade(c, .1), "t")}"/>` +
          [27, 22, 17].map((r) => `<ellipse cx="${n1(cc[0])}" cy="${n1(cc[1])}" rx="${r}" ry="${n1(r * .47)}" fill="none" stroke="#000" stroke-opacity=".55" stroke-width="1"/><ellipse cx="${n1(cc[0])}" cy="${n1(cc[1] + .7)}" rx="${r}" ry="${n1(r * .47)}" fill="none" stroke="#fff" stroke-opacity=".08" stroke-width=".6"/>`).join("") +
          `<path d="M${n1(cc[0] - 20)} ${n1(cc[1] - 5)}L${n1(cc[0] + 20)} ${n1(cc[1] - 5)}" stroke="#000" stroke-width="3.6" stroke-linecap="round"/><path d="M${n1(cc[0] - 13)} ${n1(cc[1] + 6)}H${n1(cc[0] + 13)}" stroke="#7a2a5a" stroke-opacity=".7" stroke-width="2.4"/>`;
        const ps = T(.1, .22), rs = T(.24, .22);
        s += `<rect x="${n1(ps[0] - 4)}" y="${n1(ps[1] - 2)}" width="8" height="4" rx="1" fill="#3a3d44"/><rect x="${n1(rs[0] - 4)}" y="${n1(rs[1] - 2)}" width="8" height="4" rx="1" fill="#2f6fd6"/>` + led(o, ps[0] + 7, ps[1], "r", null, .8) +
          `<rect x="${x + 8}" y="${y + 8}" width="14" height="2" rx="1" fill="#000"/><rect x="${x + 12}" y="${y + 6.6}" width="3" height="4.6" rx=".8" fill="#55585f"/>`;
        return svg(o, s + genpad(o, 6, 151, 62, "#151517"));
      }
    },
    {
      id: "white-128-bit-console", name: "White 128-bit console", colors: ["#ecebe7", "#2a2b2f", "#c9ccd1"], picker: true, colorLabel: "Body",
      render(o) {
        const u = o.uid, c = o.color, x = 82, w = 92, h = 30, y = B - h, dx = 18, dy = 44;
        const T = (uu, vv) => [x + w * uu + dx * vv, y - dy * vv];
        let s = stage(o) + box3(o, c, x, y, w, h, dx, dy, { gloss: .35, r: 4 });
        for (let i = 1; i < 6; i++) s += `<path d="M${n1(x + w + dx * i / 6)} ${n1(y + h * .4 - dy * i / 6)}V${n1(y + h - dy * i / 6 - 4)}" stroke="#000" stroke-opacity=".3" stroke-width="1"/>`;
        const lc = T(.5, .56);
        s += `<ellipse cx="${n1(lc[0])}" cy="${n1(lc[1] + .8)}" rx="35" ry="16" fill="#000" opacity=".18"/><ellipse cx="${n1(lc[0])}" cy="${n1(lc[1])}" rx="34" ry="15.4" fill="${mat(o, H().shade(c, .05), "t")}"/><ellipse cx="${n1(lc[0])}" cy="${n1(lc[1])}" rx="34" ry="15.4" fill="none" stroke="#000" stroke-opacity=".3"/>`;
        const sp = T(.74, .82); s += `<ellipse cx="${n1(sp[0])}" cy="${n1(sp[1])}" rx="4.2" ry="2" fill="#e8742a"/>`;
        [.1, .9].forEach((uu) => { const p = T(uu, .14); s += `<ellipse cx="${n1(p[0])}" cy="${n1(p[1])}" rx="7" ry="3.2" fill="${H().shade(c, -.12)}"/><ellipse cx="${n1(p[0])}" cy="${n1(p[1] - .6)}" rx="5.8" ry="2.6" fill="${mat(o, H().shade(c, .05), "t")}" stroke="#000" stroke-opacity=".25" stroke-width=".5"/>`; });
        const lp = T(.2, .1); s += led(o, lp[0], lp[1], "a", null, .8);
        s += [0, 1, 2, 3].map((i) => `<rect x="${x + 12 + i * 18}" y="${y + 13}" width="12" height="9" rx="2" fill="#2a2b2f"/><rect x="${x + 14 + i * 18}" y="${y + 15}" width="8" height="5" rx="1" fill="#55565a"/>`).join("");
        return svg(o, s + dcpad(o, 6, 151, 62, c === "#2a2b2f" ? "#2a2b2f" : "#dcdcd8"));
      }
    }
  ];

  (window.HDA = window.HDA || []).push({
    id: "consoles",
    tab: "Consoles: block & classic",
    group: "Home",
    kind: "device",
    onWord: "Playing", offWord: "Off",
    intro: "Block-style consoles from the original big black box to the newest black tower, plus two classic 90s consoles, drawn at real proportions with their controllers. When playing, the power light comes on, the jewel and the tower's top vent glow green, the memory card screen lights up, and the TV washes the wall.",
    
    css: `
.hda-anim .hda-consoles-tv{animation:hda-consoles-tv 5s ease-in-out infinite}
@keyframes hda-consoles-tv{0%,100%{opacity:.7}35%{opacity:1}60%{opacity:.55}}
.hda-anim .hda-consoles-fan{animation:hda-consoles-fan 3.2s ease-in-out infinite}
@keyframes hda-consoles-fan{0%,100%{opacity:.35}50%{opacity:.75}}
.hda-anim .hda-consoles-slot{animation:hda-consoles-slot 2.4s ease-in-out infinite}
@keyframes hda-consoles-slot{0%,100%{opacity:.35}50%{opacity:1}}
.hda-anim .hda-consoles-pan{animation:hda-consoles-pan 10s ease-in-out infinite alternate}
@keyframes hda-consoles-pan{from{transform:translate(-8px,0)}to{transform:translate(8px,0)}}
.hda-anim .hda-consoles-bob{animation:hda-consoles-bob 1.4s ease-in-out infinite}
@keyframes hda-consoles-bob{0%,100%{transform:translate(0,0)}50%{transform:translate(0,-3px)}}
.hda-anim .hda-consoles-hop{animation:hda-consoles-hop 1.8s ease-in-out infinite}
@keyframes hda-consoles-hop{0%,60%,100%{transform:translate(0,0)}30%{transform:translate(10px,-16px)}}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-consoles-tv,.hda-anim .hda-consoles-fan,.hda-anim .hda-consoles-slot,.hda-anim .hda-consoles-pan,.hda-anim .hda-consoles-bob,.hda-anim .hda-consoles-hop{animation:none}}
`,
    icons
  });
})();
