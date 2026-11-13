(function () {
  const P = "hda-consoles2-";
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
${lg(u + "-chrome", 1, [[0, "#fbfcfd"], [.4, "#9097a0"], [.6, "#e6e9ec"], [1, "#575d65"]])}${halo(u + "-tvg", "#8fb8ff", .7)}${halo(u + "-hw", "#ffffff", .9)}${halo(u + "-hg", "#3dff6a", .9)}${halo(u + "-hb", "#3fa9ff", .9)}${halo(u + "-hr", "#ff3b30", .9)}
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
  const LC = { w: ["#ffffff", "hw"], g: ["#45ff7a", "hg"], b: ["#4fb2ff", "hb"], r: ["#ff3b30", "hr"] };
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

  const padPath = (x, y, w, h) => `M${n1(x + .2 * w)} ${n1(y)}H${n1(x + .8 * w)}C${n1(x + .96 * w)} ${n1(y)} ${n1(x + w)} ${n1(y + .35 * h)} ${n1(x + w)} ${n1(y + .62 * h)}C${n1(x + w)} ${n1(y + .96 * h)} ${n1(x + .9 * w)} ${n1(y + 1.02 * h)} ${n1(x + .82 * w)} ${n1(y + .9 * h)}L${n1(x + .66 * w)} ${n1(y + .7 * h)}H${n1(x + .34 * w)}L${n1(x + .18 * w)} ${n1(y + .9 * h)}C${n1(x + .1 * w)} ${n1(y + 1.02 * h)} ${n1(x)} ${n1(y + .96 * h)} ${n1(x)} ${n1(y + .62 * h)}C${n1(x)} ${n1(y + .35 * h)} ${n1(x + .04 * w)} ${n1(y)} ${n1(x + .2 * w)} ${n1(y)}Z`;
  const stick = (cx, cy, r, ring) => `<circle cx="${n1(cx)}" cy="${n1(cy)}" r="${n1(r * 1.25)}" fill="#000" opacity=".4"/>${ring ? `<circle cx="${n1(cx)}" cy="${n1(cy)}" r="${n1(r * 1.15)}" fill="none" stroke="${ring}" stroke-width="${n1(r * .3)}"/>` : ""}<circle cx="${n1(cx)}" cy="${n1(cy)}" r="${n1(r)}" fill="#2a2d33"/><circle cx="${n1(cx - r * .25)}" cy="${n1(cy - r * .25)}" r="${n1(r * .5)}" fill="#4a4e56"/>`;
  const cross = (cx, cy, s, c) => `<path d="M${n1(cx - s * .33)} ${n1(cy - s)}h${n1(s * .66)}v${n1(s * .67)}h${n1(s * .67)}v${n1(s * .66)}h${n1(-s * .67)}v${n1(s * .67)}h${n1(-s * .66)}v${n1(-s * .67)}h${n1(-s * .67)}v${n1(-s * .66)}h${n1(s * .67)}Z" fill="${c || "#26282d"}"/>`;
  const four = (cx, cy, d, r, cs) => [[0, -1], [1, 0], [0, 1], [-1, 0]].map((p, i) => `<circle cx="${n1(cx + p[0] * d)}" cy="${n1(cy + p[1] * d)}" r="${n1(r)}" fill="${cs[i] || cs[0]}"/><circle cx="${n1(cx + p[0] * d - r * .3)}" cy="${n1(cy + p[1] * d - r * .3)}" r="${n1(r * .4)}" fill="#fff" opacity=".35"/>`).join("");
  const B = 164;
  const G = (s) => s ? `<g class="hda-bg">${s}</g>` : "";
  function stage(o) { return G(stage0(o)); }
  function stage0(o) {
    const u = o.uid, fy = B + 30, c = "#6b4a30", x = 4, y = B + 4, w = 192, h = 26;
    let s = `<rect width="200" height="200" fill="url(#${u}-wall)"/>` + (o.on ? `<ellipse cx="100" cy="-10" rx="130" ry="80" fill="url(#${u}-tvg)" class="${P}tv"/>` : "") +
      `<rect y="${fy}" width="200" height="${200 - fy}" fill="url(#${u}-flr)"/><rect y="${fy}" width="200" height="${200 - fy}" fill="url(#${u}-fls)"/>`;
    s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${mat(o, c, "v")}"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${u}-grain)"/>`;
    [1, 2].forEach((i) => { s += `<path d="M${n1(x + w * i / 3)} ${y + 2}V${y + h}" stroke="#000" stroke-opacity=".38"/>`; });
    [0, 1, 2].forEach((i) => { s += `<rect x="${n1(x + w * (i + .5) / 3 - 5)}" y="${y + 6}" width="10" height="1.6" rx=".8" fill="#e2d2a8" opacity=".85"/>`; });
    s += `<rect x="${x - 2}" y="${B}" width="${w + 4}" height="4.5" rx="1" fill="${mat(o, "#7d5638", "t")}"/><rect x="${x - 2}" y="${B}" width="${w + 4}" height="4.5" fill="url(#${u}-grain)"/><rect x="${x - 2}" y="${B}" width="${w + 4}" height=".8" fill="#fff" opacity=".25"/><rect x="${x}" y="${y + .5}" width="${w}" height="2.5" fill="#000" opacity=".3"/>`;
    return s;
  }
  const M = (pts) => "M" + pts.map((p) => n1(p[0]) + " " + n1(p[1])).join("L") + "Z";
  function rpoly(pts, r) {
    const n = pts.length, c = [];
    for (let i = 0; i < n; i++) {
      const a = pts[(i + n - 1) % n], b = pts[i], d = pts[(i + 1) % n];
      const la = Math.hypot(a[0] - b[0], a[1] - b[1]), ld = Math.hypot(d[0] - b[0], d[1] - b[1]), ra = Math.min(r, la / 2), rd = Math.min(r, ld / 2);
      c.push([[b[0] + (a[0] - b[0]) * ra / la, b[1] + (a[1] - b[1]) * ra / la], b, [b[0] + (d[0] - b[0]) * rd / ld, b[1] + (d[1] - b[1]) * rd / ld]]);
    }
    let s = `M${n1(c[0][2][0])} ${n1(c[0][2][1])}`;
    for (let i = 1; i <= n; i++) { const k = c[i % n]; s += `L${n1(k[0][0])} ${n1(k[0][1])}Q${n1(k[1][0])} ${n1(k[1][1])} ${n1(k[2][0])} ${n1(k[2][1])}`; }
    return s + "Z";
  }
  function sbox(x, y, w, h, sl, dx, dy) {
    const ftl = [x + sl, y], ftr = [x + w + sl, y], fbr = [x + w, y + h], fbl = [x, y + h], btl = [ftl[0] + dx, y - dy], btr = [ftr[0] + dx, y - dy], bbr = [fbr[0] + dx, fbr[1] - dy];
    const at = (u, v) => [ftl[0] + w * u + dx * v, y - dy * v];
    const fx = (yy, u) => [x + sl * (y + h - yy) / h + w * u, yy];
    return { top: [ftl, btl, btr, ftr], side: [ftr, btr, bbr, fbr], front: [ftl, ftr, fbr, fbl], at, fx };
  }
  function faces(o, c, b, op) {
    op = op || {};
    const r = op.r || 0, t = r ? rpoly(b.top, r) : M(b.top), s = M(b.side), f = r ? rpoly(b.front, Math.min(r, 4)) : M(b.front);
    return `<path d="${s}" fill="${mat(o, c, "s")}"/><path d="${t}" fill="${mat(o, H().shade(c, op.tl || .08), "t")}"/>` + gl(o, t, op.gloss || .25) +
      `<path d="${f}" fill="${mat(o, c, "v")}"/>` + gl(o, f, (op.gloss || .25) * .5) + `<path d="M${n1(b.front[0][0] + 1)} ${n1(b.front[0][1] + .4)}H${n1(b.front[1][0] - 1)}" stroke="#fff" stroke-opacity=".3" stroke-width=".7"/>`;
  }
  const lineF = (b, yy, u0, u1, w, c, op) => { const a = b.fx(yy, u0), z = b.fx(yy, u1); return `<path d="M${n1(a[0])} ${n1(a[1])}L${n1(z[0])} ${n1(z[1])}" stroke="${c || "#000"}" stroke-opacity="${op || .8}" stroke-width="${w || 1.4}" stroke-linecap="round"/>`; };
  const ellT = (b, u, v, rx, ry, fill, extra) => { const p = b.at(u, v); return `<ellipse cx="${n1(p[0])}" cy="${n1(p[1])}" rx="${rx}" ry="${ry}" fill="${fill}" ${extra || ""}/>`; };

  function psPad(o, x, yb, w, c, k) {
    const h = w * .6, y = yb - h, d = padPath(x, y, w, h);
    let s = sh(o, x + w / 2, yb - 1, w * .55, 3) + `<path d="${d}" fill="${mat(o, c, "v")}"/>` + gl(o, d, k === "ds3" ? .45 : .28) + `<path d="${d}" fill="none" stroke="#000" stroke-opacity=".3" stroke-width=".5"/>`;
    const btn = pal(c).lt ? "#9a9da3" : "#4a4e56", col = k === "gray-disc-console" || k === "dsw", face = col ? ["#3fae6a", "#e2504a", "#4a7fd6", "#e28ab8"] : [btn];
    if (col) s += `<circle cx="${n1(x + .2 * w)}" cy="${n1(y + .32 * h)}" r="${n1(w * .1)}" fill="#000" opacity=".1"/><circle cx="${n1(x + .8 * w)}" cy="${n1(y + .32 * h)}" r="${n1(w * .11)}" fill="#000" opacity=".1"/>`;
    s += (col ? cross(x + .2 * w, y + .32 * h, w * .07, "#6a6c72") : four(x + .2 * w, y + .32 * h, w * .055, w * .026, [btn])) + four(x + .8 * w, y + .32 * h, w * .06, w * .03, face);
    if (k === "dsw") k = "ds";
    if (k !== "gray-disc-console") s += stick(x + .37 * w, y + .6 * h, w * .068) + stick(x + .63 * w, y + .6 * h, w * .068);
    if (k === "gray-disc-console" || k === "ds") s += `<rect x="${n1(x + .42 * w)}" y="${n1(y + .3 * h)}" width="${n1(.06 * w)}" height="${n1(.05 * h)}" rx=".8" fill="#000" opacity=".4"/><rect x="${n1(x + .52 * w)}" y="${n1(y + .3 * h)}" width="${n1(.06 * w)}" height="${n1(.05 * h)}" rx=".8" fill="#000" opacity=".4"/>`;
    if (k === "ds") s += led(o, x + .5 * w, y + .46 * h, "r", null, .8);
    if (k === "ds3") { s += `<circle cx="${n1(x + .5 * w)}" cy="${n1(y + .44 * h)}" r="${n1(w * .032)}" fill="#2a2d33" stroke="#9aa0a8" stroke-width=".4"/>`; for (let i = 0; i < 4; i++) s += `<rect x="${n1(x + .43 * w + i * w * .04)}" y="${n1(y + .5)}" width="${n1(w * .025)}" height="1.1" fill="${o.on && i === 0 ? "#ff3b30" : "#5a1414"}"/>`; }
    if (k === "ds4") s += `<rect x="${n1(x + .33 * w)}" y="${n1(y + .05 * h)}" width="${n1(.34 * w)}" height="${n1(.3 * h)}" rx="1.6" fill="url(#${o.uid}-gls)"/>` + strip(o, `M${n1(x + .34 * w)} ${n1(y + .6)}H${n1(x + .66 * w)}`, "#4fb2ff", 1.1) + `<circle cx="${n1(x + .5 * w)}" cy="${n1(y + .47 * h)}" r="${n1(w * .025)}" fill="#2a2d33"/>`;
    return s;
  }
  function dsense(o, x, yb, w, c) {
    const h = w * .62, y = yb - h, d = padPath(x, y, w, h);
    const core = `M${n1(x + .29 * w)} ${n1(y + .04 * h)}H${n1(x + .71 * w)}L${n1(x + .67 * w)} ${n1(y + .72 * h)}H${n1(x + .33 * w)}Z`;
    return sh(o, x + w / 2, yb - 1, w * .55, 3) + `<path d="${d}" fill="${mat(o, c, "v")}"/>` + gl(o, d, .3) + `<path d="${d}" fill="none" stroke="#000" stroke-opacity=".2" stroke-width=".5"/><path d="${core}" fill="url(#${o.uid}-blk)"/>` +
      `<rect x="${n1(x + .34 * w)}" y="${n1(y + .02 * h)}" width="${n1(.32 * w)}" height="${n1(.3 * h)}" rx="${n1(w * .03)}" fill="${mat(o, c, "v")}"/>` +
      strip(o, `M${n1(x + .32 * w)} ${n1(y + .06 * h)}L${n1(x + .33 * w)} ${n1(y + .34 * h)}M${n1(x + .68 * w)} ${n1(y + .06 * h)}L${n1(x + .67 * w)} ${n1(y + .34 * h)}`, "#4fb2ff", .9) +
      stick(x + .4 * w, y + .55 * h, w * .07) + stick(x + .6 * w, y + .55 * h, w * .07) +
      four(x + .2 * w, y + .32 * h, w * .055, w * .026, ["#8a8e96"]) + four(x + .8 * w, y + .32 * h, w * .06, w * .03, ["#d9dbdf"]) +
      `<circle cx="${n1(x + .5 * w)}" cy="${n1(y + .48 * h)}" r="${n1(w * .025)}" fill="#3a3d42"/>`;
  }

  function ps5(o, kind) {
    const u = o.uid, c = o.color, slimish = kind === "slim" || kind === "pro";
    const Ht = { disc: 150, digital: 148, slim: 134, pro: 148 }[kind], y1 = B - 5, y0 = y1 - Ht, ym = y0 + Ht * .5;
    const X0 = 44, Xf = 64, Xb = Xf + { disc: 74, digital: 70, slim: 70, pro: 66 }[kind];
    const tl = [Xf, y0 + 2], tr = [Xb, y0 + 9], br = [Xb, y1 - 9], bl = [Xf + 1, y1];
    let front;
    if (kind === "disc") front = `C${Xf + 12} ${y0 + Ht * .3} ${Xf + 11} ${y0 + Ht * .5} ${Xf + 5} ${y0 + Ht * .64}C${Xf - 3} ${y0 + Ht * .78} ${Xf - 3} ${y1 - 8} ${bl[0]} ${bl[1]}`;
    else if (kind === "digital") front = `Q${Xf + 13} ${ym} ${bl[0]} ${bl[1]}`;
    else front = `Q${Xf + 4} ${ym} ${bl[0]} ${bl[1]}`;
    const r = slimish ? 7 : 3;
    const panel = `M${tl[0]} ${tl[1] + r}Q${tl[0]} ${tl[1]} ${tl[0] + r} ${tl[1] + .3}L${tr[0] - r} ${tr[1] - .3}Q${tr[0]} ${tr[1]} ${tr[0]} ${tr[1] + r}L${br[0]} ${br[1] - r}Q${br[0]} ${br[1]} ${br[0] - r} ${br[1] + .3}L${bl[0] + r} ${bl[1] - .3}Q${bl[0]} ${bl[1]} ${bl[0]} ${bl[1] - 1}` +
      (kind === "disc" ? `C${Xf - 3} ${y1 - 8} ${Xf - 3} ${y0 + Ht * .78} ${Xf + 5} ${y0 + Ht * .64}C${Xf + 11} ${y0 + Ht * .5} ${Xf + 12} ${y0 + Ht * .3} ${tl[0]} ${tl[1] + r}` : kind === "digital" ? `Q${Xf + 13} ${ym} ${tl[0]} ${tl[1] + r}` : `Q${Xf + 4} ${ym} ${tl[0]} ${tl[1] + r}`) + "Z";
    const edge = `M${tl[0]} ${tl[1] + r}` + front;
    const far = slimish ? `M${X0 + 6} ${y0 + 10}L${X0 + 10} ${y0 + 9}L${X0 + 11} ${y1 - 4}L${X0 + 7} ${y1 - 4}Z` : `M${X0} ${y0 + 6}Q${X0 + 9} ${ym} ${X0 + 5} ${y1 - 4}L${X0 + 9} ${y1 - 4}Q${X0 + 13} ${ym} ${X0 + 5} ${y0 + 5}Z`;
    const core = `M${X0 + 4} ${y0 + 8}L${Xf + 2} ${y0 + 6}` + front.replace(/^C|^Q/, (m) => m) + `L${X0 + 8} ${y1 - 2}Z`;
    let s = sh(o, (Xf + Xb) / 2 - 6, B + 1, 58, 5) + `<ellipse cx="${(Xf + Xb) / 2 - 8}" cy="${B - 2}" rx="34" ry="4.6" fill="url(#${u}-blk)"/>`;
    s += `<path d="M${Xf + 2} ${y0 + 6}${front}L${X0 + 8} ${y1 - 2}L${X0 + 4} ${y0 + 8}Z" fill="url(#${u}-blkh)"/>` + `<path d="M${X0 + 8} ${y0 + 10}Q${X0 + 16} ${ym} ${X0 + 12} ${y1 - 6}" stroke="#fff" stroke-opacity=".16" stroke-width="2" fill="none"/>`;
    s += `<path d="${far}" fill="${mat(o, H().shade(c, -.12), "v")}"/>`;
    s += strip(o, `M${X0 + 8} ${y0 + 9}Q${X0 + 13} ${ym} ${X0 + 9} ${y1 - 6}`, "#d6ebff", 1);
    s += strip(o, edge.replace(/(\d+(\.\d+)?) /, (m) => m), "#d6ebff", 1.2);
    s += `<path d="${panel}" fill="${mat(o, c, "v")}"/><path d="${panel}" fill="${mat(o, H().shade(c, -.14), "h")}" opacity=".45"/>` + gl(o, panel, .4);
    if (kind === "slim") {
      const sy = y0 + Ht * .26;
      s += `<path d="M${Xf + 1.5} ${sy}L${Xb} ${sy + 5}" stroke="#000" stroke-opacity=".35" stroke-width="1.2"/><path d="M${Xf + 1.5} ${sy + 1.2}L${Xb} ${sy + 6.2}" stroke="#fff" stroke-opacity=".5" stroke-width=".6"/>` +
        `<path d="M${tl[0] + 4} ${tl[1] + 3}L${tr[0] - 4} ${tr[1] + 2}L${Xb - 2} ${sy + 3}L${Xf + 4} ${sy - 1}Z" fill="#fff" opacity=".18"/>`;
    }
    if (kind === "pro") [-5.6, 0, 5.6].forEach((dy) => {
      const fy = ym + 8 + dy, by = fy - 16;
      s += `<path d="M${Xf + 2.6} ${fy - 1.8}L${Xb} ${by - 1.8}V${by + 1.8}L${Xf + 2.6} ${fy + 1.8}Z" fill="url(#${u}-blk)"/><path d="M${Xf + 2.6} ${fy - 1.8}L${Xb} ${by - 1.8}" stroke="#fff" stroke-opacity=".25" stroke-width=".5"/>`;
    });
    s += `<path d="M${tl[0] + r} ${tl[1] + 1}L${tr[0] - r} ${tr[1] + .4}" stroke="#fff" stroke-opacity=".7" stroke-width=".8"/>`;
    s += `<rect x="${X0 + 10}" y="${y1 - 34}" width="5" height="2" rx=".5" fill="#000"/><rect x="${X0 + 11}" y="${y1 - 29}" width="3" height="1.6" rx=".7" fill="#000"/><rect x="${X0 + 9}" y="${y1 - 44}" width="1.2" height="6" rx=".6" fill="#3a3d44"/>`;
    if (kind === "disc") s += `<path d="M${Xf - 1} ${y1 - 46}V${y1 - 12}" stroke="#000" stroke-width="1.6"/><path d="M${Xf - .3} ${y1 - 46}V${y1 - 12}" stroke="#fff" stroke-opacity=".2" stroke-width=".5"/>`;
    if (kind === "slim" && o.color) s += `<path d="${rpoly([[Xf + 14, y1 - 50], [Xb - 8, y1 - 46], [Xb - 8, y1 - 14], [Xf + 14, y1 - 14]], 8)}" fill="none" stroke="#000" stroke-opacity=".18" stroke-width="1"/>`;
    return s;
  }

  const icons = [
    {
      id: "gray-disc-console", name: "Gray disc console", colors: ["#c9c8c5", "#3b4c96", "#2a2a2c"], picker: true, colorLabel: "Body",
      render(o) {
        const c = o.color, b = sbox(20, 124, 150, 30, 0, 26, 56), dk = H().shade(c, -.1);
        let s = stage(o) + sh(o, 106, 156, 84, 5) + faces(o, c, b, { gloss: .18, r: 3 });
        for (let i = 1; i < 9; i++) { const t = i / 9; s += `<path d="M${n1(170 + 26 * t)} ${n1(124 - 56 * t + 3)}V${n1(154 - 56 * t - 3)}" stroke="#000" stroke-opacity=".3" stroke-width=".8"/>`; }
        s += `<path d="${rpoly([b.at(0, 0), b.at(0, 1), b.at(.24, 1), b.at(.24, 0)], 4)}" fill="${mat(o, H().shade(c, .12), "t")}"/><path d="${rpoly([b.at(.76, 0), b.at(.76, 1), b.at(1, 1), b.at(1, 0)], 4)}" fill="${mat(o, H().shade(c, .12), "t")}"/>`;
        s += `<path d="M${n1(b.at(.24, 0)[0])} ${n1(b.at(.24, 0)[1])}L${n1(b.at(.24, 1)[0])} ${n1(b.at(.24, 1)[1])}M${n1(b.at(.76, 0)[0])} ${n1(b.at(.76, 0)[1])}L${n1(b.at(.76, 1)[0])} ${n1(b.at(.76, 1)[1])}" stroke="#000" stroke-opacity=".25" stroke-width="1"/>`;
        s += ellT(b, .5, .5, 38, 21, "#000", 'opacity=".2"') + ellT(b, .5, .52, 37, 20, mat(o, H().shade(c, .06), "t")) + ellT(b, .5, .52, 37, 20, "none", 'stroke="#000" stroke-opacity=".35" stroke-width="1"');
        const btn = (uu, vv, r) => ellT(b, uu, vv, r + 2, (r + 2) * .5, dk) + ellT(b, uu, vv - .02, r, r * .5, mat(o, H().shade(c, .04), "t"), 'stroke="#000" stroke-opacity=".3" stroke-width=".6"');
        s += btn(.11, .3, 8) + btn(.89, .3, 8) + ellT(b, .14, .78, 4.4, 2, dk, 'stroke="#000" stroke-opacity=".3" stroke-width=".5"');
        const lp = b.at(.2, .12); s += led(o, lp[0], lp[1], "g", null, 1);
        [.38, .53].forEach((u0) => { const p = b.fx(140, u0); s += `<rect x="${n1(p[0])}" y="130" width="17" height="3" rx=".8" fill="#2a2a2c"/><rect x="${n1(p[0])}" y="138" width="17" height="8" rx="3" fill="#1a1a1c"/><rect x="${n1(p[0] + 2)}" y="140" width="13" height="4" rx="1.6" fill="#3a3a3e"/>`; });
        return svg(o, s + psPad(o, 6, 178, 70, c === "#3b4c96" ? "#c9c8c5" : c, "gray-disc-console"));
      }
    },
    {
      id: "mini-round-console", name: "Mini round console", colors: ["#e6e6e3", "#cfd0d4"], picker: true, colorLabel: "Body",
      render(o) {
        const c = o.color, b = sbox(54, 132, 126, 24, 0, 18, 54), dk = H().shade(c, -.1);
        let s = stage(o) + sh(o, 124, 158, 72, 5) + faces(o, c, b, { gloss: .3, r: 16 });
        s += ellT(b, .5, .55, 40, 19, "#000", 'opacity=".18"') + ellT(b, .5, .57, 39, 18.4, mat(o, H().shade(c, .05), "t")) + ellT(b, .5, .57, 39, 18.4, "none", 'stroke="#000" stroke-opacity=".28" stroke-width="1"');
        const btn = (uu, vv) => ellT(b, uu, vv, 10, 5, dk) + ellT(b, uu, vv - .03, 8.4, 4, mat(o, H().shade(c, .08), "t"), 'stroke="#000" stroke-opacity=".25" stroke-width=".6"');
        s += btn(.1, .2) + btn(.9, .2);
        const lp = b.at(.1, .2); s += o.on ? led(o, lp[0], lp[1] - 2, "g", null, .9) : "";
        [.38, .52].forEach((u0) => { const p = b.fx(144, u0); s += `<rect x="${n1(p[0])}" y="138" width="15" height="2.6" rx=".6" fill="#55565a"/><rect x="${n1(p[0])}" y="144" width="15" height="6" rx="2.4" fill="#3a3b3f"/>`; });
        return svg(o, s + psPad(o, 6, 178, 70, "#dcdcd9", "dsw"));
      }
    },
    {
      id: "black-ridged-console", name: "Black ridged console", colors: ["#141518", "#b9bcc1", "#ecedef", "#5fa8c8", "#1e2a52"], picker: true, colorLabel: "Body",
      render(o) {
        const u = o.uid, c = o.color, x = 50, w = 84, y = 12, h = 144, dx = 24, dy = 6;
        const side = M([[x + w, y], [x + w + dx, y - dy], [x + w + dx, y + h - dy], [x + w, y + h]]), top = M([[x, y], [x + dx, y - dy], [x + w + dx, y - dy], [x + w, y]]);
        let s = stage(o) + sh(o, x + 54, B + 1, 70, 5) + `<path d="M${x - 6} ${B}L${x + 4} ${y + h - 2}H${x + w + dx + 4}L${x + w + dx + 12} ${B}Z" fill="${c === "#141518" ? "#1d4f9a" : "url(#" + u + "-blk)"}" opacity=".9"/>`;
        s += `<path d="${top}" fill="${mat(o, H().shade(c, .1), "t")}"/><path d="${side}" fill="${mat(o, H().shade(c, -.05), "h")}"/>`;
        s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${mat(o, c, "v")}"/>` + gl(o, R(x, y, w, h), .18);
        for (let i = 0; i < 5; i++) s += `<path d="M${x + 1} ${y + 2 + i * 2.6}H${x + w - 14 + i * 2.6}V${y + h}" fill="none" stroke="#000" stroke-opacity=".6" stroke-width="1"/><path d="M${x + 1} ${y + 3.1 + i * 2.6}H${x + w - 13 + i * 2.6}V${y + h}" fill="none" stroke="#fff" stroke-opacity=".1" stroke-width=".6"/>`;
        const fx = (t, yy) => [x + w + dx * t, yy - dy * t];
        const band = M([fx(.15, y + 4), fx(.5, y + 4), fx(.5, y + h - 40), fx(.15, y + h - 40)]);
        s += `<path d="${band}" fill="#000" opacity=".22"/><path d="M${n1(fx(.5, y + 4)[0])} ${n1(fx(.5, y + 4)[1])}L${n1(fx(.5, y + h - 40)[0])} ${n1(fx(.5, y + h - 40)[1])}" stroke="#000" stroke-opacity=".6"/>`;
        const p1 = fx(.72, y + 12), p2 = fx(.72, y + 22);
        s += `<rect x="${n1(p1[0] - 2.5)}" y="${n1(p1[1] - 2.5)}" width="5" height="5" rx="1" fill="#2a2d33"/>` + led(o, p1[0], p1[1], "g", "r", 1.1) + `<rect x="${n1(p2[0] - 2.5)}" y="${n1(p2[1] - 2.5)}" width="5" height="5" rx="1" fill="#2a2d33"/>` + led(o, p2[0], p2[1], "b", null, 1.1);
        for (let i = 0; i < 8; i++) { const a = fx(.62, y + 40 + i * 5), z = fx(.92, y + 40 + i * 5); s += `<path d="M${n1(a[0])} ${n1(a[1])}L${n1(z[0])} ${n1(z[1])}" stroke="#000" stroke-opacity=".6" stroke-width="1.6"/>`; }
        [y + h - 32, y + h - 18].forEach((yy) => { s += `<path d="${M([fx(.2, yy), fx(.62, yy), fx(.62, yy + 9), fx(.2, yy + 9)])}" fill="#050506"/><path d="${M([fx(.7, yy), fx(.88, yy), fx(.88, yy + 9), fx(.7, yy + 9)])}" fill="#050506"/>`; });
        return svg(o, s + psPad(o, 12, 178, 76, c === "#5fa8c8" || c === "#1e2a52" ? c : (c === "#ecedef" ? "#ecedef" : "#141518"), "ds"));
      }
    },
    {
      id: "slim-black-console", name: "Slim black console", colors: ["#1c1d20", "#b9bcc1", "#ecedef", "#e8a4bd"], picker: true, colorLabel: "Body",
      render(o) {
        const c = o.color, b = sbox(14, 134, 160, 22, 0, 22, 66);
        let s = stage(o) + sh(o, 104, 158, 86, 5) + faces(o, c, b, { gloss: .12, r: 2, tl: .04 });
        s += `<path d="${M([b.at(.58, 0), b.at(.58, 1), b.at(.66, 1), b.at(.66, 0)])}" fill="${mat(o, H().shade(c, -.25), "t")}"/>` +
          `<path d="M${n1(b.at(.58, 0)[0])} ${n1(b.at(.58, 0)[1])}L${n1(b.at(.58, 1)[0])} ${n1(b.at(.58, 1)[1])}M${n1(b.at(.66, 0)[0])} ${n1(b.at(.66, 0)[1])}L${n1(b.at(.66, 1)[0])} ${n1(b.at(.66, 1)[1])}" stroke="#000" stroke-opacity=".5"/>` +
          `<path d="${rpoly([b.at(.02, .04), b.at(.02, .96), b.at(.56, .96), b.at(.56, .04)], 4)}" fill="none" stroke="#fff" stroke-opacity=".08"/>`;
        s += lineF(b, 138.5, 0, 1, .9, "#000", .55) + lineF(b, 142, 0, 1, .9, "#000", .55);
        [.05, .14].forEach((u0) => { const p = b.fx(148, u0); s += `<rect x="${n1(p[0])}" y="149" width="12" height="5" rx="2" fill="#050506"/><rect x="${n1(p[0] + 1)}" y="144.6" width="10" height="2.2" rx=".5" fill="#050506"/>`; });
        for (let i = 0; i < 4; i++) { const p = b.fx(150, .3 + i * .055); s += `<rect x="${n1(p[0])}" y="148" width="7" height="2" fill="#050506"/>`; }
        const q1 = b.fx(149, .82), q2 = b.fx(149, .9);
        s += `<circle cx="${n1(q1[0])}" cy="149.5" r="2.4" fill="#2a2d33"/>` + led(o, q1[0], 149.5, "g", "r", 1.1) + `<circle cx="${n1(q2[0])}" cy="149.5" r="2.4" fill="#2a2d33"/>` + led(o, q2[0], 149.5, "b", null, 1);
        return svg(o, s + psPad(o, 118, 178, 70, c === "#e8a4bd" ? "#1c1d20" : c, "ds"));
      }
    },
    {
      id: "curved-gloss-console", name: "Curved gloss console", colors: ["#0d0e11", "#ecedef", "#b9bcc1"], picker: true, colorLabel: "Body",
      render(o) {
        const u = o.uid, c = o.color, dx = 26, dy = 42;
        const top = `M14 124Q14 119 20 118.4Q92 112 164 118.4Q170 119 170 124L${170 + dx} ${124 - dy}Q${170 + dx} ${119 - dy} ${164 + dx} ${118.4 - dy}Q${92 + dx} ${110 - dy} ${20 + dx} ${118.4 - dy}Q${14 + dx} ${119 - dy} ${14 + dx} ${124 - dy}Z`;
        const front = "M14 124Q14 119 20 118.4Q92 112 164 118.4Q170 119 170 124V150H14Z";
        let s = stage(o) + sh(o, 106, 160, 86, 5) + `<path d="M170 124L${170 + dx} ${124 - dy}V${150 - dy}L170 150Z" fill="${mat(o, c, "s")}"/>` +
          `<path d="${top}" fill="${mat(o, H().shade(c, .1), "t")}"/>` + gl(o, top, .7) + `<path d="M30 113Q100 104 168 110L176 102Q104 94 40 104Z" fill="#fff" opacity=".14"/>` +
          `<path d="${front}" fill="${mat(o, c, "v")}"/>` + gl(o, front, .4) + `<rect x="18" y="150" width="148" height="10" fill="url(#${u}-blk)"/><path d="M${170} 150L${170 + dx * .3} ${150 - dy * .3}V${160 - dy * .3}L166 160Z" fill="#050506"/>` +
          `<rect x="14" y="136" width="156" height="12" fill="url(#${u}-chrome)"/><rect x="14" y="136" width="156" height=".8" fill="#fff" opacity=".7"/>` +
          `<rect x="30" y="140.6" width="74" height="2.4" rx="1.2" fill="#050506"/><path d="M142 139v6M152 139v6" stroke="#000" stroke-opacity=".45" stroke-width=".8"/>` + led(o, 160, 142, "g", "r", 1.1) +
          `<path d="M14 124Q14 119 20 118.4Q92 112 164 118.4Q170 119 170 124" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width=".8"/>`;
        return svg(o, s + psPad(o, 8, 176, 64, c === "#b9bcc1" ? "#0d0e11" : c, "ds3"));
      }
    },
    {
      id: "matte-slim-console", name: "Matte slim console", colors: ["#18191c", "#ecedef"], picker: true, colorLabel: "Body",
      render(o) {
        const u = o.uid, c = o.color, b = sbox(14, 128, 154, 28, 0, 26, 52);
        let s = stage(o) + sh(o, 104, 158, 84, 5) + faces(o, c, b, { gloss: .2, r: 12 });
        s += `<path d="${rpoly([b.at(.03, .02), b.at(.03, .12), b.at(.97, .12), b.at(.97, .02)], 3)}" fill="#fff" opacity=".12"/>`;
        s += `<rect x="14" y="152" width="154" height="2.4" fill="url(#${u}-chrome)"/><rect x="50" y="137" width="80" height="9" rx="4" fill="#06070a"/>` + gl(o, R(50, 137, 80, 9), .5) + `<rect x="58" y="141" width="64" height="1.6" rx=".8" fill="#000"/>` +
          `<path d="M142 139v5M150 139v5" stroke="#000" stroke-opacity=".45" stroke-width=".8"/>` + led(o, 158, 141.5, "g", "r", 1);
        return svg(o, s + psPad(o, 8, 176, 64, c, "ds3"));
      }
    },
    {
      id: "top-loader-console", name: "Top-loader console", colors: ["#18191c", "#ecedef", "#2d4f8a", "#7d1f22"], picker: true, colorLabel: "Body",
      render(o) {
        const u = o.uid, c = o.color, b = sbox(14, 138, 156, 18, 0, 28, 58);
        let s = stage(o) + sh(o, 106, 158, 86, 5) + faces(o, c, b, { gloss: .15, r: 3 });
        s += `<path d="${M([b.at(.02, .04), b.at(.02, .96), b.at(.58, .96), b.at(.58, .04)])}" fill="url(#${u}-dot)" opacity=".35"/>` +
          `<path d="${M([b.at(.6, .04), b.at(.6, .96), b.at(.98, .96), b.at(.98, .04)])}" fill="${mat(o, H().shade(c, .14), "t")}"/>` + gl(o, M([b.at(.6, .04), b.at(.6, .96), b.at(.98, .96), b.at(.98, .04)]), .7) +
          lineF(b, 151.5, 0, 1, 1.2, "#cfd3d8", .8) + lineF(b, 146, .62, .66, 1, "#000", .5) + lineF(b, 146, .7, .74, 1, "#000", .5);
        const p = b.fx(146, .92); s += led(o, p[0], 146, "g", "r", 1);
        return svg(o, s + psPad(o, 8, 176, 64, c === "#2d4f8a" || c === "#7d1f22" ? c : (c === "#ecedef" ? c : "#18191c"), "ds3"));
      }
    },
    {
      id: "wedge-console", name: "Wedge console", colors: ["#16171a", "#ecedef", "#9b1b1f", "#2a5aa0"], picker: true, colorLabel: "Body",
      render(o) {
        const c = o.color, b = sbox(14, 132, 142, 28, 7, 30, 58);
        const gloss = [b.at(0, 0), b.at(0, 1), b.at(.33, 1), b.at(.33, 0)];
        let s = stage(o) + sh(o, 104, 160, 84, 5) + faces(o, c, b, { gloss: .1, tl: .02 }) + `<path d="${M(gloss)}" fill="${mat(o, H().shade(c, .16), "t")}"/>` + gl(o, M(gloss), .75);
        const yl = 146; s += `<path d="${M([b.fx(yl - 1.6, 0), b.fx(yl - 1.6, 1), b.fx(yl + 1.6, 1), b.fx(yl + 1.6, 0)])}" fill="#050506"/>` + lineF(b, yl, .1, .5, .7, "#2a2d33", 1);
        const g0 = b.at(.33, 0), g1 = b.at(.33, 1);
        s += `<path d="M${n1(g0[0])} ${n1(g0[1])}L${n1(g1[0])} ${n1(g1[1])}" stroke="#000" stroke-width="2.2"/>` + strip(o, `M${n1(g0[0])} ${n1(g0[1] - .5)}L${n1(g1[0])} ${n1(g1[1])}`, "#e8f2ff", 1.4);
        return svg(o, s + psPad(o, 6, 178, 70, c === "#ecedef" ? c : "#16171a", "ds4"));
      }
    },
    {
      id: "rounded-wedge-console", name: "Rounded wedge console", colors: ["#16171a", "#ecedef", "#c8a96a", "#2a5aa0"], picker: true, colorLabel: "Body",
      render(o) {
        const u = o.uid, c = o.color, b = sbox(16, 136, 146, 22, 0, 28, 56);
        let s = stage(o) + sh(o, 104, 160, 84, 5) + faces(o, c, b, { gloss: .12, r: 12 });
        s += lineF(b, 150, .02, .98, 1.8, "#050506", .9) + lineF(b, 143, .3, .7, 1.2, "#000", .7);
        const p = b.fx(150, .06); s += led(o, p[0] + 2, 150, "w", null, 1);
        return svg(o, s + psPad(o, 6, 178, 70, c === "#c8a96a" ? "#16171a" : c, "ds4"));
      }
    },
    {
      id: "three-layer-wedge", name: "Three-layer wedge", colors: ["#16171a", "#ecedef", "#1f2a4a"], picker: true, colorLabel: "Body",
      render(o) {
        const c = o.color;
        let s = stage(o) + sh(o, 104, 160, 86, 5);
        const slab = (y, h, ins) => { const b = sbox(12 + ins, y, 150 - ins * 2, h, 4, 30, 56); return { b, s: faces(o, c, b, { gloss: .15, r: 4 }) }; };
        const L3 = slab(150.5, 9.5, 1), L2 = slab(139.5, 9.5, 0), L1 = slab(128.5, 9.5, 1);
        s += L3.s + `<path d="${M([L3.b.fx(150.5, 0), L3.b.fx(150.5, 1), [L3.b.fx(150.5, 1)[0] + 30, 150.5 - 56], [L3.b.fx(150.5, 0)[0] + 30, 150.5 - 56]])}" fill="#050506" opacity=".9"/>`;
        s += L2.s + `<path d="${M([L2.b.fx(139.5, 0), L2.b.fx(139.5, 1), [L2.b.fx(139.5, 1)[0] + 30, 139.5 - 56], [L2.b.fx(139.5, 0)[0] + 30, 139.5 - 56]])}" fill="#050506" opacity=".9"/>` + L1.s;
        s += strip(o, `M${n1(L2.b.fx(149.8, .06)[0])} 149.8H${n1(L2.b.fx(149.8, .5)[0])}`, "#e8f2ff", 1.1);
        return svg(o, s + psPad(o, 6, 178, 70, c === "#1f2a4a" ? "#16171a" : c, "ds4"));
      }
    },
    {
      id: "tower-console-white-wings", name: "Tower console, white wings", colors: ["#f3f3f1", "#1e1f23", "#b3252e", "#3a62b8", "#e8a4bd", "#5a3d8f"], picker: true, colorLabel: "Body",
      render(o) { return svg(o, stage(o) + ps5(o, "disc") + dsense(o, 112, 172, 76, o.color)); }
    },
    {
      id: "discless-wing-console", name: "Discless wing console", colors: ["#f3f3f1", "#1e1f23", "#b3252e", "#3a62b8", "#8ec9a8"], picker: true, colorLabel: "Body",
      render(o) { return svg(o, stage(o) + ps5(o, "digital") + dsense(o, 112, 172, 76, o.color)); }
    },
    {
      id: "slim-wing-console", name: "Slim wing console", colors: ["#f3f3f1", "#1e1f23", "#c7c9cc", "#b3252e", "#3a62b8"], picker: true, colorLabel: "Body",
      render(o) { return svg(o, stage(o) + ps5(o, "slim") + dsense(o, 112, 172, 76, o.color === "#c7c9cc" ? "#f3f3f1" : o.color)); }
    },
    {
      id: "striped-wing-console", name: "Striped wing console", colors: ["#f3f3f1", "#3a3d44", "#7c8698"], picker: true, colorLabel: "Body",
      render(o) { return svg(o, stage(o) + ps5(o, "pro") + dsense(o, 112, 172, 76, o.color === "#3a3d44" ? "#1e1f23" : o.color)); }
    }
  ];

  (window.HDA = window.HDA || []).push({
    id: "consoles2",
    tab: "Consoles: wing & slab",
    group: "Home",
    kind: "device",
    onWord: "Playing", offWord: "Off",
    intro: "Every console in this family from the first gray disc box to the newest striped tower, drawn from press photos at real proportions with that era's controller. When playing, the real light comes on: green power lights on the first three, the white light bar on the wedge models and the edge strips on the wing towers, plus controller lights, while the TV washes the wall.",
    
    css: `
.hda-anim .hda-consoles2-tv{animation:hda-consoles2-tv 5s ease-in-out infinite}
@keyframes hda-consoles2-tv{0%,100%{opacity:.7}35%{opacity:1}60%{opacity:.55}}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-consoles2-tv{animation:none}}
`,
    icons
  });
})();
