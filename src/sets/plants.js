(function () {
  "use strict";
  const P = "hda-plants-";
  const HH = () => window.HDAH;
  const cl = (v, a, b) => Math.max(a == null ? 0 : a, Math.min(b == null ? 1 : b, v));
  const n = (v) => Math.round(v * 10) / 10;
  const rad = (d) => d * Math.PI / 180, deg = (r) => r * 180 / Math.PI;
  const mix = (a, b, t) => HH().mix(a, b, cl(t));
  const sh = (c, a) => HH().shade(c, a);
  function rng(seed) { let s = seed >>> 0; return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

  function ST(o) {
    const w = o.on ? cl(+o.level || 0) : 0;
    return { o, u: o.uid, w, droop: cl(1 - w / .6), dry: cl(1 - w / .7), wet: cl((w - .15) / .7),
      gloss: .05 + .36 * cl((w - .2) / .6), D: [], G: {} };
  }
  const S = (...a) => a.map((s) => `<stop offset="${s[0]}" stop-color="${s[1]}"${s[2] != null ? ` stop-opacity="${s[2]}"` : ""}/>`).join("");
  function LGd(st, k, x1, y1, x2, y2, stops) { const id = st.u + "-" + k; if (!st.G[k]) { st.G[k] = 1; st.D.push(`<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops}</linearGradient>`); } return `url(#${id})`; }
  function RG(st, k, cx, cy, r, stops) { const id = st.u + "-" + k; if (!st.G[k]) { st.G[k] = 1; st.D.push(`<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${stops}</radialGradient>`); } return `url(#${id})`; }
  const DULL = { l: "#e3d58c", m: "#b3a352", d: "#6a5f2e" };
  function greens(st, b, amt) { const t = st.dry * (amt == null ? .8 : amt); return { l: mix(b.l, DULL.l, t), m: mix(b.m, DULL.m, t), d: mix(b.d, DULL.d, t) }; }
  const crossFill = (st, k, g) => LGd(st, k, 0, 1, 1, 0, S([0, g.l], [.5, g.m], [1, g.d]));
  const lenFill = (st, k, a, b, c) => LGd(st, k, 0, 1, 0, 0, S([0, a], [.55, b], [1, c]));
  const stemOf = (g) => mix(g.m, "#5d6b2e", .35);
  const BROWN = "#8a5a2c";

  function svg(st, body) { return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="${P}svg"><defs>${st.D.join("")}</defs>${body}</svg>`; }
  const shadow = (cx, cy, rx, ry) => `<ellipse cx="${n(cx)}" cy="${n(cy)}" rx="${n(rx + 6)}" ry="${n((ry || 5) + 1.6)}" fill="#000" opacity=".14"/><ellipse cx="${n(cx)}" cy="${n(cy)}" rx="${n(rx)}" ry="${n(ry || 5)}" fill="#000" opacity=".26"/>`;
  const sway = (inner, d, hang) => `<g class="${P}${hang ? "hang" : "sway"}" style="animation-delay:${-(d || 0)}s">${inner}</g>`;
  function grav(a, t) { const x = ((a % 360) + 540) % 360 - 180; const tg = x >= 0 ? 180 : -180; return x + (tg - x) * cl(t); }
  const quad = (p0, p1, p2, t) => { const u = 1 - t; const x = u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0], y = u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1];
    const dx = 2 * u * (p1[0] - p0[0]) + 2 * t * (p2[0] - p1[0]), dy = 2 * u * (p1[1] - p0[1]) + 2 * t * (p2[1] - p1[1]); return [x, y, deg(Math.atan2(dx, -dy))]; };
  const cub = (p, t) => { const u = 1 - t; const x = u * u * u * p[0] + 3 * u * u * t * p[2] + 3 * u * t * t * p[4] + t * t * t * p[6], y = u * u * u * p[1] + 3 * u * u * t * p[3] + 3 * u * t * t * p[5] + t * t * t * p[7];
    const dx = 3 * u * u * (p[2] - p[0]) + 6 * u * t * (p[4] - p[2]) + 3 * t * t * (p[6] - p[4]), dy = 3 * u * u * (p[3] - p[1]) + 6 * u * t * (p[5] - p[3]) + 3 * t * t * (p[7] - p[5]);
    return [x, y, deg(Math.atan2(dx, -dy))]; };

  let beadN = 0;
  function bead(st, x, y, s) {
    if (st.w < .55) return "";
    s = s || 1; const op = n(cl((st.w - .55) / .3) * .95 + .05), i = beadN++;
    return `<g class="${P}spark" style="animation-delay:${-((i * 1.37) % 3.6).toFixed(2)}s" opacity="${op}"><circle cx="${n(x)}" cy="${n(y)}" r="${n(1.9 * s)}" fill="#e6f6ff" fill-opacity=".42" stroke="#fff" stroke-opacity=".75" stroke-width=".5"/><circle cx="${n(x - .6 * s)}" cy="${n(y - .6 * s)}" r="${n(.6 * s)}" fill="#fff"/><path class="${P}glint" opacity="0" d="M${n(x + 1.4 * s)} ${n(y - 5 * s)}l.6 2.2 2.2 .6-2.2 .6-.6 2.2-.6-2.2-2.2-.6 2.2-.6Z" fill="#fff"/></g>`;
  }

  const SHP = {
    lance: { s: 0, c: [[1.35, -.18, .95, -.72, 0, -1]] },
    oval: { s: 0, c: [[1.45, -.06, 1.3, -.88, 0, -1]] },
    sword: { s: .45, c: [[1.1, -.35, .8, -.8, 0, -1]] },
    strap: { s: .55, c: [[1, -.3, .85, -.82, 0, -1]] },
    heart: { s: 0, c: [[.75, .17, 1.32, .02, 1.12, -.36], [.92, -.7, .28, -.9, 0, -1]] },
    paddle: { s: .2, c: [[1.25, -.05, 1.15, -.92, 0, -1]] },
  };
  function geom(shape, L, W, b) {
    const g = SHP[shape] || SHP.lance;
    const bf = (Y) => b * Math.pow(Math.max(0, -Y), 1.6);
    const pt = (s, X, Y) => [n(s * X * W + bf(Y)), n(Y * L)];
    const chain = (s) => { const a = [pt(s, g.s, 0)]; g.c.forEach((c) => a.push(pt(s, c[0], c[1]), pt(s, c[2], c[3]), pt(s, c[4], c[5]))); return a; };
    const R = chain(1), Lc = chain(-1);
    const segs = (a) => { let o = ""; for (let i = 1; i < a.length; i += 3) o += `C${a[i]} ${a[i + 1]} ${a[i + 2]}`; return o; };
    const rev = Lc.slice().reverse();
    const d = `M${R[0]}${segs(R)}${segs(rev)}Z`;
    const rc = [n(2 * bf(-.5) - b / 2), n(-L / 2)];
    const half = `M${R[0]}${segs(R)}Q${rc} 0 0Z`;
    const rib = `M0 0Q${rc} ${n(b)} ${n(-L)}`;
    const prof = []; let p0 = [g.s, 0];
    g.c.forEach((c) => { for (let k = 0; k <= 16; k++) { const t = k / 16, u = 1 - t;
      prof.push([u * u * u * p0[0] + 3 * u * u * t * c[0] + 3 * u * t * t * c[2] + t * t * t * c[4], -(u * u * u * p0[1] + 3 * u * u * t * c[1] + 3 * u * t * t * c[3] + t * t * t * c[5])]); }
      p0 = [c[4], c[5]]; });
    const wAt = (f) => { let best = 0, bd = 9; prof.forEach((q) => { const dd = Math.abs(q[1] - f); if (dd < bd && q[1] >= -.2) { bd = dd; best = q[0]; } }); return best; };
    const rp = (f) => [bf(-f), -f * L];
    const at = (s, f, k) => [s * wAt(f) * W * (k == null ? 1 : k) + bf(-f), -f * L];
    return { d, half, rib, rp, at, wAt, L, W, b };
  }
  const pp = (p) => `${n(p[0])} ${n(p[1])}`;

  function leaf(st, x, y, a, L, W, k) {
    k = k || {};
    const side = k.side != null ? k.side : (a >= 0 ? 1 : -1);
    const dr = st.droop * (k.flop == null ? 1 : k.flop);
    const A = k.grav != null ? grav(a, (k.g0 || 0) + dr * k.grav) : a + side * dr * (k.da == null ? 30 : k.da);
    const Ln = L * (1 - dr * (k.shrink == null ? .1 : k.shrink)), Wn = W * (1 - st.dry * (k.curl || 0) * .45);
    const b = (k.b || 0) + side * dr * Ln * (k.db == null ? .28 : k.db);
    const G = geom(k.shape || "lance", Ln, Wn, b);
    let s = `<g transform="translate(${n(x)} ${n(y)}) rotate(${n(A)})">`;
    if (k.under) s += `<path d="${geom(k.shape || "lance", Ln, W, b).d}" fill="${k.under}"/>`;
    s += `<path d="${G.d}" fill="${k.fill}"${k.edge ? ` stroke="${k.edge}" stroke-width="${k.ew || 1.2}" stroke-linejoin="round"` : ""}/>`;
    if (k.pat) s += k.pat(G);
    if (k.ho !== 0) s += `<path d="${G.half}" fill="#000" opacity="${k.ho == null ? .15 : k.ho}"/>`;
    if (k.veins) { let v = ""; for (let i = 1; i <= k.veins; i++) { const f = i / (k.veins + 1); const r = G.rp(f), f2 = Math.min(.97, f + (k.vs == null ? .12 : k.vs));
      v += `M${pp(r)}L${pp(G.at(1, f2, .9))}M${pp(r)}L${pp(G.at(-1, f2, .9))}`; }
      s += `<path d="${v}" fill="none" stroke="${k.vc || "#fff"}" stroke-opacity="${k.vo || .16}" stroke-width=".6"/>`; }
    if (k.rib !== false) s += `<path d="${G.rib}" fill="none" stroke="${k.rib || "#fff"}" stroke-opacity="${k.ro == null ? .26 : k.ro}" stroke-width="${k.rw || .9}" stroke-linecap="round"/>`;
    const gl = st.gloss * (k.gl == null ? 1 : k.gl);
    if (gl > .02) { const h1 = G.at(-1, .15, .62), h2 = G.at(-1, .5, .78), h3 = G.at(-1, .84, .55);
      s += `<path d="M${pp(h1)}Q${pp(h2)} ${pp(h3)}" fill="none" stroke="#fff" stroke-opacity="${n(Math.min(.9, gl))}" stroke-width="${n(cl(Wn * .16, .7, 2.4))}" stroke-linecap="round"/>`; }
    if (!k.edge) s += `<path d="${G.d}" fill="none" stroke="#000" stroke-opacity=".2" stroke-width=".5"/>`;
    if (k.dew) k.dew.forEach((q) => { const r = G.rp(q[0]); s += bead(st, r[0] + q[1] * Wn, r[1], q[2]); });
    return s + `</g>`;
  }
  function pleaf(st, bx, by, a, pl, L, W, k) {
    k = k || {};
    const side = k.side != null ? k.side : (a >= 0 ? 1 : -1), dr = st.droop * (k.flop == null ? 1 : k.flop);
    const pa = a + side * dr * (k.pda == null ? 30 : k.pda), pln = pl * (1 - dr * .06);
    const ex = bx + Math.sin(rad(pa)) * pln, ey = by - Math.cos(rad(pa)) * pln;
    const cx = bx + Math.sin(rad(pa * (k.pc == null ? .45 : k.pc))) * pln * .55, cy = by - Math.cos(rad(pa * (k.pc == null ? .45 : k.pc))) * pln * .55;
    const ta = deg(Math.atan2(ex - cx, cy - ey));
    const stem = `<path d="M${n(bx)} ${n(by)}Q${n(cx)} ${n(cy)} ${n(ex)} ${n(ey)}" fill="none" stroke="${k.stem}" stroke-width="${k.sw || 1.8}" stroke-linecap="round"/>` +
      `<path d="M${n(bx)} ${n(by)}Q${n(cx)} ${n(cy)} ${n(ex)} ${n(ey)}" fill="none" stroke="#fff" stroke-opacity=".18" stroke-width="${n((k.sw || 1.8) * .35)}" transform="translate(-.5 0)"/>`;
    return stem + leaf(st, ex, ey, ta + (k.tilt || 0) * side, L, W, Object.assign({}, k, { side, da: k.da == null ? 22 : k.da }));
  }

  function soil(st, cx, cy, rx, ry, d) {
    const t = 1 - st.wet;
    const f = RG(st, "so", .45, .4, .75, S([0, mix("#5a3a24", "#bfa684", t)], [.7, mix("#2e1b0f", "#95795b", t)], [1, mix("#1a0e07", "#6e5843", t)]));
    let s = d ? `<path d="${d}" fill="${f}"/>` : `<ellipse cx="${n(cx)}" cy="${n(cy)}" rx="${n(rx)}" ry="${n(ry)}" fill="${f}"/>`;
    const r = rng(Math.round(cx * 7 + cy * 3));
    for (let i = 0; i < 12; i++) { const an = r() * 6.283, rr = Math.sqrt(r()) * .82;
      const x = cx + Math.cos(an) * rx * rr, y = cy + Math.sin(an) * ry * rr, lt = i % 3 === 0;
      s += `<ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(.7 + r() * .9)}" ry="${n(.45 + r() * .4)}" fill="${lt ? mix("#7a5638", "#e2cfb0", t) : "#120904"}" opacity="${lt ? .55 : .35}"/>`; }
    for (let i = 0; i < 3; i++) { const an = r() * 6.283, rr = Math.sqrt(r()) * .7; s += `<circle cx="${n(cx + Math.cos(an) * rx * rr)}" cy="${n(cy + Math.sin(an) * ry * rr)}" r=".75" fill="#f4f1ea" opacity=".75"/>`; }
    if (st.dry > .2) {
      const o = n(st.dry * .85), q = (fx, fy) => `${n(cx + fx * rx)} ${n(cy + fy * ry)}`;
      s += `<path d="M${q(-.75, -.1)}L${q(-.42, .12)}L${q(-.18, -.05)}L${q(.1, .3)}M${q(-.18, -.05)}L${q(-.05, -.5)}M${q(.1, .3)}L${q(.45, .1)}L${q(.78, .2)}M${q(.45, .1)}L${q(.5, -.45)}" fill="none" stroke="#3a2a1c" stroke-opacity="${o}" stroke-width=".8" stroke-linejoin="round"/>`;
      if (!d) s += `<ellipse cx="${n(cx)}" cy="${n(cy)}" rx="${n(rx - .6)}" ry="${n(ry - .4)}" fill="none" stroke="#1a100a" stroke-opacity="${n(st.dry * .55)}" stroke-width="1.3"/>`;
    }
    if (st.wet > .35) s += `<ellipse cx="${n(cx - rx * .3)}" cy="${n(cy - ry * .25)}" rx="${n(rx * .38)}" ry="${n(ry * .32)}" fill="#fff" opacity="${n(st.wet * .14)}"/>`;
    return s;
  }

  function pot(st, c, p) {
    const cx = p.cx, y = p.y, h = p.h, rt = p.rt, rb = p.rb, ry = p.ry || rt * .2, mat = p.mat || "matte", bul = p.bul || 0, rh = p.rim || 0;
    const L = sh(c, .34), M = c, D = sh(c, -.5), K = sh(c, -.74);
    const body = LGd(st, "pb", 0, 0, 1, 0, S([0, D], [.28, L], [.6, M], [1, sh(c, -.58)]));
    const by = y + h, rby = rb * .2;
    const bodyD = `M${n(cx - rt)} ${y}Q${n(cx - (rt + rb) / 2 - bul)} ${n(y + h * .55)} ${n(cx - rb)} ${n(by)}A${rb} ${n(rby)} 0 0 0 ${n(cx + rb)} ${n(by)}Q${n(cx + (rt + rb) / 2 + bul)} ${n(y + h * .55)} ${n(cx + rt)} ${y}Z`;
    let s = p.noShadow ? "" : shadow(cx, by + 1, rb * 1.3 + 4, 5);
    s += `<path d="${bodyD}" fill="${body}"/>`;
    const r = rng(Math.round(c.length * 31 + cx * 13 + y));
    const inside = (fy, m) => { const hw = (rt + (rb - rt) * fy) + bul * Math.sin(Math.PI * fy) * .8 - (m || 3); return hw; };
    if (mat === "concrete" || mat === "terrazzo") {
      const cols = mat === "terrazzo" ? ["#c46a4a", "#7d9a86", "#2b2b2e", "#e9e2d2", "#d9a441"] : null;
      for (let i = 0; i < (cols ? 30 : 46); i++) { const fy = .06 + r() * .88, hw = inside(fy, 4), xx = cx + (r() * 2 - 1) * hw, yy = y + rh + fy * (h - rh);
        if (cols) { const rr = 1 + r() * 1.4; s += `<path d="M${n(xx - rr)} ${n(yy)}L${n(xx)} ${n(yy - rr * .8)}L${n(xx + rr)} ${n(yy + .2)}L${n(xx + .2)} ${n(yy + rr * .7)}Z" fill="${cols[i % 5]}" opacity=".85"/>`; }
        else s += `<circle cx="${n(xx)}" cy="${n(yy)}" r="${n(.35 + r() * .7)}" fill="${i % 2 ? "#000" : "#fff"}" opacity="${i % 2 ? .22 : .16}"/>`; }
    }
    if (mat === "basket") {
      const cid = st.u + "-bc"; st.D.push(`<clipPath id="${cid}"><path d="${bodyD}"/></clipPath>`);
      let w = "", v = ""; let row = 0;
      for (let yy = y + rh + 4; yy < by + 2; yy += 5.4, row++) { const fy = (yy - y) / h, hw = inside(fy, 0);
        w += `M${n(cx - hw - 2)} ${n(yy)}Q${cx} ${n(yy + hw * .42)} ${n(cx + hw + 2)} ${n(yy)}`;
        for (let j = -6; j <= 6; j++) { const th = (j + (row % 2 ? .5 : 0)) * Math.PI / 13; if (Math.abs(th) > 1.5) continue; const xx = cx + hw * Math.sin(th), yo = hw * .21 * Math.cos(th);
          v += `<path d="M${n(xx)} ${n(yy + yo + .9)}L${n(xx)} ${n(yy + yo + 4.3)}" stroke="${sh(c, .55)}" stroke-opacity=".38" stroke-width="${n(2.6 * Math.cos(th))}" stroke-linecap="round"/>`; } }
      s += `<g clip-path="url(#${cid})"><path d="${w}" fill="none" stroke="#000" stroke-opacity=".32" stroke-width="1"/>${v}</g>`;
    }
    s += `<path d="${bodyD}" fill="${LGd(st, "pv", 0, 0, 0, 1, S([0, "#fff", .05], [.45, "#000", 0], [1, "#000", .26]))}"/>`;
    if (mat === "glaze") {
      s += `<path d="M${n(cx - rt * .62)} ${n(y + rh + 4)}Q${n(cx - rt * .74 - bul * .6)} ${n(y + h * .5)} ${n(cx - rb * .7)} ${n(by - 7)}L${n(cx - rb * .5)} ${n(by - 7)}Q${n(cx - rt * .5 - bul * .5)} ${n(y + h * .5)} ${n(cx - rt * .42)} ${n(y + rh + 4)}Z" fill="#fff" opacity=".34"/>`;
      s += `<path d="M${n(cx + rt * .5)} ${n(y + rh + 5)}Q${n(cx + rt * .6 + bul * .5)} ${n(y + h * .45)} ${n(cx + rb * .62)} ${n(by - 9)}" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="3" stroke-linecap="round"/>`;
      const fy = by - 6, hw = rb + 1.2;
      s += `<path d="M${n(cx - hw)} ${n(fy)}Q${n(cx - hw * .5)} ${n(fy + rby * 1.6)} ${cx} ${n(fy + rby * 2.1)}Q${n(cx + hw * .5)} ${n(fy + rby * 2.5)} ${n(cx + hw)} ${n(fy)}L${n(cx + rb)} ${n(by)}A${rb} ${n(rby)} 0 0 1 ${n(cx - rb)} ${n(by)}Z" fill="${LGd(st, "clay", 0, 0, 1, 0, S([0, "#7a5a40"], [.3, "#dcbb98"], [.65, "#b89070"], [1, "#6e4f37"]))}"/>`;
    } else if (mat !== "basket") {
      s += `<path d="M${n(cx - rt * .6)} ${n(y + rh + 4)}Q${n(cx - rt * .7 - bul * .6)} ${n(y + h * .5)} ${n(cx - rb * .66)} ${n(by - 4)}" fill="none" stroke="#fff" stroke-opacity="${mat === "matte" ? .1 : .08}" stroke-width="${n(rt * .22)}" stroke-linecap="round"/>`;
    }
    if (mat === "terra") s += `<path d="M${n(cx - rb - 1)} ${n(by - 7)}Q${cx} ${n(by - 7 + rby * 2)} ${n(cx + rb + 1)} ${n(by - 7)}" fill="none" stroke="#fff" stroke-opacity=".07" stroke-width="4"/>`;
    if (rh) {
      const rim = LGd(st, "pr", 0, 0, 1, 0, S([0, sh(c, -.4)], [.28, sh(c, .5)], [.6, sh(c, .12)], [1, sh(c, -.46)]));
      s += `<path d="M${n(cx - rt - 2.6)} ${y}L${n(cx - rt - 2)} ${y + rh}A${rt + 2} ${n(ry)} 0 0 0 ${n(cx + rt + 2)} ${y + rh}L${n(cx + rt + 2.6)} ${y}Z" fill="${rim}"/>`;
      s += `<path d="M${n(cx - rt - 2)} ${y + rh}A${rt + 2} ${n(ry)} 0 0 0 ${n(cx + rt + 2)} ${y + rh}" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="1.6"/>`;
      if (mat === "basket") s += `<path d="M${n(cx - rt - 2)} ${y + rh * .5}A${rt + 2} ${n(ry)} 0 0 0 ${n(cx + rt + 2)} ${y + rh * .5}" fill="none" stroke="#000" stroke-opacity=".28" stroke-width="${rh * .8}" stroke-dasharray="2.2 2.2"/>`;
    }
    const er = rt + (rh ? 2.6 : 0);
    s += `<ellipse cx="${cx}" cy="${y}" rx="${n(er)}" ry="${n(ry + .7)}" fill="${sh(c, .14)}"/>`;
    s += `<ellipse cx="${cx}" cy="${n(y + .3)}" rx="${n(er - 3)}" ry="${n(ry - .5)}" fill="${K}"/>`;
    if (!p.noSoil) s += soil(st, cx, y + 1.7, er - 4.6, ry - 2);
    s += `<path d="M${n(cx - er + 1)} ${n(y + 1)}A${n(er - 1)} ${n(ry)} 0 0 0 ${n(cx + er * .4)} ${n(y + ry * .95)}" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width="1"/>`;
    return s;
  }
  function box(st, c, p) {
    const x = p.x, y = p.y, w = p.w, h = p.h, dp = p.dp || 9, dx = dp * 1.1;
    const K = sh(c, -.72);
    let s = shadow(x + w / 2 + 4, y + dp + h + 1, w * .55, 5);
    s += `<rect x="${x}" y="${y + dp}" width="${w}" height="${h}" fill="${LGd(st, "bf", 0, 0, 1, 0, S([0, sh(c, .22)], [.55, c], [1, sh(c, -.16)]))}"/>`;
    s += `<path d="M${x + w} ${y + dp}L${n(x + w + dx)} ${y}L${n(x + w + dx)} ${y + h}L${x + w} ${y + dp + h}Z" fill="${LGd(st, "bs", 0, 0, 0, 1, S([0, sh(c, -.32)], [1, sh(c, -.62)]))}"/>`;
    const r = rng(Math.round(x * 3 + w));
    for (let i = 0; i < 50; i++) s += `<circle cx="${n(x + 2 + r() * (w - 4))}" cy="${n(y + dp + 2 + r() * (h - 4))}" r="${n(.35 + r() * .7)}" fill="${i % 2 ? "#000" : "#fff"}" opacity="${i % 2 ? .22 : .15}"/>`;
    s += `<rect x="${x}" y="${y + dp}" width="${w}" height="${h}" fill="${LGd(st, "pv", 0, 0, 0, 1, S([0, "#fff", .05], [.45, "#000", 0], [1, "#000", .26]))}"/>`;
    s += `<path d="M${x} ${y + dp}L${n(x + dx)} ${y}L${n(x + w + dx)} ${y}L${x + w} ${y + dp}Z" fill="${sh(c, .3)}"/>`;
    const op = `M${n(x + 3.5)} ${n(y + dp - 1)}L${n(x + dx + 1.6)} ${n(y + 1.3)}L${n(x + w + dx - 3.4)} ${n(y + 1.3)}L${n(x + w - 1.5)} ${n(y + dp - 1)}Z`;
    s += `<path d="${op}" fill="${K}"/>`;
    const sd = `M${n(x + 4.6)} ${n(y + dp - 1.6)}L${n(x + dx + 2.4)} ${n(y + 2.6)}L${n(x + w + dx - 4.2)} ${n(y + 2.6)}L${n(x + w - 2.6)} ${n(y + dp - 1.6)}Z`;
    s += soil(st, x + w / 2 + dx / 2, y + dp / 2 + .4, w / 2 - 4, dp / 2 - 1.6, sd);
    s += `<path d="M${x} ${y + dp + .5}L${x + w} ${y + dp + .5}" stroke="#fff" stroke-opacity=".35" stroke-width="1"/>`;
    return s;
  }
  function wood(st, k, c, vert) { return LGd(st, k, 0, 0, vert ? 0 : 1, vert ? 1 : 0, S([0, sh(c, -.35)], [.3, sh(c, .25)], [.7, c], [1, sh(c, -.45)])); }

  const GR = {
    mon: { l: "#7cc66a", m: "#2f8040", d: "#13451f" }, snake: { l: "#6f9f62", m: "#2f5e36", d: "#173621" },
    poth: { l: "#9ad866", m: "#4e9d35", d: "#24601e" }, zz: { l: "#69b85c", m: "#2a6f33", d: "#103a19" },
    lily: { l: "#6cbf5e", m: "#2b7a3a", d: "#13401f" }, rub: { l: "#a0606a", m: "#552534", d: "#2a0f18" },
    pearl: { l: "#b9e39a", m: "#6bab52", d: "#36702e" }, aloe: { l: "#acd6a2", m: "#5f9b6e", d: "#2f5f45" },
    jade: { l: "#9cd67e", m: "#4c9a45", d: "#285f2a" }, cact: { l: "#86c47c", m: "#3f8a4a", d: "#1d5230" },
    cal: { l: "#c2e695", m: "#7fba5c", d: "#447c36" }, fern: { l: "#acdf7c", m: "#5aae3e", d: "#2e6e26" },
    spid: { l: "#a9dc78", m: "#5aa443", d: "#2f6a28" }, phil: { l: "#5f9a52", m: "#24552c", d: "#0f2e17" },
    bop: { l: "#9cc98a", m: "#4f8f5c", d: "#24563a" }, pil: { l: "#aadf76", m: "#5aa83c", d: "#2f6e24" },
    bas: { l: "#b1e57e", m: "#5cae3c", d: "#2e6e22" }, mint: { l: "#8fcf88", m: "#3f8f50", d: "#1f5530" },
    ros: { l: "#9fbf98", m: "#5d8a68", d: "#2f5240" }, hoya: { l: "#9ccf86", m: "#4f8f4c", d: "#22502a" },
  };

  function monstera(o) {
    const st = ST(o), g = greens(st, GR.mon), lf = crossFill(st, "lf", g), stem = stemOf(g), mid = st.u + "-mm";
    let sl = "";
    [-9, -22, -35, -47].forEach((y, i) => [1, -1].forEach((s) => {
      sl += `<path d="M${s * 6.5} ${y + 1.2}L${s * 46} ${y - 12}L${s * 46} ${y - 7.6}L${s * 6.5} ${y + 3.2}Z"/><circle cx="${s * 6.6}" cy="${y + 2.2}" r="1.05"/>`;
      if (i < 3) sl += `<ellipse cx="${s * 13}" cy="${y - 6.4}" rx="2.7" ry="1.5" transform="rotate(${s * -22} ${s * 13} ${y - 6.4})"/>`; }));
    st.D.push(`<mask id="${mid}" maskUnits="userSpaceOnUse" x="-60" y="-75" width="120" height="100"><rect x="-60" y="-75" width="120" height="100" fill="#fff"/><g fill="#000">${sl}</g></mask>`);
    const G = geom("heart", 62, 31, 0);
    let vn = ""; [-3, -16, -29, -41].forEach((y) => { vn += `M2 ${y}L30 ${y - 9}M-2 ${y}L-30 ${y - 9}`; });
    const B = [100, 138];
    const L = [[-4, 84, .86, 0], [46, 70, .92, 1], [-48, 66, .92, 2], [82, 46, .8, 3], [-84, 48, .8, 4], [16, 38, .62, 5], [-24, 34, .6, 6]];
    let out = "";
    L.forEach((q) => {
      const side = q[0] >= 0 ? 1 : -1, dr = st.droop, pa = q[0] + side * dr * 34, pl = q[1] * (1 - dr * .08);
      const bx = B[0] + q[0] * .06, ex = bx + Math.sin(rad(pa)) * pl, ey = B[1] - Math.cos(rad(pa)) * pl;
      const cx = bx + Math.sin(rad(pa * .4)) * pl * .5, cy = B[1] - pl * .62;
      out += `<path d="M${n(bx)} ${B[1]}Q${n(cx)} ${n(cy)} ${n(ex)} ${n(ey)}" fill="none" stroke="${stem}" stroke-width="2.4" stroke-linecap="round"/><path d="M${n(bx - .6)} ${B[1]}Q${n(cx - .6)} ${n(cy)} ${n(ex - .6)} ${n(ey)}" fill="none" stroke="#fff" stroke-opacity=".16" stroke-width=".8"/>`;
      const A = pa * 1.15 + side * (14 + dr * 52), sc = q[2], sq = 1 - dr * .28;
      out += `<g transform="translate(${n(ex)} ${n(ey)}) rotate(${n(A)}) scale(${sc} ${n(sc * sq)})"><g mask="url(#${mid})"><path d="${G.d}" fill="${lf}"/><path d="${G.half}" fill="#000" opacity=".16"/><path d="${vn}" stroke="#fff" stroke-opacity=".13" stroke-width=".7"/><path d="${G.d}" fill="none" stroke="#000" stroke-opacity=".22" stroke-width=".6"/></g>` +
        `<path d="${G.rib}" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="1.1"/><path d="M-26 -14Q-30 -34 -6 -55" fill="none" stroke="#fff" stroke-opacity="${n(st.gloss)}" stroke-width="2" stroke-linecap="round"/>${q[3] < 3 ? bead(st, -14, -30, 1.3) + bead(st, 18, -44, 1) : ""}</g>`;
    });
    return svg(st, pot(st, o.color, { cx: 100, y: 134, h: 50, rt: 43, rb: 34, mat: "basket", rim: 6 }) + sway(out, 0));
  }

  function snake(o) {
    const st = ST(o), g = greens(st, GR.snake), lf = crossFill(st, "lf", g), edge = mix("#d8d063", "#b39a54", st.dry);
    const band = mix("#b9d6a6", "#d9cf9a", st.dry);
    const pat = (G) => { let d = ""; for (let j = 0; j < 9; j++) { const f = .08 + j * .1, hw = G.wAt(f) * G.W * .72, r = G.rp(f);
      d += `M${n(r[0] - hw)} ${n(r[1])}l${n(hw * .5)} -1.8l${n(hw * .5)} 1.8l${n(hw * .5)} -1.8l${n(hw * .5)} 1.8`; }
      return `<path d="${d}" fill="none" stroke="${band}" stroke-opacity=".42" stroke-width="1.5" stroke-linejoin="round"/>`; };
    const L = [[-3, 124, 10, 98], [5, 114, 10, 104], [-13, 100, 9, 92], [15, 96, 9, 108], [-24, 76, 8, 86], [27, 74, 8, 114], [9, 90, 9, 100], [-9, 84, 9, 95]];
    let out = "";
    L.forEach((q, i) => { out += leaf(st, q[3], 142, q[0], q[1], q[2], { shape: "sword", fill: lf, edge, ew: 1.6, pat, flop: .75, da: 34, db: .42, ro: .12, gl: .8, dew: i < 3 ? [[.55, -.2, 1.1]] : null, b: (i % 2 ? 1 : -1) * 3 }); });
    return svg(st, box(st, o.color, { x: 64, y: 134, w: 70, h: 48, dp: 10 }) + sway(out, 1.4));
  }

  function pothos(o) {
    const st = ST(o), g = greens(st, GR.poth), lf = crossFill(st, "lf", g), stem = stemOf(g);
    const vari = mix("#efe58e", "#e6d79a", st.dry);
    const pat = (G) => `<path d="M.5 -2Q${n(G.W * .55 + G.b * .2)} ${n(-G.L * .42)} ${n(G.b * .7 + G.W * .1)} ${n(-G.L * .82)}" fill="none" stroke="${vari}" stroke-opacity=".5" stroke-width="${n(G.W * .32)}" stroke-linecap="round"/>`;
    const lk = { shape: "heart", fill: lf, pat, ro: .3, veins: 0 };
    let s = "";
    s += `<g class="hda-bg"><rect x="28" y="103" width="144" height="12" fill="#000" opacity=".16"/>`;
    s += `<path d="M46 104L46 124L58 104Z" fill="#2f2a33"/><path d="M154 104L154 124L142 104Z" fill="#2f2a33"/>`;
    s += `<path d="M24 94L176 94L172 98L28 98Z" fill="${sh("#b48459", .2)}"/><rect x="24" y="96" width="152" height="8" rx="1.2" fill="${wood(st, "sh", "#a8784e", true)}"/>`;
    s += `<path d="M30 99.5H96M104 101.5H170" stroke="#3a2416" stroke-opacity=".3" stroke-width=".6"/></g>`;
    s += pot(st, o.color, { cx: 100, y: 58, h: 37, rt: 27, rb: 22, mat: "glaze", noShadow: true });
    s += `<ellipse cx="100" cy="95" rx="27" ry="3" fill="#000" opacity=".25"/>`;
    let top = "";
    [[-58, 10, 16, 9.5], [60, 10, 16, 9.5], [-26, 16, 18, 10.5], [24, 16, 18, 10.5], [-4, 20, 17, 10]].forEach((q, i) => {
      top += pleaf(st, 100 + q[0] * .1, 59, q[0], q[1], q[2], q[3], Object.assign({ stem, sw: 1.3, tilt: 6, flop: .9, pda: 40, da: 40, dew: i > 2 ? [[.5, -.3, 1]] : null }, lk)); });
    const V = [[80, 62, 56, 72, 42, 112, 40, 170], [92, 64, 84, 98, 76, 132, 80, 188], [112, 64, 124, 98, 118, 140, 124, 178], [124, 61, 150, 72, 158, 108, 160, 152], [74, 60, 44, 62, 32, 92, 30, 128]];
    let vines = "";
    V.forEach((p, vi) => {
      vines += `<path d="M${p[0]} ${p[1]}C${p[2]} ${p[3]} ${p[4]} ${p[5]} ${p[6]} ${p[7]}" fill="none" stroke="${stem}" stroke-width="1.4" stroke-linecap="round"/>`;
      for (let t = .1, j = 0; t < .99; t += .115, j++) { const q = cub(p, t), sd = j % 2 ? 1 : -1, Lf = 19 - t * 8;
        vines += leaf(st, q[0], q[1], q[2] + sd * 72, Lf, Lf * .58, Object.assign({}, lk, { grav: .55, g0: .25, side: sd, dew: (vi + j) % 4 === 0 ? [[.5, .3, .9]] : null })); }
    });
    return svg(st, s + sway(vines, 2.1, true) + sway(top, .6));
  }

  function zz(o) {
    const st = ST(o), g = greens(st, GR.zz), lf = crossFill(st, "lf", g), stem = mix(g.m, "#4a6a2a", .2);
    const S0 = [[-6, -24, 80], [6, -4, 98], [12, 16, 88], [-14, -42, 62], [16, 40, 64], [-2, 30, 74], [-8, -12, 70]];
    let out = "";
    S0.forEach((q, si) => {
      const side = q[1] >= 0 ? 1 : -1, dr = st.droop, a = q[1] + side * dr * 34, len = q[2] * (1 - dr * .06);
      const b0 = [100 + q[0], 140], e = [b0[0] + Math.sin(rad(a)) * len, b0[1] - Math.cos(rad(a)) * len], c = [b0[0] + Math.sin(rad(a * .35)) * len * .5, b0[1] - len * .62];
      out += `<path d="M${pp(b0)}Q${pp(c)} ${pp(e)}" fill="none" stroke="${stem}" stroke-width="2.3" stroke-linecap="round"/><path d="M${pp(b0)}Q${pp(c)} ${pp(e)}" fill="none" stroke="#fff" stroke-opacity=".2" stroke-width=".7" transform="translate(-.6 0)"/>`;
      out += `<ellipse cx="${b0[0]}" cy="${b0[1] - 3}" rx="3" ry="5" fill="${stem}"/><ellipse cx="${b0[0] - 1}" cy="${b0[1] - 4}" rx="1" ry="3" fill="#fff" opacity=".2"/>`;
      for (let t = .3, j = 0; t < .93; t += .12, j++) { const pq = quad(b0, c, e, t), Lf = 15.5 - t * 4;
        [1, -1].forEach((sd) => { out += leaf(st, pq[0], pq[1], pq[2] + sd * 58, Lf, 6.2, { shape: "oval", fill: lf, side: sd, flop: .6, da: 30, gl: 1.7, ro: .18, dew: (si + j) % 5 === 0 && sd > 0 ? [[.5, 0, .9]] : null }); }); }
      const pe = quad(b0, c, e, 1); out += leaf(st, pe[0], pe[1], pe[2], 13, 5.6, { shape: "oval", fill: lf, side, flop: .6, gl: 1.7, ro: .18 });
    });
    return svg(st, pot(st, o.color, { cx: 100, y: 138, h: 46, rt: 32, rb: 27, mat: "glaze", bul: 5 }) + sway(out, 2.8));
  }

  function lily(o) {
    const st = ST(o), g = greens(st, GR.lily), lf = crossFill(st, "lf", g), stem = stemOf(g);
    const L = [[-8, 44, 54, 14], [12, 48, 54, 14], [-30, 36, 50, 14], [33, 36, 50, 14], [-2, 30, 46, 13], [-53, 26, 46, 13], [56, 24, 46, 13], [20, 26, 44, 12], [-76, 18, 40, 12], [80, 16, 40, 12]];
    let out = "";
    L.forEach((q, i) => { out += pleaf(st, 100 + q[0] * .1, 140, q[0], q[1], q[2], q[3], { fill: lf, stem, sw: 1.7, pda: 42, da: 42, db: .4, b: (q[0] >= 0 ? 1 : -1) * 4, veins: 6, vs: .16, gl: 1.3, ro: .32, dew: i % 3 === 0 ? [[.45, -.35, 1.1]] : null }); });
    return svg(st, pot(st, o.color, { cx: 100, y: 138, h: 46, rt: 36, rb: 29, mat: "matte" }) + sway(out, 3.5));
  }

  function rubber(o) {
    const st = ST(o), g = greens(st, GR.rub, .65), lf = crossFill(st, "lf", g);
    const b0 = [100, 142], c = [106, 92], e = [98, 34 + st.droop * 6];
    let out = `<path d="M${pp(b0)}Q${pp(c)} ${pp(e)}" fill="none" stroke="${mix("#6b5a3a", "#8a7a52", st.dry)}" stroke-width="4" stroke-linecap="round"/><path d="M${pp(b0)}Q${pp(c)} ${pp(e)}" fill="none" stroke="#fff" stroke-opacity=".2" stroke-width="1.2" transform="translate(-1.2 0)"/>`;
    const T = [[.14, -1, 36], [.25, 1, 39], [.37, -1, 40], [.49, 1, 40], [.6, -1, 37], [.71, 1, 34], [.81, -1, 28], [.89, 1, 22]];
    T.forEach((q, i) => { const p = quad(b0, c, e, q[0]), sd = q[1], a = p[2] + sd * 56;
      const pe = [p[0] + Math.sin(rad(a)) * 5, p[1] - Math.cos(rad(a)) * 5];
      out += `<path d="M${pp(p)}L${pp(pe)}" stroke="#5a3a2a" stroke-width="1.6" stroke-linecap="round"/>`;
      out += leaf(st, pe[0], pe[1], a + sd * 6, q[2] * 1.05, q[2] * .27, { shape: "oval", fill: lf, side: sd, da: 70, db: .2, rib: "#e0808a", ro: .55, rw: 1.1, gl: 1.6, veins: 0, dew: i % 3 === 1 ? [[.5, -.35, 1.1]] : null }); });
    const pe = quad(b0, c, e, 1);
    out += leaf(st, pe[0], pe[1], pe[2], 16, 2.6, { fill: LGd(st, "sht", 0, 1, 0, 0, S([0, "#8a2a32"], [1, "#e0606a"])), rib: false, ho: .1, gl: 1.2 });
    return svg(st, pot(st, o.color, { cx: 100, y: 140, h: 46, rt: 30, rb: 25, mat: "glaze", bul: 2 }) + sway(out, 1.1));
  }

  function pearls(o) {
    const st = ST(o), g = greens(st, GR.pearl), rope = "#e8dcc2", ropeD = "#b9a888";
    const pf = RG(st, "pe", .36, .32, .72, S([0, mix(g.l, "#ffffff", .55)], [.45, g.l], [1, g.d]));
    const pr = 3.3 * (1 - .26 * st.dry);
    const pearl = (x, y, r) => `<circle cx="${n(x)}" cy="${n(y)}" r="${n(r)}" fill="${pf}"/><path d="M${n(x + r * .15)} ${n(y - r * .7)}Q${n(x + r * .55)} ${n(y)} ${n(x + r * .1)} ${n(y + r * .65)}" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width=".6"/>` +
      (st.dry > .3 ? `<path d="M${n(x - r * .6)} ${n(y - r * .1)}Q${n(x)} ${n(y + r * .45)} ${n(x + r * .55)} ${n(y - r * .2)}" fill="none" stroke="#3a3a1a" stroke-opacity="${n(st.dry * .55)}" stroke-width=".55"/>` : "");
    const rp = (d, w) => `<path d="${d}" fill="none" stroke="${ropeD}" stroke-width="${w || 2.2}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${rope}" stroke-width="${(w || 2.2) - .8}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#7a6a50" stroke-opacity=".45" stroke-width="${(w || 2.2) - .8}" stroke-dasharray="1.2 1.6"/>`;
    let s = `<circle cx="100" cy="11" r="4.2" fill="none" stroke="#c9a24a" stroke-width="1.8"/><path d="M97 9.5a3.4 3.4 0 0 1 5 -1" fill="none" stroke="#fff3c0" stroke-opacity=".6" stroke-width=".7"/>`;
    s += rp("M99 15L72 70") + rp("M101 15L128 70") + rp("M100 15L94 44L104 58L100 72");
    s += `<rect x="96" y="14" width="8" height="7" rx="2.5" fill="${ropeD}"/><path d="M96.5 16.5h7M96.5 18.5h7" stroke="#7a6a50" stroke-opacity=".5" stroke-width=".6"/>`;
    s += `<ellipse cx="86" cy="44" rx="2.8" ry="2.2" fill="${ropeD}"/><ellipse cx="114" cy="44" rx="2.8" ry="2.2" fill="${ropeD}"/>`;
    s += pot(st, o.color, { cx: 100, y: 72, h: 28, rt: 30, rb: 19, mat: "matte", bul: 4, noShadow: true });
    s += rp("M72 72Q76 94 100 104") + rp("M128 72Q124 94 100 104");
    s += `<rect x="95" y="101" width="10" height="9" rx="3" fill="${ropeD}"/>`;
    let tas = ""; for (let i = -4; i <= 4; i++) tas += `M${100 + i * .8} 108L${n(100 + i * 2.1)} 136`;
    s += `<path d="${tas}" stroke="${rope}" stroke-width="1.1" stroke-linecap="round"/><path d="${tas}" stroke="#7a6a50" stroke-opacity=".3" stroke-width="1.1" stroke-dasharray="1 2"/>`;
    const r = rng(9); let m = "";
    for (let i = 0; i < 18; i++) { const an = r() * 6.283, rr = Math.sqrt(r()) * .9; m += pearl(100 + Math.cos(an) * 24 * rr, 70.5 + Math.sin(an) * 4.2 * rr - (1 - rr) * 3, pr * .95); }
    const X = [74, 80, 87, 93, 99, 106, 112, 119, 126], LEN = [64, 96, 58, 110, 86, 116, 66, 94, 70];
    let str = "";
    X.forEach((x0, i) => { const fx = (x0 - 100) / 30, y0 = 72 + 6 * Math.sqrt(Math.max(0, 1 - fx * fx)) - 1, len = LEN[i] * (1 - st.droop * .06);
      let d = `M${x0} ${n(y0)}`, pe = ""; const k = Math.floor(len / (pr * 1.95));
      for (let j = 1; j <= k; j++) { const t = j / k, y = y0 + t * len, x = x0 + (x0 - 100) * .22 * t + Math.sin(t * 5 + i * 1.7) * 2.4;
        d += `L${n(x)} ${n(y)}`; pe += pearl(x, y, j > k - 2 ? pr * .78 : pr); if (j === Math.floor(k * .55) && i % 2 === 0) pe += bead(st, x + pr * .9, y - pr * .8, .8); }
      str += `<path d="${d}" fill="none" stroke="${mix(g.d, "#6a5a2a", .4)}" stroke-width=".8"/>${pe}`; });
    return svg(st, sway(s + m + str, 0, true));
  }

  function aloe(o) {
    const st = ST(o), g = greens(st, GR.aloe, .7);
    const lf = lenFill(st, "al", mix(g.l, "#ffffff", .12), g.m, mix(g.d, BROWN, st.dry * .95));
    const tooth = mix("#e8f2d8", "#d9c79a", st.dry);
    const pat = (G) => { let t = "", sp = ""; for (let f = .18; f < .9; f += .1) [1, -1].forEach((s) => { const p = G.at(s, f, 1); t += `M${n(p[0])} ${n(p[1] + 1.2)}l${n(s * 2)} -2.2l${n(-s * .6)} 2.6Z`; });
      const r = rng(Math.round(G.L * 10)); for (let i = 0; i < 9; i++) { const f = .12 + r() * .7, p = G.at(r() > .5 ? 1 : -1, f, r() * .7); sp += `<ellipse cx="${n(p[0])}" cy="${n(p[1])}" rx="1" ry=".55" fill="#fff" opacity=".42"/>`; }
      return `<path d="${t}" fill="${tooth}"/>${sp}`; };
    const L = [[-8, 78, 8], [12, 74, 8], [-30, 66, 9], [33, 64, 9], [1, 60, 9], [-55, 56, 10], [58, 54, 10], [-18, 48, 10], [22, 46, 10], [-80, 40, 9], [82, 40, 9]];
    let out = "";
    L.forEach((q, i) => { out += leaf(st, 100 + q[0] * .1, 138, q[0], q[1], q[2], { fill: lf, pat, flop: .45, da: 32, curl: 1.2, b: (q[0] >= 0 ? 1 : -1) * q[1] * .06, ro: .14, rw: 2, gl: 1.2, ho: .18, dew: i === 4 || i === 7 ? [[.45, -.3, 1.1]] : null }); });
    return svg(st, pot(st, o.color, { cx: 100, y: 136, h: 48, rt: 37, rb: 28, mat: "terra", rim: 9 }) + sway(out, 4.2));
  }

  function jade(o) {
    const st = ST(o), g = greens(st, GR.jade, .7), lf = crossFill(st, "lf", g), edge = HH().rgba(mix("#c4524a", "#9a6a3a", st.dry), .75);
    const bark = mix("#7d6c4c", "#94825c", st.dry), dr = st.droop;
    const br = [["M100 152C100 140 99 128 98 118", 8], ["M98 120C90 108 80 98 64 84", 5], ["M98 120C108 108 122 94 140 82", 5], ["M99 122C100 104 99 86 96 62", 4.5], ["M78 98C80 90 84 82 86 74", 3], ["M120 96C118 86 114 78 112 70", 3], ["M98 132C90 126 82 120 72 116", 3]];
    let out = br.map((b) => `<path d="${b[0]}" fill="none" stroke="${bark}" stroke-width="${b[1]}" stroke-linecap="round"/><path d="${b[0]}" fill="none" stroke="#e6d8b0" stroke-opacity=".3" stroke-width="${n(b[1] * .3)}" stroke-linecap="round" transform="translate(-${n(b[1] * .22)} 0)"/>`).join("");
    out += `<path d="M98 140q2 -1 1 -3M97 128q2 -1 1 -3" stroke="#3a2a1a" stroke-opacity=".4" stroke-width=".7" fill="none"/>`;
    const C = [[64, 84, -40, 9], [140, 82, 42, 9], [96, 62, 0, 9], [86, 74, -14, 6], [112, 70, 12, 6], [72, 116, -60, 6]];
    C.forEach((cq, ci) => { for (let i = 0; i < cq[3]; i++) { const a = cq[2] - 95 + (190 / (cq[3] - 1)) * i, L = 18 - Math.abs(a - cq[2]) / 24;
      out += leaf(st, cq[0], cq[1], a, L, 7, { shape: "oval", fill: lf, edge, ew: .7, curl: 1.3, flop: .7, grav: .55, g0: 0, gl: 1.5, ro: .12, ho: .14, dew: (ci + i) % 7 === 0 ? [[.55, 0, .9]] : null }); } });
    return svg(st, pot(st, o.color, { cx: 100, y: 150, h: 30, rt: 54, rb: 34, mat: "glaze", bul: 7, ry: 9 }) + sway(out, 5.1));
  }

  function succulents(o) {
    const st = ST(o);
    const ros = (cx, cy, R, b, tipC, key) => {
      const g = greens(st, b, .55), tip = mix(tipC, BROWN, st.dry * .8);
      const f = lenFill(st, key, g.l, g.m, tip); const Rn = R * (1 - st.dry * .1);
      let s = `<ellipse cx="${cx}" cy="${cy + 2}" rx="${n(Rn * 1.05)}" ry="${n(Rn * .35)}" fill="#000" opacity=".3"/><g transform="translate(${cx} ${cy}) scale(1 .68)">`;
      [[1, 11, .34, 0], [.78, 9, .36, 16], [.56, 7, .36, 6], [.34, 5, .3, 30]].forEach((ring, ri) => {
        const pts = []; for (let i = 0; i < ring[1]; i++) pts.push(ring[3] + i * 360 / ring[1]);
        pts.sort((a, b2) => Math.cos(rad(b2)) - Math.cos(rad(a)));
        pts.forEach((a) => { s += leaf(st, 0, 0, a, Rn * ring[0], Rn * ring[2] * (ri === 0 ? 1 - st.dry * .35 : 1), { shape: "lance", fill: f, curl: ri === 0 ? 1.2 : .4, flop: 0, ro: .1, gl: .9, ho: .12 }); }); });
      s += `<circle r="${n(Rn * .12)}" fill="${g.l}"/></g>`;
      return s + bead(st, cx - Rn * .3, cy - Rn * .2, 1) ;
    };
    let s = box(st, o.color, { x: 26, y: 146, w: 140, h: 30, dp: 9 });
    s += ros(56, 144, 29, { l: "#d6eae6", m: "#8fb5b5", d: "#4e7a80" }, "#d88aa0", "r1");
    s += ros(148, 144, 27, { l: "#efd6e8", m: "#b48aa8", d: "#6e4a6a" }, "#d06a8a", "r3");
    s += ros(103, 140, 35, { l: "#dff2b8", m: "#9cc77a", d: "#5a8a4a" }, "#e07a6a", "r2");
    return svg(st, s);
  }

  function cactus(o) {
    const st = ST(o), g = greens(st, GR.cact, .6), f = LGd(st, "cb", 0, 0, 1, 0, S([0, g.d], [.3, g.l], [.62, g.m], [1, sh(g.d, -.3)]));
    const k = 1 - st.dry * .1, ribO = n(.22 + st.dry * .3);
    const parts = ["M86 148L86 46C86 27 114 27 114 46L114 148Z", "M88 112C70 112 62 108 62 94L62 70C62 58 76 58 76 70L76 96C76 100 80 100 88 100Z", "M112 100C130 100 138 96 138 82L138 56C138 44 124 44 124 56L124 84C124 88 120 88 112 88Z"];
    let body = parts.map((d) => `<path d="${d}" fill="${f}"/>`).join("");
    let ribs = "", sp = "";
    [90.5, 95.5, 100.5, 105.5, 110].forEach((x, i) => { ribs += `M${x} ${i === 2 ? 30 : 34}L${x} 148`; for (let y = 38 + (i % 2) * 3.5; y < 146; y += 7) sp += `M${x} ${y}l-1.6 -1.4M${x} ${y}l1.6 -1.4M${x} ${y}l0 -2`; });
    [65.5, 69, 72.5].forEach((x, i) => { ribs += `M${x} 64L${x} 98`; for (let y = 66 + i * 2; y < 96; y += 7) sp += `M${x} ${y}l-1.4 -1.2M${x} ${y}l1.4 -1.2`; });
    [127.5, 131, 134.5].forEach((x, i) => { ribs += `M${x} 50L${x} 86`; for (let y = 52 + i * 2; y < 84; y += 7) sp += `M${x} ${y}l-1.4 -1.2M${x} ${y}l1.4 -1.2`; });
    body += `<path d="${ribs}" stroke="#000" stroke-opacity="${ribO}" stroke-width="1.1"/><path d="${ribs}" stroke="#fff" stroke-opacity=".12" stroke-width=".6" transform="translate(1.6 0)"/>`;
    body += `<path d="${sp}" stroke="#f3ecd2" stroke-opacity=".75" stroke-width=".55" stroke-linecap="round"/>`;
    body += `<path d="M90 140L90 44C90 36 94 32 98 31" fill="none" stroke="#fff" stroke-opacity="${n(st.gloss * .7)}" stroke-width="2" stroke-linecap="round"/>`;
    body += bead(st, 104, 58, 1.1) + bead(st, 66, 76, 1) + bead(st, 132, 64, .9);
    let s = pot(st, o.color, { cx: 100, y: 146, h: 40, rt: 32, rb: 25, mat: "terra", rim: 8 });
    const r = rng(4); for (let i = 0; i < 9; i++) s += `<ellipse cx="${n(76 + r() * 48)}" cy="${n(146 + (r() - .3) * 4)}" rx="${n(1.6 + r() * 1.6)}" ry="${n(1 + r())}" fill="${["#b9b2a6", "#8e877c", "#d8d2c6"][i % 3]}"/>`;
    return svg(st, s + sway(`<g transform="translate(100 0) scale(${n(k)} 1) translate(-100 0)">${body}</g>`, 2));
  }

  function calathea(o) {
    const st = ST(o), g = greens(st, GR.cal), lf = crossFill(st, "lf", g), stem = mix("#7a3a5a", g.m, .5), spot = mix("#2a5a2a", "#6a6a2a", st.dry);
    const pat = (G) => { let s = ""; for (let j = 1; j <= 7; j++) { const f = j / 8.5, r = G.rp(f), sd = j % 2 ? 1 : -1, hw = G.wAt(f) * G.W, big = j % 2 ? 1 : .6;
      s += `<ellipse cx="${n(r[0] + sd * hw * .42)}" cy="${n(r[1])}" rx="${n(hw * .3 * big)}" ry="${n(G.L * .03 * big + .5)}" transform="rotate(${-sd * 18} ${n(r[0] + sd * hw * .42)} ${n(r[1])})" fill="${spot}" opacity=".85"/>`;
      s += `<ellipse cx="${n(r[0] - sd * hw * .4)}" cy="${n(r[1] - G.L * .05)}" rx="${n(hw * .17)}" ry="${n(G.L * .018 + .3)}" transform="rotate(${sd * 18} ${n(r[0] - sd * hw * .4)} ${n(r[1] - G.L * .05)})" fill="${spot}" opacity=".7"/>`; }
      return s; };
    const L = [[-6, 46, 56, 11], [15, 40, 54, 11], [-27, 36, 52, 11], [35, 30, 50, 10], [-47, 26, 46, 10], [54, 22, 46, 10], [-70, 16, 40, 9], [76, 14, 40, 9], [4, 28, 46, 10]];
    let out = "";
    L.forEach((q, i) => { out += pleaf(st, 100 + q[0] * .08, 140, q[0], q[1], q[2], q[3], { fill: lf, stem, sw: 1.4, under: mix("#6a2a5a", "#7a5a4a", st.dry), curl: 1.6, pat, pda: 34, da: 34, ro: .35, gl: 1, dew: i % 4 === 1 ? [[.4, .4, 1]] : null }); });
    return svg(st, pot(st, o.color, { cx: 100, y: 138, h: 46, rt: 33, rb: 27, mat: "glaze", bul: 3 }) + sway(out, 3));
  }

  function fern(o) {
    const st = ST(o), g = greens(st, GR.fern), pf = crossFill(st, "pf", g), rach = mix(g.d, "#5a5a2a", .3), dr = st.droop;
    const c = o.color, uf = wood(st, "ped", c, false);
    let s = shadow(100, 186, 32, 5);
    s += `<path d="M80 184L86 174L114 174L120 184Z" fill="${uf}"/><ellipse cx="100" cy="184" rx="20" ry="3" fill="${sh(c, -.4)}"/><ellipse cx="100" cy="174" rx="14" ry="2.4" fill="${sh(c, .2)}"/>`;
    s += `<path d="M93 140L92 174L108 174L107 140Z" fill="${uf}"/><path d="M92 152h16M92 164h16" stroke="#000" stroke-opacity=".22" stroke-width="1.4"/><path d="M92 151h16M92 163h16" stroke="#fff" stroke-opacity=".15" stroke-width=".7"/>`;
    s += pot(st, c, { cx: 100, y: 112, h: 30, rt: 42, rb: 18, mat: "concrete", rim: 6, bul: 8, noShadow: true });
    const frond = (a, len, sy, flip) => {
      const side = a >= 0 ? 1 : -1, b0 = [100 + a * .1, sy], dir = (an, l) => [Math.sin(rad(an)) * l, -Math.cos(rad(an)) * l];
      const d1 = dir(a * .6, len * .6), d2 = dir(a, len);
      const p1 = [b0[0] + d1[0], b0[1] + d1[1]], p2 = [b0[0] + d2[0], b0[1] + d2[1] + len * (.2 + .45 * Math.abs(a) / 100 + dr * .5)];
      let f = `<path d="M${pp(b0)}Q${pp(p1)} ${pp(p2)}" fill="none" stroke="${rach}" stroke-width="1" stroke-linecap="round"/>`, d = "";
      for (let t = .06; t < .99; t += .068) { const q = quad(b0, p1, p2, t), l = 9.5 * (1 - t * .62) * (1 - st.dry * .3), w = 2.3 * (1 - t * .4);
        [1, -1].forEach((sd) => { const an = rad(q[2] + sd * 68 * (flip || 1)), ux = Math.sin(an), uy = -Math.cos(an), px = -uy, py = ux;
          const ex = q[0] + ux * l, ey = q[1] + uy * l, mx = q[0] + ux * l * .5, my = q[1] + uy * l * .5;
          d += `M${n(q[0])} ${n(q[1])}Q${n(mx + px * w)} ${n(my + py * w)} ${n(ex)} ${n(ey)}Q${n(mx - px * w)} ${n(my - py * w)} ${n(q[0])} ${n(q[1])}Z`; }); }
      return f + `<path d="${d}" fill="${pf}" stroke="${g.d}" stroke-opacity=".5" stroke-width=".35"/>`;
    };
    let out = "";
    [[-12, 66], [14, 64], [0, 56], [-34, 62], [36, 62], [-58, 60], [60, 60], [-24, 48], [26, 48]].forEach((q) => { out += frond(q[0], q[1] * 1.25, 112); });
    [[-82, 58], [84, 58], [-100, 50], [102, 50], [-66, 44], [68, 44]].forEach((q) => { out += frond(q[0], q[1] * 1.2, 114); });
    out += `<path d="M76 108Q74 102 78 98M122 106Q126 101 122 96" fill="none" stroke="#fff" stroke-opacity="${n(st.gloss * .5)}" stroke-width="1"/>`;
    out += bead(st, 82, 74, 1) + bead(st, 118, 70, 1.1) + bead(st, 100, 64, .9);
    return svg(st, s + sway(out, 1.7));
  }

  function spider(o) {
    const st = ST(o), g = greens(st, GR.spid), dr = st.droop;
    const lf = lenFill(st, "sp", g.l, g.m, mix(g.m, BROWN, st.dry * .9)), stripe = mix("#f4f1df", "#e6dcaa", st.dry);
    const pat = (G) => `<path d="${geom("strap", G.L * .96, G.W * .34, G.b).d}" fill="${stripe}" opacity=".88"/>`;
    let s = shadow(100, 190, 44, 4.5);
    const wf = wood(st, "wd", "#9b6b42", false);
    s += `<path d="M74 156L64 190L69 190L80 156Z" fill="${wf}"/><path d="M126 156L136 190L131 190L120 156Z" fill="${wf}"/><path d="M97 158L97 192L103 192L103 158Z" fill="${wf}"/>`;
    s += `<path d="M58 150L58 156A42 6 0 0 0 142 156L142 150Z" fill="${wood(st, "wd2", "#a8784e", true)}"/><ellipse cx="100" cy="150" rx="42" ry="6" fill="${sh("#b48459", .15)}"/><path d="M66 149Q100 145 134 149" fill="none" stroke="#3a2416" stroke-opacity=".25" stroke-width=".6"/>`;
    s += pot(st, o.color, { cx: 100, y: 112, h: 37, rt: 28, rb: 24, mat: "glaze", noShadow: true }) + `<ellipse cx="100" cy="149.5" rx="25" ry="3.2" fill="#000" opacity=".25"/>`;
    const A = [-6, 8, -18, 20, -30, 32, -42, 44, -54, 56, -66, 68, -78, 80, -2, 14, -90, 92];
    let out = "";
    A.slice().sort((x, y) => Math.abs(x) - Math.abs(y)).forEach((a, i) => { const L = 46 + ((i * 37) % 26), side = a >= 0 ? 1 : -1;
      out += leaf(st, 100 + a * .07, 114, a, L, 3.6, { shape: "strap", fill: lf, pat, b: side * L * (.3 + Math.abs(a) / 300), db: .55, da: 34, rib: false, ho: .12, gl: .6, dew: i % 6 === 2 ? [[.4, .9, .8]] : null }); });
    const run = (d, bx, by) => { let r = `<path d="${d}" fill="none" stroke="${mix("#d9d6a0", "#b9a970", st.dry)}" stroke-width="1.1"/>`;
      [-70, -35, 0, 35, 70, -15, 20].forEach((a, j) => { r += leaf(st, bx, by, a, 10 + (j % 3) * 2, 2.6, { shape: "strap", fill: lf, pat, b: (a >= 0 ? 1 : -1) * 3, rib: false, ho: .1, gl: .5 }); }); return r; };
    out += run(`M95 118Q60 ${n(112 + dr * 12)} 40 ${n(150 + dr * 10)}`, 40, 152 + dr * 10) + run(`M106 118Q150 ${n(116 + dr * 10)} 166 ${n(142 + dr * 10)}`, 166, 144 + dr * 10);
    return svg(st, s + sway(out, 4.6));
  }

  function philo(o) {
    const st = ST(o), g = greens(st, GR.phil, .7), lf = crossFill(st, "lf", g), stem = mix(g.m, "#7a8a4a", .2), pin = mix("#f3eed4", "#d9cfa0", st.dry);
    const pat = (G) => { let d = ""; for (let j = 1; j <= 9; j++) { const f = j / 10.5, r = G.rp(f), f2 = Math.min(.97, f + .1);
      [1, -1].forEach((s) => { const e = G.at(s, f2, .92), m = G.at(s, f + .02, .5); d += `M${pp(r)}Q${pp(m)} ${pp(e)}`; }); }
      return `<path d="${d}" fill="none" stroke="${pin}" stroke-opacity=".8" stroke-width=".65" stroke-linecap="round"/>`; };
    const L = [[-6, 32, 48, 19], [24, 26, 45, 18], [-30, 24, 44, 18], [48, 16, 40, 16], [-54, 16, 40, 16], [10, 12, 36, 15], [-18, 10, 34, 14]];
    let out = "";
    L.forEach((q, i) => { out += pleaf(st, 100 + q[0] * .08, 140, q[0], q[1], q[2], q[3], { shape: "oval", fill: lf, stem, sw: 2, pat, b: (q[0] >= 0 ? 1 : -1) * 3, pda: 32, da: 36, gl: 1.5, ro: .5, rib: pin, dew: i % 3 === 0 ? [[.4, -.45, 1.1]] : null }); });
    return svg(st, pot(st, o.color, { cx: 100, y: 138, h: 46, rt: 35, rb: 29, mat: "terrazzo", bul: 2 }) + sway(out, 2.4));
  }

  function bird(o) {
    const st = ST(o), g = greens(st, GR.bop, .75), lf = crossFill(st, "lf", g), stem = mix(g.m, "#7a8a5a", .3), edgeC = mix(g.d, BROWN, st.dry);
    const tears = (G) => { let d = ""; [[.3, 1], [.52, 1], [.66, -1], [.8, 1], [.44, -1]].forEach((q) => { const e = G.at(q[1], q[0], 1), m = G.at(q[1], q[0] - .06, .35); d += `M${pp(e)}L${pp(m)}`; });
      return `<path d="${d}" stroke="${edgeC}" stroke-opacity=".8" stroke-width=".8"/>` + (st.dry > .3 ? `<path d="${G.d}" fill="none" stroke="${BROWN}" stroke-opacity="${n(st.dry * .7)}" stroke-width="1.2"/>` : ""); };
    let s = shadow(100, 191, 40, 4.5), wf = wood(st, "lg", "#8a5a34", false);
    s += `<path d="M80 164L68 191L72.5 191L85 164Z" fill="${wf}"/><path d="M120 164L132 191L127.5 191L115 164Z" fill="${wf}"/><path d="M98 168L98 193L102 193L102 168Z" fill="${wf}"/>`;
    s += pot(st, o.color, { cx: 100, y: 130, h: 38, rt: 32, rb: 25, mat: "matte", noShadow: true });
    const L = [[-10, 72, 48, 15], [15, 64, 46, 15], [-34, 52, 44, 14], [38, 46, 42, 14], [-2, 48, 40, 13], [-58, 36, 38, 13], [60, 32, 36, 12]];
    let out = "";
    L.forEach((q, i) => { out += pleaf(st, 100 + q[0] * .08, 132, q[0], q[1], q[2], q[3], { shape: "paddle", fill: lf, stem, sw: 2.6, pat: tears, pda: 26, da: 34, curl: 1, veins: 9, vs: .2, vo: .13, ro: .4, rw: 1.2, gl: 1, dew: i < 2 ? [[.55, -.4, 1.1]] : null }); });
    return svg(st, s + sway(out, 5.6));
  }

  function pilea(o) {
    const st = ST(o), g = greens(st, GR.pil), dr = st.droop;
    const cf = RG(st, "cn", .42, .38, .7, S([0, mix(g.l, "#ffffff", .2)], [.55, g.m], [1, g.d]));
    const c = o.color;
    let s = shadow(100, 184, 38, 4.5);
    s += `<path d="M62 178L65 184A35 6 0 0 0 135 184L138 178Z" fill="${LGd(st, "sa", 0, 0, 1, 0, S([0, sh(c, -.4)], [.3, sh(c, .4)], [.65, c], [1, sh(c, -.45)]))}"/><ellipse cx="100" cy="178" rx="38" ry="6.4" fill="${sh(c, .15)}"/><ellipse cx="100" cy="178" rx="33" ry="4.8" fill="${sh(c, -.25)}"/>`;
    s += pot(st, c, { cx: 100, y: 142, h: 36, rt: 30, rb: 25, mat: "matte", noShadow: true });
    const stemC = mix(g.m, "#6a7a3a", .3);
    let out = `<path d="M100 144C99 130 101 112 100 ${n(96 + dr * 6)}" fill="none" stroke="${stemC}" stroke-width="3" stroke-linecap="round"/>`;
    const Lv = [[132, -122, 26, 10], [130, 118, 24, 10], [124, -96, 30, 12], [122, 92, 32, 12], [116, -68, 32, 13], [112, 62, 32, 13], [106, -40, 30, 14], [104, 34, 28, 14], [100, -12, 22, 14], [98, 12, 20, 13]];
    Lv.forEach((q, i) => {
      const side = q[1] >= 0 ? 1 : -1, a = grav(q[1], dr * .5), ex = 100 + Math.sin(rad(a)) * q[2], ey = q[0] - Math.cos(rad(a)) * q[2] + Math.abs(Math.sin(rad(a))) * q[2] * .18, R = q[3] * (1 - st.dry * .12);
      out += `<path d="M100 ${q[0]}Q${n(100 + Math.sin(rad(a)) * q[2] * .5)} ${n(q[0] - q[2] * .55)} ${n(ex)} ${n(ey)}" fill="none" stroke="${stemC}" stroke-width="1.1"/>`;
      const sq = .8 - st.dry * .25, tilt = a * .35;
      let veins = ""; for (let k = 0; k < 7; k++) { const an = rad(k * 51 + 20); veins += `M0 0L${n(Math.cos(an) * R * .9)} ${n(Math.sin(an) * R * .9 * sq)}`; }
      out += `<g transform="translate(${n(ex)} ${n(ey)}) rotate(${n(tilt)})"><ellipse rx="${n(R)}" ry="${n(R * sq)}" fill="${cf}"/>` +
        (st.dry > .2 ? `<path d="M${n(-R * .92)} ${n(R * .1)}Q0 ${n(R * sq * 1.1)} ${n(R * .92)} ${n(R * .1)}" fill="none" stroke="#000" stroke-opacity="${n(st.dry * .3)}" stroke-width="1.4"/>` : "") +
        `<path d="${veins}" stroke="#fff" stroke-opacity=".16" stroke-width=".6"/><ellipse rx="${n(R)}" ry="${n(R * sq)}" fill="none" stroke="#000" stroke-opacity=".25" stroke-width=".6"/>` +
        `<path d="M${n(-R * .7)} ${n(-R * sq * .35)}Q${n(-R * .45)} ${n(-R * sq * .85)} ${n(R * .1)} ${n(-R * sq * .9)}" fill="none" stroke="#fff" stroke-opacity="${n(st.gloss * 1.1)}" stroke-width="1.4" stroke-linecap="round"/><circle r="1.1" fill="${mix(g.l, "#fff", .3)}"/>` +
        (i % 3 === 0 ? bead(st, R * .35, R * sq * .2, 1) : "") + `</g>`;
    });
    return svg(st, s + sway(out, 3.9));
  }

  function herbs(o) {
    const st = ST(o), c = o.color, dr = st.droop;
    let s = `<g class="hda-bg"><rect x="20" y="10" width="160" height="142" rx="2" fill="${LGd(st, "sky", 0, 0, 0, 1, S([0, "#a9c6e8", .2], [1, "#e6eef7", .08]))}"/>`;
    s += `<path d="M20 10H180V152H20Z M100 10V152 M20 80H180" fill="none" stroke="#d6d0e8" stroke-opacity=".32" stroke-width="5"/><path d="M28 18L60 18L28 60Z" fill="#fff" opacity=".05"/>`;
    s += `<rect x="8" y="160" width="184" height="9" fill="${wood(st, "sl", "#c8b49a", true)}"/><path d="M12 152H188L192 160H8Z" fill="${sh("#d8c8b0", .1)}"/><rect x="8" y="169" width="184" height="10" fill="#000" opacity=".18"/></g>`;
    const pots = [50, 100, 150].map((x) => { const sub = { u: st.u + "p" + x, D: st.D, G: {}, wet: st.wet, dry: st.dry }; return pot(sub, c, { cx: x, y: 118, h: 34, rt: 21, rb: 15, mat: "terra", rim: 7, noShadow: true }) + `<ellipse cx="${x}" cy="152" rx="17" ry="3" fill="#000" opacity=".25"/>`; });
    const gb = greens(st, GR.bas), fb = crossFill(st, "fb", gb), sb = stemOf(gb);
    let bas = `<path d="M50 120C50 104 49 88 50 ${n(64 + dr * 10)}M50 104Q40 96 36 ${n(84 + dr * 8)}M50 98Q62 90 64 ${n(78 + dr * 8)}" fill="none" stroke="${sb}" stroke-width="1.6" stroke-linecap="round"/>`;
    [[50, 110, 18, 9], [50, 96, 17, 8.5], [50, 82, 14, 7.5], [36, 86, 12, 6.5], [64, 80, 12, 6.5]].forEach((q) => { [1, -1].forEach((sd) => { bas += leaf(st, q[0], q[1], sd * 62, q[2], q[3], { shape: "oval", fill: fb, side: sd, flop: 1.2, da: 55, db: .4, veins: 3, gl: 1.4, ro: .3 }); }); });
    bas += leaf(st, 50, 66 + dr * 10, -8, 12, 6, { shape: "oval", fill: fb, flop: 1, da: 40, gl: 1.4 }) + leaf(st, 50, 66 + dr * 10, 14, 11, 5.6, { shape: "oval", fill: fb, flop: 1, da: 40, gl: 1.4 });
    bas += bead(st, 44, 100, .9);
    const gm = greens(st, GR.mint), fm = crossFill(st, "fm", gm), sm = mix(gm.m, "#6a3a4a", .35);
    let mint = "";
    [[-28, 44], [-10, 52], [4, 56], [18, 48], [32, 40]].forEach((q) => { const side = q[0] >= 0 ? 1 : -1, a = q[0] + side * dr * 30, b0 = [100 + q[0] * .15, 120], e = [b0[0] + Math.sin(rad(a)) * q[1], b0[1] - Math.cos(rad(a)) * q[1]], cc = [b0[0] + Math.sin(rad(a * .3)) * q[1] * .5, b0[1] - q[1] * .6];
      mint += `<path d="M${pp(b0)}Q${pp(cc)} ${pp(e)}" fill="none" stroke="${sm}" stroke-width="1.2"/>`;
      for (let t = .35; t < 1.01; t += .21) { const p = quad(b0, cc, e, t); [1, -1].forEach((sd) => { mint += leaf(st, p[0], p[1], p[2] + sd * 55, 11 - t * 3, 5.4, { shape: "oval", fill: fm, side: sd, flop: .9, da: 40, veins: 3, vo: .25, gl: .8, ro: .3 }); }); } });
    mint += bead(st, 104, 80, .9);
    const gr = greens(st, GR.ros, .6), wn = mix("#6a5a3a", "#8a7a5a", st.dry);
    let ros = "", nd = "";
    [[-20, 56], [-8, 64], [4, 60], [14, 66], [24, 52], [-30, 44]].forEach((q) => { const side = q[0] >= 0 ? 1 : -1, a = q[0] + side * dr * 18, b0 = [150 + q[0] * .15, 120], e = [b0[0] + Math.sin(rad(a)) * q[1], b0[1] - Math.cos(rad(a)) * q[1]], cc = [b0[0] + Math.sin(rad(a * .4)) * q[1] * .5, b0[1] - q[1] * .55];
      ros += `<path d="M${pp(b0)}Q${pp(cc)} ${pp(e)}" fill="none" stroke="${wn}" stroke-width="1.2"/>`;
      for (let t = .2; t < .99; t += .055) { const p = quad(b0, cc, e, t), l = 6.2 * (1 - t * .35); [1, -1].forEach((sd) => { const an = rad(p[2] + sd * 48); nd += `M${n(p[0])} ${n(p[1])}l${n(Math.sin(an) * l)} ${n(-Math.cos(an) * l)}`; }); } });
    ros += `<path d="${nd}" stroke="${gr.d}" stroke-width="1.7" stroke-linecap="round"/><path d="${nd}" stroke="${gr.l}" stroke-width=".8" stroke-linecap="round"/>`;
    ros += bead(st, 146, 82, .8);
    return svg(st, s + pots.join("") + sway(bas, 1) + sway(mint, 2.5) + sway(ros, 4));
  }

  function airplant(o) {
    const st = ST(o), c = o.color, t = st.wet;
    const g = { l: mix(mix("#dfe6da", "#b4dc98", t * .8), DULL.l, st.dry * .3), m: mix(mix("#9cb0a2", "#5fa860", t * .8), "#9a9a7a", st.dry * .4), d: mix(mix("#5f7868", "#2f6e3a", t * .8), "#6a6a4a", st.dry * .4) };
    const lf = LGd(st, "ap", 0, 1, 0, 0, S([0, mix("#d88a9a", g.m, .55)], [.25, g.m], [.7, g.l], [1, mix(g.l, BROWN, st.dry * .9)]));
    const wf = LGd(st, "dw", 0, 0, 0, 1, S([0, sh(c, .32)], [.45, c], [1, sh(c, -.5)]));
    let s = shadow(100, 176, 70, 5);
    const log = "M16 156C30 146 52 150 70 146C92 141 110 146 132 140C150 135 166 138 184 131C188 140 184 150 172 153C150 157 134 161 112 163C92 166 74 163 54 167C38 170 22 169 15 164Z";
    s += `<path d="M138 141C144 129 150 118 162 112C165 117 162 125 154 136Z" fill="${wf}"/><path d="${log}" fill="${wf}"/>`;
    s += `<path d="M24 158C50 152 80 154 110 150C136 146 160 142 178 137M30 164C60 158 92 160 124 156C146 153 164 150 176 146M60 150C80 147 96 148 116 145" fill="none" stroke="${sh(c, -.6)}" stroke-opacity=".45" stroke-width=".8"/>`;
    s += `<path d="M22 154C46 147 74 150 98 145C118 141 140 141 168 134" fill="none" stroke="#fff" stroke-opacity=".28" stroke-width="1.4" stroke-linecap="round"/><ellipse cx="134" cy="152" rx="5" ry="2.6" fill="${sh(c, -.55)}"/><ellipse cx="134" cy="152" rx="2.4" ry="1.1" fill="${sh(c, -.75)}"/><path d="M16 160L15 164L22 168" fill="none" stroke="${sh(c, -.5)}" stroke-width="1"/>`;
    const pat = (G) => { const r = rng(Math.round(G.L * 7)); let d = ""; for (let i = 0; i < 6; i++) { const p = G.at(r() > .5 ? 1 : -1, .1 + r() * .75, r() * .8); d += `M${n(p[0])} ${n(p[1])}h.6`; } return `<path d="${d}" stroke="#fff" stroke-opacity=".55" stroke-width=".9" stroke-linecap="round"/>`; };
    const A = [-12, 10, -30, 28, -50, 48, -70, 68, -92, 90, -112, 110, 0, -20, 20];
    let out = "";
    A.forEach((a, i) => { const L = 40 + ((i * 13) % 20), side = a >= 0 ? 1 : -1;
      out += leaf(st, 98 + a * .03, 145, a, L, 4.4, { fill: lf, pat, b: side * L * (.34 + st.dry * .45), flop: .3, da: 20, db: .3, ho: .14, rib: false, gl: .7, dew: i % 5 === 1 ? [[.55, 0, .8]] : null }); });
    out += `<ellipse cx="98" cy="146" rx="5" ry="3" fill="${mix("#d88a9a", g.m, .5)}"/>`;
    return svg(st, s + sway(out, 2.2));
  }

  function hoya(o) {
    const st = ST(o), g = greens(st, GR.hoya), lf = crossFill(st, "lf", g), vine = mix("#6a5a3a", g.m, .4), dr = st.droop;
    const speck = (G) => { const r = rng(Math.round(G.L * 11)); let d = ""; for (let i = 0; i < 7; i++) { const p = G.at(r() > .5 ? 1 : -1, .15 + r() * .7, r() * .75); d += `M${n(p[0])} ${n(p[1])}h.5`; }
      return `<path d="${d}" stroke="#eef6e6" stroke-opacity=".38" stroke-width="1" stroke-linecap="round"/>` + (st.dry > .3 ? `<path d="M${pp(G.at(-1, .3, .5))}Q${pp(G.rp(.5))} ${pp(G.at(1, .7, .5))}" fill="none" stroke="#000" stroke-opacity="${n(st.dry * .35)}" stroke-width=".8"/>` : ""); };
    let s = pot(st, o.color, { cx: 100, y: 150, h: 34, rt: 28, rb: 22, mat: "glaze", bul: 2 });
    const cx = 100, cy = 84, R = 52;
    const hoop = `M88 152L86.2 134.1A52 52 0 1 1 113.8 134.1L112 152`;
    let back = `<path d="${hoop}" fill="none" stroke="#7a7266" stroke-width="2.2"/><path d="${hoop}" fill="none" stroke="#f1ead8" stroke-opacity=".5" stroke-width=".8" transform="translate(-.5 -.5)"/>`;
    let vp = "M96 150L90 134", out = "";
    const pts = [];
    for (let th = -16; th >= -344; th -= 6) { const tr = rad(th), w = R + Math.sin(rad(th * 7)) * 2.4; const x = cx + Math.sin(tr) * w, y = cy + Math.cos(tr) * w; vp += `L${n(x)} ${n(y)}`; pts.push([x, y, th]); }
    out += `<path d="${vp}" fill="none" stroke="${vine}" stroke-width="1.3" stroke-linejoin="round"/>`;
    pts.forEach((p, i) => { if (i % 3 !== 1) return; const outward = deg(Math.atan2(p[0] - cx, -(p[1] - cy))), sd = ((i - 1) / 3) % 2 ? 1 : -1;
      out += leaf(st, p[0], p[1], outward + sd * 62, 17, 7.2, { shape: "oval", fill: lf, pat: speck, side: sd, grav: .6, g0: .05, curl: 1, gl: 1.9, ro: .2, ho: .16, dew: i % 12 === 1 ? [[.5, 0, .9]] : null }); });
    out += leaf(st, 96, 146, -40, 13, 6, { shape: "oval", fill: lf, pat: speck, gl: 1.9, flop: .8, da: 30 }) + leaf(st, 104, 147, 34, 12, 5.6, { shape: "oval", fill: lf, pat: speck, gl: 1.9, flop: .8, da: 30 });
    return svg(st, back + s + sway(out, 3.3));
  }

  const css = `
.hda-plants-sway{transform-box:fill-box;transform-origin:50% 100%}
.hda-plants-hang{transform-box:fill-box;transform-origin:50% 0%}
.hda-plants-spark,.hda-plants-glint{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-plants-sway{animation:hda-plants-sway 7s ease-in-out infinite}
.hda-anim .hda-plants-hang{animation:hda-plants-swing 8.5s ease-in-out infinite}
.hda-anim .hda-plants-spark{animation:hda-plants-tw 3.6s ease-in-out infinite}
.hda-anim .hda-plants-glint{animation:hda-plants-gl 3.6s ease-in-out infinite}
@keyframes hda-plants-sway{0%,100%{transform:rotate(-.9deg)}50%{transform:rotate(1.1deg)}}
@keyframes hda-plants-swing{0%,100%{transform:rotate(-1.4deg)}50%{transform:rotate(1.4deg)}}
@keyframes hda-plants-tw{0%,100%{opacity:.55}45%{opacity:1}}
@keyframes hda-plants-gl{0%,32%,100%{opacity:0;transform:scale(.3)}45%{opacity:1;transform:scale(1)}58%{opacity:0;transform:scale(.4)}}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-plants-sway,.hda-anim .hda-plants-hang,.hda-anim .hda-plants-spark,.hda-anim .hda-plants-glint{animation:none!important}}
`;

  const POT = { terra: ["#c8693f", "#a5502f", "#dd9a72", "#e8ded0", "#6b6e74"], glaze: ["#2f6f73", "#e9e4da", "#1f2a44", "#c56b4a", "#d9a441"],
    white: ["#ece8e1", "#d8cfc2", "#2b2b2e", "#8fa89a", "#e3b7a6"], concrete: ["#9b9a96", "#5e5d5a", "#c9c4ba", "#3b3f45", "#b98b6e"] };
  const I = (id, name, colors, fn) => ({ id, name, colors, picker: true, colorLabel: "Pot", render: fn });
  (window.HDA = window.HDA || []).push({
    id: "plants", tab: "Plants", group: "Plants", kind: "plant",
    intro: "Twenty popular foliage houseplants for watering reminders: upright and glossy with dark damp soil when watered, drooping, dull and cracked when dry.",
    
    css,
    icons: [
      I("monstera", "Monstera", ["#c9a46a", "#e8d9b8", "#6b4a2e", "#2f2a26", "#9fb39a"], monstera),
      I("snake", "Snake plant", POT.concrete, snake),
      I("pothos", "Pothos", POT.glaze, pothos),
      I("zz", "ZZ plant", ["#22252b", "#e8e4dc", "#3d5a80", "#7a4b8f", "#b6463a"], zz),
      I("lily", "Peace lily", POT.white, lily),
      I("rubber", "Rubber plant", ["#8a2f3a", "#e7e2d8", "#1d3b5a", "#2f4f3a", "#c7a05a"], rubber),
      I("pearls", "String of pearls", ["#e9e4da", "#c8693f", "#2f6f73", "#2b2b2e", "#d9a441"], pearls),
      I("aloe", "Aloe vera", POT.terra, aloe),
      I("jade", "Jade plant", ["#2f5d8a", "#e7e2d8", "#7a8c5a", "#3a3a3f", "#b5543b"], jade),
      I("succulents", "Succulent trio", ["#b9b5ad", "#e9e4da", "#c8693f", "#4a4d52", "#d7b9a5"], succulents),
      I("cactus", "Cactus", POT.terra, cactus),
      I("calathea", "Calathea", ["#e5ded3", "#384a3e", "#d9a441", "#c27a8a", "#2d3550"], calathea),
      I("fern", "Boston fern", ["#d8d2c6", "#8e8a82", "#3a3d42", "#9c6b4b", "#5f7f6f"], fern),
      I("spider", "Spider plant", ["#f1ede6", "#d9a441", "#4b6b8a", "#c56b4a", "#2b2b2e"], spider),
      I("philodendron", "Philodendron", ["#e8e2d8", "#2b2b2e", "#c98f74", "#7f9a8a", "#3d4a6b"], philo),
      I("bird", "Bird of paradise", ["#e9e4da", "#2b2b2e", "#d9a441", "#5f7f6f", "#c56b4a"], bird),
      I("pilea", "Pilea", ["#f1ede6", "#e6b8a2", "#9fb6c9", "#2b2b2e", "#d9a441"], pilea),
      I("herbs", "Herb trio", ["#c8693f", "#e9e4da", "#5a7d6a", "#3a5a80", "#d9a441"], herbs),
      Object.assign(I("airplant", "Air plant", ["#a89a86", "#cfc3b0", "#7d6a55", "#8f8a84", "#b98b6e"], airplant), { colorLabel: "Wood" }),
      I("hoya", "Hoya hoop", ["#d9a441", "#e9e4da", "#2f6f73", "#2b2b2e", "#c56b4a"], hoya),
    ],
  });
})();
