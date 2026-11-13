(function () {
  "use strict";
  const H = window.HDAH;
  const P = "hda-flowers-";
  const f = (v) => (Math.round(v * 10) / 10).toString();
  const f2 = (v) => (Math.round(v * 100) / 100).toString();
  const cl = (v, a, b) => Math.max(a == null ? 0 : a, Math.min(b == null ? 1 : b, v));
  const RAD = Math.PI / 180;
  const dir = (a) => [Math.sin(a * RAD), -Math.cos(a * RAD)];
  const sg = (a) => (a < 0 ? -1 : 1);
  function rng(seed) { let s = seed % 2147483647; if (s <= 0) s += 2147483646; return () => (s = (s * 16807) % 2147483647) / 2147483647; }
  const stops = (s) => s.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a == null ? "" : ` stop-opacity="${a}"`}/>`).join("");
  const DIRS = { h: [0, 0, 1, 0], v: [0, 0, 0, 1], u: [0, 1, 0, 0], d: [0, 0, 1, 1] };
  const lg = (id, s, d) => { const q = DIRS[d || "h"]; return `<linearGradient id="${id}" x1="${q[0]}" y1="${q[1]}" x2="${q[2]}" y2="${q[3]}">${stops(s)}</linearGradient>`; };
  const rg = (id, s, cx, cy, r) => `<radialGradient id="${id}" cx="${cx == null ? .5 : cx}" cy="${cy == null ? .5 : cy}" r="${r == null ? .5 : r}">${stops(s)}</radialGradient>`;
  const tr = (x, y, a, sx, sy) => `translate(${f(x)} ${f(y)})${a ? ` rotate(${f(a)})` : ""}${sx != null ? ` scale(${f2(sx)} ${f2(sy == null ? sx : sy)})` : ""}`;

  function ctx(o) {
    const c = o.color || "#e8559c", on = !!o.on, w = on ? cl(o.level == null ? 1 : +o.level) : 0;
    const h = cl(w / .6), dry = cl(1 - w / .7), wet = cl((w - .15) / .7);
    const dd = on ? 1 - h : 1.1;
    const pc = H.mix(H.mix(c, "#a3927a", .42 * dry), "#7d5a3a", on ? 0 : .16);
    const lf = H.mix(H.mix("#3f8f48", "#b3a352", dry * .8), "#8a6a3e", on ? 0 : .22);
    const st = H.mix(H.mix("#5a9444", "#a39a4c", dry * .8), "#8a6a3e", on ? 0 : .2);
    const id = (s) => `${o.uid}-${s}`, url = (s) => `url(#${o.uid}-${s})`;
    return { o, c, pc, on, w, h, dry, wet, dd, lf, st, id, url, anim: !!o.anim, ext: [], seen: {},
      gloss: .05 + .36 * cl((w - .2) / .6), brown: on ? cl((.45 - w) * 1.8, 0, .7) : .85, n: 0 };
  }
  function defs(x) {
    const { pc, lf, id } = x, dk = H.mix(lf, "#123526", .5), soilT = 1 - x.wet;
    return `<defs>
${lg(id("lf"), [[0, H.shade(lf, .3)], [.47, lf], [.53, H.shade(lf, -.14)], [1, H.shade(lf, -.48)]])}
${lg(id("lfd"), [[0, H.shade(dk, .34)], [.47, dk], [.53, H.shade(dk, -.16)], [1, H.shade(dk, -.52)]])}
${lg(id("tip"), [[0, "#7a5230", 0], [.5, "#7a5230", 0], [1, "#5e3a1e", .95]], "u")}
${lg(id("tipv"), [[0, "#7a5230", 0], [.5, "#7a5230", 0], [1, "#5e3a1e", .95]], "v")}
${lg(id("p"), [[0, H.shade(pc, -.4)], [.5, pc], [1, H.shade(pc, .3)]], "u")}
${rg(id("pr"), [[0, H.shade(pc, .4)], [.55, pc], [1, H.shade(pc, -.34)]], .4, .35, .7)}
${rg(id("so"), [[0, H.mix("#5a3a24", "#bfa684", soilT)], [.7, H.mix("#2e1b0f", "#95795b", soilT)], [1, H.mix("#1a0e07", "#6e5843", soilT)]], .45, .4, .75)}
${lg(id("sd"), [[0, "#000", .3], [.26, "#000", 0], [.6, "#000", 0], [1, "#000", .46]])}
${lg(id("gls"), [[0, "#fff", .5], [.45, "#fff", .08], [1, "#fff", 0]], "d")}
${x.ext.join("")}</defs>`;
  }
  const svg = (x, body) => `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs(x)}${body}</svg>`;
  const grad = (x, k, make) => { if (!x.seen[k]) { x.seen[k] = 1; x.ext.push(make(x.id(k))); } return x.url(k); };
  const sway = (x, body, d, hang) => `<g class="${P}${hang ? "hang" : "sway"}" style="animation-delay:-${d || 0}s;animation-duration:${f((hang ? 8 : 6.5) + 3 * cl(x.dd))}s">${body}</g>`;
  const shadow = (cx, cy, rx) => `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx + 6)}" ry="6.4" fill="#000" opacity=".14"/><ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="4.6" fill="#000" opacity=".28"/>`;

  function soil(x, cx, cy, rx, ry, op) {
    op = op || {};
    let s = `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="${x.url("so")}"/>`;
    const r = rng(Math.round(cx * 7 + cy * 13)), t = 1 - x.wet;
    if (op.bark) {
      for (let i = 0; i < 11; i++) { const an = r() * 6.283, rr = Math.sqrt(r()) * .78, px = cx + Math.cos(an) * rx * rr, py = cy + Math.sin(an) * ry * rr;
        const col = ["#8a5a34", "#6b4226", "#a8744a", "#5a361e"][i % 4];
        s += `<rect x="${f(px - 3)}" y="${f(py - 1.4)}" width="6" height="2.8" rx="1.2" fill="${H.mix(col, "#c9a77e", t * .5)}" transform="rotate(${f(r() * 60 - 30)} ${f(px)} ${f(py)})"/>`; }
    } else {
      for (let i = 0; i < 10; i++) { const an = r() * 6.283, rr = Math.sqrt(r()) * .8, lt = i % 3 === 0;
        s += `<ellipse cx="${f(cx + Math.cos(an) * rx * rr)}" cy="${f(cy + Math.sin(an) * ry * rr)}" rx="${f(.7 + r() * .8)}" ry=".5" fill="${lt ? H.mix("#7a5638", "#e2cfb0", t) : "#120904"}" opacity="${lt ? .55 : .35}"/>`; }
    }
    if (x.dry > .2) {
      const q = (fx, fy) => `${f(cx + fx * rx)} ${f(cy + fy * ry)}`;
      s += `<path d="M${q(-.75, -.1)}L${q(-.42, .12)}L${q(-.18, -.05)}L${q(.1, .3)}M${q(-.18, -.05)}L${q(-.05, -.5)}M${q(.1, .3)}L${q(.45, .1)}L${q(.78, .2)}M${q(.45, .1)}L${q(.5, -.45)}" fill="none" stroke="#3a2a1c" stroke-opacity="${f2(x.dry * .85)}" stroke-width=".8" stroke-linejoin="round"/>`;
    }
    if (x.wet > .35) s += `<ellipse cx="${f(cx - rx * .3)}" cy="${f(cy - ry * .25)}" rx="${f(rx * .38)}" ry="${f(ry * .32)}" fill="#fff" opacity="${f2(x.wet * .14)}"/>`;
    return s;
  }
  const PAL = { tc: ["#efad84", "#c8693f", "#7a3a1e"], cw: ["#ffffff", "#e6e2ec", "#9d98ab"], cb: ["#6d8fd6", "#2a4486", "#111c40"], cg: ["#c3d8b7", "#8eac85", "#4f6a4c"],
    pk: ["#64626f", "#2d2c35", "#111016"], cc: ["#cfcdc7", "#9c9a95", "#5c5a57"], ys: ["#f6d778", "#d9a42f", "#86600f"], rp: ["#f7d0d6", "#dea2ad", "#985c67"],
    tl: ["#86d6cc", "#2f9a92", "#12524d"], cr: ["#f8f2e6", "#e0d3bc", "#9e9078"], rd: ["#d4676a", "#8f2b31", "#45100f"], gv: ["#eef2f5", "#a1acb5", "#5a6570"],
    pl: ["#56645a", "#2c3a30", "#121a14"], wd: ["#e2bd92", "#b0835a", "#6a4429"], bk: ["#e2c48e", "#b58b52", "#6e4f25"] };
  function potFill(x, k) {
    return grad(x, "pot" + k, (id) => {
      if (k === "br") return lg(id, [[0, "#4d3210"], [.2, "#b8863a"], [.36, "#f6dd94"], [.55, "#c0913f"], [.82, "#7a5118"], [1, "#3f2a0d"]]);
      const [l, m, d] = PAL[k];
      return lg(id, [[0, H.shade(d, -.25)], [.2, m], [.36, l], [.6, m], [.86, d], [1, H.shade(d, -.35)]]);
    });
  }
  function pot(x, k, cx, top, wt, wb, ht, op) {
    op = op || {};
    const g = potFill(x, k), bot = top + ht, rim = op.rim || 0, bul = op.bulge || 0, Lx = cx - wt / 2, Rx = cx + wt / 2;
    const dark = k === "br" ? "#3f2a0d" : PAL[k][2];
    const body = `M${f(Lx)} ${top}Q${f(cx - (wt + wb) / 4 - bul)} ${f(top + ht * .55)} ${f(cx - wb / 2)} ${f(bot - 2)}Q${f(cx)} ${f(bot + 3)} ${f(cx + wb / 2)} ${f(bot - 2)}Q${f(cx + (wt + wb) / 4 + bul)} ${f(top + ht * .55)} ${f(Rx)} ${top}Z`;
    let s = shadow(cx, (op.foot ? bot + 9 : bot) + 1, (op.foot ? 16 : wb * .55) + 4);
    if (op.foot) s += `<path d="M${f(cx - 9)} ${f(bot - 3)}L${f(cx - 16)} ${f(bot + 7)}Q${f(cx)} ${f(bot + 11)} ${f(cx + 16)} ${f(bot + 7)}L${f(cx + 9)} ${f(bot - 3)}Z" fill="${g}"/><path d="M${f(cx - 16)} ${f(bot + 7)}Q${f(cx)} ${f(bot + 11)} ${f(cx + 16)} ${f(bot + 7)}" fill="none" stroke="#000" stroke-opacity=".3"/>`;
    s += `<path d="${body}" fill="${g}"/>`;
    if (op.weave || op.ridges) {
      const cid = x.id("pc" + (x.n++)); x.ext.push(`<clipPath id="${cid}"><path d="${body}"/></clipPath>`);
      let w = "";
      if (op.weave) {
        let row = 0;
        for (let yy = top + rim + 3; yy < bot + 2; yy += 5, row++) {
          const hw = wt / 2 + (wb - wt) / 2 * ((yy - top) / ht) + 2;
          w += `<path d="M${f(cx - hw)} ${f(yy)}Q${f(cx)} ${f(yy + 3)} ${f(cx + hw)} ${f(yy)}" fill="none" stroke="#000" stroke-opacity=".3" stroke-width=".8"/>`;
          for (let j = -7; j <= 7; j++) { const xx = cx + (j + (row % 2 ? .5 : 0)) * (hw / 7.5);
            w += `<path d="M${f(xx - 2)} ${f(yy + 1)}Q${f(xx)} ${f(yy + 3.6)} ${f(xx + 2)} ${f(yy + 1)}" fill="none" stroke="#fff" stroke-opacity=".28" stroke-width="1.1"/>`; }
        }
      }
      if (op.ridges) for (let i = 1; i < 5; i++) { const yy = top + rim + (ht - rim) * i / 5, hw = wt / 2 + (wb - wt) / 2 * (i / 5) + 2;
        w += `<path d="M${f(cx - hw)} ${f(yy)}Q${f(cx)} ${f(yy + 3)} ${f(cx + hw)} ${f(yy)}" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1.3"/><path d="M${f(cx - hw)} ${f(yy + 1.6)}Q${f(cx)} ${f(yy + 4.6)} ${f(cx + hw)} ${f(yy + 1.6)}" fill="none" stroke="#000" stroke-opacity=".28"/>`; }
      s += `<g clip-path="url(#${cid})">${w}</g>`;
    }
    if (op.band) s += `<path d="M${f(Lx + (wb - wt) * .1)} ${f(top + ht * .2)}Q${f(cx)} ${f(top + ht * .2 + 4)} ${f(Rx - (wb - wt) * .1)} ${f(top + ht * .2)}" fill="none" stroke="${op.band}" stroke-width="2.2" stroke-opacity=".85"/>`;
    s += `<path d="${body}" fill="${x.url("sd")}"/>`;
    s += `<path d="M${f(Lx + wt * .17)} ${f(top + rim + 4)}Q${f(cx - (wt + wb) / 4 - bul + wt * .17)} ${f(top + ht * .55)} ${f(cx - wb / 2 + wb * .17)} ${f(bot - 6)}" fill="none" stroke="#fff" stroke-opacity="${op.matte ? .12 : .36}" stroke-width="${op.matte ? 2.4 : 3}" stroke-linecap="round"/>`;
    if (op.handles) s += `<ellipse cx="${f(Lx - 1)}" cy="${f(top + 9)}" rx="3" ry="5" fill="none" stroke="${g}" stroke-width="1.8"/><ellipse cx="${f(Rx + 1)}" cy="${f(top + 9)}" rx="3" ry="5" fill="none" stroke="${g}" stroke-width="1.8"/>`;
    if (rim) s += `<rect x="${f(Lx - 3)}" y="${f(top - 2)}" width="${f(wt + 6)}" height="${rim}" rx="2" fill="${g}"/><rect x="${f(Lx - 3)}" y="${f(top - 2)}" width="${f(wt + 6)}" height="${rim}" rx="2" fill="${x.url("sd")}"/><path d="M${f(Lx - 2)} ${f(top - 2 + rim)}H${f(Rx + 2)}" stroke="#000" stroke-opacity=".32"/><path d="M${f(Lx - 1)} ${f(top - 1.2)}H${f(Rx + 1)}" stroke="#fff" stroke-opacity=".3"/>`;
    const rx = wt / 2 + (rim ? 2 : -.4), ry = Math.max(3.2, wt * .075);
    s += `<ellipse cx="${f(cx)}" cy="${f(top - 1.5)}" rx="${f(rx)}" ry="${f(ry)}" fill="${H.shade(dark, -.5)}"/><ellipse cx="${f(cx)}" cy="${f(top - 1.5)}" rx="${f(rx)}" ry="${f(ry)}" fill="none" stroke="#fff" stroke-opacity="${op.matte ? .12 : .28}" stroke-width=".8"/>`;
    s += soil(x, cx, top - .6, rx - 2.6, ry * .72, op);
    return s;
  }
  function box(x, k, cx, top, w, ht) {
    const g = potFill(x, k), Lx = cx - w / 2, bot = top + ht;
    let s = shadow(cx, bot + 1, w * .5);
    s += `<rect x="${f(Lx + 3)}" y="${f(top - 7)}" width="${f(w - 6)}" height="7" rx="3" fill="${x.url("so")}"/>`;
    s += soil(x, cx, top - 4, w / 2 - 6, 2.4);
    s += `<rect x="${f(Lx)}" y="${top}" width="${w}" height="${ht}" rx="2" fill="${g}"/>`;
    for (let i = 1; i < 3; i++) { const yy = top + ht * i / 3; s += `<path d="M${f(Lx)} ${f(yy)}H${f(Lx + w)}" stroke="#2a170a" stroke-opacity=".55" stroke-width="1.2"/><path d="M${f(Lx)} ${f(yy + 1.2)}H${f(Lx + w)}" stroke="#fff" stroke-opacity=".18"/>`; }
    const r = rng(Math.round(cx * 3 + top));
    for (let i = 0; i < 9; i++) { const yy = top + 3 + r() * (ht - 6), x0 = Lx + 4 + r() * (w * .6); s += `<path d="M${f(x0)} ${f(yy)}q${f(10 + r() * 14)} ${f(r() * 1.6 - .8)} ${f(24 + r() * 16)} 0" fill="none" stroke="#3a210f" stroke-opacity=".25" stroke-width=".7"/>`; }
    s += `<rect x="${f(Lx)}" y="${top}" width="${w}" height="${ht}" rx="2" fill="${x.url("sd")}"/>`;
    s += `<rect x="${f(Lx - 2)}" y="${f(top - 3)}" width="${f(w + 4)}" height="5" rx="1.5" fill="${g}"/><path d="M${f(Lx - 1)} ${f(top - 2.3)}H${f(Lx + w + 1)}" stroke="#fff" stroke-opacity=".35"/><path d="M${f(Lx - 2)} ${f(top + 2)}H${f(Lx + w + 2)}" stroke="#000" stroke-opacity=".35"/>`;
    s += `<rect x="${f(Lx + 3)}" y="${f(top + 4)}" width="4" height="${f(ht - 6)}" rx="1" fill="#000" opacity=".12"/><rect x="${f(Lx + w - 7)}" y="${f(top + 4)}" width="4" height="${f(ht - 6)}" rx="1" fill="#000" opacity=".2"/>`;
    return s;
  }

  function leaf(x, px, py, L, W, a, op) {
    op = op || {};
    const s = op.s || sg(a), dr = (op.dr == null ? 36 : op.dr) * x.dd;
    const aa = cl(a + s * dr, -150, 150), Lw = L * (1 - .1 * cl(x.dd)), Wn = W * (1 - .25 * x.dry * (op.curlW || 0));
    const b = s * x.dd * Lw * (op.curl == null ? .22 : op.curl), pet = op.pet || 0;
    const c1 = op.round ? 1.2 : 1, c2 = op.round ? 1.1 : .92, y1 = op.round ? .1 : .22, y2 = op.round ? .86 : .7;
    const d = `M0 0C${f(Wn * c1)} ${f(-Lw * y1)} ${f(Wn * c2 + b * .4)} ${f(-Lw * y2)} ${f(b)} ${f(-Lw)}C${f(-Wn * c2 + b * .4)} ${f(-Lw * y2)} ${f(-Wn * c1)} ${f(-Lw * y1)} 0 0Z`;
    const half = `M0 0C${f(Wn * c1)} ${f(-Lw * y1)} ${f(Wn * c2 + b * .4)} ${f(-Lw * y2)} ${f(b)} ${f(-Lw)}Q${f(b * .3)} ${f(-Lw * .5)} 0 0Z`;
    const fill = op.fill || x.url(op.dark ? "lfd" : "lf");
    let g = `<g transform="${tr(px, py, aa)}">`;
    if (pet) g += `<path d="M0 0V${f(-pet)}" stroke="${x.st}" stroke-width="1.6" stroke-linecap="round"/><g transform="translate(0 ${f(-pet)})">`;
    g += `<path d="${d}" fill="${fill}"${op.serr ? ` stroke="${H.shade(x.lf, -.45)}" stroke-width="1" stroke-dasharray="1.4 1.2"` : ""}/>`;
    g += `<path d="${half}" fill="#000" opacity=".14"/>`;
    if (op.veins) { let v = ""; for (let i = 1; i <= op.veins; i++) { const t = i / (op.veins + 1), yy = -Lw * t, bx = b * t * t, ww = Wn * (op.round ? 1 : .8) * Math.sin(Math.PI * Math.min(.95, t + .1));
      v += `M${f(bx)} ${f(yy)}L${f(bx + ww * .8)} ${f(yy - Lw * .12)}M${f(bx)} ${f(yy)}L${f(bx - ww * .8)} ${f(yy - Lw * .12)}`; }
      g += `<path d="${v}" fill="none" stroke="#fff" stroke-opacity=".16" stroke-width=".6"/>`; }
    if (op.marble) g += `<path d="M0 ${f(-Lw * .15)}C${f(Wn * .7)} ${f(-Lw * .2)} ${f(Wn * .6 + b * .3)} ${f(-Lw * .6)} ${f(b * .6)} ${f(-Lw * .72)}C${f(-Wn * .6 + b * .3)} ${f(-Lw * .6)} ${f(-Wn * .7)} ${f(-Lw * .2)} 0 ${f(-Lw * .15)}Z" fill="none" stroke="#d9ead2" stroke-opacity=".45" stroke-width="2.2"/>`;
    g += `<path d="M0 -.5Q${f(b * .3)} ${f(-Lw * .5)} ${f(b * .95)} ${f(-Lw * .96)}" fill="none" stroke="${H.shade(x.lf, .45)}" stroke-opacity=".55" stroke-width=".8" stroke-linecap="round"/>`;
    const gl = x.gloss * (op.gl == null ? 1 : op.gl);
    if (gl > .03) g += `<path d="M${f(-Wn * .5)} ${f(-Lw * .2)}Q${f(-Wn * .72 + b * .2)} ${f(-Lw * .5)} ${f(-Wn * .3 + b * .6)} ${f(-Lw * .8)}" fill="none" stroke="#fff" stroke-opacity="${f2(Math.min(.85, gl))}" stroke-width="${f(cl(Wn * .14, .7, 2.2))}" stroke-linecap="round"/>`;
    if (op.fuzz) g += `<path d="${d}" fill="none" stroke="#fff" stroke-opacity=".2" stroke-width="1.4"/>`;
    if (op.edge) g += `<path d="${d}" fill="none" stroke="${op.edge}" stroke-opacity=".6" stroke-width="1"/>`;
    else if (!op.serr) g += `<path d="${d}" fill="none" stroke="#000" stroke-opacity=".2" stroke-width=".5"/>`;
    if (x.brown > .05) g += `<path d="${d}" fill="${x.url("tip")}" opacity="${f2(x.brown)}"/>`;
    if (op.dew && x.w > .55) g += dew(x, b * .5 + Wn * .2, -Lw * .55, 1);
    return g + (pet ? "</g>" : "") + "</g>";
  }
  function strap(x, px, py, L, W, a, bend, op) {
    op = op || {};
    const s = op.s || sg(a), a0 = a + s * x.dd * 10, a1 = cl(a0 + bend + s * x.dd * (op.dr == null ? 55 : op.dr), -165, 165);
    const d0 = dir(a0), d1 = dir(a1), dm = dir((a0 + a1) / 2);
    const C = [px + d0[0] * L * .55, py + d0[1] * L * .55], E = [C[0] + d1[0] * L * .5, C[1] + d1[1] * L * .5];
    const n0 = [-d0[1], d0[0]], nm = [-dm[1], dm[0]];
    const pt = (p) => `${f(p[0])} ${f(p[1])}`;
    const l0 = [px + n0[0] * W / 2, py + n0[1] * W / 2], r0 = [px - n0[0] * W / 2, py - n0[1] * W / 2];
    const lc = [C[0] + nm[0] * W * .6, C[1] + nm[1] * W * .6], rc = [C[0] - nm[0] * W * .6, C[1] - nm[1] * W * .6];
    const d = `M${pt(l0)}Q${pt(lc)} ${pt(E)}Q${pt(rc)} ${pt(r0)}Z`;
    const fill = op.fill || x.url(op.dark ? "lfd" : "lf");
    let g = `<path d="${d}" fill="${fill}"/><path d="M${pt(l0)}Q${pt(lc)} ${pt(E)}L${f(px)} ${f(py)}Z" fill="#000" opacity="${s > 0 ? .16 : 0}"/><path d="M${pt(r0)}Q${pt(rc)} ${pt(E)}L${f(px)} ${f(py)}Z" fill="#000" opacity="${s > 0 ? 0 : .16}"/>`;
    g += `<path d="M${f(px)} ${f(py)}Q${pt(C)} ${pt(E)}" fill="none" stroke="${H.shade(x.lf, .4)}" stroke-opacity=".45" stroke-width=".8"/>`;
    if (op.stripe) g += `<path d="M${f(px)} ${f(py)}Q${pt(C)} ${pt(E)}" fill="none" stroke="${op.stripe}" stroke-opacity=".5" stroke-width="${f(W * .3)}"/>`;
    if (x.gloss > .05) g += `<path d="M${pt([px + n0[0] * W * .25, py + n0[1] * W * .25])}Q${pt([C[0] + nm[0] * W * .3, C[1] + nm[1] * W * .3])} ${pt([E[0] * .7 + C[0] * .3, E[1] * .7 + C[1] * .3])}" fill="none" stroke="#fff" stroke-opacity="${f2(x.gloss * .9)}" stroke-width="1" stroke-linecap="round"/>`;
    g += `<path d="${d}" fill="none" stroke="#000" stroke-opacity=".22" stroke-width=".5"/>`;
    if (x.brown > .05) { const gid = x.id("sb" + (x.n++)); x.ext.push(`<linearGradient id="${gid}" gradientUnits="userSpaceOnUse" x1="${f(C[0])}" y1="${f(C[1])}" x2="${f(E[0])}" y2="${f(E[1])}"><stop offset=".35" stop-color="#6b4426" stop-opacity="0"/><stop offset="1" stop-color="#5e3a1e" stop-opacity=".95"/></linearGradient>`); g += `<path d="${d}" fill="url(#${gid})" opacity="${f2(x.brown)}"/>`; }
    return g;
  }
  function stem(x, bx, by, L, a, bend, op) {
    op = op || {};
    const s = op.s || sg(a), a0 = a + s * x.dd * (op.da == null ? 8 : op.da), a1 = cl(a0 + bend + s * x.dd * (op.dr == null ? 60 : op.dr), -160, 160);
    const Lx = L * (1 - .05 * cl(x.dd)), d0 = dir(a0), d1 = dir(a1);
    const cx = bx + d0[0] * Lx * .55, cy = by + d0[1] * Lx * .55, ex = cx + d1[0] * Lx * .5, ey = cy + d1[1] * Lx * .5;
    const w = op.w || 2, col = op.col || x.st, path = `M${f(bx)} ${f(by)}Q${f(cx)} ${f(cy)} ${f(ex)} ${f(ey)}`;
    const svgS = `<path d="${path}" fill="none" stroke="${H.shade(col, -.35)}" stroke-width="${f(w + .9)}" stroke-linecap="round"/><path d="${path}" fill="none" stroke="${col}" stroke-width="${f(w)}" stroke-linecap="round"/><path d="${path}" fill="none" stroke="#fff" stroke-opacity=".2" stroke-width="${f(w * .32)}" stroke-linecap="round" transform="translate(${f(-w * .25)} 0)"/>`;
    return { x: ex, y: ey, a: a1, cx, cy, svg: svgS, path };
  }
  const bz = (p, t) => { const u = 1 - t; return [u * u * u * p[0] + 3 * u * u * t * p[2] + 3 * u * t * t * p[4] + t * t * t * p[6], u * u * u * p[1] + 3 * u * u * t * p[3] + 3 * u * t * t * p[5] + t * t * t * p[7]]; };

  const PT = (L, W) => `M0 0C${f(W * .9)} ${f(-L * .18)} ${f(W)} ${f(-L * .7)} 0 ${f(-L)}C${f(-W)} ${f(-L * .7)} ${f(-W * .9)} ${f(-L * .18)} 0 0Z`;
  const RP = (L, W) => `M0 0C${f(W * 1.05)} ${f(-L * .08)} ${f(W * 1.12)} ${f(-L * .92)} 0 ${f(-L)}C${f(-W * 1.12)} ${f(-L * .92)} ${f(-W * 1.05)} ${f(-L * .08)} 0 0Z`;
  const ring = (n, d, fill, r0, extra) => { let s = ""; for (let i = 0; i < n; i++) s += `<path d="${d}" fill="${fill}" transform="rotate(${f((r0 || 0) + i * 360 / n)})"${extra || ""}/>`; return s; };
  function scallop(r, n, dep) { let s = ""; for (let i = 0; i <= n; i++) { const t = i / n * 6.2832, x0 = Math.cos(t) * r, y0 = Math.sin(t) * r;
    if (!i) s += `M${f(x0)} ${f(y0)}`; else { const tm = (i - .5) / n * 6.2832; s += `Q${f(Math.cos(tm) * (r + dep))} ${f(Math.sin(tm) * (r + dep))} ${f(x0)} ${f(y0)}`; } } return s + "Z"; }
  function phyllo(n, R, sy) { const out = []; for (let i = 0; i < n; i++) { const r = R * Math.sqrt((i + .5) / n), t = i * 137.508 * RAD; out.push([r * Math.cos(t), r * Math.sin(t) * sy, r / R, (i * 137.508) % 360]); } return out.sort((a, b) => a[1] - b[1]); }
  const sphereCol = (pc, nx, ny) => H.shade(pc, cl(.28 - .32 * (ny + 1) - .14 * (nx + 1) + .2, -.45, .4));
  const fadePc = (x) => H.mix(x.pc, "#7a5a3a", .4);
  function dew(x, px, py, s) {
    if (x.w < .55) return "";
    const op = f2(cl((x.w - .55) / .3) * .9 + .1), i = x.n++;
    return `<g opacity="${op}"><circle cx="${f(px)}" cy="${f(py)}" r="${f(1.8 * s)}" fill="#e6f6ff" fill-opacity=".4" stroke="#fff" stroke-opacity=".75" stroke-width=".5"/><circle cx="${f(px - .6 * s)}" cy="${f(py - .6 * s)}" r="${f(.6 * s)}" fill="#fff"/><path class="${P}tw" style="animation-delay:-${f((i * 1.37) % 3.6)}s" d="M${f(px + 1.4 * s)} ${f(py - 5 * s)}l.6 2.2 2.2 .6-2.2 .6-.6 2.2-.6-2.2-2.2-.6 2.2-.6Z" fill="#fff"/></g>`;
  }
  function fallen(x, pts, shape) {
    if (x.w > .32) return "";
    const n = Math.max(1, Math.round(pts.length * cl((.36 - x.w) / .3))), col = fadePc(x);
    return pts.slice(0, n).map(([px, py, r, s]) => `<g transform="${tr(px, py, r, s, s * .5)}"><path d="${shape || RP(8, 4.6)}" fill="${col}"/><path d="${shape || RP(8, 4.6)}" fill="#000" opacity=".18" transform="scale(.6 1)"/></g>`).join("");
  }
  function falling(x, px, py, d, shape) {
    if (!x.anim || x.w > .36) return "";
    return `<g transform="translate(${f(px)} ${f(py)})"><g class="${P}fall" style="animation-delay:-${d || 0}s"><path d="${shape || RP(7, 4.2)}" fill="${fadePc(x)}"/></g></g>`;
  }
  const leafy = (x, k) => H.mix(x.lf, k, .5);

  const icons = [];
  const add = (id, name, colors, render) => icons.push({ id, name, colors, picker: true, colorLabel: "Flowers", render });

  function phal(x, s) {
    const pc = x.pc, vein = H.shade(pc, -.28);
    let g = `<path d="${PT(15, 6.4)}" fill="${x.url("p")}"/>`;
    g += `<path d="${PT(14, 6)}" fill="${x.url("p")}" transform="rotate(148)"/><path d="${PT(14, 6)}" fill="${x.url("p")}" transform="rotate(-148)"/>`;
    g += `<g transform="rotate(74)"><path d="${RP(16, 10.5)}" fill="${x.url("pr")}"/><path d="M0 -2V-13M0 -3L-4 -11.5M0 -3L4 -11.5" stroke="${vein}" stroke-opacity=".35" stroke-width=".6" fill="none"/></g>`;
    g += `<g transform="rotate(-74)"><path d="${RP(16, 10.5)}" fill="${x.url("pr")}"/><path d="M0 -2V-13M0 -3L-4 -11.5M0 -3L4 -11.5" stroke="${vein}" stroke-opacity=".35" stroke-width=".6" fill="none"/></g>`;
    g += `<path d="M-5 2C-7.5 8 -3.5 13 0 13C3.5 13 7.5 8 5 2C3 4 -3 4 -5 2Z" fill="${H.shade(pc, -.38)}"/><path d="M-3 3.2C-1.5 5 1.5 5 3 3.2" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width=".7"/>`;
    g += `<ellipse cx="0" cy="4" rx="3.2" ry="2" fill="#f3c847"/><circle cx="-1" cy="4" r=".5" fill="#c0392b"/><circle cx="1.1" cy="4.4" r=".5" fill="#c0392b"/>`;
    g += `<ellipse cx="0" cy="-.5" rx="2.2" ry="3.4" fill="${H.shade(pc, .55)}"/><ellipse cx="0" cy="-1.5" rx="1" ry="1" fill="#fff8d8"/>`;
    return g;
  }
  add("orchid", "Moth orchid", ["#f7f1fa", "#e8559c", "#a855c8", "#f6d36b", "#ff8a7a", "#7a3f9e"], (o) => {
    const x = ctx(o); let b = pot(x, "cw", 88, 144, 54, 44, 42, { bark: 1 });
    let p = leaf(x, 86, 142, 34, 11, -38, { dark: 1, round: 1, dr: 30, dew: 1 }) + leaf(x, 88, 143, 48, 15, -80, { dark: 1, round: 1, dr: 22 }) + leaf(x, 89, 144, 52, 16, 77, { dark: 1, round: 1, dr: 22, dew: 1 });
    p += `<path d="M78 143C70 151 68 160 74 168" fill="none" stroke="#9fb0a0" stroke-width="3.2" stroke-linecap="round"/><path d="M73 166l1 3" stroke="#78b46a" stroke-width="3" stroke-linecap="round"/>`;
    p += `<path d="M95 142V58" stroke="#b8925a" stroke-width="1.6"/><path d="M94.5 142V58" stroke="#fff" stroke-opacity=".25" stroke-width=".5"/>`;
    p += `<path d="M94 142C93 106 91 72 104 52" fill="none" stroke="${x.st}" stroke-width="2.4" stroke-linecap="round"/><rect x="92.6" y="94" width="4" height="2" rx="1" fill="#e9e2c8"/>`;
    const A = [104, 52, 128, 34, 160, 44, 168, 86], rot = x.dd * 30;
    let arch = `<path d="M104 52C128 34 160 44 168 86" fill="none" stroke="${x.st}" stroke-width="2" stroke-linecap="round"/>`;
    const nb = x.w < .22 ? 2 : x.w < .4 ? 3 : 4, ts = [.12, .38, .62, .86], sc = [1, .95, .87, .78];
    arch += `<ellipse cx="168" cy="88" rx="3" ry="4.4" fill="${H.mix(x.pc, "#8fbf6a", .45)}"/><ellipse cx="166.8" cy="86.6" rx="1" ry="1.6" fill="#fff" opacity=".35"/>`;
    for (let i = nb - 1; i >= 0; i--) { const q = bz(A, ts[i]); arch += `<g transform="${tr(q[0], q[1] + 4, -rot * .6 + (i - 1.5) * 6, sc[i] * .98 * (.82 + .18 * x.h))}">${phal(x)}</g>`; }
    p += `<g transform="rotate(${f(rot)} 104 52)">${arch}</g>`;
    b += sway(x, p, 1) + fallen(x, [[126, 186, 20, 1.2], [56, 187, -30, 1.1], [140, 189, 70, 1]]) + falling(x, 146, 112, 1.5);
    return svg(x, b);
  });

  add("poinsettia", "Poinsettia", ["#d41f2f", "#f4efe2", "#f28cb1", "#e9c46a", "#b8326a", "#ea6a3c"], (o) => {
    const x = ctx(o); let b = pot(x, "rd", 100, 148, 60, 46, 38, { band: "#e3c16f" });
    let p = "";
    [[-100, 34], [100, 34], [-72, 38], [72, 38], [-40, 34], [42, 34]].forEach(([a, L], i) => { p += leaf(x, 100 + a * .08, 147, L, 12, a, { serr: 1, veins: 3, dr: 30, dew: i === 3 }); });
    const bractRing = (cx, cy, s, rot0, back) => {
      let g = `<g transform="${tr(cx, cy, rot0 + x.dd * 8, s * (.85 + .15 * x.h), s * (.62 + .2 * x.h))}">`;
      const n = back ? 6 : 7;
      for (let i = 0; i < n; i++) { const a = i * 360 / n + (back ? 30 : 0), L = back ? 30 : 24;
        g += `<g transform="rotate(${f(a)})"><path d="${PT(L, 8.5)}" fill="${x.url("p")}"/><path d="M0 -1V${f(-L * .9)}" stroke="${H.shade(x.pc, -.3)}" stroke-opacity=".45" stroke-width=".7"/><path d="M0 ${f(-L * .4)}l4 -4M0 ${f(-L * .4)}l-4 -4M0 ${f(-L * .65)}l3 -3M0 ${f(-L * .65)}l-3 -3" stroke="${H.shade(x.pc, -.28)}" stroke-opacity=".35" stroke-width=".5" fill="none"/></g>`; }
      for (let i = 0; i < 6; i++) { const a = i * 60 * RAD; g += `<circle cx="${f(Math.cos(a) * 3)}" cy="${f(Math.sin(a) * 3)}" r="1.6" fill="#7aa83f"/><circle cx="${f(Math.cos(a) * 3)}" cy="${f(Math.sin(a) * 3)}" r=".8" fill="#f2c94c"/>`; }
      return g + "</g>";
    };
    const tops = [[76, 110, .9, -12], [126, 108, .92, 14], [100, 96, 1, 0], [86, 126, .85, -20], [116, 126, .85, 22]];
    tops.forEach(([cx, cy, s, r]) => { const st = stem(x, 100, 146, Math.hypot(cx - 100, 146 - cy), Math.atan2(cx - 100, 146 - cy) / RAD, 0, { dr: 20, w: 1.8 }); p += st.svg; });
    tops.forEach(([cx, cy, s, r]) => { p += bractRing(cx, cy + x.dd * 10, s, r, false); });
    b += sway(x, p, 2.4) + fallen(x, [[62, 188, 40, 1.4], [138, 187, -20, 1.3], [128, 191, 80, 1.1]], PT(14, 5)) + falling(x, 70, 120, 2.2, PT(10, 4));
    return svg(x, b);
  });

  add("violet", "African violet", ["#7b4fc9", "#c04fd0", "#e85d9e", "#3f5fd0", "#f4f1f7", "#d84a5f"], (o) => {
    const x = ctx(o); let b = pot(x, "rp", 100, 152, 64, 48, 34, {});
    let p = "";
    [[-104, 30], [104, 30], [-72, 31], [72, 31], [-40, 27], [40, 27], [-125, 24], [125, 24]].forEach(([a, L], i) => { p += leaf(x, 100 + sg(a) * 2, 149, L * 1.2, 16, a, { round: 1, fuzz: 1, dark: 1, dr: 26, pet: 7, gl: .5, dew: i === 2 }); });
    const fl = [[82, 116], [100, 105], [118, 115], [90, 128], [110, 128], [100, 118], [126, 129], [74, 129]];
    const n = x.w < .22 ? 4 : x.w < .4 ? 6 : 8;
    fl.slice(0, n).forEach(([fx, fy]) => { p += `<path d="M100 148Q${f((fx + 100) / 2)} ${f(fy + 16)} ${f(fx)} ${f(fy + x.dd * 12)}" fill="none" stroke="${H.mix(x.st, "#8a4a6a", .4)}" stroke-width="1.1"/>`; });
    fl.slice(0, n).forEach(([fx, fy], i) => {
      const s = (1.18 - (i % 3) * .07) * (.78 + .22 * x.h);
      p += `<g transform="${tr(fx + (fx - 100) * x.dd * .3, fy + x.dd * 12, (fx - 100) * .4 + x.dd * (fx < 100 ? -25 : 25), s, s * (.92 - .3 * x.dd))}">${ring(5, RP(9.5, 6.2), x.url("pr"), 18)}<path d="${RP(9.5, 6.2)}" fill="#fff" opacity=".12" transform="rotate(-54)"/><circle r="2.4" fill="${H.shade(x.pc, -.45)}"/><ellipse cx="-1.2" cy="-.2" rx="1.4" ry="1.9" fill="#f5d33b"/><ellipse cx="1.2" cy="-.2" rx="1.4" ry="1.9" fill="#e9b81f"/></g>`;
    });
    b += sway(x, p, .8) + fallen(x, [[64, 186, 30, 1], [136, 187, -40, 1], [72, 190, 90, .9]]) + falling(x, 120, 132, .7);
    return svg(x, b);
  });

  const HEART = (L, W) => `M0 ${f(L * .08)}C${f(-W * .3)} ${f(-L * .12)} ${f(-W)} ${f(-L * .1)} ${f(-W)} ${f(L * .3)}C${f(-W)} ${f(L * .62)} ${f(-W * .35)} ${f(L * .82)} 0 ${f(L)}C${f(W * .35)} ${f(L * .82)} ${f(W)} ${f(L * .62)} ${f(W)} ${f(L * .3)}C${f(W)} ${f(-L * .1)} ${f(W * .3)} ${f(-L * .12)} 0 ${f(L * .08)}Z`;
  add("anthurium", "Anthurium", ["#d7263d", "#ff7aa2", "#f8f6f0", "#e8590c", "#6d1430", "#9b5de5"], (o) => {
    const x = ctx(o); let b = pot(x, "pk", 100, 148, 52, 42, 38, {});
    let p = "";
    [[-48, 64, -10, 36, 16], [44, 60, 10, 34, 15], [-14, 74, -4, 30, 13]].forEach(([a, L, bd, hl, hw], i) => {
      const st = stem(x, 100 + a * .06, 146, L, a, bd, { dr: 45 }), s = sg(a);
      p += st.svg + `<g transform="${tr(st.x, st.y, -s * 38 + st.a * .3 - s * x.dd * 20)}"><path d="${HEART(hl * (1 - .1 * x.dd), hw)}" fill="${x.url("lfd")}"/><path d="M0 ${f(hl * .1)}V${f(hl * .95)}" stroke="${H.shade(x.lf, .4)}" stroke-opacity=".5" stroke-width=".9"/><path d="M0 ${f(hl * .3)}Q${f(hw * .5)} ${f(hl * .3)} ${f(hw * .8)} ${f(hl * .12)}M0 ${f(hl * .3)}Q${f(-hw * .5)} ${f(hl * .3)} ${f(-hw * .8)} ${f(hl * .12)}M0 ${f(hl * .55)}Q${f(hw * .5)} ${f(hl * .55)} ${f(hw * .75)} ${f(hl * .42)}M0 ${f(hl * .55)}Q${f(-hw * .5)} ${f(hl * .55)} ${f(-hw * .75)} ${f(hl * .42)}" fill="none" stroke="#fff" stroke-opacity=".14" stroke-width=".6"/>${x.gloss > .05 ? `<path d="M${f(-hw * .7)} ${f(hl * .15)}Q${f(-hw * .8)} ${f(hl * .5)} ${f(-hw * .3)} ${f(hl * .78)}" fill="none" stroke="#fff" stroke-opacity="${f2(x.gloss)}" stroke-width="1.4" stroke-linecap="round"/>` : ""}${x.brown > .05 ? `<path d="${HEART(hl * (1 - .1 * x.dd), hw)}" fill="${x.url("tipv")}" opacity="${f2(x.brown)}"/>` : ""}</g>`;
    });
    const nf = x.w < .25 ? 2 : 3;
    [[-26, 80, -6, 1], [24, 86, 6, .95], [2, 66, 14, .85]].slice(0, nf).forEach(([a, L, bd, s]) => {
      const st = stem(x, 100, 146, L, a, bd, { dr: 55, w: 1.8 }), sz = s * (.8 + .2 * x.h);
      p += st.svg + `<g transform="${tr(st.x, st.y, st.a * .4 + sg(a) * x.dd * 30, sz)}"><path d="${HEART(26, 13)}" fill="${x.url("pr")}"/><path d="M0 3V25" stroke="${H.shade(x.pc, -.3)}" stroke-opacity=".45" stroke-width=".7"/><path d="M0 8Q7 8 10 3M0 8Q-7 8 -10 3M0 15Q6 15 9 11M0 15Q-6 15 -9 11" fill="none" stroke="${H.shade(x.pc, -.25)}" stroke-opacity=".3" stroke-width=".6"/><path d="M-9 3Q-11 10 -5 18" fill="none" stroke="#fff" stroke-opacity="${f2(.2 + .5 * x.h)}" stroke-width="2" stroke-linecap="round"/><path d="${HEART(26, 13)}" fill="${x.url("gls")}" opacity="${f2(.3 + .4 * x.h)}"/><path d="M0 4C3 -3 5 -10 4 -17" fill="none" stroke="#b58f2a" stroke-width="4.6" stroke-linecap="round"/><path d="M0 4C3 -3 5 -10 4 -17" fill="none" stroke="#f3d56b" stroke-width="3.4" stroke-linecap="round"/><path d="M1 2C3 -4 4 -9 3.6 -15" fill="none" stroke="#fff6c8" stroke-width="1" stroke-linecap="round" stroke-opacity=".7"/></g>`;
    });
    b += sway(x, p, 3.1) + fallen(x, [[60, 188, 30, 1.5], [140, 189, -40, 1.3]], HEART(14, 7)) + falling(x, 70, 110, 3, HEART(10, 5));
    return svg(x, b);
  });

  function hib(x, open) {
    const W = 16 * (.7 + .3 * open), eye = grad(x, "eye", (id) => rg(id, [[0, H.shade(x.pc, -.65), .95], [.55, H.shade(x.pc, -.45), .7], [1, x.pc, 0]]));
    let g = "";
    for (let i = 0; i < 5; i++) g += `<g transform="rotate(${f(i * 72 - 8)})"><path d="${RP(26, W)}" fill="${x.url("p")}"/><path d="M0 -2L0 -22M0 -3L-6 -20M0 -3L6 -20M0 -3L-10 -15M0 -3L10 -15" stroke="${H.shade(x.pc, -.3)}" stroke-opacity=".25" stroke-width=".6" fill="none"/><path d="M${f(-W * .9)} -18Q0 -30 ${f(W * .9)} -18" fill="none" stroke="#fff" stroke-opacity=".18" stroke-width="1.2"/><path d="${RP(26, W)}" fill="#000" opacity=".12" transform="scale(.5 1) translate(${f(W * .9)} 0)"/></g>`;
    g += `<circle r="11" fill="${eye}"/>`;
    g += `<path d="M0 0L15 -22" stroke="${H.shade(x.pc, .25)}" stroke-width="2.4" stroke-linecap="round"/><path d="M0 0L15 -22" stroke="#fff" stroke-opacity=".3" stroke-width=".8"/>`;
    [[9, -13], [11, -16], [8, -16], [12, -13], [10, -19], [13, -18]].forEach(([a, c]) => { g += `<circle cx="${a}" cy="${c}" r="1.1" fill="#f6cf3a"/>`; });
    [[15, -24], [17, -22], [14, -25.5], [17.6, -24.6]].forEach(([a, c]) => { g += `<circle cx="${a}" cy="${c}" r="1.2" fill="${H.shade(x.pc, -.5)}"/>`; });
    return g;
  }
  add("hibiscus", "Hibiscus", ["#e8312f", "#ff8a3d", "#ffd23f", "#ff6fa5", "#f8f2e8", "#c2185b"], (o) => {
    const x = ctx(o); let b = pot(x, "cb", 100, 152, 66, 52, 34, { rim: 6 });
    let p = `<path d="M98 150Q96 128 84 108M102 150Q106 124 120 102M100 150Q100 120 102 92" fill="none" stroke="#6a4a2e" stroke-width="2.6" stroke-linecap="round"/>`;
    const L = [[70, 120, -70], [130, 118, 70], [84, 106, -40], [116, 100, 40], [62, 102, -84], [138, 98, 86], [100, 92, 0], [92, 76, -20], [114, 74, 24], [76, 86, -56], [128, 84, 60], [104, 116, 15], [88, 124, -30], [118, 130, 50], [80, 136, -100], [124, 140, 104]];
    L.forEach(([lx, ly, a], i) => { p += leaf(x, lx, ly + x.dd * 6, 22, 10, a, { dark: i % 3 === 0, serr: 1, veins: 2, dr: 32, dew: i === 6 || i === 11 }); });
    const op = .3 + .7 * x.h;
    p += `<g transform="${tr(108, 64 + x.dd * 14, 20 + x.dd * 40, .85)}"><path d="M-4 0C-6 -8 -2 -16 2 -18C5 -12 5 -5 4 0Z" fill="${x.url("p")}"/><path d="M-5 1C-6 -4 -4 -6 -2 -6L0 0L2 -6C4 -6 6 -3 5 1Z" fill="#4f8a3c"/></g>`;
    if (x.w > .2) p += `<g transform="${tr(128, 84 + x.dd * 16, 24 + x.dd * 50, .78 * (.75 + .25 * x.h), .7 * (.75 + .25 * x.h))}">${hib(x, op)}</g>`;
    p += `<g transform="${tr(78, 92 + x.dd * 18, -10 - x.dd * 45, .95 * (.75 + .25 * x.h), .92 * (.7 + .3 * x.h))}">${hib(x, op)}</g>`;
    b += sway(x, p, 1.9);
    if (x.w <= .2) b += `<g transform="${tr(146, 184, 70, .5, .3)}">${hib(x, .5)}</g>`;
    b += fallen(x, [[56, 188, 30, 1.6], [62, 192, 100, 1.3]], RP(14, 9)) + falling(x, 70, 118, .6, RP(10, 6));
    return svg(x, b);
  });

  function umbel(x, cx, cy, R) {
    let g = `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(R * .72)}" fill="${H.shade(x.pc, -.35)}"/>`;
    phyllo(10, R * .78, .85).forEach(([px, py, rr, rot]) => {
      const col = sphereCol(x.pc, px / R, py / R), s = (1 - rr * .25) * (.75 + .25 * x.h);
      g += `<g transform="${tr(cx + px, cy + py + x.dd * rr * 4, rot, s)}">${ring(5, RP(7, 4.8), col, 0)}<path d="${RP(7, 4.8)}" fill="#fff" opacity=".14" transform="rotate(-72)"/><circle r="1.3" fill="${H.shade(x.pc, -.45)}"/><circle r=".5" fill="#f3e9b0"/></g>`;
    });
    return g;
  }
  add("geranium", "Geranium", ["#e03131", "#ff6b8a", "#f783ac", "#f6f0f2", "#ff7a33", "#b0306a"], (o) => {
    const x = ctx(o); let b = pot(x, "tc", 100, 150, 58, 44, 36, { rim: 9, matte: 1 });
    let p = "";
    const st = [[-28, 66, -8], [6, 84, 0], [30, 60, 10]].map(([a, L, bd]) => stem(x, 100, 140, L, a, bd, { dr: 55, w: 1.8 }));
    st.forEach((s) => { p += s.svg; });
    const lv = [[70, 140], [130, 138], [84, 130], [116, 128], [100, 134], [60, 150], [140, 150], [92, 144], [110, 146]];
    lv.forEach(([lx, ly], i) => {
      const ss = 1 - (i % 3) * .08, a = (lx - 100) * .5 + x.dd * (lx < 100 ? -18 : 18);
      p += `<g transform="${tr(lx + (lx - 100) * x.dd * .15, ly + x.dd * 7, a, ss, ss * (.72 - .14 * x.dd))}"><path d="${scallop(13, 9, 2.4)}" fill="${x.url("lf")}"/><path d="${scallop(13, 9, 2.4)}" fill="#000" opacity=".12" transform="scale(.55 1) translate(10 0)"/><circle r="8" fill="none" stroke="${H.mix(x.lf, "#4a2a12", .55)}" stroke-opacity=".45" stroke-width="2.2"/><path d="M0 0L0 -12M0 0L10 -6M0 0L-10 -6M0 0L8 8M0 0L-8 8" stroke="#fff" stroke-opacity=".15" stroke-width=".6"/>${x.gloss > .05 ? `<path d="M-9 -7Q-4 -12 3 -11" fill="none" stroke="#fff" stroke-opacity="${f2(x.gloss * .7)}" stroke-width="1.2"/>` : ""}${x.brown > .05 ? `<path d="${scallop(13, 9, 2.4)}" fill="none" stroke="#7a5230" stroke-width="3" stroke-opacity="${f2(x.brown)}"/>` : ""}</g>`;
    });
    p += dew(x, 118, 125, 1);
    const nu = x.w < .22 ? 2 : 3;
    st.slice(0, nu).forEach((s, i) => { p += umbel(x, s.x, s.y, [15, 17, 14][i]); });
    b += sway(x, p, 2.7) + fallen(x, [[58, 189, 20, 1], [142, 188, -30, 1], [66, 192, 80, .9], [134, 192, 60, .9]], RP(6, 3.8)) + falling(x, 128, 100, 1.1, RP(6, 4));
    return svg(x, b);
  });

  add("begonia", "Wax begonia", ["#ff4d6d", "#ffb3c6", "#f8f4f0", "#e63946", "#ff8c42"], (o) => {
    const x = ctx(o); let b = pot(x, "bk", 100, 150, 72, 56, 34, { weave: 1, matte: 1 });
    let p = "";
    const r = rng(77), L = [], sag = x.dd * 6;
    p += `<path d="M60 150C56 120 76 ${f(102 + sag)} 100 ${f(100 + sag)}C124 ${f(102 + sag)} 144 120 140 150Z" fill="${x.url("lfd")}"/>`;
    for (let i = 0; i < 34; i++) { const an = (r() * 2 - 1) * 95, rr = .45 + Math.sqrt(r()) * .55; L.push([100 + Math.sin(an * RAD) * 44 * rr, 150 - Math.cos(an * RAD) * 44 * rr, an * .9 + (r() * 30 - 15)]); }
    L.sort((a, c) => a[1] - c[1]).forEach(([lx, ly, a], i) => { p += leaf(x, lx, ly + sag, 15, 8.5, a, { round: 1, dark: i % 2 === 0, edge: "#a4484f", dr: 30, gl: 1.2 }); });
    const n = x.w < .22 ? 6 : x.w < .4 ? 10 : 15;
    for (let i = 0; i < n; i++) {
      const an = (r() * 2 - 1) * 80, rr = .5 + r() * .5, fx = 100 + Math.sin(an * RAD) * 44 * rr, fy = 148 - Math.cos(an * RAD) * 48 * rr, s = (.85 + r() * .3) * (.75 + .25 * x.h);
      p += `<g transform="${tr(fx, fy + x.dd * 8, an * .5 + x.dd * 30 * sg(an), s, s * (.9 - .3 * x.dd))}"><path d="${RP(7, 5.6)}" fill="${x.url("pr")}" transform="rotate(-90)"/><path d="${RP(7, 5.6)}" fill="${x.url("pr")}" transform="rotate(90)"/><path d="${RP(4.6, 3.4)}" fill="${x.url("p")}"/><path d="${RP(4.6, 3.4)}" fill="${x.url("p")}" transform="rotate(180)"/><circle r="2" fill="#f2c230"/><circle cx="-.5" cy="-.6" r=".8" fill="#fff3a6"/></g>`;
    }
    p += dew(x, 76, 118, 1) + dew(x, 126, 124, .9);
    b += sway(x, p, 3.6) + fallen(x, [[52, 187, 20, 1], [146, 188, -30, 1], [60, 192, 70, .9], [140, 192, 60, .9]], RP(6, 4.6)) + falling(x, 80, 130, 1.8, RP(6, 4.6));
    return svg(x, b);
  });

  add("kalanchoe", "Kalanchoe", ["#ff5a36", "#ffcc33", "#ff4f8b", "#f8f4ee", "#ff8c1a", "#d6175a"], (o) => {
    const x = ctx(o); let b = pot(x, "br", 100, 154, 52, 40, 30, {});
    let p = "";
    [[-100, 26], [100, 26], [-70, 28], [70, 28], [-40, 26], [40, 26], [-12, 22], [14, 22]].forEach(([a, L], i) => { p += leaf(x, 100 + a * .05, 152, L, 13, a, { round: 1, serr: 1, dr: 18, curl: .1, gl: 1.4, curlW: 1, dew: i === 5 }); });
    const heads = [[80, 108, 13], [101, 98, 15], [121, 109, 13]].slice(0, x.w < .22 ? 2 : 3);
    heads.forEach(([hx, hy]) => { p += `<path d="M100 146Q${f((hx + 100) / 2)} 130 ${f(hx)} ${f(hy + x.dd * 12)}" fill="none" stroke="${x.st}" stroke-width="2"/>`; });
    heads.forEach(([hx, hy, R]) => {
      const cy = hy + x.dd * 12;
      p += `<ellipse cx="${f(hx)}" cy="${f(cy + 2)}" rx="${f(R)}" ry="${f(R * .55)}" fill="${H.mix(x.st, "#2a3a1a", .4)}"/>`;
      phyllo(16, R, .55).forEach(([px, py, rr, rot], i) => {
        const col = sphereCol(x.pc, px / R, py / R / .55), bud = rr > .85 && i % 2 === 0;
        p += bud ? `<circle cx="${f(hx + px)}" cy="${f(cy + py)}" r="1.8" fill="${H.mix(col, "#8fbf6a", .4)}"/>`
          : `<g transform="${tr(hx + px, cy + py - 1, rot, (.95 - rr * .25) * (.7 + .3 * x.h))}">${ring(4, RP(4.2, 3.1), col, 45)}<circle r=".9" fill="#f6d34a"/></g>`;
      });
    });
    b += sway(x, p, .4) + fallen(x, [[60, 186, 20, .8], [142, 187, -30, .8], [66, 190, 80, .7]], RP(5, 3.4)) + falling(x, 120, 112, 2.6, RP(5, 3.4));
    return svg(x, b);
  });

  add("bromeliad", "Bromeliad", ["#e8243c", "#ff9f1c", "#ffd23f", "#e64fa0", "#9b5de5"], (o) => {
    const x = ctx(o); let b = pot(x, "ys", 100, 154, 50, 40, 32, {});
    let p = "";
    [[-60, 56, -34], [60, 56, 34], [-36, 58, -26], [38, 58, 26], [-14, 50, -16], [14, 50, 16]].forEach(([a, L, bd]) => { p += strap(x, 100, 150, L, 9, a, bd, { dark: 1, dr: 40 }); });
    const lean = x.dd * 14;
    let br = "";
    for (let i = 0; i < 7; i++) {
      const y = 134 - i * 11, ang = 52 - i * 6, L = 22 - i * 1.7, wd = 6.4 - i * .4, sc = .82 + .18 * x.h;
      const fl = (a) => `<g transform="${tr(100, y, a * sc + (a > 0 ? 1 : -1) * x.dd * 14)}"><path d="${PT(L, wd)}" fill="${x.url("p")}"/><path d="M0 -1V${f(-L * .9)}" stroke="#fff" stroke-opacity=".2" stroke-width=".7"/>${i < 5 && x.w > .3 ? `<ellipse cx="0" cy="${f(-L + 1.5)}" rx="1.4" ry="2.2" fill="#fff6dc"/>` : ""}</g>`;
      br += fl(-ang) + fl(ang);
    }
    br += `<g transform="${tr(100, 64, 0, .9 * (.82 + .18 * x.h))}"><path d="${PT(18, 5.4)}" fill="${x.url("p")}"/></g>`;
    p += `<g transform="rotate(${f(lean)} 100 150)">${br}<path d="M100 150V130" stroke="${H.shade(x.pc, -.45)}" stroke-width="5"/></g>`;
    [[-84, 44, -24], [84, 44, 24], [-104, 38, -20], [104, 38, 20]].forEach(([a, L, bd]) => { p += strap(x, 100, 151, L, 9.5, a, bd, { dr: 30 }); });
    b += sway(x, p, 2) + fallen(x, [[60, 187, 40, 1.4], [140, 188, -40, 1.3]], PT(12, 4.4)) + falling(x, 118, 96, 1, PT(10, 4));
    return svg(x, b);
  });

  function tulip(x, open, k) {
    const sp = (1 - open) * 34, dark = H.shade(x.pc, -.3);
    let g = `<path d="M-8 -1C-11 -12 -7 -22 0 -25C7 -22 11 -12 8 -1C5 3 -5 3 -8 -1Z" fill="${dark}"/>`;
    g += `<g transform="rotate(${f(-sp)} -2 0)"><path d="M-1 2C-8 2 -12 -6 -11 -14C-10 -20 -6 -24 -3 -25C0 -18 2 -8 -1 2Z" fill="${x.url("p")}"/></g>`;
    g += `<g transform="rotate(${f(sp)} 2 0)"><path d="M1 2C8 2 12 -6 11 -14C10 -20 6 -24 3 -25C0 -18 -2 -8 1 2Z" fill="${x.url("p")}"/><path d="M1 2C8 2 12 -6 11 -14C10 -20 6 -24 3 -25C0 -18 -2 -8 1 2Z" fill="#000" opacity=".16"/></g>`;
    g += `<path d="M-6 1C-9 -8 -6 -18 0 -23C6 -18 9 -8 6 1C3 4 -3 4 -6 1Z" fill="${x.url("p")}"/><path d="M-3.4 -3C-5 -9 -3.5 -15 -.5 -19" fill="none" stroke="#fff" stroke-opacity="${f2(.18 + .3 * x.h)}" stroke-width="1.6" stroke-linecap="round"/>`;
    return g;
  }
  add("tulips", "Potted tulips", ["#e03131", "#ffd43b", "#f783ac", "#f8f4ee", "#9c36b5", "#ff922b"], (o) => {
    const x = ctx(o); let b = box(x, "wd", 100, 156, 104, 30);
    const gf = grad(x, "tlf", (id) => { const c = H.mix(x.lf, "#7aa08a", .35); return lg(id, [[0, H.shade(c, .3)], [.5, c], [1, H.shade(c, -.45)]]); });
    let p = "";
    [[60, -40, 42, -20], [140, 42, 42, 20], [76, -22, 46, -14], [126, 24, 48, 14], [94, -8, 40, -12], [108, 10, 38, 12]].forEach(([lx, a, L, bd]) => { p += strap(x, lx, 152, L, 12, a, bd, { fill: gf, dr: 50 }); });
    const T = [[72, 70, -12, -2], [86, 88, -5, 0], [100, 98, 0, 0], [114, 86, 6, 0], [128, 72, 13, 2]];
    const open = .55 + .45 * x.h;
    const lost = x.w < .2 ? 2 : 0;
    T.forEach(([tx, L, a, bd], i) => {
      const st = stem(x, tx, 152, L, a, bd, { dr: 62 + i * 4, s: i < 2 ? -1 : 1, w: 2.4 });
      p += st.svg;
      if (i >= T.length - lost) { p += `<circle cx="${f(st.x)}" cy="${f(st.y)}" r="2" fill="${H.shade(x.st, -.2)}"/>`; return; }
      p += `<g transform="${tr(st.x, st.y, st.a * .9, .95)}">${tulip(x, open, i)}</g>`;
    });
    [[96, 112, -4], [104, 112, 4]].forEach(([lx, a, bd]) => { p += strap(x, lx, 153, 36, 11, a < 100 ? -4 : 4, 0, { fill: gf, dr: 40, s: lx < 100 ? -1 : 1 }); });
    b += sway(x, p, 1.3) + fallen(x, [[50, 188, 30, 1.5], [150, 189, -30, 1.4], [146, 193, 80, 1.2]], RP(12, 6.5)) + falling(x, 140, 120, 2.3, RP(10, 6));
    return svg(x, b);
  });

  function mophead(x, cx, cy, R) {
    const base = grad(x, "mb", (id) => rg(id, [[0, H.shade(x.pc, .1)], [.7, H.shade(x.pc, -.35)], [1, H.shade(x.pc, -.6)]], .4, .35, .7));
    let g = `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(R)}" fill="${base}"/>`;
    phyllo(30, R * .92, .92).forEach(([px, py, rr, rot]) => {
      const col = sphereCol(x.pc, px / R, py / R), s = (1 - rr * rr * .35) * (.72 + .28 * x.h);
      g += `<g transform="${tr(cx + px, cy + py, rot, s, s * (1 - rr * .3))}">${ring(4, RP(5.4, 4.4), col, 0)}<path d="${RP(5.4, 4.4)}" fill="#fff" opacity=".14" transform="rotate(-45)"/><circle r=".9" fill="${H.shade(x.pc, -.5)}"/></g>`;
    });
    return g;
  }
  add("hydrangea", "Hydrangea", ["#6c8cff", "#e86fb0", "#f4f1ea", "#a47be8", "#bfe39a"], (o) => {
    const x = ctx(o); let b = pot(x, "gv", 100, 150, 78, 64, 36, { rim: 5, ridges: 1, handles: 1 });
    let p = "";
    [[-100, 34], [100, 34], [-70, 36], [70, 36], [-40, 30], [42, 30], [-118, 28], [118, 28]].forEach(([a, L], i) => { p += leaf(x, 100 + a * .1, 148, L, 15, a, { round: 1, serr: 1, veins: 4, dr: 30, dew: i === 3 }); });
    const heads = [[100, 74, 24, 0], [72, 104, 25, -1], [128, 100, 27, 1]];
    heads.forEach(([hx, hy, R, s]) => { p += `<path d="M100 146Q${f((hx + 100) / 2)} ${f(hy + 30)} ${f(hx)} ${f(hy + x.dd * 20)}" fill="none" stroke="${x.st}" stroke-width="2.6"/>`; });
    heads.forEach(([hx, hy, R, s]) => { p += mophead(x, hx + s * x.dd * 6, hy + x.dd * 20, R * (.86 + .14 * x.h)); });
    [[-56, 26], [56, 26]].forEach(([a, L]) => { p += leaf(x, 100, 147, L, 12, a, { round: 1, serr: 1, veins: 3, dr: 30, dark: 1 }); });
    b += sway(x, p, 2.9) + fallen(x, [[50, 186, 20, 1], [150, 187, -20, 1], [56, 190, 70, .9], [144, 191, 60, .9], [62, 193, 10, .8]], RP(5.4, 4.4)) + falling(x, 140, 110, .4, RP(5.4, 4.4));
    return svg(x, b);
  });

  function rose(x, r) {
    let g = `<g transform="scale(1 .82)">`;
    for (let i = 0; i < (x.w < .22 ? 3 : 5); i++) g += `<path d="${RP(r, r * .78)}" fill="${x.url("pr")}" transform="rotate(${i * 72 + 20})"/>`;
    g += `</g><ellipse cx="0" cy="-1" rx="${f(r * .66)}" ry="${f(r * .56)}" fill="${H.shade(x.pc, -.35)}"/>`;
    for (let i = 0; i < 3; i++) g += `<path d="${RP(r * .62, r * .52)}" fill="${x.url("p")}" transform="rotate(${i * 120 - 30}) scale(1 .8)"/>`;
    g += `<ellipse cx="0" cy="-1.5" rx="${f(r * .34)}" ry="${f(r * .3)}" fill="${H.shade(x.pc, -.2)}"/>`;
    g += `<path d="M0 -1C${f(r * .2)} -2 ${f(r * .22)} ${f(-r * .38)} 0 ${f(-r * .38)}C${f(-r * .3)} ${f(-r * .38)} ${f(-r * .36)} 0 ${f(-r * .2)} ${f(r * .2)}C0 ${f(r * .42)} ${f(r * .44)} ${f(r * .3)} ${f(r * .44)} ${f(-r * .06)}" fill="none" stroke="${H.shade(x.pc, -.5)}" stroke-opacity=".75" stroke-width="1.1" stroke-linecap="round"/>`;
    g += `<path d="M${f(-r * .7)} ${f(-r * .3)}Q${f(-r * .5)} ${f(-r * .75)} 0 ${f(-r * .75)}" fill="none" stroke="#fff" stroke-opacity="${f2(.15 + .25 * x.h)}" stroke-width="1.4" stroke-linecap="round"/>`;
    return g;
  }
  function roseLeaf(x, px, py, a) {
    const s = sg(a), aa = a + s * x.dd * 30;
    return `<g transform="${tr(px, py, aa)}"><path d="M0 0V-14" stroke="${x.st}" stroke-width="1"/>${leaf(x, 0, -14, 11, 5, 0, { serr: 1, dr: 0, dark: 1 })}${leaf(x, 0, -7, 10, 4.6, -55, { serr: 1, dr: 0, dark: 1 })}${leaf(x, 0, -7, 10, 4.6, 55, { serr: 1, dr: 0, dark: 1 })}</g>`;
  }
  add("rose", "Rose bush", ["#c9184a", "#ff8fab", "#fff1e6", "#ffd166", "#ff7b54", "#7b1e3a"], (o) => {
    const x = ctx(o); let b = pot(x, "cc", 100, 148, 60, 40, 30, { foot: 1, rim: 6, matte: 1 });
    let p = "";
    const S = [[-24, 70, -6], [8, 82, 2], [32, 58, 12], [-8, 92, -2], [42, 76, 8]].map(([a, L, bd]) => stem(x, 100, 146, L, a, bd, { dr: 35, da: 4, w: 2.2, col: H.mix(x.st, "#5a4a2a", .3) }));
    S.forEach((s) => { p += s.svg; const tx = (s.cx + 100) / 2, ty = (s.cy + 146) / 2; p += `<path d="M${f(tx)} ${f(ty)}l2.4 -1.2 -1.6 2.6Z" fill="#6a3a22"/>`; });
    [[80, 120, -70], [120, 116, 70], [92, 98, -40], [112, 92, 50], [70, 102, -90], [132, 108, 96], [102, 116, 10], [124, 80, 30], [84, 82, -30]].forEach(([lx, ly, a]) => { p += roseLeaf(x, lx, ly + x.dd * 6, a); });
    [[0, 17], [1, 18], [2, 16]].forEach(([i, r]) => { const s = S[i]; p += `<g transform="${tr(s.x, s.y, s.a * .5 + sg(s.a) * x.dd * 25, .78 + .22 * x.h)}">${rose(x, r)}</g>`; });
    [3, 4].forEach((i) => { const s = S[i]; p += `<g transform="${tr(s.x, s.y, s.a)}"><path d="M0 2C-4 0 -5 -6 0 -12C5 -6 4 0 0 2Z" fill="${x.url("p")}"/><path d="M0 3L-5 -4M0 3L5 -4M0 3L0 -5" stroke="#4f8a3c" stroke-width="1.6" stroke-linecap="round"/></g>`; });
    p += dew(x, 118, 76, 1);
    b += sway(x, p, 1.6) + fallen(x, [[62, 192, 30, 1.3], [138, 193, -20, 1.2], [70, 196, 90, 1.1], [130, 196, 60, 1]], RP(10, 7.5)) + falling(x, 80, 100, 2.8, RP(9, 7));
    return svg(x, b);
  });

  function daisy(x, R, op) {
    op = op || {};
    const inner = H.shade(x.pc, -.18), n1 = op.n1 || 20, n2 = op.n2 || 16;
    let g = ring(n1, PT(R, R * .16), x.url("p"), 0);
    g += ring(n2, PT(R * .7, R * .13), inner, 360 / n2 / 2);
    g += `<circle r="${f(R * .34)}" fill="${op.ring || "#d8b23a"}"/><circle r="${f(R * .26)}" fill="${op.disc || "#3b2a14"}"/><circle r="${f(R * .12)}" fill="${op.eye || "#6d7a2a"}"/><circle cx="${f(-R * .08)}" cy="${f(-R * .1)}" r="${f(R * .07)}" fill="#fff" opacity=".25"/>`;
    return g;
  }
  add("gerbera", "Gerbera daisies", ["#ff6b1a", "#ffd23f", "#ff4d6d", "#f8f4ee", "#e63946", "#ff9eb5"], (o) => {
    const x = ctx(o); let b = pot(x, "cw", 100, 156, 48, 38, 30, {});
    let p = "";
    [[-108, 30], [108, 30], [-80, 32], [80, 32], [-52, 28], [52, 28]].forEach(([a, L], i) => { p += leaf(x, 100, 154, L, 10, a, { serr: 1, veins: 3, dr: 25, dew: i === 3 }); });
    const S = [[96, 100, -14, -6, -1], [102, 112, 4, 4, 1], [106, 88, 22, 8, 1]].map(([bx, L, a, bd, s]) => stem(x, bx, 152, L, a, bd, { dr: 82, s, w: 2 }));
    S.forEach((s) => { p += s.svg; });
    S.forEach((s, i) => {
      const R = [20, 21, 19][i] * (.8 + .2 * x.h), tilt = .82 - .32 * cl(x.dd);
      p += `<g transform="${tr(s.x, s.y, s.a * .6, 1, tilt)}">${daisy(x, R)}</g>`;
    });
    b += sway(x, p, .9) + fallen(x, [[62, 188, 20, 1], [138, 189, -30, 1], [70, 192, 80, 1], [132, 192, 50, .9]], PT(16, 2.8)) + falling(x, 120, 110, 1.4, PT(12, 2.4));
    return svg(x, b);
  });

  add("cyclamen", "Cyclamen", ["#e0115f", "#f8f2f6", "#ff6fa5", "#b5179e", "#ff4d4d"], (o) => {
    const x = ctx(o); let b = pot(x, "cr", 100, 156, 54, 42, 30, {});
    let p = "";
    const stc = H.mix(x.st, "#7a3a4a", .5);
    const F = [[-30, 64, -30], [-14, 80, -40], [2, 88, 30], [16, 76, 40], [30, 62, 34], [-4, 70, -36]].slice(0, x.w < .22 ? 3 : x.w < .4 ? 5 : 6);
    const S = F.map(([a, L, bd]) => stem(x, 100 + a * .1, 150, L, a, bd, { dr: 70, w: 1.4, col: stc }));
    S.forEach((s) => { p += s.svg; });
    S.forEach((s, i) => {
      const sc = .85 + .15 * x.h, op = 1 - x.dd * .5;
      let fl = "";
      [-40, -16, 10, 34].forEach((r, k) => { fl += `<g transform="rotate(${f(r * (1 + .6 * x.dd))}) skewX(${k % 2 ? 10 : -10})"><path d="${PT(22, 5)}" fill="${x.url("p")}"/><path d="M0 -2V-16" stroke="#fff" stroke-opacity=".18" stroke-width=".8"/></g>`; });
      fl += `<ellipse cx="0" cy="2" rx="3.2" ry="2.6" fill="${H.shade(x.pc, -.55)}"/><path d="M0 4.4V8" stroke="${stc}" stroke-width="1.3" stroke-linecap="round"/>`;
      p += `<g transform="${tr(s.x, s.y - 2, s.a * .25 + sg(s.a) * x.dd * 40, sc)}">${fl}</g>`;
    });
    [[-110, 22], [110, 22], [-80, 24], [80, 24], [-50, 22], [50, 22], [-20, 20], [22, 20], [-130, 18], [130, 18]].forEach(([a, L]) => {
      const s = sg(a), aa = a + s * x.dd * 24;
      p += `<g transform="${tr(100 + s * 3, 152, aa)}"><path d="M0 0V-6" stroke="${stc}" stroke-width="1.2"/><g transform="translate(0 -6) rotate(180)">${`<path d="${HEART(L, 11)}" fill="${x.url("lfd")}"/><path d="${HEART(L * .7, 7.5)}" fill="none" stroke="#d9ead2" stroke-opacity=".42" stroke-width="2" transform="translate(0 ${f(L * .12)})"/><path d="M0 ${f(L * .1)}V${f(L * .9)}" stroke="#fff" stroke-opacity=".3" stroke-width=".7"/>`}${x.gloss > .05 ? `<path d="M${f(-8)} ${f(L * .2)}Q-9 ${f(L * .5)} -3 ${f(L * .78)}" fill="none" stroke="#fff" stroke-opacity="${f2(x.gloss)}" stroke-width="1.1"/>` : ""}${x.brown > .05 ? `<path d="${HEART(L, 11)}" fill="none" stroke="#7a5230" stroke-width="2.4" stroke-opacity="${f2(x.brown)}"/>` : ""}</g></g>`;
    });
    p += dew(x, 122, 140, .9);
    b += sway(x, p, 3.3) + fallen(x, [[62, 189, 30, 1.3], [138, 190, -40, 1.3], [70, 193, 80, 1.1]], PT(16, 4.6)) + falling(x, 86, 100, .9, PT(14, 4));
    return svg(x, b);
  });

  add("lavender", "Lavender", ["#8a63d2", "#6d4fc2", "#b79ce8", "#e8b6d8", "#f4f0f8"], (o) => {
    const x = ctx(o); let b = pot(x, "tc", 100, 158, 72, 54, 26, { rim: 7, matte: 1 });
    const sil = grad(x, "sil", (id) => { const c = H.mix(x.lf, "#a9bcae", .55); return lg(id, [[0, H.shade(c, .3)], [.5, c], [1, H.shade(c, -.4)]]); });
    const stc = H.mix(x.st, "#9fb4a0", .5);
    let p = "";
    for (let i = 0; i < 18; i++) { const a = -95 + i * (190 / 17); p += leaf(x, 100 + a * .2, 155, 20 + (i % 3) * 3, 2.6, a, { fill: sil, dr: 26, gl: .3 }); }
    const n = 13, r = rng(31);
    const S = [];
    for (let i = 0; i < n; i++) { const a = -36 + i * 6, L = 70 + r() * 30 - Math.abs(a) * .4; S.push(stem(x, 100 + a * .25, 154, L, a, a * .15, { dr: 44, w: 1.1, col: stc, s: a < 0 ? -1 : 1 })); }
    S.forEach((s) => { p += s.svg; });
    S.forEach((s) => {
      let sp = "";
      for (let k = 0; k < 9; k++) { const y = 1 + k * 2.7, w = 1.1 + k * .32, col = H.shade(x.pc, .18 - k * .05);
        sp += `<ellipse cx="${f(-w)}" cy="${f(y)}" rx="2.1" ry="1.9" fill="${H.shade(col, -.25)}"/><ellipse cx="${f(w)}" cy="${f(y)}" rx="2.1" ry="1.9" fill="${H.shade(col, -.38)}"/><ellipse cx="0" cy="${f(y - .6)}" rx="2.2" ry="2" fill="${col}"/>`; }
      sp += `<circle cx="-.6" cy="1" r=".7" fill="#fff" opacity=".35"/>`;
      p += `<g transform="${tr(s.x, s.y, s.a, .9 + .1 * x.h)}">${sp}</g>`;
    });
    b += sway(x, p, 2.2) + fallen(x, [[58, 190, 20, .5], [64, 192, 70, .45], [140, 191, -20, .5], [134, 193, 40, .45], [146, 194, 0, .45]], RP(6, 3)) + falling(x, 70, 104, 1.6, RP(4, 2.4));
    return svg(x, b);
  });

  function petunia(x, s) {
    const throat = grad(x, "thr", (id) => rg(id, [[0, "#f3e9b0"], [.25, H.shade(x.pc, -.55)], [.6, H.shade(x.pc, -.2)], [1, x.pc, 0]]));
    let g = `<path d="${scallop(9.4, 5, 2.6)}" fill="${x.url("pr")}"/><path d="${scallop(9.4, 5, 2.6)}" fill="#000" opacity=".14" transform="translate(1.6 1.2) scale(.8)"/>`;
    g += `<circle r="5.4" fill="${throat}"/><path d="M0 0L0 -8M0 0L7.6 -2.5M0 0L4.7 6.5M0 0L-4.7 6.5M0 0L-7.6 -2.5" stroke="${H.shade(x.pc, -.45)}" stroke-opacity=".5" stroke-width=".7"/><path d="M-6 -5Q-2 -9 3 -8" fill="none" stroke="#fff" stroke-opacity="${f2(.12 + .25 * x.h)}" stroke-width="1.3" stroke-linecap="round"/>`;
    return g;
  }
  add("petunia", "Petunia basket", ["#c2255c", "#7b2cbf", "#f8f4f8", "#ff6fa5", "#e03131", "#3a56d4"], (o) => {
    const x = ctx(o);
    const coco = grad(x, "coco", (id) => lg(id, [[0, "#4a2f18"], [.3, "#9a6a3c"], [.55, "#7a5030"], [1, "#2e1a0c"]]));
    let p = `<circle cx="100" cy="8" r="4" fill="none" stroke="#c9ced8" stroke-width="1.8"/>`;
    [[60, 96], [100, 102], [140, 96]].forEach(([cx, cy]) => { p += `<path d="M100 12L${cx} ${cy}" stroke="#2d2c35" stroke-width="2.2" stroke-dasharray="3 1.6"/><path d="M100 12L${cx} ${cy}" stroke="#c9ced8" stroke-width="1.1" stroke-dasharray="3 1.6"/>`; });
    p += `<path d="M58 98Q58 150 100 154Q142 150 142 98Z" fill="${coco}"/>`;
    const r = rng(9);
    for (let i = 0; i < 26; i++) { const xx = 62 + r() * 76, yy = 104 + r() * 44; p += `<path d="M${f(xx)} ${f(yy)}q${f(r() * 8 - 4)} ${f(2 + r() * 3)} ${f(r() * 10 - 5)} ${f(4 + r() * 3)}" fill="none" stroke="${r() > .5 ? "#c49562" : "#2a1708"}" stroke-opacity=".5" stroke-width=".7"/>`; }
    p += `<path d="M58 98Q58 150 100 154Q142 150 142 98" fill="none" stroke="#24232b" stroke-width="2"/><path d="M70 98Q72 146 100 154M130 98Q128 146 100 154M60 124Q100 140 140 124" fill="none" stroke="#24232b" stroke-width="1.4"/>`;
    p += `<path d="M58 98Q58 150 100 154Q142 150 142 98Z" fill="${x.url("sd")}"/>`;
    p += `<ellipse cx="100" cy="98" rx="42" ry="7" fill="#24232b"/>${soil(x, 100, 97.5, 38, 5)}`;
    let fol = "";
    [[64, 98, -96], [136, 98, 96], [70, 94, -60], [130, 94, 60], [86, 92, -30], [114, 92, 30], [100, 92, 0], [62, 104, -140], [138, 104, 140], [80, 100, -120], [120, 100, 120]].forEach(([lx, ly, a]) => { fol += leaf(x, lx, ly, 14, 6.4, a, { round: 1, dr: 28, fuzz: 1, gl: .5 }); });
    const trails = [[62, 100, -1, 46], [138, 100, 1, 50], [80, 104, -1, 58], [120, 104, 1, 56]];
    trails.forEach(([tx, ty, s, L]) => { const e = 100 + L * (1 + .25 * x.dd); fol += `<path d="M${tx} ${ty}Q${f(tx + s * 14)} ${f(ty + 10)} ${f(tx + s * 8)} ${f(e - 70)}" fill="none" stroke="${x.st}" stroke-width="1.4"/>`;
      fol += leaf(x, tx + s * 10, ty + 18, 12, 5.5, s * 150, { round: 1, dr: 10, fuzz: 1, gl: .4 }) + leaf(x, tx + s * 9, e - 82, 11, 5, s * 170, { round: 1, dr: 0, fuzz: 1, gl: .4 }); });
    const fl = [[72, 86, -20], [92, 80, -5], [112, 81, 8], [130, 88, 22], [100, 92, 0], [58, 108, -40], [142, 110, 40], [68, 126, -20], [134, 130, 20], [86, 148, -10], [116, 150, 12], [60, 90, -30]];
    const n = x.w < .22 ? 6 : x.w < .4 ? 9 : 12, k = .72 + .28 * x.h;
    fl.slice(0, n).forEach(([fx, fy, a], i) => { fol += `<g transform="${tr(fx, fy + x.dd * (fy < 100 ? 8 : 5), a + x.dd * a * .8, k * (.9 + (i % 3) * .06), k * (.8 - .25 * x.dd))}">${petunia(x)}</g>`; });
    p += fol + dew(x, 112, 96, 1);
    let out = sway(x, p, 1.2, 1);
    out += falling(x, 100, 158, 2, RP(7, 5));
    return svg(x, out);
  });

  add("mum", "Garden mum", ["#e59a2b", "#d9462e", "#f8f2e0", "#c2185b", "#f2d03b", "#9b4f96"], (o) => {
    const x = ctx(o); let b = pot(x, "pl", 100, 150, 74, 56, 36, { rim: 6, matte: 1 });
    const sag = x.dd * 8;
    let p = `<path d="M58 150C56 116 78 ${f(98 + sag)} 100 ${f(96 + sag)}C122 ${f(98 + sag)} 144 116 142 150Z" fill="${x.url("lfd")}"/>`;
    [[-100, 18], [100, 18], [-80, 16], [80, 16], [-120, 15], [120, 15]].forEach(([a, L]) => { p += leaf(x, 100 + sg(a) * 36, 146, L, 7, a, { serr: 1, dark: 1, dr: 20 }); });
    const rl = rng(5);
    for (let i = 0; i < 18; i++) { const an = (rl() * 2 - 1) * 75, rr = .25 + rl() * .7; p += leaf(x, 100 + Math.sin(an * RAD) * 40 * rr, 148 - Math.cos(an * RAD) * 50 * rr + sag * .5, 12, 5.5, an + rl() * 40 - 20, { serr: 1, dark: i % 2 === 0, dr: 20 }); }
    const pts = [];
    const rj = rng(41);
    for (let row = 0; row < 5; row++) { const t = row / 4, yy = 92 + t * 50, hw = 16 + 28 * Math.sin(Math.PI * (.25 + t * .55)), nn = 2 + Math.round(hw / 14);
      for (let j = 0; j < nn; j++) { const xx = 100 - hw + (2 * hw) * (j + (row % 2 ? .75 : .5)) / (nn + .25); pts.push([xx + (rj() - .5) * 7, yy + (rj() - .5) * 6]); } }
    const ctr = H.mix(x.pc, "#e9d27a", .45), kk = 1.25 * (.75 + .25 * x.h);
    pts.forEach(([px, py]) => {
      const nx = (px - 100) / 44, ny = (py - 116) / 34, tilt = cl(1 - .45 * nx * nx - .3 * Math.max(0, -ny), .45, 1), rot = nx * 40, col = sphereCol(x.pc, nx, ny);
      p += `<g transform="${tr(px, py + sag * (1 - Math.abs(nx)), rot, kk, kk * tilt)}">${ring(14, PT(8, 2.6), col, 0)}${ring(10, PT(5.4, 2.3), H.shade(col, .14), 18)}<circle r="2.4" fill="${ctr}"/><circle cx="-.7" cy="-.7" r=".9" fill="#fff" opacity=".3"/></g>`;
    });
    p += dew(x, 124, 134, 1);
    b += sway(x, p, .5) + fallen(x, [[50, 187, 30, .8], [150, 188, -30, .8], [56, 191, 80, .7], [144, 191, 50, .7], [62, 194, 0, .7]], PT(8, 2.6)) + falling(x, 130, 110, 2.5, PT(7, 2.4));
    return svg(x, b);
  });

  function azFlower(x) {
    let g = "";
    [[-144, 1], [-72, 1], [72, 1], [144, 1], [0, 0]].forEach(([r, k]) => { g += `<g transform="rotate(${r})"><path d="${RP(10, 6.6)}" fill="${x.url("pr")}"/>${k ? "" : `<circle cx="-1.6" cy="-5" r=".7" fill="${H.shade(x.pc, -.5)}"/><circle cx="1.4" cy="-6" r=".7" fill="${H.shade(x.pc, -.5)}"/><circle cx="0" cy="-3.6" r=".7" fill="${H.shade(x.pc, -.5)}"/>`}</g>`; });
    g += `<circle r="2.4" fill="${H.shade(x.pc, -.42)}"/>`;
    g += `<path d="M0 0Q4 6 3 13M0 0Q-1 7 -3 12M0 0Q2 5 7 10" fill="none" stroke="${H.shade(x.pc, .35)}" stroke-width=".7"/><circle cx="3" cy="13" r=".9" fill="#7a3a2a"/><circle cx="-3" cy="12" r=".9" fill="#7a3a2a"/><circle cx="7" cy="10" r=".9" fill="#7a3a2a"/>`;
    return g;
  }
  add("azalea", "Azalea", ["#ff4f8b", "#f8f4f0", "#e63946", "#ff8c69", "#b55fd8", "#ffb3c6"], (o) => {
    const x = ctx(o); let b = pot(x, "tl", 100, 156, 62, 48, 30, { rim: 5 });
    let p = `<path d="M98 154Q96 140 92 130M102 154Q106 140 112 128" fill="none" stroke="#5a3e28" stroke-width="3" stroke-linecap="round"/>`;
    const sag = x.dd * 7;
    p += `<path d="M54 140C50 104 74 ${f(76 + sag)} 100 ${f(74 + sag)}C126 ${f(76 + sag)} 150 104 146 140C130 146 70 146 54 140Z" fill="${x.url("lfd")}"/>`;
    const r = rng(53);
    for (let i = 0; i < 26; i++) { const an = -100 + i * 8, rr = .85 + r() * .2; p += leaf(x, 100 + Math.sin(an * RAD) * 46 * rr, 116 - Math.cos(an * RAD) * 40 * rr + sag * .5 + (Math.abs(an) > 80 ? 14 : 0), 12, 4.6, an + r() * 20 - 10, { dark: i % 2 === 0, dr: 20, gl: 1 }); }
    for (let i = 0; i < 22; i++) { const an = (r() * 2 - 1) * 70, rr = .2 + r() * .65; p += leaf(x, 100 + Math.sin(an * RAD) * 44 * rr, 138 - Math.cos(an * RAD) * 56 * rr + sag * .6, 11, 4.4, an + r() * 50 - 25, { dark: i % 2 === 1, dr: 20, gl: 1 }); }
    const F = [[76, 96], [100, 88], [124, 96], [64, 116], [88, 110], [112, 108], [136, 116], [78, 130], [100, 124], [122, 130], [100, 104]];
    const n = x.w < .22 ? 5 : x.w < .4 ? 8 : 11, k = .78 + .22 * x.h;
    F.slice(0, n).forEach(([fx, fy], i) => { const nx = (fx - 100) / 46; p += `<g transform="${tr(fx, fy + sag, nx * 30 + (i % 2 ? 12 : -12), k * 1.05, k * (.92 - .25 * x.dd))}">${azFlower(x)}</g>`; });
    p += dew(x, 72, 124, 1);
    b += sway(x, p, 3.9) + fallen(x, [[54, 189, 30, 1.1], [146, 190, -30, 1.1], [60, 193, 80, 1], [140, 193, 50, 1]], RP(10, 6.6)) + falling(x, 128, 116, 1.2, RP(8, 5.4));
    return svg(x, b);
  });

  function amFlower(x, k) {
    let g = "";
    for (let i = 0; i < 6; i++) { const L = (i % 2 ? 21 : 23) * k; g += `<g transform="rotate(${i * 60 + 30})"><path d="${PT(L, 8.6 * k)}" fill="${x.url("p")}"/><path d="M0 -3V${f(-L * .85)}" stroke="${H.shade(x.pc, .5)}" stroke-opacity=".45" stroke-width="${f(2.2 * k)}" stroke-linecap="round"/><path d="${PT(L, 8.6 * k)}" fill="#000" opacity=".12" transform="scale(.5 1) translate(${f(7 * k)} 0)"/></g>`; }
    const thr = grad(x, "amt", (id) => rg(id, [[0, "#d9ec8a"], [.5, "#9cc455"], [1, H.shade(x.pc, -.2), 0]]));
    g += `<circle r="${f(7 * k)}" fill="${thr}"/>`;
    [[-6, 12], [-2, 14], [3, 13.5], [7, 11]].forEach(([a, c]) => { g += `<path d="M0 0Q${f(a * .4 * k)} ${f(c * .5 * k)} ${f(a * k)} ${f(c * k)}" fill="none" stroke="#f4ecd0" stroke-width=".7"/><ellipse cx="${f(a * k)}" cy="${f(c * k)}" rx="1.6" ry=".8" fill="#e8c44a"/>`; });
    return g;
  }
  add("amaryllis", "Amaryllis", ["#d1202f", "#f8f4ee", "#ff7aa2", "#ff7f3f", "#9e1b32", "#f0a6b8"], (o) => {
    const x = ctx(o); let b = pot(x, "rd", 100, 156, 56, 44, 30, {});
    const bulbG = grad(x, "bulb", (id) => rg(id, [[0, "#f0d7ac"], [.6, "#c8955c"], [1, "#6e4424"]], .38, .35, .7));
    let p = `<path d="M100 120C88 120 80 132 82 144C84 152 116 152 118 144C120 132 112 120 100 120Z" fill="${bulbG}"/><path d="M92 126Q88 136 90 148M100 121V150M108 126Q112 136 110 148" fill="none" stroke="#6e4424" stroke-opacity=".4" stroke-width=".7"/><path d="M86 136Q88 126 96 123" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1.4" stroke-linecap="round"/><path d="M96 121Q100 110 104 121Z" fill="#b08050"/>`;
    p += strap(x, 98, 120, 54, 7.5, -26, -22, { dr: 40 }) + strap(x, 102, 120, 60, 7.5, 28, 20, { dr: 40 });
    const st = stem(x, 100, 120, 70, 2, 0, { dr: 70, w: 5, s: 1, da: 12 });
    p += st.svg;
    const k = .78 + .22 * x.h;
    let top = `<path d="M0 0L-12 -6M0 0L12 -4M0 0L-2 -12" stroke="${x.st}" stroke-width="2" stroke-linecap="round"/>`;
    top += `<g transform="${tr(1, -18, 14 - x.dd * 10, 1)}"><path d="M0 4C-4 0 -5 -10 0 -16C5 -10 4 0 0 4Z" fill="${x.url("p")}"/><path d="M0 4C-2 0 -2 -8 0 -14" fill="none" stroke="#9cc455" stroke-opacity=".6" stroke-width="1.4"/></g>`;
    if (x.w > .2) top += `<g transform="${tr(-14, -6, -70 - x.dd * 20, k, k * .62)}">${amFlower(x, 1)}</g>`;
    top += `<g transform="${tr(15, -4, 70 + x.dd * 20, k, k * .62)}">${amFlower(x, 1)}</g>`;
    top += `<g transform="${tr(0, 4, 0, k, k * (.92 - .3 * x.dd))}">${amFlower(x, 1)}</g>`;
    p += `<g transform="${tr(st.x, st.y, st.a)}">${top}</g>`;
    b += sway(x, p, 2.6) + fallen(x, [[58, 188, 30, 1.4], [142, 189, -30, 1.4], [134, 193, 80, 1.2]], PT(18, 6)) + falling(x, 74, 92, .4, PT(14, 5));
    return svg(x, b);
  });

  add("bougainvillea", "Bougainvillea", ["#e0218a", "#ff6b3d", "#b5179e", "#f8f4f0", "#ff9f1c", "#d63b3b"], (o) => {
    const x = ctx(o); let b = "";
    const wood = grad(x, "wood", (id) => lg(id, [[0, "#8a6440"], [.4, "#e0bc8a"], [1, "#7a5432"]]));
    let tre = "";
    [-30, -15, 0, 15, 30].forEach((a) => { const d = dir(a); const ln = `M100 158L${f(100 + d[0] * 150)} ${f(158 + d[1] * 150)}`; tre += `<path d="${ln}" stroke="#7a5432" stroke-width="3.6" stroke-linecap="round"/><path d="${ln}" stroke="#c99a64" stroke-width="2.4" stroke-linecap="round"/><path d="${ln}" stroke="#f0d3a4" stroke-opacity=".7" stroke-width=".8" transform="translate(-.7 0)"/>`; });
    [60, 98, 132].forEach((r) => { tre += `<path d="M${f(100 + Math.sin(-34 * RAD) * r)} ${f(158 - Math.cos(-34 * RAD) * r)}A${r} ${r} 0 0 1 ${f(100 + Math.sin(34 * RAD) * r)} ${f(158 - Math.cos(34 * RAD) * r)}" fill="none" stroke="${wood}" stroke-width="2.6"/>`; });
    b += tre;
    b += pot(x, "tc", 100, 158, 58, 44, 26, { rim: 7, matte: 1 });
    let p = `<path d="M96 156C84 136 104 118 90 98C80 82 86 62 76 40M104 156C116 134 98 116 112 96C122 80 116 60 126 38M100 156C100 132 100 110 100 80" fill="none" stroke="#6a4a2e" stroke-width="2.2" stroke-linecap="round"/>`;
    const r = rng(17);
    const vine = [[90, 140], [106, 132], [94, 116], [108, 110], [88, 100], [112, 96], [84, 84], [116, 82], [80, 66], [120, 64], [100, 92], [100, 116], [78, 50], [124, 48]];
    vine.forEach(([vx, vy], i) => { p += leaf(x, vx, vy + x.dd * 4, 10, 5, (i % 2 ? 1 : -1) * (50 + r() * 50), { round: 1, dr: 30, gl: .8, dark: i % 3 === 0 }); });
    const CL = [[76, 42, 1], [126, 40, 1], [84, 70, .95], [118, 68, .95], [100, 82, 1], [90, 104, .9], [112, 100, .9], [100, 60, .85], [72, 88, .8], [128, 88, .8], [96, 124, .8], [108, 128, .75]];
    const n = x.w < .22 ? 5 : x.w < .4 ? 8 : CL.length, k = .75 + .25 * x.h;
    CL.slice(0, n).forEach(([cx, cy, s], i) => {
      let g = "";
      for (let j = 0; j < 3; j++) g += `<g transform="rotate(${j * 120 + i * 17})"><path d="${RP(10, 7.4)}" fill="${x.url("p")}" fill-opacity=".95"/><path d="M0 -1V-9M0 -4L-3.6 -8M0 -4L3.6 -8" stroke="#fff" stroke-opacity=".22" stroke-width=".5" fill="none"/></g>`;
      g += `<circle cx="-1" cy="-1" r="1.1" fill="#fff6dc"/><circle cx="1.2" cy=".2" r="1.1" fill="#fff6dc"/><circle cx="-.2" cy="1.4" r="1" fill="#f3e8b8"/>`;
      p += `<g transform="${tr(cx, cy + x.dd * 8, x.dd * 30, s * k, s * k * (.85 - .2 * x.dd))}">${g}</g>`;
    });
    p += dew(x, 112, 108, 1);
    b += sway(x, p, 1.7) + fallen(x, [[54, 190, 30, 1.3], [146, 191, -40, 1.3], [62, 194, 80, 1.1], [138, 194, 50, 1.1], [70, 196, 0, 1]], RP(10, 7.4)) + falling(x, 120, 120, 3.1, RP(8, 6)) + falling(x, 80, 90, .7, RP(8, 6));
    return svg(x, b);
  });

  const css = `
.hda-flowers-sway{transform-box:fill-box;transform-origin:50% 100%}
.hda-flowers-hang{transform-box:fill-box;transform-origin:50% 0%}
.hda-anim .hda-flowers-sway{animation:hda-flowers-sway 7s ease-in-out infinite}
.hda-anim .hda-flowers-hang{animation:hda-flowers-swing 8.5s ease-in-out infinite}
@keyframes hda-flowers-sway{0%,100%{transform:rotate(-1deg)}50%{transform:rotate(1.2deg)}}
@keyframes hda-flowers-swing{0%,100%{transform:rotate(-1.6deg)}50%{transform:rotate(1.6deg)}}
.hda-flowers-fall{opacity:0;transform-box:fill-box;transform-origin:center}
.hda-anim .hda-flowers-fall{animation:hda-flowers-fall 5.5s ease-in infinite}
@keyframes hda-flowers-fall{0%{opacity:0;transform:translate(0,0) rotate(0deg)}12%{opacity:.95}82%{opacity:.9}100%{opacity:0;transform:translate(-12px,58px) rotate(250deg)}}
.hda-flowers-tw{opacity:0;transform-box:fill-box;transform-origin:center}
.hda-anim .hda-flowers-tw{animation:hda-flowers-tw 3.6s ease-in-out infinite}
@keyframes hda-flowers-tw{0%,32%,100%{opacity:0;transform:scale(.3)}45%{opacity:1;transform:scale(1)}58%{opacity:0;transform:scale(.4)}}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-flowers-sway,.hda-anim .hda-flowers-hang,.hda-anim .hda-flowers-fall,.hda-anim .hda-flowers-tw{animation:none!important}}
`;

  (window.HDA = window.HDA || []).push({
    id: "flowers", tab: "Flowering plants", group: "Plants", kind: "plant",
    intro: "Twenty flowering plants in pots. Pick the flower color; watered plants stand up with open, glossy blooms, thirsty ones wilt and drop petals.",
    
    css,
    icons,
  });
})();
