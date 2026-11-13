(function () {
  const P = "hda-printers-";
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
${lg(u + "-photo", 1, [[0, "#5aa8f5"], [.6, "#ffd29a"], [1, "#ff9a5a"]])}${halo(u + "-tvg", "#8fb8ff", .7)}${halo(u + "-hw", "#ffffff", .9)}${halo(u + "-hg", "#3dff6a", .9)}${halo(u + "-hb", "#3fa9ff", .9)}${halo(u + "-hr", "#ff3b30", .9)}${halo(u + "-ha", "#ffb347", .9)}
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

  const B = 160;
  const CMYK = ["#1fb3ea", "#e8358f", "#f5d020", "#1b1b1d"], AMB = "#ffb347";
  const G = (s) => s ? `<g class="hda-bg">${s}</g>` : "";
  function stage(o) { return G(stage0(o)); }
  function stage0(o) {
    const u = o.uid;
    return `<rect width="200" height="200" fill="url(#${u}-wall)"/><rect x="150" y="18" width="38" height="28" fill="#e9e4d8" opacity=".85"/><rect x="154" y="22" width="14" height="9" fill="#f5d36a"/><rect x="170" y="24" width="14" height="9" fill="#9ad0f0"/><rect x="156" y="34" width="22" height="2" fill="#9a9a9a"/>` +
      `<path d="M0 142H200V176H0Z" fill="${mat(o, "#b88a5c", "v")}"/><path d="M0 142H200V176H0Z" fill="url(#${u}-grain)"/><rect y="142" width="200" height="1.2" fill="#fff" opacity=".25"/>` +
      `<rect y="176" width="200" height="5" fill="${mat(o, "#8a6440", "v")}"/><rect y="181" width="200" height="19" fill="url(#${u}-fls)"/>`;
  }
  function box3(o, c, x, y, w, h, dx, dy, op) {
    op = op || {};
    const t = `M${n1(x)} ${n1(y)}L${n1(x + dx)} ${n1(y - dy)}H${n1(x + w + dx)}L${n1(x + w)} ${n1(y)}Z`, sd = `M${n1(x + w)} ${n1(y)}L${n1(x + w + dx)} ${n1(y - dy)}V${n1(y + h - dy)}L${n1(x + w)} ${n1(y + h)}Z`;
    return sh(o, x + w / 2 + dx / 2, y + h, w * .62, 4) + `<path d="${t}" fill="${mat(o, H().shade(c, .08), "t")}"/>` + gl(o, t, op.gloss || .25) + `<path d="${sd}" fill="${mat(o, c, "s")}"/>` +
      `<rect x="${n1(x)}" y="${n1(y)}" width="${n1(w)}" height="${n1(h)}" rx="${op.r || 1.5}" fill="${mat(o, c, "v")}"/>` + gl(o, R(x, y, w, h), (op.gloss || .25) * .5) + `<path d="M${n1(x + .5)} ${n1(y + .4)}H${n1(x + w - .5)}" stroke="#fff" stroke-opacity=".35" stroke-width=".7"/>`;
  }
  const dk = (c, a) => H().shade(c, a || -.2);
  const two = (c) => c === "#8e939a" ? "#2b2d31" : c;
  function status(o, x, y) {
    const low = o.level < .25;
    if (!o.on) return `<circle cx="${x}" cy="${y}" r="1.1" fill="#3a4a3a" opacity=".8"/>` + (low ? `<circle cx="${x + 5}" cy="${y}" r="1.1" fill="${AMB}" opacity=".45"/>` : "");
    return `<g class="${P}blink"><circle cx="${x}" cy="${y}" r="4.5" fill="url(#${o.uid}-hg)"/><circle cx="${x}" cy="${y}" r="1.2" fill="#6dff94"/></g>` + (low ? `<circle cx="${x + 5}" cy="${y}" r="4.5" fill="url(#${o.uid}-ha)"/><circle cx="${x + 5}" cy="${y}" r="1.2" fill="${AMB}"/>` : "");
  }
  function gauge(o, x, y, cols, bw, bh) {
    bw = bw || 3; bh = bh || 9;
    const low = o.level < .25, f = Math.max(.06, o.level);
    let s = `<rect x="${x - 1.5}" y="${y - 1.5}" width="${n1(cols.length * (bw + 1.6) + 1.4)}" height="${bh + 3}" rx="1" fill="#0b0d12"/>`;
    cols.forEach((c, i) => {
      const bx = x + i * (bw + 1.6), fh = bh * f;
      s += `<rect x="${n1(bx)}" y="${y}" width="${bw}" height="${bh}" fill="#2a2d33"/><rect x="${n1(bx)}" y="${n1(y + bh - fh)}" width="${bw}" height="${n1(fh)}" fill="${low ? AMB : c}" opacity="${o.on ? 1 : .55}"/>`;
    });
    return s;
  }
  function page(o, q, dir, colored, clip) {
    if (!o.on) return "";
    const u = o.uid, id = u + "-pc" + (N++);
    if (clip) DEF.push(`<clipPath id="${id}"><path d="${clip}"/></clipPath>`);
    const L = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
    const at = (uu, vv) => L(L(q[0], q[1], uu), L(q[3], q[2], uu), vv);
    let s = `<path d="${M4(q[0], q[1], q[2], q[3])}" fill="#fbfbf8"/><path d="${M4(q[0], q[1], q[2], q[3])}" fill="none" stroke="#000" stroke-opacity=".18" stroke-width=".5"/>`;
    const rows = dir === "u" || dir === "r" ? [.2, .35, .5, .65, .8] : [.2, .32, .44, .56, .68, .8];
    rows.forEach((v, i) => { const a = at(.12, v), z = at(colored && v < .55 ? .5 : (i % 3 === 2 ? .6 : .86), v); s += `<path d="M${n1(a[0])} ${n1(a[1])}L${n1(z[0])} ${n1(z[1])}" stroke="#2a2b30" stroke-opacity=".7" stroke-width=".9"/>`; });
    if (colored) s += `<path d="${M4(at(.56, .14), at(.88, .14), at(.88, .5), at(.56, .5))}" fill="url(#${u}-photo)"/><path d="${M4(at(.56, .38), at(.88, .3), at(.88, .5), at(.56, .5))}" fill="#3f9a4a"/>`;
    return `<g ${clip ? `clip-path="url(#${id})"` : ""}><g class="${P}p${dir}">${s}</g></g>`;
  }
  function carriage(o, x, y, w, h) {
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="1" fill="#0b0c10"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="1" fill="url(#${o.uid}-ref)"/><path d="M${x + 2} ${y + h * .55}H${x + w - 2}" stroke="#55585f" stroke-width=".8"/>` +
      `<g class="${o.on ? P + "carr" : ""}" style="--w:${w - 12}px"><rect x="${x + 2}" y="${y + 1}" width="10" height="${h - 2}" rx="1" fill="#3a3d44"/><rect x="${x + 3}" y="${y + 2}" width="3" height="${h - 4}" fill="${CMYK[0]}" opacity=".8"/><rect x="${x + 7}" y="${y + 2}" width="3" height="${h - 4}" fill="#1b1b1d"/></g>`;
  }
  function trayF(o, x0, x1, ys, ye, spread, c, colored) {
    const q = [[x0 + 4, ys + 1], [x1 - 4, ys + 1], [x1 - 4 + spread, ye - 2], [x0 + 4 - spread, ye - 2]];
    return `<path d="${M4([x0, ys], [x1, ys], [x1 + spread, ye], [x0 - spread, ye])}" fill="${mat(o, dk(c, .06), "t")}"/>` + `<path d="M${x0 - spread} ${ye}H${x1 + spread}" stroke="#000" stroke-opacity=".3"/>` +
      page(o, q, "f", colored, `M${x0 - 20} ${ys}H${x1 + 20}V${ye + 10}H${x0 - 20}Z`) + `<rect x="${x0}" y="${ys - 2.2}" width="${x1 - x0}" height="2.4" rx="1" fill="#050608"/>`;
  }

  const FIL = ["#ff6a3d", "#3fae6a", "#2f74d0", "#f2c230", "#f3f3f1", "#1b1c1f"];
  const post = (o, x, y0, y1, op) => `<rect x="${x}" y="${y0}" width="6" height="${y1 - y0}" fill="${mat(o, "#9aa0a8", "h")}" opacity="${op || 1}"/><path d="M${x + 3} ${y0}V${y1}" stroke="#000" stroke-opacity=".35" stroke-width="1"/>`;
  function spool(o, cx, cy, r, c) {
    return `<circle cx="${cx}" cy="${cy}" r="${n1(r)}" fill="#1b1c1f"/><circle cx="${cx}" cy="${cy}" r="${n1(r * .86)}" fill="${mat(o, c, "r")}"/>` +
      `<circle cx="${cx}" cy="${cy}" r="${n1(r * .62)}" fill="none" stroke="#000" stroke-opacity=".18" stroke-width="${n1(r * .1)}"/><circle cx="${cx}" cy="${cy}" r="${n1(r * .32)}" fill="#2b2d31"/><circle cx="${cx}" cy="${cy}" r="${n1(r * .12)}" fill="#9aa0a8"/>`;
  }
  const bedglow = (o, q) => o.on ? `<path d="${M4(q[0], q[1], q[2], q[3])}" fill="none" stroke="#ff7a3a" stroke-opacity=".75" stroke-width="1.2"/><path d="${M4(q[0], q[1], q[2], q[3])}" fill="#ff5a1a" opacity=".1"/>` : "";
  function head(o, x, y, small) {
    const k = small ? .7 : 1;
    return `<rect x="${n1(x - 8 * k)}" y="${n1(y)}" width="${n1(16 * k)}" height="${n1(13 * k)}" rx="1.5" fill="#2a2d33"/><circle cx="${n1(x)}" cy="${n1(y + 6 * k)}" r="${n1(4.2 * k)}" fill="#141518" stroke="#55585f" stroke-width=".6"/>` +
      `<path d="M${n1(x - 2 * k)} ${n1(y + 13 * k)}h${n1(4 * k)}l${n1(-2 * k)} ${n1(4 * k)}Z" fill="#c8a24a"/>` + (o.on ? `<circle cx="${n1(x)}" cy="${n1(y + 17 * k)}" r="5" fill="url(#${o.uid}-ha)"/>` : "");
  }
  function part(o, cx, by, w, hm) {
    const u = o.uid, ph = Math.max(2, hm * o.level), id = u + "-cl" + (N++), lid = u + "-ly" + (N++);
    DEF.push(`<clipPath id="${id}"><rect x="${cx - w}" y="${n1(by - ph)}" width="${w * 2}" height="${n1(ph + 3)}"/></clipPath><pattern id="${lid}" width="4" height="1.6" patternUnits="userSpaceOnUse"><rect width="4" height=".5" fill="#000" fill-opacity=".2"/></pattern>`);
    const d = `M${n1(cx - w * .5)} ${by}C${n1(cx - w * .64)} ${n1(by - hm * .35)} ${n1(cx - w * .3)} ${n1(by - hm * .55)} ${n1(cx - w * .28)} ${n1(by - hm * .75)}L${n1(cx - w * .36)} ${n1(by - hm)}H${n1(cx + w * .36)}L${n1(cx + w * .28)} ${n1(by - hm * .75)}C${n1(cx + w * .3)} ${n1(by - hm * .55)} ${n1(cx + w * .64)} ${n1(by - hm * .35)} ${n1(cx + w * .5)} ${by}Z`;
    return (o.on ? `<path d="${d}" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width=".7" stroke-dasharray="2 2"/>` : "") +
      `<g clip-path="url(#${id})"><path d="${d}" fill="${mat(o, o.color, "h")}"/><path d="${d}" fill="url(#${lid})"/></g>` +
      (o.on ? `<path d="M${n1(cx - w * .42)} ${n1(by - ph)}H${n1(cx + w * .42)}" stroke="#ffd29a" stroke-width="1.1" class="${P}layer"/>` : "");
  }
  const ART = { "enclosed-3d-printer": "boxa", "boxy-enclosed-printer": "boxb", "bed-slinger-3d-printer": "slinger", "mini-3d-printer": "slingermini" };
  function lineup(o, key, box) {
    const k = ART[key] || key, pv = (window.HDAPV || {})[k], d = pv ? pv[2].draw : (window.HDAPA || {})[k];
    if (!d) return svg(o, stage(o) + `<rect x="60" y="80" width="80" height="60" rx="6" fill="#000" opacity=".25"/>`);
    let a = d({ pct: Math.round(o.level * 100), run: !!o.on, off: false, colors: [o.color, "#f8fafc", "#2563eb", "#16a34a"], act: o.color, tool: 4, hotend: 2 });
    a = a.replace(/<svg /, `<svg x="${box[0]}" y="${box[1]}" width="${box[2]}" height="${box[3]}" `).replace(/preserveAspectRatio="[^"]*"/, 'preserveAspectRatio="xMidYMax meet"');
    return svg(o, stage(o) + `<g class="${o.on ? P + "run" : ""}">${a}</g>` + (o.on ? "" : ""));
  }

  const WB = ["#f2f2f0", "#1d1e21", "#8e939a"];
  const icons = [
    {
      id: "aio", name: "Home all-in-one", colors: WB, picker: true, colorLabel: "Body",
      render(o) {
        const u = o.uid, c = o.color, x = 38, w = 122, h = 46, y = B - h, dx = 14, dy = 30;
        let s = stage(o) + box3(o, two(c), x, y + 12, w, h - 12, dx, 0) + box3(o, c, x, y, w, 12, dx, dy, { gloss: .35 });
        s += `<path d="M${x} ${y + 12}H${x + w}" stroke="#000" stroke-opacity=".35"/><path d="M${x + w} ${y + 12}L${x + w + dx} ${y + 12 - dy}V${y + h - dy}L${x + w} ${y + h}Z" fill="${mat(o, two(c), "s")}"/>`;
        s += carriage(o, x + 50, y + 15, 62, 5) + trayF(o, x + 30, x + 102, y + 26, y + h + 8, 5, two(c), true);
        s += `<path d="M${x + 4} ${y + 13}L${x + 44} ${y + 13}L${x + 40} ${y + 27}L${x + 8} ${y + 27}Z" fill="#141519"/><path d="M${x + 7} ${y + 15}H${x + 41}L${x + 38.5} ${y + 25}H${x + 9.5}Z" fill="${o.on ? "#234a7a" : "#0b0c10"}"/>` +
          (o.on ? `<rect x="${x + 12}" y="${y + 17}" width="9" height="6" rx="1" fill="#5fb8ff"/>` + gauge(o, x + 25, y + 16.5, CMYK, 2, 6) : "") + status(o, x + w - 10, y + 20);
        return svg(o, s);
      }
    },
    {
      id: "slim", name: "Slim inkjet", colors: WB, picker: true, colorLabel: "Body",
      render(o) {
        const c = o.color, x = 34, w = 132, h = 24, y = B - h, dx = 14, dy = 30;
        let s = stage(o) + `<path d="M${x + 30 + dx} ${y - dy + 2}L${x + 36 + dx} ${y - dy - 22}H${x + 98 + dx}L${x + 92 + dx} ${y - dy + 2}Z" fill="${mat(o, dk(c, -.05), "v")}"/>` + (o.on ? `<path d="M${x + 40 + dx} ${y - dy}L${x + 44 + dx} ${y - dy - 16}H${x + 86 + dx}L${x + 82 + dx} ${y - dy}Z" fill="#fbfbf8" opacity=".9"/>` : "") +
          box3(o, c, x, y, w, h, dx, dy, { gloss: .3, r: 3 });
        s += carriage(o, x + 30, y + 4, 70, 5) + trayF(o, x + 32, x + 100, y + 15, y + h + 8, 5, c, true) + gauge(o, x + 8, y + 6, CMYK, 2.4, 8) + status(o, x + w - 12, y + 10);
        return svg(o, s);
      }
    },
    {
      id: "tank", name: "Ink-tank printer", colors: ["#1d1e21", "#f2f2f0", "#8e939a"], picker: true, colorLabel: "Body",
      render(o) {
        const u = o.uid, c = o.color, x = 36, w = 118, h = 46, y = B - h, dx = 14, dy = 30;
        let s = stage(o) + box3(o, two(c), x, y + 12, w, h - 12, dx, 0) + box3(o, c, x, y, w, 12, dx, dy, { gloss: .3 }) + `<path d="M${x + w} ${y + 12}L${x + w + dx} ${y + 12 - dy}V${y + h - dy}L${x + w} ${y + h}Z" fill="${mat(o, two(c), "s")}"/><path d="M${x} ${y + 12}H${x + w}" stroke="#000" stroke-opacity=".35"/>`;
        s += trayF(o, x + 10, x + 72, y + 26, y + h + 8, 5, two(c), true);
        const tx = x + 80, ty = y + 15, f = Math.max(.05, o.level), low = o.level < .25;
        s += `<rect x="${tx - 2}" y="${ty - 2}" width="38" height="28" rx="2" fill="${dk(two(c), -.15)}"/>`;
        CMYK.forEach((k, i) => {
          const bx = tx + i * 9, fh = 22 * f;
          s += `<rect x="${bx}" y="${ty}" width="7" height="24" rx="1.4" fill="#e8eef2" opacity=".35"/><rect x="${bx}" y="${n1(ty + 24 - fh)}" width="7" height="${n1(fh)}" rx="1" fill="${k}"/><rect x="${bx + 1}" y="${ty + 1}" width="1.4" height="22" fill="#fff" opacity=".45"/>` +
            `<rect x="${bx}" y="${ty}" width="7" height="24" rx="1.4" fill="none" stroke="${low ? AMB : "#000"}" stroke-opacity="${low ? .9 : .35}" stroke-width="${low ? 1 : .6}"/><path d="M${bx + .5} ${ty + 4}H${bx + 6.5}" stroke="#000" stroke-opacity=".3" stroke-width=".5"/>`;
        });
        s += status(o, x + 8, y + 18) + `<circle cx="${x + 20}" cy="${y + 18}" r="2.2" fill="#3a3d44"/>`;
        return svg(o, s);
      }
    },
    {
      id: "photo6", name: "Photo inkjet", colors: ["#1d1e21", "#f2f2f0", "#8e939a"], picker: true, colorLabel: "Body",
      render(o) {
        const c = o.color, x = 34, w = 128, h = 34, y = B - h, dx = 14, dy = 30;
        let s = stage(o) + box3(o, c, x, y, w, h, dx, dy, { gloss: .6, r: 4 });
        s += `<path d="M${x + 4} ${y + 6}H${x + w - 4}" stroke="#000" stroke-opacity=".35"/>` + carriage(o, x + 40, y + 9, 66, 5) + trayF(o, x + 36, x + 104, y + 22, y + h + 9, 6, c, true) +
          gauge(o, x + 8, y + 10, ["#1fb3ea", "#8fd8f5", "#e8358f", "#f59ac6", "#f5d020", "#1b1b1d"], 2, 9) + status(o, x + w - 12, y + 14);
        return svg(o, s);
      }
    },
    {
      id: "dyesub", name: "4x6 photo printer", colors: ["#f2f2f0", "#1d1e21", "#e8a4bd"], picker: true, colorLabel: "Body",
      render(o) {
        const c = o.color, x = 62, w = 74, h = 30, y = B - h - 4, dx = 10, dy = 24;
        let s = stage(o) + `<path d="M${x + 14 + dx} ${y - dy + 4}L${x + 18 + dx} ${y - dy - 6}H${x + 58 + dx}L${x + 54 + dx} ${y - dy + 4}Z" fill="${mat(o, dk(c, .05), "t")}"/>` + box3(o, c, x, y, w, h, dx, dy, { gloss: .45, r: 6 });
        s += `<path d="${M4([x + 12, y + h - 6], [x + w - 12, y + h - 6], [x + w - 6, y + h + 8], [x + 6, y + h + 8])}" fill="${mat(o, dk(c, .1), "t")}"/>` +
          page(o, [[x + 16, y + h - 5], [x + w - 16, y + h - 5], [x + w - 12, y + h + 6], [x + 12, y + h + 6]], "f", true, `M${x} ${y + h - 6}H${x + w}V${y + h + 20}H${x}Z`).replace(/#fbfbf8/g, "#fff") +
          `<rect x="${x + 12}" y="${y + h - 8}" width="${w - 24}" height="2.4" rx="1" fill="#050608"/>` + gauge(o, x + 8, y + 7, ["#e8b04a"], 3, 8) + status(o, x + w - 10, y + 10);
        return svg(o, s);
      }
    },
    {
      id: "a3", name: "Wide-format inkjet", colors: ["#1d1e21", "#f2f2f0", "#8e939a"], picker: true, colorLabel: "Body",
      render(o) {
        const c = o.color, x = 12, w = 166, h = 30, y = B - h, dx = 12, dy = 26;
        let s = stage(o) + `<path d="M${x + 40 + dx} ${y - dy + 2}L${x + 46 + dx} ${y - dy - 34}H${x + 126 + dx}L${x + 120 + dx} ${y - dy + 2}Z" fill="${mat(o, dk(c, -.06), "v")}"/>` + (o.on ? `<path d="M${x + 52 + dx} ${y - dy}L${x + 56 + dx} ${y - dy - 26}H${x + 116 + dx}L${x + 112 + dx} ${y - dy}Z" fill="#fbfbf8" opacity=".9"/>` : "") +
          box3(o, c, x, y, w, h, dx, dy, { gloss: .35, r: 3 });
        s += carriage(o, x + 40, y + 5, 96, 5) + trayF(o, x + 34, x + 140, y + 17, y + h + 9, 7, c, true) + gauge(o, x + 8, y + 8, CMYK.concat(["#8fd8f5", "#f59ac6"]), 2, 9) + status(o, x + w - 12, y + 12);
        return svg(o, s);
      }
    },
    {
      id: "mono-ink", name: "Black-only inkjet", colors: WB, picker: true, colorLabel: "Body",
      render(o) {
        const c = o.color, x = 48, w = 104, h = 32, y = B - h, dx = 14, dy = 28;
        let s = stage(o) + box3(o, c, x, y, w, h, dx, dy, { gloss: .3, r: 3 });
        s += carriage(o, x + 26, y + 6, 56, 5) + trayF(o, x + 24, x + 84, y + 21, y + h + 8, 5, c, false) + gauge(o, x + 8, y + 8, ["#1b1b1d"], 4, 10) + status(o, x + w - 12, y + 12);
        return svg(o, s);
      }
    },
    {
      id: "mono-laser", name: "Compact laser", colors: WB, picker: true, colorLabel: "Body",
      render(o) {
        const c = o.color, x = 54, w = 92, h = 54, y = B - h, dx = 14, dy = 30;
        const T = (uu, vv) => [x + w * uu + dx * vv, y - dy * vv];
        let s = stage(o) + box3(o, c, x, y, w, h, dx, dy, { gloss: .25, r: 3 });
        const rec = [T(.12, .08), T(.12, .78), T(.88, .78), T(.88, .08)];
        s += `<path d="${M4(rec[0], rec[1], rec[2], rec[3])}" fill="${mat(o, dk(c, -.45), "t")}"/><path d="M${n1(rec[1][0])} ${n1(rec[1][1])}H${n1(rec[2][0])}" stroke="#050608" stroke-width="2"/>` +
          page(o, [T(.2, .72), T(.8, .72), T(.8, .14), T(.2, .14)], "t", false, M4(T(.1, .78), T(.9, .78), T(.9, 0), T(.1, 0)));
        s += `<path d="M${x + 3} ${y + 14}H${x + w - 3}M${x + 3} ${y + 40}H${x + w - 3}" stroke="#000" stroke-opacity=".3"/><rect x="${x + 30}" y="${y + 44}" width="32" height="2" rx="1" fill="#000" opacity=".35"/>` +
          gauge(o, x + 8, y + 20, ["#1b1b1d"], 4, 10) + status(o, x + w - 12, y + 24);
        return svg(o, s);
      }
    },
    {
      id: "laser-aio", name: "Laser all-in-one", colors: WB, picker: true, colorLabel: "Body",
      render(o) {
        const c = o.color, x = 48, w = 106, dx = 14, dy = 30, yb = B - 40, ys = B - 64;
        let s = stage(o) + box3(o, two(c), x, yb, w, 40, dx, 0);
        s += `<path d="M${x + w} ${yb}L${x + w + dx} ${yb - dy}V${B - dy}L${x + w} ${B}Z" fill="${mat(o, two(c), "s")}"/>`;
        s += `<rect x="${x + 4}" y="${ys + 16}" width="${w - 8}" height="8" fill="#08090c"/>` + page(o, [[x + 20, ys + 18], [x + 82, ys + 18], [x + 86, ys + 24], [x + 16, ys + 24]], "f", false, `M${x} ${ys + 16}H${x + w}V${ys + 30}H${x}Z`);
        s += box3(o, c, x, ys, w, 16, dx, dy, { gloss: .3 }) + `<path d="M${x + 6 + dx} ${ys - dy + 4}L${x + 12 + dx} ${ys - dy - 6}H${x + 76 + dx}L${x + 72 + dx} ${ys - dy + 4}Z" fill="${mat(o, dk(c, -.04), "t")}"/><path d="M${x + 6 + dx} ${ys - dy + 4}H${x + 72 + dx}" stroke="#000" stroke-opacity=".3"/>`;
        s += `<rect x="${x + 6}" y="${ys + 3}" width="26" height="9" rx="1" fill="#0b0d12"/>` + (o.on ? `<rect x="${x + 8}" y="${ys + 5}" width="10" height="5" fill="#5fb8ff" opacity=".7"/>` : "") + gauge(o, x + 22, ys + 4, ["#1b1b1d"], 3, 6) + status(o, x + w - 12, ys + 8) +
          `<path d="M${x + 3} ${yb + 18}H${x + w - 3}" stroke="#000" stroke-opacity=".3"/><rect x="${x + 36}" y="${yb + 30}" width="34" height="2" rx="1" fill="#000" opacity=".35"/>`;
        return svg(o, s);
      }
    },
    {
      id: "color-laser", name: "Color laser", colors: WB, picker: true, colorLabel: "Body",
      render(o) {
        const c = o.color, x = 52, w = 98, h = 74, y = B - h, dx = 14, dy = 28;
        const T = (uu, vv) => [x + w * uu + dx * vv, y - dy * vv];
        let s = stage(o) + box3(o, c, x, y, w, h, dx, dy, { gloss: .25, r: 3 });
        const rec = [T(.1, .06), T(.1, .8), T(.78, .8), T(.78, .06)];
        s += `<path d="${M4(rec[0], rec[1], rec[2], rec[3])}" fill="${mat(o, dk(c, -.45), "t")}"/><path d="M${n1(rec[1][0])} ${n1(rec[1][1])}H${n1(rec[2][0])}" stroke="#050608" stroke-width="2"/>` +
          page(o, [T(.18, .74), T(.7, .74), T(.7, .12), T(.18, .12)], "t", true, M4(T(.08, .8), T(.8, .8), T(.8, 0), T(.08, 0)));
        s += `<rect x="${x + w - 26}" y="${y + 6}" width="20" height="12" rx="1" fill="#0b0d12"/>` + gauge(o, x + w - 23, y + 8, CMYK, 2, 7) + status(o, x + w - 12, y + 24) +
          `<path d="M${x + 3} ${y + 30}H${x + w - 3}M${x + 3} ${y + 54}H${x + w - 3}" stroke="#000" stroke-opacity=".35"/><rect x="${x + 30}" y="${y + 34}" width="38" height="2.2" rx="1" fill="#000" opacity=".35"/><rect x="${x + 30}" y="${y + 62}" width="38" height="2.2" rx="1" fill="#000" opacity=".35"/>`;
        return svg(o, s);
      }
    },
    {
      id: "color-mfp", name: "Color laser MFP", colors: WB, picker: true, colorLabel: "Body",
      render(o) {
        const u = o.uid, c = o.color, x = 42, w = 112, dx = 14, dy = 24, yb = B - 58, ys = B - 92;
        let s = stage(o) + box3(o, two(c), x, yb, w, 58, dx, 0) + `<path d="M${x + w} ${yb}L${x + w + dx} ${yb - dy}V${B - dy}L${x + w} ${B}Z" fill="${mat(o, two(c), "s")}"/>`;
        s += `<path d="M${x + 3} ${yb + 18}H${x + w - 3}M${x + 3} ${yb + 38}H${x + w - 3}" stroke="#000" stroke-opacity=".35"/><rect x="${x + 38}" y="${yb + 26}" width="36" height="2.2" rx="1" fill="#000" opacity=".35"/><rect x="${x + 38}" y="${yb + 46}" width="36" height="2.2" rx="1" fill="#000" opacity=".35"/>`;
        s += `<rect x="${x + 4}" y="${ys + 22}" width="${w - 8}" height="12" fill="#08090c"/>` + page(o, [[x + 16, ys + 24], [x + 76, ys + 24], [x + 80, ys + 33], [x + 12, ys + 33]], "f", true, `M${x} ${ys + 22}H${x + w}V${ys + 40}H${x}Z`);
        s += box3(o, c, x, ys, w, 22, dx, dy, { gloss: .3 }) + `<path d="M${x + 8 + dx} ${ys - dy + 4}L${x + 14 + dx} ${ys - dy - 8}H${x + 82 + dx}L${x + 78 + dx} ${ys - dy + 4}Z" fill="${mat(o, dk(c, -.04), "t")}"/>`;
        s += `<path d="M${x + w - 46} ${ys + 4}L${x + w - 4} ${ys + 4}L${x + w + 2} ${ys + 26}L${x + w - 40} ${ys + 26}Z" fill="#141519"/><path d="M${x + w - 43} ${ys + 6.5}L${x + w - 6} ${ys + 6.5}L${x + w - 1.5} ${ys + 23.5}L${x + w - 38.5} ${ys + 23.5}Z" fill="${o.on ? "#1d3d66" : "#0b0c10"}"/>` +
          (o.on ? [0, 1, 2].map((i) => `<rect x="${x + w - 38 + i * 10}" y="${ys + 9}" width="8" height="6" rx="1" fill="${["#5fb8ff", "#7cd68a", "#f2a65a"][i]}"/>`).join("") + gauge(o, x + w - 36, ys + 17, CMYK, 2, 4.5) : "") + status(o, x + 10, ys + 12);
        return svg(o, s);
      }
    },
    {
      id: "label", name: "Label printer", colors: ["#f2f2f0", "#1d1e21", "#8e939a"], picker: true, colorLabel: "Body",
      render(o) {
        const u = o.uid, c = o.color, x = 72, w = 54, h = 40, y = B - h - 2, dx = 12, dy = 22;
        let s = stage(o) + box3(o, c, x, y, w, h, dx, dy, { gloss: .4, r: 8 });
        const T = (uu, vv) => [x + w * uu + dx * vv, y - dy * vv];
        s += `<path d="${M4(T(.15, .15), T(.15, .85), T(.85, .85), T(.85, .15))}" fill="#9ab8d0" opacity=".35"/>` + `<ellipse cx="${n1(T(.5, .5)[0])}" cy="${n1(T(.5, .5)[1])}" rx="14" ry="5" fill="#fbfbf8" opacity=".8"/><ellipse cx="${n1(T(.5, .5)[0])}" cy="${n1(T(.5, .5)[1])}" rx="4" ry="1.5" fill="#3a3d44"/>`;
        const sy = y + h - 10;
        s += `<rect x="${x + 10}" y="${sy}" width="${w - 20}" height="2.2" rx="1" fill="#050608"/>` +
          (o.on ? `<g clip-path="url(#${u}-lc)"><g class="${P}pf"><path d="${M4([x + 14, sy + 2], [x + w - 14, sy + 2], [x + w - 12, sy + 20], [x + 12, sy + 20])}" fill="#fbfbf8"/><path d="M${x + 16} ${sy + 8}H${x + w - 18}M${x + 16} ${sy + 12}H${x + w - 24}M${x + 16} ${sy + 16}H${x + w - 20}" stroke="#2a2b30" stroke-width="1.2"/></g></g>` : "") +
          gauge(o, x + 6, y + 6, ["#1b1b1d"], 3, 7) + status(o, x + w - 9, y + 9);
        DEF.push(`<clipPath id="${u}-lc"><rect x="${x}" y="${sy + 1}" width="${w}" height="30"/></clipPath>`);
        return svg(o, s);
      }
    },
    {
      id: "receipt", name: "Thermal receipt printer", colors: ["#1d1e21", "#f2f2f0", "#8e939a"], picker: true, colorLabel: "Body",
      render(o) {
        const u = o.uid, c = o.color, x = 70, w = 62, h = 36, y = B - h, dx = 12, dy = 28;
        const T = (uu, vv) => [x + w * uu + dx * vv, y - dy * vv];
        DEF.push(`<clipPath id="${u}-rc"><rect x="${x - 10}" y="0" width="${w + 30}" height="${n1(T(.5, .3)[1])}"/></clipPath>`);
        let s = stage(o) + box3(o, c, x, y, w, h, dx, dy, { gloss: .35, r: 6 });
        const a = T(.15, .3), z = T(.85, .3);
        s += `<path d="${M4(T(.06, .35), T(.06, .95), T(.94, .95), T(.94, .35))}" fill="${mat(o, dk(c, -.06), "t")}"/>`;
        if (o.on) s += `<g clip-path="url(#${u}-rc)"><g class="${P}pu"><path d="M${n1(a[0] + 4)} ${n1(a[1])}V${n1(a[1] - 34)}H${n1(z[0] - 4)}V${n1(z[1])}Z" fill="#fbfbf8"/>` + [6, 10, 14, 18, 24, 28].map((d) => `<path d="M${n1(a[0] + 8)} ${n1(a[1] - d)}H${n1(z[0] - (d % 8 ? 16 : 8))}" stroke="#2a2b30" stroke-width="1"/>`).join("") + `</g></g>`;
        s += `<path d="M${n1(a[0])} ${n1(a[1])}H${n1(z[0])}" stroke="#9aa0a8" stroke-width="2.2" stroke-linecap="round"/><path d="M${n1(a[0])} ${n1(a[1] + 1.4)}H${n1(z[0])}" stroke="#050608" stroke-width="1"/>` +
          gauge(o, x + 6, y + 8, ["#e8e6de"], 3, 8) + status(o, x + w - 10, y + 12) + `<rect x="${x + w - 18}" y="${y + 22}" width="10" height="5" rx="1.5" fill="#3a3d44"/>`;
        return svg(o, s);
      }
    },
    { id: "enclosed-3d-printer", name: "Enclosed 3D printer", colors: FIL, picker: true, colorLabel: "Filament", render(o) { return lineup(o, "enclosed-3d-printer", [16, 8, 168, 156]); } },
    { id: "boxy-enclosed-printer", name: "Boxy enclosed printer", colors: FIL, picker: true, colorLabel: "Filament", render(o) { return lineup(o, "boxy-enclosed-printer", [24, 8, 152, 156]); } },
    { id: "bed-slinger-3d-printer", name: "Bed-slinger 3D printer", colors: FIL, picker: true, colorLabel: "Filament", render(o) { return lineup(o, "bed-slinger-3d-printer", [6, 30, 188, 134]); } },
    { id: "mini-3d-printer", name: "Mini 3D printer", colors: FIL, picker: true, colorLabel: "Filament", render(o) { return lineup(o, "mini-3d-printer", [14, 40, 172, 124]); } },
    {
      id: "resin", name: "Resin 3D printer", colors: FIL, picker: true, colorLabel: "Resin",
      render(o) {
        const u = o.uid, c = o.color, x = 64, w = 72, by = B - 22, ph = 30 * Math.max(.06, o.level), py = by - 10 - ph - 6;
        let s = stage(o) + box3(o, "#2b2d31", x, by, w, 22, 10, 14, { gloss: .25 });
        s += `<rect x="${x + 8}" y="${by + 5}" width="28" height="12" rx="1" fill="#0b0d12"/>` + (o.on ? `<rect x="${x + 10}" y="${by + 7}" width="24" height="8" fill="#2f6fd6" opacity=".85"/>` : "");
        s += `<rect x="${x + 33}" y="${by - 82}" width="5" height="78" fill="${mat(o, "#9aa0a8", "h")}"/>`;
        s += `<path d="${M4([x + 12, by - 1], [x + w - 10, by - 1], [x + w - 4, by - 10], [x + 18, by - 10])}" fill="#c9ccd1"/><path d="${M4([x + 15, by - 2.5], [x + w - 13, by - 2.5], [x + w - 8, by - 8.5], [x + 20, by - 8.5])}" fill="${c}" opacity=".85"/>` +
          (o.on ? `<ellipse cx="${x + w / 2 + 3}" cy="${by - 5}" rx="26" ry="6" fill="#b06cff" opacity=".5" class="${P}uv"/>` : "");
        s += `<g class="${o.on ? P + "plz" : ""}"><rect x="${x + 33}" y="${n1(py - 4)}" width="10" height="6" fill="#55585f"/><path d="${M4([x + 16, py], [x + w - 14, py], [x + w - 10, py - 5], [x + 20, py - 5])}" fill="url(#${u}-chrome)"/>` +
          `<path d="M${x + 26} ${n1(py + 1)}h${w - 48}l-4 ${n1(ph)}h${-(w - 56)}Z" fill="${mat(o, c, "h")}" opacity=".95"/><path d="M${x + 26} ${n1(py + 1)}h${w - 48}l-4 ${n1(ph)}h${-(w - 56)}Z" fill="url(#${u}-lay)"/></g>`;
        DEF.push(`<pattern id="${u}-lay" width="4" height="1.6" patternUnits="userSpaceOnUse"><rect width="4" height=".5" fill="#000" fill-opacity=".18"/></pattern>`);
        s += `<path d="${M4([x + 2, by], [x + w - 2, by], [x + w - 2, by - 88], [x + 2, by - 88])}" fill="#ff7a1a" opacity=".32"/><path d="${M4([x + 2, by - 88], [x + 12, by - 100], [x + w + 8, by - 100], [x + w - 2, by - 88])}" fill="#ff9a3a" opacity=".45"/><path d="${M4([x + w - 2, by], [x + w + 8, by - 12], [x + w + 8, by - 100], [x + w - 2, by - 88])}" fill="#d85a10" opacity=".35"/>` +
          gl(o, M4([x + 2, by], [x + w - 2, by], [x + w - 2, by - 88], [x + 2, by - 88]), .4) + `<path d="M${x + 2} ${by - 88}H${x + w - 2}" stroke="#fff" stroke-opacity=".4"/>`;
        return svg(o, s);
      }
    },
    {
      id: "delta", name: "Delta 3D printer", colors: FIL, picker: true, colorLabel: "Filament",
      render(o) {
        const u = o.uid, c = o.color, by = B - 22, hm = 40, ph = hm * Math.max(.04, o.level), ey = by - ph - 12;
        let s = stage(o) + post(o, 104, 24, B - 30, .7) + box3(o, "#2b2d31", 52, B - 18, 96, 18, 12, 16, { gloss: .2 }) + box3(o, "#2b2d31", 52, 22, 96, 8, 12, 10, { gloss: .2 });
        s += spool(o, 100, 9, 9, c);
        s += `<ellipse cx="104" cy="${by}" rx="32" ry="7.5" fill="#141518"/>` + (o.on ? `<ellipse cx="104" cy="${by}" rx="32" ry="7.5" fill="none" stroke="#ff7a3a" stroke-opacity=".7" stroke-width="1.2"/>` : "") + part(o, 104, by + 1, 22, hm);
        s += post(o, 56, 30, B - 18) + post(o, 140, 30, B - 18);
        const cy = ey - 34;
        s += `<g class="${o.on ? P + "dl" : ""}"><path d="M59 ${cy}L98 ${ey}M63 ${cy}L101 ${ey}M143 ${cy}L110 ${ey}M139 ${cy}L107 ${ey}M104 ${cy - 6}L102 ${ey - 2}M108 ${cy - 6}L106 ${ey - 2}" stroke="#2a2d33" stroke-width="1.4"/>${head(o, 104, ey - 4, 1)}</g>` +
          `<rect x="55" y="${cy - 3}" width="12" height="6" rx="1" fill="#3a3d44"/><rect x="137" y="${cy - 3}" width="12" height="6" rx="1" fill="#3a3d44"/>`;
        s += `<path d="M100 18C80 30 90 ${ey - 20} 104 ${ey - 4}" stroke="${c}" stroke-width=".9" fill="none" opacity=".8"/>`;
        return svg(o, s);
      }
    },
    {
      id: "largeformat", name: "Large-format 3D printer", colors: FIL, picker: true, colorLabel: "Filament",
      render(o) {
        const u = o.uid, c = o.color, by = B - 18, hm = 70, ph = hm * Math.max(.04, o.level), bar = by - ph - 14;
        let s = stage(o) + post(o, 36, 22, B - 26, .7) + post(o, 182, 22, B - 26, .7) + `<path d="M28 20L40 6H188L176 20Z" fill="none" stroke="#7a8089" stroke-width="3"/>` + box3(o, "#2b2d31", 20, B - 12, 160, 12, 12, 16, { gloss: .2 });
        s += spool(o, 106, 12, 9, c);
        s += `<path d="${M4([30, B - 13], [168, B - 13], [178, B - 27], [40, B - 27])}" fill="#141518"/>` + bedglow(o, [[30, B - 13], [168, B - 13], [178, B - 27], [40, B - 27]]) + part(o, 102, by, 40, hm);
        s += post(o, 24, 20, B - 12) + post(o, 170, 20, B - 12) + `<rect x="24" y="18" width="152" height="5" fill="${mat(o, "#8a9099", "v")}"/>`;
        s += `<rect x="28" y="${n1(bar)}" width="144" height="5" fill="${mat(o, "#8a9099", "v")}"/><g class="${o.on ? P + "hx2" : ""}">${head(o, 102, bar - 3)}</g><path d="M106 20C116 40 108 ${bar - 12} 102 ${bar - 3}" stroke="${c}" stroke-width=".9" fill="none"/>`;
        s += `<rect x="26" y="${B - 10}" width="22" height="8" rx="1" fill="#0b0d12"/>` + (o.on ? `<rect x="28" y="${B - 8}" width="18" height="4" fill="#2f6fd6" opacity=".85"/>` : "");
        return svg(o, s);
      }
    }
  ];

  (window.HDA = window.HDA || []).push({
    id: "printers",
    tab: "Printers",
    group: "Home",
    kind: "device",
    levelLabel: "Ink / toner",
    onWord: "Printing", offWord: "Idle",
    intro: "Thirteen home and office printers plus seven 3D printers on a desk (the X1C, P1S, A1 and A1 mini art is the approved lineup drawing). While printing, a page slides out (color pages from color printers, text from mono ones), the inkjet carriage runs back and forth and the status light blinks. The slider is the ink or toner level: on the gauges and the ink-tank windows, and below 25% everything turns amber. On 3D printers the slider is print progress: the part grows, the head moves, the bed glows and the resin plate lifts.",
    
    css: `
.hda-anim .hda-printers-pf{animation:hda-printers-pf 3.2s ease-out infinite}
@keyframes hda-printers-pf{0%{transform:translate(0,-12px)}70%,100%{transform:translate(0,0)}}
.hda-anim .hda-printers-pt{animation:hda-printers-pt 3.2s ease-out infinite}
@keyframes hda-printers-pt{0%{transform:translate(6px,-14px)}70%,100%{transform:translate(0,0)}}
.hda-anim .hda-printers-pu{animation:hda-printers-pu 3s ease-out infinite}
@keyframes hda-printers-pu{0%{transform:translate(0,22px)}75%,100%{transform:translate(0,0)}}
.hda-anim .hda-printers-carr{animation:hda-printers-carr 1.3s ease-in-out infinite alternate}
@keyframes hda-printers-carr{from{transform:translate(0,0)}to{transform:translate(var(--w,50px),0)}}
.hda-anim .hda-printers-blink{animation:hda-printers-blink 1s steps(2,end) infinite}
@keyframes hda-printers-blink{0%{opacity:1}100%{opacity:.2}}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-printers-pf,.hda-anim .hda-printers-pt,.hda-anim .hda-printers-pu,.hda-anim .hda-printers-carr,.hda-anim .hda-printers-blink{animation:none}}
.hda-anim .hda-printers-run .pa-head{animation:hda-printers-pahead 2.4s ease-in-out infinite alternate}
@keyframes hda-printers-pahead{from{transform:translateX(-22px)}to{transform:translateX(22px)}}
.hda-anim .hda-printers-hx1{animation:hda-printers-hx1 2.2s ease-in-out infinite alternate}
@keyframes hda-printers-hx1{from{transform:translate(-14px,0)}to{transform:translate(14px,0)}}
.hda-anim .hda-printers-hx2{animation:hda-printers-hx2 2.6s ease-in-out infinite alternate}
@keyframes hda-printers-hx2{from{transform:translate(-30px,0)}to{transform:translate(30px,0)}}
.hda-anim .hda-printers-bedy{animation:hda-printers-bedy 2.8s ease-in-out infinite alternate}
@keyframes hda-printers-bedy{from{transform:translate(-2px,3px)}to{transform:translate(2px,-3px)}}
.hda-anim .hda-printers-plz{animation:hda-printers-plz 3.4s ease-in-out infinite}
@keyframes hda-printers-plz{0%,100%{transform:translate(0,0)}50%{transform:translate(0,-8px)}}
.hda-anim .hda-printers-uv{animation:hda-printers-uv 3.4s steps(2,end) infinite}
@keyframes hda-printers-uv{0%{opacity:.6}100%{opacity:0}}
.hda-anim .hda-printers-dl{animation:hda-printers-dl 3s linear infinite}
@keyframes hda-printers-dl{0%{transform:translate(-8px,0)}25%{transform:translate(0,2px)}50%{transform:translate(8px,0)}75%{transform:translate(0,-2px)}100%{transform:translate(-8px,0)}}
.hda-anim .hda-printers-layer{animation:hda-printers-blink 1.2s ease-in-out infinite}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-printers-run .pa-head,.hda-anim .hda-printers-hx1,.hda-anim .hda-printers-hx2,.hda-anim .hda-printers-bedy,.hda-anim .hda-printers-plz,.hda-anim .hda-printers-uv,.hda-anim .hda-printers-dl,.hda-anim .hda-printers-layer{animation:none}}
`,
    icons
  });
})();
