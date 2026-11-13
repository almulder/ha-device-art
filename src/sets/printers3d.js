(function () {
  const P = "hda-printers3d-";
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
${lg(u + "-chrome", 1, [[0, "#fbfcfd"], [.4, "#9097a0"], [.6, "#e6e9ec"], [1, "#575d65"]])}${halo(u + "-tvg", "#8fb8ff", .7)}${halo(u + "-hw", "#ffffff", .9)}${halo(u + "-hg", "#3dff6a", .9)}${halo(u + "-hb", "#3fa9ff", .9)}${halo(u + "-hr", "#ff3b30", .9)}${halo(u + "-ha", "#ffb347", .9)}
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
  const B = 160;
  const FIL = ["#ff6a3d", "#3fae6a", "#2f74d0", "#f2c230", "#f3f3f1", "#1b1c1f"];
  const OR = "#f26a1b";
  function stage(o) {
    const u = o.uid;
    return G(`<rect width="200" height="200" fill="url(#${u}-wall)"/><path d="M0 142H200V176H0Z" fill="${mat(o, "#b88a5c", "v")}"/><path d="M0 142H200V176H0Z" fill="url(#${u}-grain)"/><rect y="142" width="200" height="1.2" fill="#fff" opacity=".25"/><rect y="176" width="200" height="5" fill="${mat(o, "#8a6440", "v")}"/><rect y="181" width="200" height="19" fill="url(#${u}-fls)"/>`);
  }
  function box3(o, c, x, y, w, h, dx, dy, op) {
    op = op || {};
    const t = `M${n1(x)} ${n1(y)}L${n1(x + dx)} ${n1(y - dy)}H${n1(x + w + dx)}L${n1(x + w)} ${n1(y)}Z`, sd = `M${n1(x + w)} ${n1(y)}L${n1(x + w + dx)} ${n1(y - dy)}V${n1(y + h - dy)}L${n1(x + w)} ${n1(y + h)}Z`;
    return sh(o, x + w / 2 + dx / 2, y + h, w * .62, 4) + `<path d="${t}" fill="${mat(o, H().shade(c, .08), "t")}"/>` + gl(o, t, op.gloss || .25) + `<path d="${sd}" fill="${mat(o, c, "s")}"/>` +
      `<rect x="${n1(x)}" y="${n1(y)}" width="${n1(w)}" height="${n1(h)}" rx="${op.r || 1.5}" fill="${mat(o, c, "v")}"/>` + gl(o, R(x, y, w, h), (op.gloss || .25) * .5) + `<path d="M${n1(x + .5)} ${n1(y + .4)}H${n1(x + w - .5)}" stroke="#fff" stroke-opacity=".35" stroke-width=".7"/>`;
  }
  const post = (o, x, y0, y1, op, c) => `<rect x="${x}" y="${y0}" width="6" height="${y1 - y0}" fill="${mat(o, c || "#9aa0a8", "h")}" opacity="${op || 1}"/><path d="M${x + 3} ${y0}V${y1}" stroke="#000" stroke-opacity=".35" stroke-width="1"/>`;
  function spool(o, cx, cy, r, c) {
    return `<circle cx="${cx}" cy="${cy}" r="${n1(r)}" fill="#1b1c1f"/><circle cx="${cx}" cy="${cy}" r="${n1(r * .86)}" fill="${mat(o, c, "r")}"/>` +
      `<circle cx="${cx}" cy="${cy}" r="${n1(r * .62)}" fill="none" stroke="#000" stroke-opacity=".18" stroke-width="${n1(r * .1)}"/><circle cx="${cx}" cy="${cy}" r="${n1(r * .32)}" fill="#2b2d31"/><circle cx="${cx}" cy="${cy}" r="${n1(r * .12)}" fill="#9aa0a8"/>`;
  }
  const bedglow = (o, q) => o.on ? `<path d="${M4(q[0], q[1], q[2], q[3])}" fill="none" stroke="#ff7a3a" stroke-opacity=".75" stroke-width="1.2"/><path d="${M4(q[0], q[1], q[2], q[3])}" fill="#ff5a1a" opacity=".1"/>` : "";
  const bed = (o, q, c) => `<path d="${M4(q[0], q[1], q[2], q[3])}" fill="${c || "#141518"}"/>` + bedglow(o, q);
  function head(o, x, y, c, small) {
    const k = small ? .7 : 1;
    return `<rect x="${n1(x - 8 * k)}" y="${n1(y)}" width="${n1(16 * k)}" height="${n1(13 * k)}" rx="1.5" fill="${c || "#2a2d33"}"/><circle cx="${n1(x)}" cy="${n1(y + 6 * k)}" r="${n1(4.2 * k)}" fill="#141518" stroke="#55585f" stroke-width=".6"/>` +
      `<path d="M${n1(x - 2 * k)} ${n1(y + 13 * k)}h${n1(4 * k)}l${n1(-2 * k)} ${n1(4 * k)}Z" fill="#c8a24a"/>` + (o.on ? `<circle cx="${n1(x)}" cy="${n1(y + 17 * k)}" r="5" fill="url(#${o.uid}-ha)"/>` : "");
  }
  function part(o, cx, by, w, hm, inv) {
    const u = o.uid, ph = Math.max(2, hm * o.level), id = u + "-cl" + (N++), lid = u + "-ly" + (N++);
    DEF.push(`<clipPath id="${id}"><rect x="${cx - w}" y="${n1(inv ? by : by - ph)}" width="${w * 2}" height="${n1(ph + 3)}"/></clipPath><pattern id="${lid}" width="4" height="1.6" patternUnits="userSpaceOnUse"><rect width="4" height=".5" fill="#000" fill-opacity=".2"/></pattern>`);
    const sg = inv ? 1 : -1;
    const d = `M${n1(cx - w * .5)} ${by}C${n1(cx - w * .64)} ${n1(by + sg * hm * .35)} ${n1(cx - w * .3)} ${n1(by + sg * hm * .55)} ${n1(cx - w * .28)} ${n1(by + sg * hm * .75)}L${n1(cx - w * .36)} ${n1(by + sg * hm)}H${n1(cx + w * .36)}L${n1(cx + w * .28)} ${n1(by + sg * hm * .75)}C${n1(cx + w * .3)} ${n1(by + sg * hm * .55)} ${n1(cx + w * .64)} ${n1(by + sg * hm * .35)} ${n1(cx + w * .5)} ${by}Z`;
    return (o.on ? `<path d="${d}" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width=".7" stroke-dasharray="2 2"/>` : "") +
      `<g clip-path="url(#${id})"><path d="${d}" fill="${mat(o, o.color, "h")}"/><path d="${d}" fill="url(#${lid})"/></g>` +
      (o.on && !inv ? `<path d="M${n1(cx - w * .42)} ${n1(by - ph)}H${n1(cx + w * .42)}" stroke="#ffd29a" stroke-width="1.1" class="${P}layer"/>` : "");
  }
  const scr = (o, x, y, w, h, c) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="1" fill="#0b0d12"/>` + (o.on ? `<rect x="${x + 1.2}" y="${y + 1.2}" width="${w - 2.4}" height="${h - 2.4}" fill="${c || "#2f6fd6"}" opacity=".85"/><rect x="${x + 2}" y="${y + h - 3.4}" width="${n1((w - 4) * o.level)}" height="1.4" fill="#fff"/>` : "");
  const glass = (o, x, y, w, h, t) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${t || "#a9c8e0"}" opacity=".16"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${o.uid}-ref)"/>`;
  const inl = (o, x, y, w, h) => { if (!o.on) return ""; DEF.push(lg(o.uid + "-inl", 1, [[0, "#fff4dc", .4], [1, "#fff4dc", 0]])); return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${o.uid}-inl)"/>`; };
  const tube = (d, c) => `<path d="${d}" fill="none" stroke="#7f8790" stroke-width="2" opacity=".7"/><path d="${d}" fill="none" stroke="${c}" stroke-width="1" opacity=".9"/>`;

  function lineup(o, key, box) {
    const pv = (window.HDAPV || {})[key], d = pv ? pv[2].draw : (window.HDAPA || {})[key];
    if (!d) return svg(o, stage(o) + `<rect x="60" y="80" width="80" height="60" rx="6" fill="#000" opacity=".25"/>`);
    const cols = key === "changer" ? [o.color, "#f97316", "#facc15", "#22c55e", "#06b6d4", "#3b82f6", "#8b5cf6", "#f8fafc", "#111827"] : [o.color, "#f8fafc", "#2563eb", "#16a34a"];
    let a = d({ pct: Math.round(o.level * 100), run: !!o.on, off: false, colors: cols, act: o.color, tool: 4, hotend: 2 });
    a = a.replace(/<svg /, `<svg x="${box[0]}" y="${box[1]}" width="${box[2]}" height="${box[3]}" `).replace(/preserveAspectRatio="[^"]*"/, 'preserveAspectRatio="xMidYMax meet"');
    return svg(o, stage(o) + `<g class="${o.on ? P + "run" : ""}">${a}</g>`);
  }
  const LB = (id, name, key, box) => ({ id, name, colors: FIL, picker: true, colorLabel: "Filament", render(o) { return lineup(o, key, box); } });
  const BOX = [16, 6, 168, 156], WIDE = [6, 22, 188, 142];

  const icons = [
    LB("box-lidar", "Core-XY box, lidar head", "boxa", BOX),
    LB("box-solid", "Core-XY box, solid sides", "boxb", BOX),
    LB("box-gen2", "Core-XY box, new spool unit", "boxc", BOX),
    LB("pro-two", "Pro box, two nozzles", "prod", BOX),
    LB("large-two", "Large box, two nozzles", "bigd", BOX),
    LB("large-one", "Large box, one nozzle", "bigs", BOX),
    LB("large-rack", "Large box, nozzle rack", "bigr", BOX),
    LB("changer9", "Tool-changer box, 9 colors", "changer", BOX),
    LB("slinger-side", "Open bed-slinger, side spools", "slinger", WIDE),
    LB("slinger-mini", "Mini bed-slinger, side spools", "slingermini", [14, 34, 172, 130]),
    LB("slinger-large", "Large bed-slinger, side spools", "slingerl", WIDE),
    {
      id: "slinger-orange", name: "Open bed-slinger, orange parts", colors: FIL, picker: true, colorLabel: "Filament",
      render(o) {
        const c = o.color, by = B - 24, hm = 44, ph = hm * Math.max(.04, o.level), bar = by - ph - 14;
        let s = stage(o) + box3(o, "#1f2125", 40, B - 14, 116, 14, 10, 12, { gloss: .2 });
        s += spool(o, 100, 14, 12, c) + `<rect x="94" y="24" width="12" height="4" fill="#1f2125"/>`;
        s += `<g class="${o.on ? P + "bedy" : ""}">` + bed(o, [[56, B - 15], [142, B - 15], [150, B - 27], [64, B - 27]], "#3a3226") + `<path d="${M4([60, B - 16], [138, B - 16], [145, B - 26], [67, B - 26])}" fill="#c7a256" opacity=".55"/>` + part(o, 103, by, 26, hm) + `</g>`;
        s += post(o, 48, 30, B - 14, 1, "#2b2d31") + post(o, 146, 30, B - 14, 1, "#2b2d31") + `<rect x="48" y="26" width="104" height="7" fill="${mat(o, "#2b2d31", "v")}"/>` +
          `<rect x="44" y="26" width="12" height="10" rx="1.5" fill="${OR}"/><rect x="144" y="26" width="12" height="10" rx="1.5" fill="${OR}"/>`;
        s += `<rect x="54" y="${n1(bar)}" width="92" height="5" fill="${mat(o, "#9aa0a8", "v")}"/><g class="${o.on ? P + "hx1" : ""}">${head(o, 103, bar - 4, OR)}<rect x="96" y="${n1(bar - 10)}" width="14" height="7" rx="1" fill="${OR}"/></g>`;
        s += `<path d="M100 26C100 ${n1(bar - 20)} 108 ${n1(bar - 16)} 103 ${n1(bar - 10)}" stroke="${c}" stroke-width="1" fill="none"/>` + `<path d="M42 ${B - 4}L46 ${B - 13}H66L62 ${B - 4}Z" fill="#1b1c1f"/>` + scr(o, 47, B - 12, 15, 7, "#d86a2a");
        return svg(o, s);
      }
    },
    {
      id: "corexy-orange", name: "Enclosed core-XY, orange corners", colors: FIL, picker: true, colorLabel: "Filament",
      render(o) {
        const c = o.color, x = 50, w = 100, h = 92, y = B - h, by = B - 18;
        let s = stage(o) + spool(o, x + w + 14, y + 40, 11, c) + box3(o, "#2b2d31", x, y, w, h, 12, 16, { gloss: .15 });
        s += `<rect x="${x + 6}" y="${y + 8}" width="${w - 12}" height="${h - 22}" fill="#0c0d10"/>` + inl(o, x + 6, y + 8, w - 12, h - 22);
        s += bed(o, [[x + 14, by], [x + w - 14, by], [x + w - 8, by - 8], [x + 20, by - 8]]) + part(o, x + w / 2, by - 1, 24, 40);
        s += `<rect x="${x + 8}" y="${y + 14}" width="${w - 16}" height="4" fill="#3a3d44"/><g class="${o.on ? P + "hx2" : ""}">${head(o, x + w / 2, y + 12, OR)}</g>`;
        s += glass(o, x + 6, y + 8, w - 12, h - 22) + `<rect x="${x}" y="${y}" width="5" height="${h}" fill="${OR}"/><rect x="${x + w - 5}" y="${y}" width="5" height="${h}" fill="${OR}"/><path d="M${x + w} ${y}L${x + w + 12} ${y - 16}" stroke="${OR}" stroke-width="4"/>` +
          scr(o, x + 10, y + h - 12, 20, 9, "#d86a2a") + `<rect x="${x + w - 30}" y="${y + h - 9}" width="18" height="3" rx="1.5" fill="#55585f"/>`;
        return svg(o, s);
      }
    },
    {
      id: "toolchanger", name: "Tool-changer, five heads", colors: FIL, picker: true, colorLabel: "Filament",
      render(o) {
        const c = o.color, by = B - 18, hm = 52, ph = hm * Math.max(.04, o.level), bar = by - ph - 14, cols = [c, "#f3f3f1", "#2f74d0", "#3fae6a", "#1b1c1f"];
        let s = stage(o) + post(o, 38, 22, B - 24, .7, "#2b2d31") + post(o, 176, 22, B - 24, .7, "#2b2d31") + `<path d="M30 22L44 8H182L170 22Z" fill="none" stroke="#2b2d31" stroke-width="4"/>`;
        cols.forEach((k, i) => { const tx = 62 + i * 21; s += tube(`M${tx} 30C${tx} 12 ${tx + 8} 4 ${tx + 10} 0`, k) + `<rect x="${tx - 6}" y="26" width="12" height="11" rx="1.5" fill="#1f2125"/><rect x="${tx - 4}" y="28" width="8" height="3" fill="${OR}"/>`; });
        s += box3(o, "#1f2125", 20, B - 12, 160, 12, 12, 14, { gloss: .2 }) + bed(o, [[30, B - 13], [168, B - 13], [178, B - 25], [40, B - 25]]) + part(o, 102, by, 34, hm);
        s += post(o, 24, 20, B - 12, 1, "#2b2d31") + post(o, 170, 20, B - 12, 1, "#2b2d31") + `<rect x="24" y="18" width="152" height="5" fill="${mat(o, "#2b2d31", "v")}"/>`;
        s += `<rect x="28" y="${n1(bar)}" width="144" height="5" fill="${mat(o, "#2b2d31", "v")}"/><g class="${o.on ? P + "hx2" : ""}">${head(o, 102, bar - 3)}</g>` + scr(o, 90, B - 10, 20, 7, "#d86a2a");
        return svg(o, s);
      }
    },
    {
      id: "bigbox-hub", name: "Big enclosed box, spool hub", colors: FIL, picker: true, colorLabel: "Filament",
      render(o) {
        const c = o.color, x = 40, w = 116, h = 100, y = B - h, by = B - 18;
        let s = stage(o) + box3(o, "#a9afb7", x, y, w, h, 14, 18, { gloss: .3 });
        s += `<rect x="${x + 6}" y="${y + 10}" width="${w - 12}" height="${h - 18}" fill="#0c0d10"/>` + inl(o, x + 6, y + 10, w - 12, h - 18);
        s += bed(o, [[x + 14, by], [x + w - 14, by], [x + w - 8, by - 8], [x + 20, by - 8]]) + part(o, x + w / 2, by - 1, 28, 50);
        s += `<rect x="${x + 8}" y="${y + 16}" width="${w - 16}" height="4" fill="#3a3d44"/><g class="${o.on ? P + "hx2" : ""}">${head(o, x + w / 2, y + 14)}</g>`;
        s += glass(o, x + 6, y + 10, w - 12, h - 18) + `<rect x="${x + 6}" y="${y + 10}" width="${w - 12}" height="${h - 18}" fill="none" stroke="#1b1c1f" stroke-width="2"/>` + scr(o, x + 8, y + 2, 22, 6, "#3fd1c8");
        const ay = y - 22;
        s += box3(o, "#8e949b", x + 10, ay, w - 20, 18, 12, 12, { gloss: .3 }) + `<rect x="${x + 14}" y="${ay + 3}" width="${w - 28}" height="12" rx="2" fill="#0b0d12"/>`;
        [c, "#f3f3f1", "#1b1c1f", "#3fae6a"].forEach((k, i) => { s += spool(o, x + 26 + i * 21, ay + 9, 5.6, k); });
        return svg(o, s + `<rect x="${x + 14}" y="${ay + 3}" width="${w - 28}" height="12" rx="2" fill="url(#${o.uid}-ref)"/>`);
      }
    },
    {
      id: "slinger-gray", name: "Open bed-slinger, side screen", colors: FIL, picker: true, colorLabel: "Filament",
      render(o) {
        const c = o.color, by = B - 24, hm = 44, ph = hm * Math.max(.04, o.level), bar = by - ph - 14;
        let s = stage(o) + box3(o, "#3a3d44", 38, B - 14, 120, 14, 10, 12, { gloss: .25 });
        s += `<g class="${o.on ? P + "bedy" : ""}">` + bed(o, [[54, B - 15], [140, B - 15], [148, B - 27], [62, B - 27]]) + part(o, 101, by, 26, hm) + `</g>`;
        s += post(o, 48, 34, B - 14, 1, "#8e949b") + post(o, 142, 34, B - 14, 1, "#8e949b") + `<rect x="48" y="30" width="100" height="6" fill="${mat(o, "#c9ccd1", "v")}"/>` + spool(o, 128, 18, 11, c);
        s += `<rect x="52" y="${n1(bar)}" width="92" height="6" fill="${mat(o, "#c9ccd1", "v")}"/><g class="${o.on ? P + "hx1" : ""}">${head(o, 101, bar - 4, "#2a2d33")}</g>` + tube(`M128 29C130 ${n1(bar - 20)} 104 ${n1(bar - 18)} 101 ${n1(bar - 4)}`, c);
        s += `<rect x="150" y="${B - 30}" width="16" height="22" rx="2" fill="#1b1c1f"/>` + scr(o, 152, B - 28, 12, 16, "#2f6fd6");
        return svg(o, s);
      }
    },
    {
      id: "box-dark", name: "Enclosed box, dark gray", colors: FIL, picker: true, colorLabel: "Filament",
      render(o) {
        const c = o.color, x = 54, w = 92, h = 86, y = B - h, by = B - 16;
        let s = stage(o) + `<ellipse cx="${x + w + 8}" cy="${y + 36}" rx="5" ry="13" fill="${mat(o, c, "v")}"/>` + box3(o, "#3a3d44", x, y, w, h, 12, 16, { gloss: .2, r: 4 });
        s += `<rect x="${x + 6}" y="${y + 6}" width="${w - 12}" height="${h - 20}" rx="2" fill="#0c0d10"/>` + inl(o, x + 6, y + 6, w - 12, h - 20);
        s += bed(o, [[x + 14, by], [x + w - 14, by], [x + w - 9, by - 7], [x + 19, by - 7]]) + part(o, x + w / 2, by - 1, 22, 36);
        s += `<rect x="${x + 8}" y="${y + 12}" width="${w - 16}" height="3.4" fill="#55585f"/><g class="${o.on ? P + "hx3" : ""}">${head(o, x + w / 2, y + 11)}</g>`;
        s += glass(o, x + 6, y + 6, w - 12, h - 20, "#6f8090") + `<rect x="${x + 6}" y="${y + 6}" width="${w - 12}" height="${h - 20}" rx="2" fill="none" stroke="#1b1c1f" stroke-width="2"/>` + scr(o, x + w / 2 - 12, y + h - 11, 24, 8, "#3fd1c8");
        return svg(o, s);
      }
    },
    {
      id: "resin-smoke", name: "Resin printer, smoky lid", colors: FIL, picker: true, colorLabel: "Resin",
      render(o) { return svg(o, resin(o, { lid: "#4a525c", lidA: .5, base: "#2b2d31", scr: "#3fa9ff", tall: 92 })); }
    },
    {
      id: "resin-orange", name: "Resin printer, orange cover", colors: FIL, picker: true, colorLabel: "Resin",
      render(o) { return svg(o, resin(o, { lid: "#ff7a1a", lidA: .42, base: "#d9dbdf", scr: "#f2f2f0", tall: 104, round: true })); }
    },
    {
      id: "kit-corexy", name: "Kit core-XY, red accents", colors: FIL, picker: true, colorLabel: "Filament",
      render(o) {
        const c = o.color, x = 46, w = 106, h = 96, y = B - h - 8, by = B - 22, RED = "#d6322e";
        let s = stage(o) + box3(o, "#1b1c1f", x - 2, B - 8, w + 4, 8, 12, 14, { gloss: .2 });
        s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#0c0d10" opacity=".55"/>` + inl(o, x, y, w, h);
        s += bed(o, [[x + 12, by], [x + w - 12, by], [x + w - 6, by - 8], [x + 18, by - 8]]) + part(o, x + w / 2, by - 1, 26, 40);
        const gy = y + 12 + 26 * (1 - o.level);
        s += `<rect x="${x + 4}" y="${n1(gy)}" width="${w - 8}" height="4" fill="#2b2d31"/><g class="${o.on ? P + "hx2" : ""}">${head(o, x + w / 2, gy - 2, RED)}</g>`;
        s += post(o, x - 3, y, B - 8, 1, "#2b2d31") + post(o, x + w - 3, y, B - 8, 1, "#2b2d31") + `<rect x="${x - 3}" y="${y - 3}" width="${w + 6}" height="5" fill="${mat(o, "#2b2d31", "v")}"/><path d="M${x + w + 3} ${y - 1}L${x + w + 14} ${y - 14}V${B - 22}" stroke="#2b2d31" stroke-width="4" fill="none"/>`;
        [[x - 4, y - 4], [x + w - 6, y - 4], [x - 4, B - 16], [x + w - 6, B - 16]].forEach((p) => { s += `<rect x="${p[0]}" y="${p[1]}" width="10" height="10" rx="1.5" fill="${RED}"/>`; });
        s += glass(o, x + 3, y + 2, w - 6, h - 4, "#cfe3f0") + `<path d="${M4([x - 2, y - 3], [x + 10, y - 16], [x + w + 14, y - 16], [x + w + 2, y - 3])}" fill="#cfe3f0" opacity=".14"/>` + scr(o, x + w / 2 - 10, B - 7, 20, 6, "#3fd1c8");
        return svg(o, s);
      }
    }
  ];
  function resin(o, k) {
    const u = o.uid, c = o.color, x = 64, w = 72, by = B - 22, ph = 30 * Math.max(.06, o.level), py = by - 10 - ph - 6, T = k.tall;
    let s = stage(o) + box3(o, k.base, x, by, w, 22, 10, 14, { gloss: .3, r: k.round ? 6 : 1.5 });
    s += k.round ? `<rect x="${x + w - 26}" y="${by + 5}" width="20" height="12" rx="1.5" fill="#0b0d12"/>` + (o.on ? `<rect x="${x + w - 24.5}" y="${by + 6.5}" width="17" height="9" fill="#2f6fd6" opacity=".85"/>` : "") : `<rect x="${x + 8}" y="${by + 5}" width="28" height="12" rx="1" fill="#0b0d12"/>` + (o.on ? `<rect x="${x + 10}" y="${by + 7}" width="24" height="8" fill="${k.scr}" opacity=".85"/>` : "");
    s += `<rect x="${x + 33}" y="${by - T + 6}" width="5" height="${T - 10}" fill="${mat(o, "#9aa0a8", "h")}"/>`;
    s += `<path d="${M4([x + 12, by - 1], [x + w - 10, by - 1], [x + w - 4, by - 10], [x + 18, by - 10])}" fill="#c9ccd1"/><path d="${M4([x + 15, by - 2.5], [x + w - 13, by - 2.5], [x + w - 8, by - 8.5], [x + 20, by - 8.5])}" fill="${c}" opacity=".85"/>` +
      (o.on ? `<ellipse cx="${x + w / 2 + 3}" cy="${by - 5}" rx="26" ry="6" fill="#b06cff" opacity=".5" class="${P}uv"/>` : "");
    DEF.push(`<pattern id="${u}-lay" width="4" height="1.6" patternUnits="userSpaceOnUse"><rect width="4" height=".5" fill="#000" fill-opacity=".18"/></pattern>`);
    s += `<g class="${o.on ? P + "plz" : ""}"><rect x="${x + 33}" y="${n1(py - 4)}" width="10" height="6" fill="#55585f"/><path d="${M4([x + 16, py], [x + w - 14, py], [x + w - 10, py - 5], [x + 20, py - 5])}" fill="url(#${u}-chrome)"/>` +
      `<path d="M${x + 26} ${n1(py + 1)}h${w - 48}l-4 ${n1(ph)}h${-(w - 56)}Z" fill="${mat(o, c, "h")}" opacity=".95"/><path d="M${x + 26} ${n1(py + 1)}h${w - 48}l-4 ${n1(ph)}h${-(w - 56)}Z" fill="url(#${u}-lay)"/></g>`;
    const r = k.round ? 8 : 0, f = `M${x + 2} ${by}V${by - T + r}Q${x + 2} ${by - T} ${x + 2 + r} ${by - T}H${x + w - 2 - r}Q${x + w - 2} ${by - T} ${x + w - 2} ${by - T + r}V${by}Z`;
    s += `<path d="${f}" fill="${k.lid}" opacity="${k.lidA}"/><path d="${M4([x + 2 + r, by - T], [x + 12 + r, by - T - 12], [x + w + 8 - r, by - T - 12], [x + w - 2 - r, by - T])}" fill="${H().shade(k.lid, .15)}" opacity="${k.lidA + .1}"/>` +
      `<path d="${M4([x + w - 2, by], [x + w + 8, by - 12], [x + w + 8, by - T - 12 + r], [x + w - 2, by - T + r])}" fill="${H().shade(k.lid, -.25)}" opacity="${k.lidA}"/>` + gl(o, f, .45) + `<path d="M${x + 2 + r} ${by - T}H${x + w - 2 - r}" stroke="#fff" stroke-opacity=".45"/>`;
    return s;
  }

  (window.HDA = window.HDA || []).push({
    id: "printers3d",
    tab: "3D printers",
    group: "Home",
    kind: "device",
    levelLabel: "Progress",
    onWord: "Printing", offWord: "Idle",
    intro: "Twenty 3D printers on a desk: the eleven approved lineup drawings (loaded from printer-cards) plus nine more forms: an orange-part bed-slinger, an orange-cornered core-XY, a five-head tool-changer, a big box with a spool hub, a side-screen bed-slinger, a dark enclosed box, two resin printers and a red-accent kit build. The slider is print progress: the part grows, the head moves, the bed glows and the resin plate lifts. The color is the filament (or resin).",
    
    css: `
.hda-anim .hda-printers3d-run .pa-head{animation:hda-printers3d-pahead 2.4s ease-in-out infinite alternate}
@keyframes hda-printers3d-pahead{from{transform:translateX(-22px)}to{transform:translateX(22px)}}
.hda-anim .hda-printers3d-hx1{animation:hda-printers3d-hx1 2.2s ease-in-out infinite alternate}
@keyframes hda-printers3d-hx1{from{transform:translate(-14px,0)}to{transform:translate(14px,0)}}
.hda-anim .hda-printers3d-hx2{animation:hda-printers3d-hx2 2.6s ease-in-out infinite alternate}
@keyframes hda-printers3d-hx2{from{transform:translate(-26px,0)}to{transform:translate(26px,0)}}
.hda-anim .hda-printers3d-hx3{animation:hda-printers3d-hx3 2.4s ease-in-out infinite alternate}
@keyframes hda-printers3d-hx3{from{transform:translate(-18px,0)}to{transform:translate(18px,0)}}
.hda-anim .hda-printers3d-bedy{animation:hda-printers3d-bedy 2.8s ease-in-out infinite alternate}
@keyframes hda-printers3d-bedy{from{transform:translate(-2px,3px)}to{transform:translate(2px,-3px)}}
.hda-anim .hda-printers3d-plz{animation:hda-printers3d-plz 3.4s ease-in-out infinite}
@keyframes hda-printers3d-plz{0%,100%{transform:translate(0,0)}50%{transform:translate(0,-8px)}}
.hda-anim .hda-printers3d-uv{animation:hda-printers3d-uv 3.4s steps(2,end) infinite}
@keyframes hda-printers3d-uv{0%{opacity:.6}100%{opacity:0}}
.hda-anim .hda-printers3d-layer{animation:hda-printers3d-layer 1.2s ease-in-out infinite}
@keyframes hda-printers3d-layer{0%,100%{opacity:1}50%{opacity:.3}}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-printers3d-run .pa-head,.hda-anim .hda-printers3d-hx1,.hda-anim .hda-printers3d-hx2,.hda-anim .hda-printers3d-hx3,.hda-anim .hda-printers3d-bedy,.hda-anim .hda-printers3d-plz,.hda-anim .hda-printers3d-uv,.hda-anim .hda-printers3d-layer{animation:none}}
`,
    icons
  });
})();
