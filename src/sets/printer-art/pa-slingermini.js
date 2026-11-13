window.HDAPA = window.HDAPA || {};
(function () {
  let N = 0;
  const R = (n) => Math.round(n * 10) / 10;
  const rgb = (c) => { c = String(c || "#888").replace("#", ""); if (c.length === 3) c = c.replace(/./g, "$&$&"); const n = parseInt(c, 16) || 0; return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
  const sh = (c, t) => "#" + rgb(c).map((v) => { v = t < 0 ? v * (1 + t) : v + (255 - v) * t; v = Math.max(0, Math.min(255, Math.round(v))); return (v < 16 ? "0" : "") + v.toString(16); }).join("");
  const pts = (a) => a.map((p) => R(p[0]) + "," + R(p[1])).join(" ");
  const pg = (a, at) => `<polygon points="${pts(a)}" ${at}/>`;
  const pathOf = (a) => "M" + a.map((p) => R(p[0]) + " " + R(p[1])).join("L") + "Z";
  const rc = (x, y, w, h, at, rx) => `<rect x="${R(x)}" y="${R(y)}" width="${R(Math.max(0, w))}" height="${R(Math.max(0, h))}"${rx ? ` rx="${R(rx)}"` : ""} ${at}/>`;
  const ln = (x1, y1, x2, y2, at) => `<path d="M${R(x1)} ${R(y1)}L${R(x2)} ${R(y2)}" ${at}/>`;
  const el = (c, rx, ry, at) => `<ellipse cx="${R(c[0])}" cy="${R(c[1])}" rx="${R(rx)}" ry="${R(ry)}" ${at}/>`;
  const ci = (c, r, at) => `<circle cx="${R(c[0])}" cy="${R(c[1])}" r="${R(r)}" ${at}/>`;
  const ep = (c, rx, ry) => { const r = []; for (let i = 0; i < 32; i++) { const t = 2 * Math.PI * i / 32; r.push([c[0] + rx * Math.cos(t), c[1] + ry * Math.sin(t)]); } return r; };
  const add = (a, b, t) => [a[0] + b[0] * (t == null ? 1 : t), a[1] + b[1] * (t == null ? 1 : t)];
  const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  function hull(ps) {
    const p = ps.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lo = [], up = [];
    for (const q of p) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
    for (let i = p.length - 1; i >= 0; i--) { const q = p[i]; while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
    up.pop(); lo.pop(); return lo.concat(up);
  }
  function S(o) {
    o = o || {}; const off = !!o.off, run = !off && !!o.run;
    const cols = (o.colors || []).slice(0, 4); while (cols.length < 4) cols.push(null);
    const act = o.act || "#2563eb", al = String(act).toLowerCase();
    return { off, run, pct: Math.max(0, Math.min(100, +o.pct || 0)), cols, act, ai: cols.findIndex((c) => c && String(c).toLowerCase() === al) };
  }
  const st = (o, c, a) => `<stop offset="${o}" stop-color="${c}"${a != null ? ` stop-opacity="${a}"` : ""}/>`;
  function defs(k) {
    const lg = (id, x2, y2, s) => `<linearGradient id="${id}${k}" x1="0" y1="0" x2="${x2}" y2="${y2}">${s}</linearGradient>`;
    return "<defs>"
      + lg("af", 1, 0, st(0, "#8a8f97") + st(.32, "#eef0f2") + st(.6, "#cdd1d5") + st(1, "#8d929a"))
      + lg("ah", 0, 1, st(0, "#f7f8f9") + st(.5, "#d4d8dc") + st(1, "#959aa1"))
      + lg("as", 1, 0, st(0, "#7f848b") + st(1, "#5a5e65"))
      + lg("at", 0, 1, st(0, "#ffffff") + st(1, "#dcdfe2"))
      + lg("ch", 1, 0, st(0, "#26282c") + st(1, "#474a50"))
      + lg("wf", 0, 1, st(0, "#fdfdfd") + st(.55, "#eceef0") + st(1, "#c6cacf"))
      + lg("wt", 0, 1, st(0, "#e4e7ea") + st(1, "#fbfcfc"))
      + lg("ws", 1, 0, st(0, "#d2d5d9") + st(1, "#aeb2b7"))
      + lg("pl", 1, 1, st(0, "#40434a") + st(.6, "#2c2e33") + st(1, "#202226"))
      + lg("hd", 0, 1, st(0, "#fbfbfc") + st(.65, "#e2e5e8") + st(1, "#b6bac0"))
      + lg("dk", 1, 0, st(0, "#5d626a") + st(.45, "#3e4248") + st(1, "#222529"))
      + lg("fd", 0, 1, st(0, "#5a5f66") + st(1, "#2a2d32"))
      + lg("gd", 0, 1, st(0, "#efd483") + st(1, "#94722b"))
      + lg("ss", 0, 1, st(0, "#000", .5) + st(.26, "#000", .05) + st(.42, "#fff", .2) + st(.6, "#000", 0) + st(1, "#000", .45))
      + lg("rf", 1, 1, st(0, "#fff", .22) + st(.5, "#fff", .03) + st(1, "#fff", 0))
      + `<radialGradient id="sg${k}" cx=".5" cy=".5" r=".5">${st(0, "#9bdcff", .6)}${st(1, "#9bdcff", 0)}</radialGradient>`
      + `<pattern id="tx${k}" width="2.2" height="2.2" patternUnits="userSpaceOnUse"><circle cx="1.1" cy="1.1" r=".42" fill="#fff" fill-opacity=".08"/></pattern>`
      + `<pattern id="lp${k}" width="8" height="1.3" patternUnits="userSpaceOnUse"><rect width="8" height=".4" fill="#000" fill-opacity=".22"/></pattern>`
      + `<filter id="bl${k}" x="-30%" y="-150%" width="160%" height="400%"><feGaussianBlur stdDeviation="4"/></filter>`
      + `<filter id="gy${k}"><feColorMatrix type="saturate" values=".12"/></filter>`
      + "</defs>";
  }
  const wrap = (vb, s, k, g) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" preserveAspectRatio="xMidYMid meet">${defs(k)}<g${s.off ? ` opacity=".6" filter="url(#gy${k})"` : ""}>${g}</g></svg>`;

  function box(P, x0, x1, y0, y1, z0, z1, f) {
    let o = "";
    if (f.sd) o += pg([P(x1, y0, z0), P(x1, y0, z1), P(x1, y1, z1), P(x1, y1, z0)], `fill="${f.sd}"`);
    if (f.tp) o += pg([P(x0, y0, z0), P(x1, y0, z0), P(x1, y0, z1), P(x0, y0, z1)], `fill="${f.tp}"`);
    const a = P(x0, y0, z0);
    if (f.fr) o += rc(a[0], a[1], x1 - x0, y1 - y0, `fill="${f.fr}"`, f.rx);
    if (f.hl) o += ln(a[0] + .6, a[1] + .35, a[0] + x1 - x0 - .6, a[1] + .35, `stroke="#fff" stroke-opacity="${f.hl}" stroke-width=".6"`);
    if (f.ed) o += ln(...P(x1, y0, z0), ...P(x1, y1, z0), `stroke="#fff" stroke-opacity="${f.ed}" stroke-width=".5"`);
    return o;
  }

  function head(P, hx, gy, z0, z1, sc, s, k) {
    const hw = 26 * sc, x0 = hx - hw / 2, x1 = hx + hw / 2, yt = gy - 27 * sc, ym = gy + 5 * sc, yb = gy + 16 * sc;
    let h = pg([P(x1, yt, z0), P(x1, yt, z1), P(x1, ym, z1), P(x1, ym, z0)], `fill="#a1a6ad"`)
      + pg([P(x1, ym, z0), P(x1, ym, z1), P(x1, yb, z1), P(x1, yb, z0)], `fill="#1d1f23"`)
      + pg([P(x0 + 1, yt, z0), P(x1, yt, z0), P(x1, yt, z1), P(x0 + 1, yt, z1)], `fill="#f6f7f8"`);
    const a = P(x0, yt, z0), ax = a[0], ay = a[1], uh = ym - yt, lh = yb - ym;
    h += rc(ax, ay, hw, uh, `fill="url(#hd${k})"`, 2.2 * sc)
      + ln(ax + 1.5, ay + .4, ax + hw - 1.5, ay + .4, `stroke="#fff" stroke-width=".6"`)
      + ln(ax + hw * .8, ay + 2 * sc, ax + hw * .8, ay + uh - 1, `stroke="#000" stroke-opacity=".16" stroke-width=".5"`);
    const fc = [ax + hw * .42, ay + uh * .5], fr = 8.2 * sc;
    h += ci(fc, fr, `fill="#18191c" stroke="#50545a" stroke-width=".7"`) + ci(fc, fr * .74, `fill="none" stroke="#3a3d42" stroke-width=".7"`)
      + ci(fc, fr * .48, `fill="#e9ecef"`) + ci(fc, fr * .2, `fill="#80858c"`);
    h += ci([ax + hw * .9, ay + 3 * sc], .9 * sc, `fill="${s.run ? "#4ade80" : s.off ? "#2a2c30" : "#9aa0a6"}"`);
    h += rc(ax + .6 * sc, ay + uh, hw - 1.2 * sc, lh, `fill="#2a2d32"`, sc) + rc(ax + .6 * sc, ay + uh, hw - 1.2 * sc, .8, `fill="#50545a"`)
      + rc(ax + hw * .1, ay + uh + lh * .2, hw * .26, lh * .6, `fill="#e4e6e9"`, .8 * sc)
      + rc(ax + hw * .62, ay + uh + lh * .28, hw * .26, lh * .44, `fill="#3d4147"`, .6);
    const nx = ax + hw * .5, ny = ay + uh + lh;
    h += pg([[nx - 2.6 * sc, ny], [nx + 2.6 * sc, ny], [nx + sc, ny + 4.5 * sc], [nx - sc, ny + 4.5 * sc]], `fill="#c4a86c"`);
    if (s.run) h += ci([nx, ny + 4.6 * sc], 1.3, `fill="#ff8a3d"`);
    return { g: `<g class="pa-head">${h}</g>`, t: P(hx + 3 * sc, yt, (z0 + z1) / 2), noz: [nx, ny + 4.5 * sc] };
  }

  const tubeSt = (d) => `<path d="${d}" fill="none" stroke="#8f979f" stroke-width="2.3"/><path d="${d}" fill="none" stroke="#eef1f4" stroke-width="1.3"/>`;
  const TL = 48;
  const headTube = (t, Y1) => { const x = t[0]; return `<g class="pa-head">${tubeSt(`M${R(x)} ${R(t[1] + 1)}L${R(x)} ${R(Y1 + 6)}Q${R(x)} ${R(Y1)} ${R(x + 6)} ${R(Y1)}L${R(x + 6 + TL)} ${R(Y1)}`)}</g>`; };

  function part(P, cx, cz, py, maxH, sc, s, k) {
    if (s.pct <= 0) return "";
    const w = 16 * sc, d = 11 * sc, h = Math.max(.8, maxH * s.pct / 100), x0 = cx - w / 2, x1 = cx + w / 2, z0 = cz - d / 2, z1 = cz + d / 2;
    let o = el(P(cx, py, cz), w * .75, 2.2, `fill="#000" fill-opacity=".35"`);
    o += box(P, x0, x1, py - h, py, z0, z1, { sd: sh(s.act, -.42), tp: sh(s.act, .3), fr: s.act });
    const a = P(x0, py - h, z0);
    return o + rc(a[0], a[1], w, h, `fill="url(#lp${k})"`) + rc(a[0], a[1], w, Math.min(h, 1), `fill="${sh(s.act, .45)}"`);
  }

  function bed(P, b, by, k) {
    const [x0, x1, z0, z1] = b, w = x1 - x0;
    let o = box(P, x0 - 2, x1 + 2, by + 1, by + 3.2, z0 - 2, z1 + 2, { fr: "#858a91", tp: "#b5b9be", sd: "#6b7076" });
    const tp = [P(x0, by, z0), P(x1, by, z0), P(x1, by, z1), P(x0, by, z1)];
    o += pg([P(x1, by, z0), P(x1, by, z1), P(x1, by + 1.1, z1), P(x1, by + 1.1, z0)], `fill="#141518"`);
    o += pg(tp, `fill="url(#pl${k})"`) + pg(tp, `fill="url(#tx${k})"`);
    o += pg([P(x0 + w * .55, by, z0), P(x0 + w * .68, by, z0), P(x0 + w * .86, by, z1), P(x0 + w * .73, by, z1)], `fill="#fff" fill-opacity=".045"`);
    const a = P(x0, by, z0);
    o += rc(a[0], a[1], w, 1.1, `fill="#101113"`) + ln(a[0] + .5, a[1] + .2, a[0] + w - .5, a[1] + .2, `stroke="#fff" stroke-opacity=".22" stroke-width=".5"`);
    o += pg([P(x0 + 5, by, z0), P(x0 + 15, by, z0), P(x0 + 13, by, z0 - 5), P(x0 + 7, by, z0 - 5)], `fill="#26282c"`);
    return o;
  }

  function screen(q, s, k, hc) {
    const L4 = (u, v) => lerp(lerp(q[0], q[1], u), lerp(q[3], q[2], u), v);
    const sq = (u0, u1, v0, v1) => [L4(u0, v0), L4(u1, v0), L4(u1, v1), L4(u0, v1)];
    const w = Math.hypot(q[1][0] - q[0][0], q[1][1] - q[0][1]);
    let o = "";
    if (s.run) o += el(L4(.5, .5), w * .85, w * .55, `fill="url(#sg${k})"`);
    o += pg(q, `fill="${hc}" stroke="#000" stroke-opacity=".25" stroke-width=".4"`);
    o += pg(sq(.07, .93, .12, .88), `fill="${s.off ? "#040506" : "#0a1018"}"`);
    if (!s.off) {
      o += `<g opacity="${s.run ? 1 : .55}">` + pg(sq(.14, .5, .58, .74), `fill="#e8edf3" fill-opacity=".85"`) + pg(sq(.14, .36, .4, .5), `fill="#9aa4b0" fill-opacity=".8"`)
        + pg(sq(.62, .86, .4, .74), `fill="#e8edf3" fill-opacity=".45"`);
      if (s.run) o += pg(sq(.14, .86, .17, .29), `fill="#2b3038"`) + pg(sq(.14, .14 + .72 * s.pct / 100, .17, .29), `fill="#4ade80"`);
      o += "</g>";
      if (s.run) o += pg(sq(.07, .93, .12, .88), `fill="#bfe9ff" fill-opacity=".12"`);
    }
    return o;
  }

  function base(P, c, k) {
    const { bx0, bx1, bTop, bBot, bz } = c;
    let g = box(P, bx0 + 3, bx1 - 3, bBot - 1, bBot + 1.6, 4, bz - 4, { fr: "#141517", sd: "#141517" });
    g += box(P, bx0, bx1, bTop, bBot, 0, bz, { sd: `url(#ws${k})`, tp: `url(#wt${k})`, fr: `url(#wf${k})`, rx: 3, hl: .95 });
    g += rc(bx0 + 3, bBot - 4.5, bx1 - bx0 - 6, .6, `fill="#000" fill-opacity=".1"`);
    if (c.dark) g += box(P, c.dark[0], bx1, bTop, bBot, c.dark[1], bz, { sd: "#33363b", tp: "#464a50" });
    return g;
  }

  function framePrinter(P, c, s, k) {
    const { bTop, uw, xL, xR, uz0, uz1, tTop, th, gy, gh, gz0, gz1 } = c, uTop = tTop + th;
    let g = base(P, c, k);
    g += rc(c.bx0 + 9, bTop + (c.bBot - bTop) * .45, 8, 1.8, `fill="#2a2d31"`, .9);
    if (c.strut) for (const x0 of [xL, xR]) {
      const w = c.strut.w, x = x0 + (uw - w) / 2, za = uz1 - 1, zb = c.strut.z, y0 = c.strut.y, t = 6;
      g += pg([P(x + w, y0, za), P(x + w, y0 + t, za), P(x + w, bTop, zb), P(x + w, bTop - t, zb)], `fill="#4d5157"`)
        + pg([P(x, y0, za), P(x + w, y0, za), P(x + w, bTop - t, zb), P(x, bTop - t, zb)], `fill="#9a9fa6"`)
        + box(P, x - 1.5, x + w + 1.5, bTop - 5, bTop, zb - 5, zb + 4, { fr: "#3a3d42", sd: "#26282c", tp: "#55595f" });
    }
    for (const [x, inner] of [[xL, 1], [xR, 0]]) {
      g += box(P, x, x + uw, uTop, bTop, uz0, uz1, { fr: `url(#af${k})`, sd: inner ? `url(#ch${k})` : `url(#as${k})` });
      const a = P(x, uTop, uz0);
      g += rc(a[0] + uw * .44, a[1], uw * .12, bTop - uTop, `fill="#000" fill-opacity=".14"`)
        + ln(a[0] + .4, a[1], a[0] + .4, a[1] + bTop - uTop, `stroke="#fff" stroke-opacity=".35" stroke-width=".5"`);
      g += box(P, x - 1.5, x + uw + 1.5, bTop - c.foot, bTop, uz0 - 3, uz1 + 3, { fr: "#3a3d42", sd: "#26282c", tp: "#55595f", hl: .2 });
    }
    g += bed(P, c.bed, c.bedY, k);
    g += box(P, xL, xR + uw, tTop, uTop, uz0, uz1, { fr: `url(#ah${k})`, tp: `url(#at${k})`, sd: `url(#as${k})`, hl: .9 });
    for (const x of [xL - 1, xR - 1]) g += box(P, x, x + uw + 2, tTop - 1.5, uTop + 4, uz0 - 1.5, uz1 + 1.5, { fr: "#3b3e44", tp: "#5a5e65", sd: "#2a2c30", hl: .25 });
    const hd = head(P, c.hx, gy, c.hz0, c.hz1, c.hsc, s, k), cz = (c.hz0 + c.hz1) / 2, pb = P(c.hx, c.bedY, cz);
    g += part(P, c.hx, cz, c.bedY, (pb[1] - hd.noz[1] - 6) * .8, c.hsc, s, k);
    for (const x of [xL, xR]) g += box(P, x - 1, x + uw + 1, gy - 6, gy + gh + 6, uz0 - 3, uz0, { fr: "#3e4248", sd: "#2b2e32", tp: "#5d6168" });
    g += gantry(P, c, k);
    g += headTube(hd.t, c.Y1) + hd.g;
    const q = c.scr;
    g += pg([P(q[1], bTop - 1, q[2]), P(q[1], bTop - 9, q[3]), P(q[1], bTop, q[3])], `fill="#c3c7cc"`);
    g += screen([P(q[0], bTop - 1, q[2]), P(q[1], bTop - 1, q[2]), P(q[1], bTop - 9, q[3]), P(q[0], bTop - 9, q[3])], s, k, "#f3f5f7");
    return { g, tx: hd.t[0] };
  }

  function gantry(P, c, k) {
    const { gy, gh, gz0, gz1, gx0, gx1 } = c;
    let g = box(P, gx0, gx1, gy, gy + gh, gz0, gz1, { fr: `url(#ah${k})`, tp: `url(#at${k})`, sd: `url(#as${k})`, hl: .9 });
    const a = P(gx0, gy, gz0), w = gx1 - gx0;
    g += rc(a[0] + 2, a[1] + gh * .38, w - 4, gh * .26, `fill="#6a6f76" fill-opacity=".55"`);
    for (let x = 6; x < w - 4; x += 9) g += ci([a[0] + x, a[1] + gh * .51], .55, `fill="#3b3e44"`);
    g += box(P, gx0 + 1, gx0 + 8, gy + gh, gy + gh + 10, gz0 + 1, gz1, { fr: "#2c2f34", sd: "#1c1e21" }) + box(P, gx0 + 2, gx0 + 7, gy + gh + 10, gy + gh + 12, gz0 + 1, gz1, { fr: "#55595f" });
    const [m0, m1] = c.mot;
    g += box(P, m0, m1, gy - 7, gy + gh + 5, gz0 - 2, gz1 + 4, { fr: `url(#wf${k})`, tp: `url(#wt${k})`, sd: `url(#ws${k})`, rx: 1.6, hl: .95 });
    const b = P(m0, gy - 7, gz0 - 2);
    g += ln(b[0] + 2, b[1] + gh + 9, b[0] + m1 - m0 - 2, b[1] + gh + 9, `stroke="#000" stroke-opacity=".12" stroke-width=".5"`)
      + rc(b[0] + (m1 - m0) * .7, b[1] + 3, 3.4, 3.4, `fill="#a3a8ae"`, .7);
    return g;
  }

  function miniPrinter(P, c, s, k) {
    const { bTop, gy, gh, gz0, gz1 } = c, [cx0, cx1, cz0, cz1] = c.col;
    let g = base(P, c, k);
    const q = c.scr;
    g += screen([P(q[0], q[3], 0), P(q[1], q[3], 0), P(q[1], q[2], 0), P(q[0], q[2], 0)], s, k, "#2a2d32");
    g += bed(P, c.bed, c.bedY, k);
    g += box(P, cx0, cx1, c.cTop, bTop, cz0, cz1, { fr: `url(#af${k})`, sd: `url(#as${k})` });
    const a = P(cx0, c.cTop, cz0);
    g += rc(a[0] + (cx1 - cx0) * .44, a[1], (cx1 - cx0) * .12, bTop - c.cTop, `fill="#000" fill-opacity=".14"`)
      + ln(a[0] + .4, a[1], a[0] + .4, a[1] + bTop - c.cTop, `stroke="#fff" stroke-opacity=".35" stroke-width=".5"`);
    g += box(P, cx0 - 2, cx1 + 2, bTop - 9, bTop, cz0 - 3, cz1 + 3, { fr: `url(#wf${k})`, tp: `url(#wt${k})`, sd: `url(#ws${k})`, hl: .8 });
    g += box(P, cx0 - 1.5, cx1 + 1.5, c.cTop - 8, c.cTop + 6, cz0 - 1.5, cz1 + 1.5, { fr: "#3b3e44", tp: "#5a5e65", sd: "#2a2c30", hl: .25 });
    const hd = head(P, c.hx, gy, c.hz0, c.hz1, c.hsc, s, k), cz = (c.hz0 + c.hz1) / 2, pb = P(c.hx, c.bedY, cz);
    g += part(P, c.hx, cz, c.bedY, (pb[1] - hd.noz[1] - 6) * .8, c.hsc, s, k);
    g += box(P, cx0 - 1, cx1 + 1, gy - 6, gy + gh + 6, cz0 - 3, cz0, { fr: "#3e4248", sd: "#2b2e32", tp: "#5d6168" });
    g += gantry(P, c, k);
    g += headTube(hd.t, c.Y1) + hd.g;
    return { g, tx: hd.t[0] };
  }

  function amsLite(ax, ay, sc, s, k) {
    const L = (x, y) => [ax + x * sc, ay + y * sc], Rr = 36 * sc, rx = .5 * Rr, T = [-.62 * Rr, -.05 * Rr];
    const F = [L(6, -106), L(40, -102), L(-30, -50), L(6, -47)], hub = L(16, -82), feeds = [];
    let g = pg([L(-14, 0), L(54, 0), L(54, -4), L(-14, -5)], `fill="#1f2125"`) + pg([L(-14, -5), L(54, -4), L(60, -10), L(0, -12)], `fill="#4a4e55"`);
    const A = L(14, -7), B = L(14, -46), C = L(10, -82), D = L(20, -82), E = L(26, -40), G = L(40, -6);
    g += `<path d="M${R(A[0])} ${R(A[1])}Q${R(B[0])} ${R(B[1])} ${R(C[0])} ${R(C[1])}L${R(D[0])} ${R(D[1])}Q${R(E[0])} ${R(E[1])} ${R(G[0])} ${R(G[1])}Z" fill="url(#dk${k})"/>`;
    for (let i = 0; i < 4; i++) { const sp = add(F[i], T, .5); g += ln(hub[0], hub[1], sp[0], sp[1], `stroke="#33363b" stroke-width="${R(4 * sc)}" stroke-linecap="round"`); }
    g += el(hub, 7 * sc, 8 * sc, `fill="#2a2d32" stroke="#555a61" stroke-width=".7"`);
    const spool = (i) => {
      const c = F[i], col = s.cols[i];
      if (!col) { g += el(add(c, T, .5), rx * .3, Rr * .3, `fill="#2b2e33" stroke="#555a61" stroke-width=".6"`); return; }
      g += el(add(c, T), rx, Rr, `fill="#d9dde2" fill-opacity=".45" stroke="#f1f4f7" stroke-opacity=".6" stroke-width=".6"`);
      const wr = .86, hp = pathOf(hull(ep(add(c, T, .93), rx * wr, Rr * wr).concat(ep(add(c, T, .07), rx * wr, Rr * wr))));
      g += `<path d="${hp}" fill="${col}"/>`;
      for (const t of [.25, .5, .75]) g += el(add(c, T, t), rx * wr, Rr * wr, `fill="none" stroke="#000" stroke-opacity=".13" stroke-width=".5"`);
      g += `<path d="${hp}" fill="url(#ss${k})"/>`;
      g += el(c, rx * wr, Rr * wr, `fill="${col}"`) + el(c, rx * .7, Rr * .7, `fill="none" stroke="${sh(col, -.3)}" stroke-opacity=".5" stroke-width=".6"`)
        + el(c, rx * .53, Rr * .53, `fill="none" stroke="${sh(col, -.3)}" stroke-opacity=".4" stroke-width=".5"`)
        + el(c, rx * .37, Rr * .37, `fill="#eef0f2"`)
        + el(c, rx, Rr, `fill="#eef2f6" fill-opacity=".18" stroke="#f6f8fa" stroke-opacity=".85" stroke-width=".9"`)
        + el(c, rx, Rr, `fill="url(#rf${k})"`)
        + el(c, rx * .22, Rr * .22, `fill="#2a2d32" stroke="#5a5f66" stroke-width=".6"`) + el(c, rx * .08, Rr * .08, `fill="#8e939a"`);
    };
    const feeder = (i) => {
      const c = F[i], col = s.cols[i], p = add(add(c, T, .45), [0, -(Rr + (i >= 2 ? 14 : 4) * sc)]), fw = 13 * sc, fh = 18 * sc, x = p[0], y = p[1], d = 3.5 * sc;
      g += pg([[x + fw / 2, y + sc], [x + fw / 2 + d, y - 1.2 * sc], [x + fw / 2 + d, y + fh - 2 * sc], [x + fw / 2, y + fh]], `fill="#1e2024"`)
        + pg([[x - fw / 2 + 1, y], [x + fw / 2, y], [x + fw / 2 + d, y - 2.2 * sc], [x - fw / 2 + 1 + d, y - 2.2 * sc]], `fill="#6a6f76"`)
        + rc(x - fw / 2, y, fw, fh, `fill="url(#fd${k})"`, 2 * sc)
        + rc(x - fw * .32, y + fh * .52, fw * .64, fh * .2, `fill="url(#gd${k})"`, .6 * sc);
      if (col) g += rc(x - fw * .12, y + fh * .14, fw * .24, fh * .26, `fill="${col}"`);
      g += rc(x + .1 * sc, y - 5 * sc, 3.2 * sc, 4.2 * sc, `fill="url(#gd${k})"`, .5);
      feeds[i] = [x + 1.7 * sc, y - 5 * sc];
    };
    spool(0); spool(1); feeder(0); feeder(1); spool(2); spool(3); feeder(2); feeder(3);
    return { g, feeds };
  }

  function scene(s, k, c) {
    const P = (x, y, z) => [x + z * c.DX, y - z * c.DY];
    const fb = P((c.bx0 + c.bx1) / 2, c.bBot, c.bz / 2);
    let g = el([fb[0], fb[1] + 2], (c.bx1 - c.bx0) / 2 + c.bz * c.DX / 2 + 8, 6, `fill="#000" fill-opacity=".55" filter="url(#bl${k})"`)
      + el([c.ax + 12 * c.asc, c.ay], 52 * c.asc, 5, `fill="#000" fill-opacity=".5" filter="url(#bl${k})"`);
    const pr = c.mini ? miniPrinter(P, c, s, k) : framePrinter(P, c, s, k);
    g += pr.g;
    const am = amsLite(c.ax, c.ay, c.asc, s, k);
    g += am.g;
    const x = pr.tx, Y1 = c.Y1, hx = x + 6 + TL + 22;
    g += tubeSt(`M${R(x + 26)} ${R(Y1)}L${R(hx + 2)} ${R(Y1)}`);
    for (let i = 0; i < 4; i++) {
      const f = am.feeds[i], h0 = [hx + 8, Y1 - 2.4 + i * 1.6], a = i === s.ai;
      const d = `M${R(h0[0])} ${R(h0[1])}C${R(h0[0] + 8 + i * 9)} ${R(Math.max(c.top + 3 + i * 2.5, Y1 - 46 - i * 5))} ${R(f[0] - 6)} ${R(Math.max(c.top + 3 + i * 2.5, f[1] - 92 - i * 9))} ${R(f[0])} ${R(f[1])}`;
      g += `<path d="${d}" fill="none" stroke="${a ? sh(s.act, -.35) : "#7f8790"}" stroke-opacity="${a ? .9 : .6}" stroke-width="2.1" stroke-linecap="round"/>`
        + `<path d="${d}" fill="none" stroke="${a ? s.act : "#eef1f4"}" stroke-opacity="${a ? .95 : .78}" stroke-width="1.1" stroke-linecap="round"/>`;
    }
    g += rc(hx, Y1 - 4.5, 9, 9, `fill="#2f3237" stroke="#000" stroke-opacity=".4" stroke-width=".4"`, 1.6) + rc(hx + 1, Y1 - 4, 7, 1.4, `fill="#6a6f76"`, .6);
    return wrap(c.vb, s, k, g);
  }

  const CFG = {"mini":true,"DX":0.22,"DY":0.17,"top":0,"vb":"0 0 308 236","bx0":54,"bx1":128,"bTop":192,"bBot":218,"bz":64,"bed":[32,114,4,62],"bedY":189,"col":[116,128,40,52],"cTop":64,"gy":92,"gh":8,"gz0":32,"gz1":40,"gx0":0,"gx1":124,"mot":[116,140],"hx":50,"hz0":24,"hz1":32,"hsc":0.92,"scr":[100,124,198,212],"ax":236,"ay":228,"asc":1.18,"Y1":47};
  window.HDAPA.slingermini = function draw(o) { const s = S(o); return scene(s, "smc" + (++N) + "_", CFG); };
})();
