(function () {
  const P = "hda-home4-";
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
${lg(u + "-chrome", 1, [[0, "#fbfcfd"], [.4, "#9097a0"], [.6, "#e6e9ec"], [1, "#575d65"]])}${halo(u + "-hsc", "#8fb8ff", .7)}<pattern id="${u}-sq" width="5" height="3.6" patternUnits="userSpaceOnUse"><rect x="1.2" y=".8" width="2.6" height="2" fill="#000" fill-opacity=".75"/></pattern>${halo(u + "-tvg", "#8fb8ff", .7)}${halo(u + "-hw", "#ffffff", .9)}${halo(u + "-hg", "#3dff6a", .9)}${halo(u + "-hb", "#3fa9ff", .9)}${halo(u + "-hr", "#ff3b30", .9)}${halo(u + "-ha", "#ffb347", .9)}
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

  const n2 = (v) => (+v).toFixed(2);
  const rpoly4 = (x0, y0, x1, y1, h) => `M${n1(x0)} ${n1(y0)}L${n1(x1)} ${n1(y1)}V${n1(y1 + h)}L${n1(x0)} ${n1(y0 + h)}Z`;
  function box3(o, c, x, y, w, h, dx, dy, op) {
    op = op || {};
    const t = `M${n1(x)} ${n1(y)}L${n1(x + dx)} ${n1(y - dy)}H${n1(x + w + dx)}L${n1(x + w)} ${n1(y)}Z`, sd = `M${n1(x + w)} ${n1(y)}L${n1(x + w + dx)} ${n1(y - dy)}V${n1(y + h - dy)}L${n1(x + w)} ${n1(y + h)}Z`;
    return sh(o, x + w / 2 + dx / 2, y + h, w * .62, 4) + `<path d="${t}" fill="${mat(o, H().shade(c, .08), "t")}"/>` + gl(o, t, op.gloss || .25) + `<path d="${sd}" fill="${mat(o, c, "s")}"/>` +
      `<rect x="${n1(x)}" y="${n1(y)}" width="${n1(w)}" height="${n1(h)}" rx="${op.r || 1.5}" fill="${mat(o, c, "v")}"/>` + gl(o, R(x, y, w, h), (op.gloss || .25) * .5) + `<path d="M${n1(x + .5)} ${n1(y + .4)}H${n1(x + w - .5)}" stroke="#fff" stroke-opacity=".35" stroke-width=".7"/>`;
  }
  const G = (s) => s ? `<g class="hda-bg">${s}</g>` : "";
  const FIN = ["#1c1d20", "#eeeeec", "#5a6068"];
  function wallFloor(o, fy, ply) {
    const u = o.uid;
    return G(`<rect width="200" height="200" fill="url(#${u}-wall)"/>` + (ply ? `<rect x="${ply[0]}" y="${ply[1]}" width="${ply[2]}" height="${ply[3]}" fill="${mat(o, "#c9a46e", "v")}"/><rect x="${ply[0]}" y="${ply[1]}" width="${ply[2]}" height="${ply[3]}" fill="url(#${u}-grain)"/>` : "") +
      (fy < 200 ? `<rect y="${fy}" width="200" height="${200 - fy}" fill="${mat(o, "#6a6e75", "v")}"/><rect y="${fy}" width="200" height="12" fill="url(#${u}-fls)"/><rect y="${fy - 5}" width="200" height="5" fill="#ece8e0" fill-opacity=".12"/>` : ""));
  }
  function desk(o) {
    const u = o.uid;
    return G(`<rect width="200" height="200" fill="url(#${u}-wall)"/><path d="M0 146H200V178H0Z" fill="${mat(o, "#b88a5c", "v")}"/><path d="M0 146H200V178H0Z" fill="url(#${u}-grain)"/><rect y="146" width="200" height="1.2" fill="#fff" opacity=".25"/><rect y="178" width="200" height="5" fill="${mat(o, "#8a6440", "v")}"/><rect y="183" width="200" height="17" fill="url(#${u}-fls)"/>`);
  }
  const spd = (o) => (1.25 - .95 * o.level).toFixed(2);
  function bl(o, x, y, c, i, steady) {
    if (!o.on) return `<rect x="${n1(x - .8)}" y="${n1(y - .6)}" width="1.6" height="1.2" fill="#2a2d33"/>`;
    return `<g ${steady ? "" : `class="${P}bl" style="animation-delay:-${((i * .37) % 1.3).toFixed(2)}s;animation-duration:${spd(o)}s"`}><circle cx="${n1(x)}" cy="${n1(y)}" r="2.2" fill="${c}" opacity=".35"/><rect x="${n1(x - .9)}" y="${n1(y - .7)}" width="1.8" height="1.4" fill="${c}"/></g>`;
  }
  const US = "#dcdfe2";
  const EQ = [{ id: "eq", name: "Equipment", values: [["mixed", "Mixed"], ["white", "Network gear (clean white)"]] }];
  const white = (o) => !!(o.opt && o.opt.eq === "white");
  const ears = (x, y, w, h) => `<rect x="${n1(x - 3)}" y="${n1(y)}" width="3" height="${n1(h)}" fill="#2a2d33"/><rect x="${n1(x + w)}" y="${n1(y)}" width="3" height="${n1(h)}" fill="#2a2d33"/>`;
  function unit(o, kind, x, y, w, u, n, c, k) {
    const h = u * n - .6, d = R(x, y, w, h);
    let s = `<rect x="${n1(x)}" y="${n1(y)}" width="${n1(w)}" height="${n1(h)}" rx=".6" fill="${mat(o, c || "#2a2d33", "v")}"/>` + gl(o, d, .18) + ears(x, y, w, h);
    const lit = Math.round(o.level * 24);
    if (kind === "patch") {
      const pw = (w - 8) / 24;
      for (let i = 0; i < 24; i++) s += `<rect x="${n1(x + 4 + i * pw)}" y="${n1(y + h * .25)}" width="${n1(pw * .7)}" height="${n1(h * .5)}" fill="#08090b"/>`;
      const cc = ["#2f74d0", "#f2c230", "#2f74d0", "#e2504a", "#2f74d0", "#3fae6a"];
      for (let i = 0; i < 12; i++) { const px = x + 4 + i * 2 * pw + pw * .35; s += `<path d="M${n1(px)} ${n1(y + h * .7)}q${n1(1.5)} ${n1(u * .9)} ${n1(pw * .6)} ${n1(u * 1.2)}" stroke="${cc[i % 6]}" stroke-width="1.1" fill="none"/>`; }
    } else if (kind === "sw") {
      const pw = (w - 18) / 24;
      for (let i = 0; i < 24; i++) { const px = x + 4 + i * pw; s += `<rect x="${n1(px)}" y="${n1(y + h * .38)}" width="${n1(pw * .75)}" height="${n1(h * .45)}" fill="#08090b"/>` + (i < lit ? bl(o, px + pw * .37, y + h * .2, i % 5 ? "#45ff7a" : "#ffb347", i + (k || 0)) : `<rect x="${n1(px + pw * .37 - .8)}" y="${n1(y + h * .2 - .6)}" width="1.6" height="1.2" fill="#2a2d33"/>`); }
      s += `<rect x="${n1(x + w - 12)}" y="${n1(y + h * .3)}" width="4" height="${n1(h * .45)}" fill="#08090b"/><rect x="${n1(x + w - 7)}" y="${n1(y + h * .3)}" width="4" height="${n1(h * .45)}" fill="#08090b"/>`;
    } else if (kind === "srv") {
      const bays = n > 1 ? 8 : 4, bw = (w * .66) / bays;
      for (let i = 0; i < bays; i++) { const bx = x + 6 + i * bw; s += `<rect x="${n1(bx)}" y="${n1(y + 2)}" width="${n1(bw - 1)}" height="${n1(h - 4)}" rx=".5" fill="#3a3d44" stroke="#000" stroke-opacity=".5" stroke-width=".4"/>` + bl(o, bx + bw * .3, y + h - 3.5, i < bays * o.level + .5 ? "#45ff7a" : "#3fa9ff", i + (k || 0) * 3); }
      s += `<rect x="${n1(x + w * .72)}" y="${n1(y + 2)}" width="${n1(w * .2)}" height="${n1(h - 4)}" fill="url(#${o.uid}-slot)"/>` + bl(o, x + w - 4, y + 3, "#4fb2ff", 0, true);
    } else if (kind === "ups") {
      s += `<rect x="${n1(x + w * .36)}" y="${n1(y + h * .2)}" width="${n1(w * .28)}" height="${n1(h * .5)}" rx=".8" fill="#06080a"/>` + (o.on ? `<rect x="${n1(x + w * .38)}" y="${n1(y + h * .3)}" width="${n1(w * .24)}" height="${n1(h * .3)}" fill="#3fd1c8" opacity=".25"/><rect x="${n1(x + w * .38)}" y="${n1(y + h * .3)}" width="${n1(w * .24 * Math.max(.1, o.level))}" height="${n1(h * .3)}" fill="#3fd1c8"/>` : "") +
        bl(o, x + w * .72, y + h * .4, "#45ff7a", 0, true) + `<circle cx="${n1(x + w * .82)}" cy="${n1(y + h * .45)}" r="${n1(Math.min(3, h * .18))}" fill="#3a3d44" stroke="#9aa0a8" stroke-width=".4"/><rect x="${n1(x + 5)}" y="${n1(y + 3)}" width="${n1(w * .25)}" height="${n1(h - 6)}" fill="url(#${o.uid}-slot)"/>`;
    } else if (kind === "pdu") {
      for (let i = 0; i < 8; i++) s += `<rect x="${n1(x + 6 + i * (w - 26) / 8)}" y="${n1(y + h * .25)}" width="${n1((w - 26) / 8 - 2)}" height="${n1(h * .5)}" rx=".6" fill="#08090b"/>`;
      s += `<rect x="${n1(x + w - 18)}" y="${n1(y + h * .2)}" width="14" height="${n1(h * .6)}" fill="#050608"/>` + (o.on ? `<rect x="${n1(x + w - 16)}" y="${n1(y + h * .3)}" width="${n1(10 * Math.max(.15, o.level))}" height="${n1(h * .4)}" fill="#4fb2ff"/>` : "");
    } else if (kind === "blank") {
      s += `<path d="M${n1(x + 4)} ${n1(y + h / 2)}H${n1(x + w - 4)}" stroke="#000" stroke-opacity=".35"/>`;
    } else if (kind === "gw" || kind === "us24" || kind === "us48" || kind === "poe" || kind === "nvr" || kind === "upatch") {
      s = `<rect x="${n1(x)}" y="${n1(y)}" width="${n1(w)}" height="${n1(h)}" rx=".8" fill="${mat(o, US, "v")}"/>` + gl(o, d, .3) + ears(x, y, w, h).replace(/#2a2d33/g, "#b9bdc2") + `<path d="M${n1(x + .5)} ${n1(y + .4)}H${n1(x + w - .5)}" stroke="#fff" stroke-opacity=".7" stroke-width=".6"/>`;
      const dsp = (dx0, r) => `<circle cx="${n1(x + dx0)}" cy="${n1(y + h / 2)}" r="${n1(r)}" fill="#0b0d12"/>` + (o.on ? `<circle cx="${n1(x + dx0)}" cy="${n1(y + h / 2)}" r="${n1(r * .78)}" fill="#3fa9ff" opacity=".9"/><circle cx="${n1(x + dx0)}" cy="${n1(y + h / 2)}" r="${n1(r * .3)}" fill="#fff"/>` : "");
      const port = (px, py, pw, ph, i) => `<rect x="${n1(px)}" y="${n1(py)}" width="${n1(pw)}" height="${n1(ph)}" rx=".3" fill="#1a1c20"/>` + (i < lit * (kind === "us48" ? 2 : 1) ? bl(o, px + pw / 2, py - Math.max(.9, ph * .25), i % 6 ? "#e8f4ff" : "#3fa9ff", i + (k || 0)) : "");
      if (kind === "upatch") {
        const pw = (w - 10) / 24;
        for (let i = 0; i < 24; i++) s += `<rect x="${n1(x + 5 + i * pw)}" y="${n1(y + h * .28)}" width="${n1(pw * .72)}" height="${n1(h * .44)}" fill="#f6f6f4" stroke="#9aa0a8" stroke-width=".3"/>`;
        for (let i = 0; i < 12; i++) { const px = x + 5 + i * 2 * pw + pw * .36; s += `<path d="M${n1(px)} ${n1(y + h * .7)}q1.4 ${n1(u * .9)} ${n1(pw * .6)} ${n1(u * 1.2)}" stroke="${i % 4 ? "#f3f3f1" : "#cfd3d8"}" stroke-width="1.2" fill="none"/>`; }
      } else if (kind === "gw") {
        const dw = Math.min(w * .22, h * 1.9);
        s += `<rect x="${n1(x + 5)}" y="${n1(y + h * .14)}" width="${n1(dw)}" height="${n1(h * .72)}" rx="1" fill="#0b0d12"/>` + (o.on ? `<rect x="${n1(x + 6)}" y="${n1(y + h * .2)}" width="${n1(dw - 2)}" height="${n1(h * .6)}" fill="#14325a"/><rect x="${n1(x + 7.5)}" y="${n1(y + h * .3)}" width="${n1((dw - 5) * Math.max(.15, o.level))}" height="${n1(h * .12)}" fill="#3fa9ff"/><rect x="${n1(x + 7.5)}" y="${n1(y + h * .55)}" width="${n1((dw - 5) * .6)}" height="${n1(h * .1)}" fill="#e8f4ff" opacity=".8"/>` : "");
        const pw = (w * .36) / 4;
        for (let r = 0; r < 2; r++) for (let i = 0; i < 4; i++) s += port(x + w * .5 + i * pw, y + h * (r ? .55 : .18), pw * .78, h * .3, r * 4 + i);
        s += `<rect x="${n1(x + w * .88)}" y="${n1(y + h * .25)}" width="${n1(w * .05)}" height="${n1(h * .22)}" fill="#1a1c20"/><rect x="${n1(x + w * .88)}" y="${n1(y + h * .55)}" width="${n1(w * .05)}" height="${n1(h * .22)}" fill="#1a1c20"/>`;
      } else if (kind === "nvr") {
        s += dsp(8, Math.min(h * .2, 5));
        const bw = (w * .7) / 4;
        for (let i = 0; i < 4; i++) { const bx = x + w * .24 + i * bw; s += `<rect x="${n1(bx)}" y="${n1(y + h * .12)}" width="${n1(bw - 1.4)}" height="${n1(h * .76)}" rx=".8" fill="${mat(o, "#c6cacf", "v")}" stroke="#8d9399" stroke-width=".4"/><path d="M${n1(bx + bw * .15)} ${n1(y + h * .3)}H${n1(bx + bw * .7)}" stroke="#000" stroke-opacity=".2"/>` + bl(o, bx + bw * .8, y + h * .78, "#3fa9ff", i + 2); }
      } else {
        const n48 = kind === "us48", cols = n48 ? 24 : 12, x0 = x + (kind === "poe" ? w * .2 : w * .14), pw = (w * .7) / cols;
        s += dsp(kind === "poe" ? w * .1 : w * .07, Math.min(h * .2, 4.2));
        for (let r = 0; r < 2; r++) for (let i = 0; i < cols; i++) s += port(x0 + i * pw + (i % 2 ? 0 : .4), y + h * (r ? .56 : .2), pw * .78, h * .26, r * cols + i);
        s += `<rect x="${n1(x + w * .88)}" y="${n1(y + h * .3)}" width="${n1(w * .04)}" height="${n1(h * .4)}" fill="#1a1c20"/><rect x="${n1(x + w * .93)}" y="${n1(y + h * .3)}" width="${n1(w * .04)}" height="${n1(h * .4)}" fill="#1a1c20"/>`;
        if (kind === "poe") s += `<rect x="${n1(x + w * .16)}" y="${n1(y + h * .2)}" width="1.2" height="${n1(h * .6)}" fill="#f2a63a" opacity="${o.on ? .9 : .3}"/>`;
      }
    } else if (kind === "shelf") {
      s = `<rect x="${n1(x)}" y="${n1(y + h - 2)}" width="${n1(w)}" height="2" fill="#3a3d44"/>` + ears(x, y + h - 2.5, w, 2.5);
      const bw = w * .26;
      [0, 1, 2].forEach((i) => { const bx = x + 4 + i * (bw + 2); s += `<rect x="${n1(bx)}" y="${n1(y + h - 2 - h * .6)}" width="${n1(bw)}" height="${n1(h * .6)}" rx="1.2" fill="${mat(o, i === 1 ? "#c9ccd1" : "#2a2d33", "v")}"/>` + bl(o, bx + 3, y + h - 2 - h * .3, "#4fb2ff", i, true); });
    }
    return s;
  }
  function stack(o, x, y, w, u, list, c) {
    let s = "", yy = y;
    list.forEach((it, i) => { s += unit(o, it[0], x, yy, w, u, it[1] || 1, it[2] || c, i); yy += u * (it[1] || 1); });
    return s;
  }
  const holes = (o, x, y, w, h) => `<rect x="${n1(x)}" y="${n1(y)}" width="${n1(w)}" height="${n1(h)}" fill="${mat(o, "#2b2d31", "h")}"/><rect x="${n1(x + 1.2)}" y="${n1(y)}" width="${n1(w - 2.4)}" height="${n1(h)}" fill="url(#${o.uid}-sq)"/>`;

  function screen(o, x, y, w, h, kind, clip) {
    const u = o.uid;
    if (!o.on) return `<rect x="${n1(x)}" y="${n1(y)}" width="${n1(w)}" height="${n1(h)}" fill="url(#${u}-gls)"/><rect x="${n1(x)}" y="${n1(y)}" width="${n1(w)}" height="${n1(h)}" fill="url(#${u}-ref)"/>`;
    let c;
    if (kind === "game") {
      DEF.push(lg(u + "-gs", 1, [[0, "#2b1f5e"], [.45, "#c4527a"], [.7, "#ffb070"]]));
      c = `<rect width="160" height="90" fill="url(#${u}-gs)"/><circle cx="96" cy="50" r="12" fill="#ffe4a8"/><path d="M0 58C30 46 60 50 90 58S140 50 160 54V90H0Z" fill="#9c5226"/><path d="M0 72C40 60 80 66 110 76S150 70 160 70V90H0Z" fill="#5e2a12"/>` +
        `<g class="${P}pan"><path d="M70 74l10-6 10 6-10 3Z" fill="#2a2d33"/><path d="M78 68l2-4 2 4Z" fill="#ff6a3d"/></g><rect x="4" y="4" width="26" height="3" fill="#000" opacity=".4"/><rect x="4" y="4" width="18" height="3" fill="#3fd17a"/><circle cx="150" cy="10" r="5" fill="none" stroke="#fff" stroke-opacity=".6"/>`;
    } else {
      DEF.push(lg(u + "-wp", 0, kind === "mac" ? [[0, "#3a6fd8"], [.5, "#9b5cf0"], [1, "#f06aa0"]] : [[0, "#1d4f9a"], [.6, "#3fa0d8"], [1, "#7ad0c8"]]));
      c = `<rect width="160" height="90" fill="url(#${u}-wp)"/><path d="M0 70C40 50 80 80 160 52V90H0Z" fill="#fff" opacity=".12"/><path d="M0 80C50 60 100 86 160 66V90H0Z" fill="#fff" opacity=".1"/>` +
        `<rect x="12" y="12" width="78" height="50" rx="2" fill="#f4f6f9"/><rect x="12" y="12" width="78" height="7" rx="2" fill="#dde2ea"/><circle cx="17" cy="15.5" r="1.4" fill="#e2504a"/><circle cx="21.5" cy="15.5" r="1.4" fill="#f2c230"/><circle cx="26" cy="15.5" r="1.4" fill="#3fae6a"/>` +
        `<g class="${P}pan">${[24, 30, 36, 42, 48, 54].map((yy, i) => `<rect x="18" y="${yy}" width="${[60, 48, 66, 40, 56, 30][i]}" height="2.4" rx="1" fill="#9aa4b4"/>`).join("")}</g>` +
        `<rect x="98" y="26" width="50" height="34" rx="2" fill="#1f2430"/><rect x="98" y="26" width="50" height="6" rx="2" fill="#2b3242"/><path d="M104 52l8-10 7 6 9-12 12 16" fill="none" stroke="#3fd1c8" stroke-width="1.6"/>` +
        (kind === "mac" ? `<rect x="50" y="80" width="60" height="7" rx="3" fill="#fff" opacity=".35"/>${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${54 + i * 9}" y="81.5" width="6" height="4" rx="1.2" fill="${["#3fa9ff", "#3fae6a", "#f2c230", "#e2504a", "#9b5cf0", "#eeeeec"][i]}"/>`).join("")}` : `<rect y="84" width="160" height="6" fill="#0d1018" opacity=".85"/>${[0, 1, 2, 3, 4].map((i) => `<rect x="${66 + i * 6}" y="85.5" width="4" height="3" rx=".6" fill="#9aa4b4"/>`).join("")}`);
    }
    const dim = `<rect width="160" height="90" fill="#000" opacity="${n2((1 - o.level) * .6)}"/>`;
    return `<svg x="${n1(x)}" y="${n1(y)}" width="${n1(w)}" height="${n1(h)}" viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice">${c}${dim}</svg><rect x="${n1(x)}" y="${n1(y)}" width="${n1(w)}" height="${n1(h)}" fill="url(#${u}-ref)" opacity=".45"/>`;
  }
  const glow = (o, cx, cy, rx, ry, c) => o.on ? `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#${o.uid}-${c || "hsc"})" opacity="${n2(.25 + .45 * o.level)}"/>` : "";

  const icons = [
    {
      id: "8u-open-frame", name: "8U open frame", colors: FIN, picker: true, colorLabel: "Finish",
      render(o) {
        const c = o.color, u = 11, top = 44, bot = top + 8 * u, dx = 16, dy = 10;
        let s = wallFloor(o, 200, [30, 22, 140, 140]);
        s += holes(o, 136 + dx, top - dy, 5, 8 * u) + holes(o, 54 + dx, top - dy, 5, 8 * u);
        s += `<path d="M57 ${top}L${57 + dx} ${top - dy}M143 ${top}L${143 + dx} ${top - dy}M57 ${bot}L${57 + dx} ${bot - dy}M143 ${bot}L${143 + dx} ${bot - dy}" stroke="${H().shade(c, -.1)}" stroke-width="5" stroke-linecap="round"/>`;
        s += stack(o, 60, top, 80, u, [["patch"], ["sw"], ["blank"], ["shelf", 2], ["sw"], ["pdu"], ["blank"]]);
        s += holes(o, 54, top - 2, 6, 8 * u + 4) + holes(o, 140, top - 2, 6, 8 * u + 4) + `<rect x="52" y="${top - 4}" width="96" height="4" rx="1" fill="${mat(o, c, "v")}"/><rect x="52" y="${bot}" width="96" height="4" rx="1" fill="${mat(o, c, "v")}"/>` + sh(o, 100 + dx / 2, bot + 8, 50, 3);
        return svg(o, s);
      }
    },
    {
      id: "wall12u", name: "12U wall cabinet", colors: FIN, picker: true, colorLabel: "Finish", options: EQ,
      render(o) {
        const u = o.uid, c = o.color, x = 46, w = 104, h = 118, y = 30, dx = 16, dy = 12;
        let s = wallFloor(o, 200) + box3(o, c, x, y, w, h, dx, dy, { gloss: .2 });
        const t = `M${x + 8} ${y - 2}L${x + 8 + dx * .8} ${y - dy * .8}H${x + w - 8 + dx * .8}L${x + w - 8} ${y - 2}Z`;
        s += `<path d="${t}" fill="url(#${u}-slot)"/>`;
        s += `<rect x="${x + 6}" y="${y + 6}" width="${w - 14}" height="${h - 12}" fill="#0b0c0f"/>` + stack(o, x + 14, y + 10, w - 30, 8.4, white(o) ? [["upatch"], ["us24"], ["upatch"], ["gw"], ["poe"], ["blank"], ["nvr", 2], ["ups", 2], ["pdu"]] : [["patch"], ["sw"], ["blank"], ["srv", 2], ["shelf", 2], ["ups", 2], ["pdu"]]);
        s += `<rect x="${x + 6}" y="${y + 6}" width="${w - 14}" height="${h - 12}" fill="#1a2a38" opacity=".35"/><rect x="${x + 6}" y="${y + 6}" width="${w - 14}" height="${h - 12}" fill="url(#${u}-ref)"/><rect x="${x + 6}" y="${y + 6}" width="${w - 14}" height="${h - 12}" fill="none" stroke="#000" stroke-opacity=".6" stroke-width="1.6"/>` +
          `<rect x="${x + w - 6}" y="${y + h / 2 - 12}" width="3" height="24" rx="1.5" fill="url(#${u}-chrome)"/><circle cx="${x + w - 4.5}" cy="${y + h / 2 - 16}" r="1.4" fill="#9aa0a8"/>`;
        return svg(o, s);
      }
    },
    {
      id: "cab42u", name: "42U server cabinet", colors: FIN, picker: true, colorLabel: "Finish", options: EQ,
      render(o) {
        const u = o.uid, c = o.color, x = 62, w = 68, h = 156, y = 12, dx = 18, dy = 10;
        let s = wallFloor(o, 172) + box3(o, c, x, y, w, h, dx, dy, { gloss: .15 }) + `<rect x="${x + 2}" y="${y + h}" width="${w - 4}" height="4" fill="#111"/>`;
        const list = white(o) ? [["gw"], ["upatch"], ["us48"], ["upatch"], ["us48"], ["poe"], ["blank"], ["nvr", 2], ["nvr", 2], ["blank"], ["srv", 2], ["blank"], ["shelf", 2], ["ups", 3]] : [["sw"], ["patch"], ["sw"], ["blank"], ["srv", 2], ["srv", 2], ["srv", 1], ["srv", 1], ["blank"], ["srv", 2], ["srv", 2], ["blank"], ["shelf", 2], ["ups", 3]];
        s += `<rect x="${x + 5}" y="${y + 5}" width="${w - 10}" height="${h - 10}" fill="#0b0c0f"/>` + stack(o, x + 10, y + 10, w - 20, 6.6, list);
        s += `<rect x="${x + 5}" y="${y + 5}" width="${w - 10}" height="${h - 10}" fill="url(#${u}-mesh)"/><rect x="${x + 5}" y="${y + 5}" width="${w - 10}" height="${h - 10}" fill="none" stroke="#000" stroke-opacity=".5"/>`;
        DEF.push(`<pattern id="${u}-mesh" width="2.6" height="2.6" patternUnits="userSpaceOnUse"><rect width="2.6" height="2.6" fill="${H().shade(c, -.25)}" fill-opacity="${white(o) ? .5 : .72}"/><circle cx="1.3" cy="1.3" r=".75" fill="#000" fill-opacity=".9"/></pattern>`);
        if (o.on) { let yy = y + 10; list.forEach((it, i) => { const nU = it[1] || 1; if (/^(srv|sw|gw|us24|us48|poe|nvr)$/.test(it[0])) s += `<circle class="${P}bl" style="animation-delay:-${(i * .29).toFixed(2)}s;animation-duration:${spd(o)}s" cx="${x + 16}" cy="${n1(yy + 3)}" r="2.6" fill="url(#${u}-hg)"/><circle cx="${x + w - 14}" cy="${n1(yy + 3)}" r="2.4" fill="url(#${u}-hb)"/>`; yy += 6.6 * nU; }); }
        s += `<rect x="${x + w - 7}" y="${y + 60}" width="3" height="22" rx="1.5" fill="url(#${u}-chrome)"/>` + `<path d="M${x + 6} ${y - 2}L${x + 6 + dx * .8} ${y - dy * .8}H${x + w - 6 + dx * .8}L${x + w - 6} ${y - 2}Z" fill="url(#${u}-slot)"/>`;
        return svg(o, s);
      }
    },
    {
      id: "open25u", name: "25U open rack", colors: FIN, picker: true, colorLabel: "Finish", options: EQ,
      render(o) {
        const c = o.color, u = 5.4, top = 32, H25 = 25 * u, dx = 20, dy = 12, x0 = 52, x1 = 144;
        let s = wallFloor(o, 172) + sh(o, 108, 172, 66, 5);
        s += holes(o, x0 + dx, top - dy, 5, H25 + 6) + holes(o, x1 + dx, top - dy, 5, H25 + 6);
        s += `<path d="M${x0 + 3} ${top}L${x0 + 3 + dx} ${top - dy}M${x1 + 3} ${top}L${x1 + 3 + dx} ${top - dy}M${x0 + 3} ${top + H25 + 4}L${x0 + 3 + dx} ${top + H25 + 4 - dy}M${x1 + 3} ${top + H25 + 4}L${x1 + 3 + dx} ${top + H25 + 4 - dy}" stroke="${H().shade(c, -.1)}" stroke-width="4"/>`;
        s += stack(o, x0 + 6, top + 2, x1 - x0 - 6, u, white(o) ? [["upatch"], ["us48"], ["upatch"], ["us24"], ["gw"], ["poe"], ["blank"], ["nvr", 2], ["blank", 2], ["srv", 2], ["shelf", 3], ["blank", 2], ["pdu"], ["ups", 3], ["ups", 3]] : [["patch"], ["sw"], ["blank"], ["srv", 2], ["srv", 2], ["srv", 1], ["blank", 2], ["srv", 2], ["shelf", 3], ["blank", 3], ["pdu"], ["ups", 3], ["ups", 3]]);
        s += holes(o, x0, top, 6, H25 + 6) + holes(o, x1, top, 6, H25 + 6) + `<rect x="${x0 - 2}" y="${top + H25 + 4}" width="${x1 - x0 + 10}" height="4" fill="${mat(o, c, "v")}"/><rect x="${x0 - 2}" y="${top - 3}" width="${x1 - x0 + 10}" height="4" fill="${mat(o, c, "v")}"/>`;
        return svg(o, s);
      }
    },
    {
      id: "desktop-mini-rack", name: "Desktop mini rack", colors: ["#c9ccd1", "#1c1d20"], picker: true, colorLabel: "Frame",
      render(o) {
        const u = o.uid, c = o.color, x = 66, w = 66, y = 70, h = 76, dx = 14, dy = 10;
        let s = desk(o) + sh(o, x + w / 2 + 6, 147, 46, 4);
        const side = (sx) => `<path d="${rpoly4(sx, y, sx + dx, y - dy, h)}" fill="none" stroke="${mat(o, c, "h")}" stroke-width="5"/>`;
        s += side(x + w) + `<rect x="${x + 4}" y="${y + 2}" width="${w - 8}" height="${h - 4}" fill="#0b0c0f" opacity=".6"/>`;
        s += stack(o, x + 6, y + 6, w - 12, 8, [["patch"], ["sw"], ["blank"], ["shelf", 3], ["shelf", 2], ["pdu"]]);
        s += side(x) + `<path d="M${x + 8 + dx * .5} ${y - dy * .5 - 2}Q${x + w / 2 + dx * .5} ${y - dy * .5 - 14} ${x + w - 8 + dx * .5} ${y - dy * .5 - 2}" fill="none" stroke="${mat(o, c, "v")}" stroke-width="4" stroke-linecap="round"/>` +
          `<rect x="${x - 2}" y="${y - 2}" width="${w + 4}" height="4" rx="1.5" fill="${mat(o, c, "v")}"/><rect x="${x - 2}" y="${y + h - 2}" width="${w + 4}" height="4" rx="1.5" fill="${mat(o, c, "v")}"/>`;
        return svg(o, s);
      }
    },
    {
      id: "nas4", name: "4-bay NAS", colors: ["#1c1d20", "#eeeeec"], picker: true, colorLabel: "Finish",
      render(o) {
        const u = o.uid, c = o.color, x = 56, w = 80, h = 70, y = 76, dx = 22, dy = 18;
        let s = G(`<rect width="200" height="200" fill="url(#${u}-wall)"/>` + `<rect x="20" y="146" width="168" height="8" fill="${mat(o, "#b88a5c", "v")}"/><rect x="20" y="146" width="168" height="8" fill="url(#${u}-grain)"/><rect x="26" y="154" width="160" height="6" fill="url(#${u}-fls)"/>`) +
          box3(o, c, x, y, w, h, dx, dy, { gloss: .15, r: 3 });
        s += `<rect x="${x + 4}" y="${y + 4}" width="14" height="${h - 8}" rx="1.5" fill="${H().shade(c, -.12)}"/>` + `<circle cx="${x + 11}" cy="${y + h - 12}" r="3.4" fill="#2a2d33" stroke="#9aa0a8" stroke-width=".5"/>` + (o.on ? `<circle cx="${x + 11}" cy="${y + h - 12}" r="7" fill="url(#${u}-hb)"/><circle cx="${x + 11}" cy="${y + h - 12}" r="1.4" fill="#cfe8ff"/>` : "") +
          bl(o, x + 11, y + 12, "#45ff7a", 0, true) + bl(o, x + 11, y + 20, "#45ff7a", 1) + bl(o, x + 11, y + 28, "#45ff7a", 2);
        const tw = (w - 26) / 4;
        for (let i = 0; i < 4; i++) { const tx = x + 22 + i * tw; s += `<rect x="${n1(tx)}" y="${y + 4}" width="${n1(tw - 1.6)}" height="${h - 8}" rx="1" fill="url(#${u}-blk)"/><rect x="${n1(tx + tw * .25)}" y="${y + h - 16}" width="${n1(tw * .4)}" height="8" rx="1" fill="#000" opacity=".5"/>` + bl(o, tx + tw * .4, y + 9, i < 4 * o.level + .5 ? "#45ff7a" : "#ffb347", i + 3); }
        return svg(o, s);
      }
    },
    {
      id: "nas8", name: "8-bay NAS tower", colors: ["#1c1d20", "#2b2d31"], picker: true, colorLabel: "Finish",
      render(o) {
        const u = o.uid, c = o.color, x = 26, w = 140, h = 64, y = 82, dx = 18, dy = 16;
        let s = G(`<rect width="200" height="200" fill="url(#${u}-wall)"/><rect x="10" y="146" width="186" height="8" fill="${mat(o, "#b88a5c", "v")}"/><rect x="10" y="146" width="186" height="8" fill="url(#${u}-grain)"/><rect x="14" y="154" width="180" height="6" fill="url(#${u}-fls)"/>`) + box3(o, c, x, y, w, h, dx, dy, { gloss: .25, r: 3 });
        s += `<rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="12" rx="1.5" fill="${H().shade(c, .08)}"/><rect x="${x + w - 44}" y="${y + 6}" width="30" height="8" rx="1" fill="#05070a"/>` + (o.on ? `<rect x="${x + w - 42.5}" y="${y + 7.5}" width="27" height="5" fill="#1d4f9a"/><rect x="${x + w - 41}" y="${y + 8.6}" width="${n1(22 * Math.max(.1, o.level))}" height="1.2" fill="#cfe8ff"/><rect x="${x + w - 41}" y="${y + 10.8}" width="14" height="1" fill="#cfe8ff" opacity=".7"/>` : "") +
          `<circle cx="${x + w - 9}" cy="${y + 10}" r="2.6" fill="#2a2d33" stroke="#9aa0a8" stroke-width=".5"/>` + (o.on ? `<circle cx="${x + w - 9}" cy="${y + 10}" r="6" fill="url(#${u}-hb)"/>` : "") +
          bl(o, x + 10, y + 10, "#3fa9ff", 0, true) + bl(o, x + 16, y + 10, "#3fa9ff", 1) + bl(o, x + 22, y + 10, "#3fa9ff", 2) + `<rect x="${x + 30}" y="${y + 8}" width="8" height="4" rx="1" fill="#2a2d33"/>`;
        const tw = (w - 10) / 8;
        for (let i = 0; i < 8; i++) { const tx = x + 5 + i * tw; s += `<rect x="${n1(tx)}" y="${y + 19}" width="${n1(tw - 1.4)}" height="${h - 23}" rx="1" fill="url(#${u}-blk)"/><rect x="${n1(tx + tw * .2)}" y="${y + h - 14}" width="${n1(tw * .5)}" height="7" rx="1" fill="#000" opacity=".5"/><path d="M${n1(tx + 2)} ${y + 30}H${n1(tx + tw - 3.4)}M${n1(tx + 2)} ${y + 33}H${n1(tx + tw - 3.4)}" stroke="#fff" stroke-opacity=".08"/>` + bl(o, tx + tw * .3, y + 23, i < 8 * o.level + .5 ? "#3fa9ff" : "#ffb347", i + 3) + bl(o, tx + tw * .6, y + 23, "#3fa9ff", i, true); }
        return svg(o, s);
      }
    },
    {
      id: "gw1u", name: "1U gateway, touchscreen", colors: [US, "#1c1d20"], picker: true, colorLabel: "Rack",
      render(o) {
        const c = o.color, x = 16, w = 168, h = 28, y = 96;
        let s = wallFloor(o, 200, [8, 40, 184, 120]) + holes(o, 10, 60, 6, 90).replace(/#2b2d31/, H().shade(c, -.2)) + holes(o, 184, 60, 6, 90).replace(/#2b2d31/, H().shade(c, -.2));
        s += unit(o, "blank", x, y - 30, w, 28, 1, c) + box3(o, US, x, y, w, h, 12, 0, { gloss: .35 }) + unit(o, "gw", x, y, w, h + .6, 1) + unit(o, "upatch", x, y + 30, w, 28, 1);
        return svg(o, s);
      }
    },
    {
      id: "nvr2u", name: "2U video recorder, 4 bays", colors: [US, "#1c1d20"], picker: true, colorLabel: "Rack",
      render(o) {
        const c = o.color, x = 16, w = 168, y = 82;
        let s = wallFloor(o, 200, [8, 40, 184, 120]) + holes(o, 10, 50, 6, 104).replace(/#2b2d31/, H().shade(c, -.2)) + holes(o, 184, 50, 6, 104).replace(/#2b2d31/, H().shade(c, -.2));
        s += unit(o, "poe", x, y - 24, w, 24, 1) + box3(o, US, x, y, w, 48, 12, 0, { gloss: .35 }) + unit(o, "nvr", x, y, w, 24.3, 2) + unit(o, "blank", x, y + 50, w, 24, 1, c);
        return svg(o, s);
      }
    },
    {
      id: "desksw8", name: "8-port desk switch, shelf", colors: [US, "#1c1d20"], picker: true, colorLabel: "Body",
      render(o) {
        const u = o.uid, c = o.color, x = 50, w = 100, h = 22, y = 118, dx = 16, dy = 20;
        let s = G(`<rect width="200" height="200" fill="url(#${u}-wall)"/><rect x="18" y="140" width="170" height="8" fill="${mat(o, "#b88a5c", "v")}"/><rect x="18" y="140" width="170" height="8" fill="url(#${u}-grain)"/><rect x="22" y="148" width="164" height="6" fill="url(#${u}-fls)"/>`) + box3(o, c, x, y, w, h, dx, dy, { gloss: .35, r: 3 });
        const pw = 9;
        for (let i = 0; i < 8; i++) { const px = x + 14 + i * (pw + 1.6); s += `<rect x="${n1(px)}" y="${y + 9}" width="${pw}" height="8" rx=".8" fill="#1a1c20"/>` + (i < Math.round(8 * o.level) ? bl(o, px + pw / 2, y + 6, i % 3 ? "#e8f4ff" : "#3fa9ff", i) : ""); }
        s += `<circle cx="${x + 7}" cy="${y + 11}" r="2.6" fill="#0b0d12"/>` + (o.on ? `<circle cx="${x + 7}" cy="${y + 11}" r="2" fill="#3fa9ff"/>` : "") +
          [0, 1, 2, 3].map((i) => `<path d="M${x + 18 + i * 21} ${y + 17}C${x + 18 + i * 21} ${y + 30} ${x + 10 + i * 26} ${y + 34} ${x + 6 + i * 30} 200" stroke="${["#f3f3f1", "#2f74d0", "#f3f3f1", "#f2c230"][i]}" stroke-width="1.6" fill="none"/>`).join("");
        return svg(o, s);
      }
    },
    {
      id: "27-inch-office-monitor", name: "27-inch office monitor", colors: ["#c7cacf", "#1c1d20"], picker: true, colorLabel: "Finish",
      render(o) {
        const u = o.uid, c = o.color;
        let s = desk(o) + glow(o, 100, 70, 96, 60) + sh(o, 100, 152, 40, 4) + `<path d="M70 152L76 145H124L130 152Z" fill="${mat(o, c, "t")}"/><path d="M70 152H130V154H70Z" fill="${H().shade(c, -.3)}"/>`;
        s += `<rect x="93" y="100" width="14" height="46" rx="2" fill="${mat(o, c, "h")}"/><ellipse cx="100" cy="128" rx="3.4" ry="6" fill="#000" opacity=".5"/>`;
        s += `<rect x="28" y="28" width="144" height="83" rx="2" fill="#141519"/>` + screen(o, 30, 30, 140, 79, "desk") + `<rect x="28.5" y="28.5" width="143" height="82" rx="2" fill="none" stroke="#fff" stroke-opacity=".18"/>` + (o.on ? `<circle cx="165" cy="110" r="1" fill="#fff" opacity=".8"/>` : `<circle cx="165" cy="110" r="1" fill="#ffb347"/>`);
        return svg(o, s);
      }
    },
    {
      id: "34-inch-curved-monitor", name: "34-inch curved monitor", colors: ["#1c1d20", "#eeeeec"], picker: true, colorLabel: "Finish",
      render(o) {
        const u = o.uid, c = o.color;
        DEF.push(`<clipPath id="${u}-cv"><path d="M20 40Q100 47 180 40V104Q100 98 20 104Z"/></clipPath>`, lg(u + "-crv", 0, [[0, "#000", .4], [.2, "#000", 0], [.8, "#000", 0], [1, "#000", .4]]));
        let s = desk(o) + glow(o, 100, 74, 100, 54) + sh(o, 100, 152, 44, 4) + `<path d="M64 152Q100 140 136 152L132 154H68Z" fill="${mat(o, c, "t")}"/>`;
        s += `<rect x="94" y="100" width="12" height="46" rx="2" fill="${mat(o, c, "h")}"/>`;
        s += `<path d="M17 37Q100 45 183 37V107Q100 100 17 107Z" fill="${mat(o, c, "h")}"/><g clip-path="url(#${u}-cv)">${screen(o, 20, 38, 160, 68, "desk")}<rect x="20" y="38" width="160" height="68" fill="url(#${u}-crv)"/></g>` + (o.on ? `<circle cx="100" cy="104.5" r="1" fill="#fff" opacity=".7"/>` : "");
        return svg(o, s);
      }
    },
    {
      id: "49-inch-super-wide", name: "49-inch super-wide", colors: ["#f2f2f0", "#1c1d20"], picker: true, colorLabel: "Finish",
      render(o) {
        const u = o.uid, c = o.color;
        DEF.push(`<clipPath id="${u}-cv"><path d="M10 36Q100 58 190 36V100Q100 88 10 100Z"/></clipPath>`, lg(u + "-crv", 0, [[0, "#000", .5], [.22, "#000", 0], [.78, "#000", 0], [1, "#000", .5]]));
        let s = desk(o) + (o.on ? `<ellipse cx="100" cy="66" rx="40" ry="26" fill="url(#${u}-hb)" opacity=".5" class="${P}ring"/>` : "") + sh(o, 100, 152, 50, 4);
        s += `<path d="M60 152L80 144H120L140 152L130 153H70Z" fill="${mat(o, c, "t")}"/><rect x="93" y="94" width="14" height="52" rx="3" fill="${mat(o, c, "h")}"/>`;
        s += `<path d="M6 32Q100 56 194 32V104Q100 92 6 104Z" fill="${mat(o, c, "h")}"/><path d="M6 104Q100 92 194 104V107Q100 95 6 107Z" fill="${H().shade(c, -.2)}"/>` +
          `<path d="M9 35Q100 58 191 35V101Q100 89.6 9 101Z" fill="#0b0c0f"/><g clip-path="url(#${u}-cv)">${screen(o, 10, 36, 180, 64, "game")}<rect x="10" y="36" width="180" height="64" fill="url(#${u}-crv)"/></g>`;
        return svg(o, s);
      }
    },
    {
      id: "aluminum-27-inch-display", name: "Aluminum 27-inch display", colors: ["#c7cacf", "#9aa0a8"], picker: true, colorLabel: "Finish",
      render(o) {
        const u = o.uid, c = o.color;
        let s = desk(o) + glow(o, 100, 70, 96, 58) + sh(o, 104, 152, 34, 4) + `<path d="M84 152L88 140H112L120 152Z" fill="${mat(o, c, "t")}"/><path d="M84 152H120V153.6H84Z" fill="${H().shade(c, -.3)}"/><path d="M92 106L96 142H106L108 106Z" fill="${mat(o, c, "h")}"/>`;
        s += `<rect x="27" y="27" width="146" height="84" rx="3" fill="${mat(o, c, "v")}"/><rect x="28.4" y="28.4" width="143.2" height="81.2" rx="2.4" fill="#08090b"/>` + screen(o, 33, 33, 134, 72, "mac") + `<rect x="27.5" y="27.5" width="145" height="83" rx="3" fill="none" stroke="#fff" stroke-opacity=".35"/>`;
        return svg(o, s);
      }
    },
    {
      id: "portable", name: "Portable 15.6", colors: ["#4a4e56", "#1c1d20", "#c7cacf"], picker: true, colorLabel: "Finish",
      render(o) {
        const u = o.uid, c = o.color;
        let s = desk(o) + G(`<path d="M120 150L128 138H190L196 150Z" fill="#2a2d33"/><path d="M128 138L136 104H188L190 138Z" fill="#1c1d20"/><rect x="138" y="106" width="48" height="30" fill="#2a3242"/>`) +
          glow(o, 74, 96, 70, 40) + sh(o, 74, 150, 52, 3.5) + `<path d="M40 150L58 116H66L52 150Z" fill="${mat(o, H().shade(c, -.2), "v")}"/>`;
        s += `<g transform="rotate(-3 74 120)"><rect x="18" y="80" width="112" height="66" rx="2.5" fill="${mat(o, c, "v")}"/><rect x="20.5" y="82.5" width="107" height="61" rx="1.5" fill="#08090b"/>` + screen(o, 22, 84, 104, 58, "desk") + `</g>` +
          `<path d="M16 148L132 142" stroke="${H().shade(c, -.3)}" stroke-width="3" stroke-linecap="round"/>`;
        return svg(o, s);
      }
    }
  ];

  (window.HDA = window.HDA || []).push({
    id: "home4",
    tab: "Racks & monitors",
    group: "Home",
    kind: "device",
    levelLabel: "Activity / brightness",
    onWord: "On", offWord: "Off",
    intro: "Server racks for the home lab (8U open frame, 12U glass wall cabinet, 42U mesh cabinet, 25U 4-post rack, 10-inch mini rack, 4-bay NAS) and desk monitors (27-inch office, 34-inch curved, 49-inch super-wide, aluminum 27-inch, a portable screen). On racks the slider is activity: more port and drive lights blink, faster. On monitors it is screen brightness.",
    
    css: `
.hda-anim .hda-home4-bl{animation:hda-home4-bl 1s steps(2,end) infinite}
@keyframes hda-home4-bl{0%{opacity:1}100%{opacity:.15}}
.hda-anim .hda-home4-pan{animation:hda-home4-pan 6s ease-in-out infinite alternate}
@keyframes hda-home4-pan{from{transform:translate(0,0)}to{transform:translate(0,-3px)}}
.hda-anim .hda-home4-ring{animation:hda-home4-ring 4s ease-in-out infinite}
@keyframes hda-home4-ring{0%,100%{opacity:.3}50%{opacity:.6}}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-home4-bl,.hda-anim .hda-home4-pan,.hda-anim .hda-home4-ring{animation:none}}
`,
    icons
  });
})();
