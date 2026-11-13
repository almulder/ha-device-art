(function () {
  const P = "hda-consoles3-";
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

  function nespad(o, x, yb, w, c) {
    const h = w * .42, y = yb - h;
    return sh(o, x + w / 2, yb - 1, w * .55, 2.5) + `<rect x="${n1(x)}" y="${n1(y)}" width="${n1(w)}" height="${n1(h)}" rx="1.6" fill="${mat(o, c, "v")}"/><rect x="${n1(x + w * .05)}" y="${n1(y + h * .2)}" width="${n1(w * .9)}" height="${n1(h * .7)}" rx="1" fill="#1d1d20"/>` +
      cross(x + w * .17, y + h * .55, h * .24, "#3a3b40") + `<rect x="${n1(x + w * .36)}" y="${n1(y + h * .25)}" width="${n1(w * .28)}" height="${n1(h * .6)}" fill="#8a8a8e"/><rect x="${n1(x + w * .39)}" y="${n1(y + h * .55)}" width="${n1(w * .09)}" height="${n1(h * .1)}" rx="1" fill="#2a2b2f"/><rect x="${n1(x + w * .52)}" y="${n1(y + h * .55)}" width="${n1(w * .09)}" height="${n1(h * .1)}" rx="1" fill="#2a2b2f"/>` +
      [.74, .87].map((p) => `<rect x="${n1(x + w * (p - .055))}" y="${n1(y + h * .38)}" width="${n1(w * .11)}" height="${n1(w * .11)}" fill="#c9c9c9"/><circle cx="${n1(x + w * p)}" cy="${n1(y + h * .38 + w * .055)}" r="${n1(w * .042)}" fill="#d8282a"/>`).join("");
  }
  function n64pad(o, x, yb, w, c) {
    const h = w * .62, y = yb - h;
    const d = `M${n1(x + w * .12)} ${n1(y + h * .1)}H${n1(x + w * .88)}Q${n1(x + w)} ${n1(y + h * .12)} ${n1(x + w)} ${n1(y + h * .4)}L${n1(x + w * .94)} ${n1(y + h * .95)}Q${n1(x + w * .86)} ${n1(y + h)} ${n1(x + w * .8)} ${n1(y + h * .9)}L${n1(x + w * .68)} ${n1(y + h * .5)}H${n1(x + w * .6)}L${n1(x + w * .56)} ${n1(y + h)}H${n1(x + w * .44)}L${n1(x + w * .4)} ${n1(y + h * .5)}H${n1(x + w * .32)}L${n1(x + w * .2)} ${n1(y + h * .9)}Q${n1(x + w * .14)} ${n1(y + h)} ${n1(x + w * .06)} ${n1(y + h * .95)}L${n1(x)} ${n1(y + h * .4)}Q${n1(x)} ${n1(y + h * .12)} ${n1(x + w * .12)} ${n1(y + h * .1)}Z`;
    return sh(o, x + w / 2, yb - 1, w * .55, 3) + `<path d="${d}" fill="${mat(o, c, "v")}"/>` + gl(o, d, .3) + `<path d="${d}" fill="none" stroke="#000" stroke-opacity=".25" stroke-width=".5"/>` +
      cross(x + w * .16, y + h * .32, w * .07, "#3a3b40") + `<circle cx="${n1(x + w * .5)}" cy="${n1(y + h * .3)}" r="${n1(w * .025)}" fill="#d8282a"/>` + stick(x + w * .5, y + h * .52, w * .05) +
      four(x + w * .84, y + h * .26, w * .045, w * .022, ["#f2c230"]) + `<circle cx="${n1(x + w * .7)}" cy="${n1(y + h * .4)}" r="${n1(w * .04)}" fill="#3f6fd6"/><circle cx="${n1(x + w * .65)}" cy="${n1(y + h * .27)}" r="${n1(w * .034)}" fill="#3fae6a"/>`;
  }
  const icons = [
    {
      id: "8-bit-gray-console", name: "8-bit gray console", colors: ["#cfcfcb", "#bdbcb6"], picker: true, colorLabel: "Body",
      render(o) {
        const u = o.uid, c = o.color, x = 46, w = 118, h = 40, y = B - h, dx = 14, dy = 36, DK = "#3c3c3f";
        const T = (uu, vv) => [x + w * uu + dx * vv, y - dy * vv];
        let s = stage(o) + box3(o, c, x, y, w, h, dx, dy, { gloss: .2, r: 1.5 });
        const band = M4(T(.72, 0), T(.72, 1), T(1, 1), T(1, 0));
        s += `<path d="${band}" fill="${mat(o, DK, "t")}"/>`;
        for (let i = 1; i < 10; i++) { const a = T(.73, i / 10), z = T(.99, i / 10); s += `<path d="M${n1(a[0])} ${n1(a[1])}L${n1(z[0])} ${n1(z[1])}" stroke="#000" stroke-opacity=".6" stroke-width="1.2"/><path d="M${n1(a[0])} ${n1(a[1] + .9)}L${n1(z[0])} ${n1(z[1] + .9)}" stroke="#fff" stroke-opacity=".12" stroke-width=".6"/>`; }
        s += `<rect x="${x}" y="${y + 23}" width="${n1(w * .72)}" height="${h - 23}" fill="${mat(o, "#7a7a7e", "v")}"/><rect x="${n1(x + w * .72)}" y="${y}" width="${n1(w * .28)}" height="${h}" fill="${mat(o, DK, "v")}"/>` +
          `<rect x="${x + 3}" y="${y + 3}" width="${n1(w * .72 - 6)}" height="17" rx="1" fill="none" stroke="#000" stroke-opacity=".35"/><rect x="${x + 6}" y="${y + 8}" width="34" height="2" fill="${H().shade(c, -.25)}"/>` +
          `<rect x="${x + 6}" y="${y + 28}" width="13" height="6" rx="1" fill="#2a2a2c"/><rect x="${x + 23}" y="${y + 28}" width="13" height="6" rx="1" fill="#2a2a2c"/>` + led(o, x + 42, y + 31, "r", null, 1) +
          [y + 18, y + 28].map((py) => `<rect x="${n1(x + w * .76)}" y="${py}" width="14" height="6" rx="1.5" fill="#d9d9d6"/><rect x="${n1(x + w * .76 + 2)}" y="${py + 1.6}" width="10" height="2.8" fill="#55565a"/>`).join("");
        return svg(o, s + nespad(o, 6, 151, 56, c));
      }
    },
    {
      id: "16-bit-gray-console", name: "16-bit gray console", colors: ["#c9c8cf", "#d9d6cf"], picker: true, colorLabel: "Body",
      render(o) {
        const u = o.uid, c = o.color, sfc = c === "#d9d6cf", x = 52, w = 112, h = 28, y = B - h, dx = 14, dy = 46;
        const T = (uu, vv) => [x + w * uu + dx * vv, y - dy * vv];
        let s = stage(o) + box3(o, c, x, y, w, h, dx, dy, { gloss: .2, r: sfc ? 8 : 3 });
        s += `<rect x="${x}" y="${y + 12}" width="${w}" height="${h - 12}" fill="${mat(o, H().shade(c, -.14), "v")}"/><path d="M${x} ${y + 12}H${x + w}" stroke="#000" stroke-opacity=".25"/>`;
        const ch = M4(T(.4, .3), T(.4, 1), T(.6, 1), T(.6, .3));
        s += `<path d="${ch}" fill="${mat(o, H().shade(c, -.2), "t")}"/>`;
        const a = T(.43, .62), z = T(.57, .62), cw = z[0] - a[0];
        s += `<path d="M${n1(a[0])} ${n1(a[1])}l${n1(dx * .14)} ${n1(-dy * .14)}h${n1(cw)}l${n1(-dx * .14)} ${n1(dy * .14)}Z" fill="#8f8f96"/><rect x="${n1(a[0])}" y="${n1(a[1])}" width="${n1(cw)}" height="0" fill="none"/>` +
          `<path d="M${n1(a[0])} ${n1(a[1])}v-14h${n1(cw)}v14Z" fill="${mat(o, "#a9a9ae", "v")}"/><path d="M${n1(a[0])} ${n1(a[1] - 14)}l${n1(dx * .14)} ${n1(-dy * .14)}h${n1(cw)}l${n1(-dx * .14)} ${n1(dy * .14)}Z" fill="#c9c9cd"/><rect x="${n1(a[0] + 2.5)}" y="${n1(a[1] - 11)}" width="${n1(cw - 5)}" height="7" fill="#e8e6de"/>`;
        const sl = sfc ? "#8f8f96" : "#6d4fb3";
        [.24, .76].forEach((uu) => { const p = T(uu, .32); s += `<path d="M${n1(p[0] - 9)} ${n1(p[1] + 3)}l3 -6h14l-3 6Z" fill="${sl}"/><path d="M${n1(p[0] - 6)} ${n1(p[1] - 3)}h14" stroke="#fff" stroke-opacity=".35" stroke-width=".7"/>`; });
        const e = T(.5, .16); s += `<ellipse cx="${n1(e[0])}" cy="${n1(e[1])}" rx="5" ry="2.2" fill="${sfc ? "#8f8f96" : "#b9a9e6"}"/>` + led(o, x + 10, y + 7, "r", null, .9);
        s += `<rect x="${x + w - 34}" y="${y + 17}" width="12" height="6" rx="1.4" fill="#4a4a50"/><rect x="${x + w - 18}" y="${y + 17}" width="12" height="6" rx="1.4" fill="#4a4a50"/>`;
        return svg(o, s + snespad(o, 4, 151, 60, c, sfc ? ["#3fae6a", "#e2504a", "#f2c230", "#3f6fd6"] : null));
      }
    },
    {
      id: "64-bit-console", name: "64-bit console", colors: ["#3a3b3f", "#3f7a4a", "#e8742a", "#5b3f8c", "#8ab8d8", "#c8a64a"], picker: true, colorLabel: "Body",
      render(o) {
        const u = o.uid, c = o.color, x = 48, w = 120, h = 22, y = B - h - 5, dx = 14, dy = 38;
        const T = (uu, vv) => [x + w * uu + dx * vv, y - dy * vv];
        let s = stage(o) + sh(o, x + w / 2 + 6, B, w * .62, 4) + `<path d="M${x - 4} ${B}L${x} ${y + h}H${x + w}L${x + w + 4} ${B}Z" fill="${mat(o, H().shade(c, -.35), "v")}"/>` + box3(o, c, x, y, w, h, dx, dy, { gloss: .25, r: 4 });
        const p0 = T(.2, .42), p1 = T(.8, .42), q0 = T(.2, 1), q1 = T(.8, 1), hh = 9;
        s += `<path d="M${n1(p0[0])} ${n1(p0[1])}V${n1(p0[1] - hh)}L${n1(q0[0])} ${n1(q0[1] - hh)}H${n1(q1[0])}L${n1(p1[0])} ${n1(p1[1] - hh)}V${n1(p1[1])}Z" fill="${mat(o, H().shade(c, .08), "t")}"/><path d="M${n1(p0[0])} ${n1(p0[1])}V${n1(p0[1] - hh)}H${n1(p1[0])}V${n1(p1[1])}Z" fill="${mat(o, c, "v")}"/>` + gl(o, `M${n1(p0[0])} ${n1(p0[1] - hh)}L${n1(q0[0])} ${n1(q0[1] - hh)}H${n1(q1[0])}L${n1(p1[0])} ${n1(p1[1] - hh)}Z`, .3);
        const s0 = T(.36, .66), s1 = T(.64, .66);
        s += `<path d="M${n1(s0[0])} ${n1(s0[1] - hh)}H${n1(s1[0])}" stroke="#000" stroke-width="3.4"/>` +
          `<path d="M${n1(s0[0] + 3)} ${n1(s0[1] - hh)}v-16h${n1(s1[0] - s0[0] - 6)}v16Z" fill="${mat(o, "#8e8e94", "v")}"/><path d="M${n1(s0[0] + 3)} ${n1(s0[1] - hh - 16)}l3 -3h${n1(s1[0] - s0[0] - 6)}l-3 3Z" fill="#b5b5ba"/><rect x="${n1(s0[0] + 7)}" y="${n1(s0[1] - hh - 13)}" width="${n1(s1[0] - s0[0] - 14)}" height="8" fill="#e8e6de" opacity=".85"/>`;
        [.1, .9].forEach((uu) => { const p = T(uu, .2); s += `<rect x="${n1(p[0] - 5)}" y="${n1(p[1] - 2)}" width="10" height="4" rx="1" fill="${H().shade(c, .25)}" stroke="#000" stroke-opacity=".3" stroke-width=".5"/>`; });
        const e = T(.5, .2); s += `<rect x="${n1(e[0] - 14)}" y="${n1(e[1] - 3.5)}" width="28" height="7" rx="2" fill="none" stroke="#000" stroke-opacity=".4"/>` + led(o, x + 14, y + 7, "r", null, 1);
        s += [0, 1, 2, 3].map((i) => `<rect x="${x + 22 + i * 20}" y="${y + h - 10}" width="12" height="7" rx="3" fill="#0d0d0f"/><rect x="${x + 25 + i * 20}" y="${y + h - 8.4}" width="6" height="3.6" rx="1" fill="#55565a"/>`).join("");
        return svg(o, s + n64pad(o, 4, 152, 62, c === "#3a3b3f" ? "#bdbdbd" : c));
      }
    },
    {
      id: "cube-console", name: "Cube console", colors: ["#4b3f8c", "#1e1e22", "#c7c9cc", "#e8892b"], picker: true, colorLabel: "Body",
      render(o) {
        const u = o.uid, c = o.color, x = 42, w = 72, h = 52, y = B - h, dx = 14, dy = 30;
        let s = stage(o) + gcpad(o, 126, 151, 60, c) +
          `<path d="M${x + 14 + dx} ${y - dy + 2}V${y - dy - 8}Q${x + 14 + dx} ${y - dy - 12} ${x + 20 + dx} ${y - dy - 12}H${x + w - 6 + dx}Q${x + w + dx} ${y - dy - 12} ${x + w + dx} ${y - dy - 8}V${y - dy + 2}H${x + w - 6 + dx}V${y - dy - 6}H${x + 20 + dx}V${y - dy + 2}Z" fill="${mat(o, H().shade(c, -.15), "v")}"/>` +
          box3(o, c, x, y, w, h, dx, dy, { gloss: .25, r: 3 });
        const lx = x + w / 2 + dx / 2, ly = y - dy / 2;
        s += `<ellipse cx="${lx}" cy="${ly + 1}" rx="25" ry="11" fill="#000" opacity=".25"/><ellipse cx="${lx}" cy="${ly}" rx="24" ry="10.5" fill="${mat(o, H().shade(c, .08), "t")}"/><ellipse cx="${lx}" cy="${ly}" rx="24" ry="10.5" fill="none" stroke="#000" stroke-opacity=".35"/>` +
          `<ellipse cx="${x + 12}" cy="${y - 4}" rx="3.4" ry="1.6" fill="${H().shade(c, -.2)}"/><ellipse cx="${x + w - 2}" cy="${y - 4}" rx="3.4" ry="1.6" fill="${H().shade(c, -.2)}"/>` + led(o, x + w - 2, y - 7, "g", null, .8) +
          `<rect x="${x + 6}" y="${y + 8}" width="27" height="14" rx="1.5" fill="#000" opacity=".2"/><rect x="${x + 39}" y="${y + 8}" width="27" height="14" rx="1.5" fill="#000" opacity=".2"/>` +
          [0, 1, 2, 3].map((i) => `<rect x="${x + 7 + i * 16.5}" y="${y + 32}" width="9" height="10" rx="2" fill="#0a0a0c"/><rect x="${x + 7 + i * 16.5}" y="${y + 32}" width="9" height="10" rx="2" fill="none" stroke="#fff" stroke-opacity=".15"/>`).join("");
        return svg(o, s);
      }
    },
    {
      id: "slim-white-motion-console", name: "Slim white motion console", colors: ["#f3f3f1", "#1b1c1f", "#c4161c"], picker: true, colorLabel: "Body",
      render(o) {
        const u = o.uid, c = o.color, x = 104, w = 22, y = 46, h = 94, D = 40;
        let s = stage(o) + sh(o, x - 4, B, 40, 4) + `<path d="${`M${x - D} ${y - 8}L${x} ${y}V${y + h}L${x - D} ${y + h - 8}Z`}" fill="${mat(o, H().shade(c, -.08), "h")}"/>` + gl(o, `M${x - D} ${y - 8}L${x} ${y}V${y + h}L${x - D} ${y + h - 8}Z`, .4) +
          `<path d="M${x - D + 6} ${y + 6}L${x - 6} ${y + 12}V${y + 22}L${x - D + 6} ${y + 16}Z" fill="url(#${u}-dot)" opacity=".35"/>` +
          `<path d="M${x - D} ${y - 8}L${x - D + 4} ${y - 10}L${x + w + 2} ${y - 2}L${x + w} ${y}H${x}Z" fill="${mat(o, H().shade(c, .1), "t")}"/>` +
          `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="1" fill="${mat(o, c, "h")}"/>` + gl(o, R(x, y, w, h), .3) +
          `<path d="M${x - D - 4} ${B}L${x - D + 2} ${y + h - 10}H${x + w + 2}L${x + w + 6} ${B}Z" fill="#c9ccd1" opacity=".55"/>` +
          strip(o, `M${x + w / 2} ${y + 16}V${y + 76}`, "#4fb2ff", 1.6) + `<rect x="${x + w / 2 - .5}" y="${y + 16}" width="1" height="60" fill="#000" opacity="${o.on ? .25 : .7}"/>` +
          `<rect x="${x + 3}" y="${y + 4}" width="6" height="3" rx="1" fill="${H().shade(c, -.12)}"/><rect x="${x + 13}" y="${y + 4}" width="6" height="3" rx="1" fill="${H().shade(c, -.12)}"/>` + led(o, x + 6, y + 5.5, "g", "r", .9) +
          `<path d="M${x + 1} ${y + 84}H${x + w - 1}" stroke="#000" stroke-opacity=".3"/>` + wiimote(o, 136, 151, 52, c);
        if (o.on) s = s.replace(`class="${P}glow"`, `class="${P}slot"`);
        return svg(o, s);
      }
    },
    {
      id: "tablet-controller-console", name: "Tablet-controller console", colors: ["#f3f3f1", "#111216"], picker: true, colorLabel: "Body",
      render(o) {
        const u = o.uid, c = o.color, x = 104, w = 78, h = 18, y = B - h, dx = 12, dy = 42;
        let s = stage(o) + box3(o, c, x, y, w, h, dx, dy, { gloss: .6, r: 2 });
        s += `<rect x="${x + 10}" y="${y + 7}" width="44" height="1.6" rx=".8" fill="#000" opacity=".8"/><rect x="${x + 58}" y="${y + 10}" width="12" height="4" rx="1" fill="#000" opacity=".2"/>` + led(o, x + w - 6, y + 6, "b", "r", .9);
        const gx = 12, gy = 92, gw = 100, gh = 56;
        const gp = `M${gx + 14} ${gy}H${gx + gw - 14}Q${gx + gw} ${gy} ${gx + gw} ${gy + 16}V${gy + gh - 10}Q${gx + gw} ${gy + gh} ${gx + gw - 14} ${gy + gh}H${gx + 14}Q${gx} ${gy + gh} ${gx} ${gy + gh - 10}V${gy + 16}Q${gx} ${gy} ${gx + 14} ${gy}Z`;
        s += sh(o, gx + gw / 2, B + 2, gw * .55, 3) + `<path d="${gp}" fill="${mat(o, c, "v")}"/>` + gl(o, gp, .45) + `<path d="${gp}" fill="none" stroke="#000" stroke-opacity=".2"/>` +
          `<rect x="${gx + 22}" y="${gy + 6}" width="56" height="36" rx="1" fill="#0b0c0f"/>` + game(o, gx + 24, gy + 8, 52, 32, "kart") +
          stick(gx + 10, gy + 14, 4.2) + stick(gx + gw - 10, gy + 14, 4.2) + cross(gx + 11, gy + 30, 4.4, "#3a3b40") + four(gx + gw - 11, gy + 30, 4.4, 2, ["#55565a"]) +
          `<circle cx="${gx + 50}" cy="${gy + 49}" r="2.4" fill="#55565a"/>` + led(o, gx + 62, gy + 49, "b", null, .7);
        return svg(o, s);
      }
    },
    {
      id: "handheld-hybrid-console", name: "Handheld hybrid console", colors: ["#00b9e8", "#828282", "#ff3278", "#e6ff00", "#b400e6"], picker: true, colorLabel: "Joy-Con",
      render(o) {
        const u = o.uid, c = o.color, pair = { "#00b9e8": "#ff3c28", "#ff3278": "#1edc00", "#b400e6": "#faa005" }[c] || c;
        const dx = 60, dw = 80, dy = B - 44;
        let s = stage(o) + sh(o, 100, B, 50, 4) +
          `<rect x="66" y="${dy - 12}" width="68" height="40" rx="2" fill="#0c0d10"/><rect x="69" y="${dy - 10}" width="62" height="34" fill="url(#${u}-gls)"/>` +
          joy(o, 48, dy - 12, 18, 40, c, "L") + joy(o, 134, dy - 12, 18, 40, pair, "R");
        s += `<path d="M${dx} ${dy}H${dx + dw}V${B - 2}Q${dx + dw} ${B} ${dx + dw - 2} ${B}H${dx + 2}Q${dx} ${B} ${dx} ${B - 2}Z" fill="${mat(o, "#2a2c31", "v")}"/>` + gl(o, R(dx, dy, dw, 44), .2) +
          `<path d="M${dx + 1} ${dy + .5}H${dx + dw - 1}" stroke="#fff" stroke-opacity=".25"/><path d="M${dx + 10} ${dy + 2}H${dx + dw - 10}" stroke="#000" stroke-opacity=".6" stroke-width="1.6"/>` + led(o, dx + dw - 8, B - 6, "g", null, 1);
        return svg(o, s);
      }
    },
    {
      id: "hybrid-console-oled", name: "Hybrid console, OLED", colors: ["#f4f4f2", "#00b9e8", "#e60012", "#1e1e22"], picker: true, colorLabel: "Joy-Con",
      render(o) {
        const u = o.uid, c = o.color, pair = { "#00b9e8": "#ff3c28" }[c] || c;
        const y = 92, h = 52, jw = 20, tw = 92, x0 = 100 - tw / 2;
        let s = stage(o) + sh(o, 100, B, 70, 4) + `<path d="M${x0 + 6} ${y + h}L${x0 + 12} ${B}H${x0 + tw - 12}L${x0 + tw - 6} ${y + h}Z" fill="#141518"/>` +
          `<rect x="${x0}" y="${y}" width="${tw}" height="${h}" rx="2" fill="#0b0c0f"/><rect x="${x0 + .5}" y="${y + .5}" width="${tw - 1}" height="${h - 1}" rx="2" fill="none" stroke="#fff" stroke-opacity=".18"/>` +
          game(o, x0 + 3, y + 3, tw - 6, h - 6, "plat") + joy(o, x0 - jw, y, jw, h, c, "L") + joy(o, x0 + tw, y, jw, h, pair, "R");
        return svg(o, s);
      }
    },
    {
      id: "handheld-only-console", name: "Handheld-only console", colors: ["#f5d000", "#3bc3c3", "#f58b8b", "#8a8a8e", "#2f5fd0"], picker: true, colorLabel: "Body",
      render(o) {
        const u = o.uid, c = o.color, x = 40, y = 92, w = 120, h = 52;
        const d = `M${x + h / 2} ${y}H${x + w - h / 2}Q${x + w} ${y} ${x + w} ${y + h * .45}V${y + h * .7}Q${x + w} ${y + h} ${x + w - h / 2} ${y + h}H${x + h / 2}Q${x} ${y + h} ${x} ${y + h * .7}V${y + h * .45}Q${x} ${y} ${x + h / 2} ${y}Z`;
        let s = stage(o) + sh(o, 100, B, 66, 4) + `<path d="M84 ${y + h}L80 ${B}H120L116 ${y + h}Z" fill="#9aa0a8" opacity=".55"/>` +
          `<path d="${d}" fill="${mat(o, c, "v")}"/>` + gl(o, d, .35) + `<rect x="${x + 25}" y="${y + 4}" width="70" height="44" rx="2" fill="#0b0c0f"/>` + game(o, x + 27.5, y + 6.5, 65, 37, "kart") +
          stick(x + 13, y + 16, 5) + cross(x + 13, y + 36, 5.2, "#2a2c31") + four(x + w - 13, y + 18, 5, 2.2, ["#2a2c31"]) + stick(x + w - 13, y + 37, 5) +
          `<rect x="${x + 19}" y="${y + 4}" width="3.6" height="1.2" fill="#2a2c31"/><path d="M${x + w - 21} ${y + 4.6}h3.6M${x + w - 19.2} ${y + 2.8}v3.6" stroke="#2a2c31" stroke-width="1.2"/>`;
        return svg(o, s);
      }
    },
    {
      id: "hybrid-console-2nd-gen", name: "Hybrid console, 2nd gen", colors: ["#2b2c30", "#b9a8e6", "#3f6fd0"], picker: true, colorLabel: "Joy-Con",
      render(o) {
        const u = o.uid, c = o.color, pair = { "#b9a8e6": "#a8e0b4" }[c] || c;
        const dx = 56, dw = 88, dy = B - 46;
        let s = stage(o) + sh(o, 100, B, 56, 4) +
          `<rect x="62" y="${dy - 12}" width="76" height="42" rx="2.5" fill="#0c0d10"/><rect x="65" y="${dy - 9}" width="70" height="36" fill="url(#${u}-gls)"/>` +
          joy(o, 42, dy - 12, 20, 42, c, "L", "#3fb6ff") + joy(o, 138, dy - 12, 20, 42, pair, "R", "#ff6a3d");
        s += `<rect x="${dx}" y="${dy}" width="${dw}" height="46" rx="8" fill="${mat(o, "#2e3035", "v")}"/>` + gl(o, R(dx, dy, dw, 30), .15) +
          `<path d="M${dx + 8} ${dy + .6}H${dx + dw - 8}" stroke="#fff" stroke-opacity=".25"/><path d="M${dx + 14} ${dy + 3}H${dx + dw - 14}" stroke="#000" stroke-opacity=".6" stroke-width="2"/>` + led(o, dx + dw - 10, B - 7, "g", null, 1);
        return svg(o, s);
      }
    },
    {
      id: "mini-retro", name: "Mini classic", colors: ["#c9c8cf", "#d9d6cf", "#bdbab2", "#2b2b2f"], picker: true, colorLabel: "Body",
      render(o) {
        const u = o.uid, c = o.color, x = 36, w = 84, h = 24, y = B - h, dx = 10, dy = 22;
        let s = stage(o) + snespad(o, 130, 151, 56, c) + box3(o, c, x, y, w, h, dx, dy, { gloss: .2, r: 2 });
        s += `<rect x="${x}" y="${y + 11}" width="${w}" height="${h - 11}" fill="${mat(o, H().shade(c, -.28), "v")}"/>` + [0, 1, 2, 3].map((i) => `<path d="M${x + 2} ${y + 14 + i * 2.6}H${x + w - 2}" stroke="#000" stroke-opacity=".25" stroke-width=".7"/>`).join("") +
          `<rect x="${x + 10}" y="${y + 15}" width="12" height="5" rx="1" fill="#2a2b30"/><rect x="${x + 62}" y="${y + 15}" width="12" height="5" rx="1" fill="#2a2b30"/>` +
          `<path d="M${x + 22 + dx * .4} ${y - dy * .4}H${x + 60 + dx * .4}" stroke="#000" stroke-opacity=".25" stroke-width="6" stroke-linecap="round"/>` +
          `<rect x="${x + 20 + dx * .45}" y="${y - dy * .45 - 2}" width="9" height="4" rx="1" fill="#6d4fb3"/><rect x="${x + 36 + dx * .45}" y="${y - dy * .45 - 2}" width="9" height="4" rx="1" fill="#6d4fb3"/><rect x="${x + 56 + dx * .45}" y="${y - dy * .45 - 2}" width="7" height="4" rx="1" fill="#b9a9e6"/>` +
          led(o, x + 14 + dx * .45, y - dy * .45, "r", null, .9);
        return svg(o, s);
      }
    }
  ];

  (window.HDA = window.HDA || []).push({
    id: "consoles3",
    tab: "Consoles: handheld & family",
    group: "Home",
    kind: "device",
    onWord: "Playing", offWord: "Off",
    intro: "Every home console in this family from the 8-bit gray box to the newest hybrid, in release order, drawn from photos at real proportions with their controllers. When playing, the power light comes on, the disc slot glows, handheld and tablet screens show original game scenery, and the TV washes the wall.",
    
    css: `
.hda-anim .hda-consoles3-tv{animation:hda-consoles3-tv 5s ease-in-out infinite}
@keyframes hda-consoles3-tv{0%,100%{opacity:.7}35%{opacity:1}60%{opacity:.55}}
.hda-anim .hda-consoles3-fan{animation:hda-consoles3-fan 3.2s ease-in-out infinite}
@keyframes hda-consoles3-fan{0%,100%{opacity:.35}50%{opacity:.75}}
.hda-anim .hda-consoles3-slot{animation:hda-consoles3-slot 2.4s ease-in-out infinite}
@keyframes hda-consoles3-slot{0%,100%{opacity:.35}50%{opacity:1}}
.hda-anim .hda-consoles3-pan{animation:hda-consoles3-pan 10s ease-in-out infinite alternate}
@keyframes hda-consoles3-pan{from{transform:translate(-8px,0)}to{transform:translate(8px,0)}}
.hda-anim .hda-consoles3-bob{animation:hda-consoles3-bob 1.4s ease-in-out infinite}
@keyframes hda-consoles3-bob{0%,100%{transform:translate(0,0)}50%{transform:translate(0,-3px)}}
.hda-anim .hda-consoles3-hop{animation:hda-consoles3-hop 1.8s ease-in-out infinite}
@keyframes hda-consoles3-hop{0%,60%,100%{transform:translate(0,0)}30%{transform:translate(10px,-16px)}}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-consoles3-tv,.hda-anim .hda-consoles3-fan,.hda-anim .hda-consoles3-slot,.hda-anim .hda-consoles3-pan,.hda-anim .hda-consoles3-bob,.hda-anim .hda-consoles3-hop{animation:none}}
`,
    icons
  });
})();
