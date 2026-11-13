(function () {
  const H = window.HDAH;
  const P = "hda-trees-";
  const f = (n) => (+n).toFixed(1);
  const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const DEG = 57.2958;
  const RND = (seed) => { let s = (seed * 7919) % 2147483646 + 1; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
  const st = (a) => a.map(([o, c, op]) => `<stop offset="${o}" stop-color="${c}"${op == null ? "" : ` stop-opacity="${op}"`}/>`).join("");
  const lg = (id, a, v) => `<linearGradient id="${id}" x1="0" y1="0" x2="${v ? 0 : 1}" y2="${v ? 1 : 0}">${st(a)}</linearGradient>`;
  const rg = (id, a, cx = .5, cy = .5, r = .5) => `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${st(a)}</radialGradient>`;
  const BR = ["#a8763a", "#8c5a2b", "#c9a052", "#7a4e26", "#b58a45"];

  function ctx(o, seed) {
    const on = !!o.on, lv = o.level == null ? 1 : cl(o.level);
    const x = {
      c: o.color || "#5b8f3a", on, lv, h: on ? lv : 0,
      id: (s) => `${o.uid}-${s}`, url: (s) => `url(#${o.uid}-${s})`,
      dens: on ? .6 + .4 * cl(lv / .7) : .5,
      brown: on ? cl((.42 - lv) / .42) * .4 : .5,
      dull: on ? cl((.55 - lv) / .55) * .42 : .55,
      droop: on ? cl((.5 - lv) / .5) : 1,
      lush: on ? cl((lv - .62) / .38) : 0,
      D: [], r: RND(seed || 7), done: {},
    };
    x.tone = (hex) => H.mix(hex, "#8d7f4a", x.dull);
    x.D.push(rg(x.id("cs"), [[0, "#000", .5], [.55, "#000", .22], [1, "#000", 0]]));
    x.D.push(lg(x.id("bark"), [[0, "#2c1f16"], [.3, "#86684c"], [.55, "#634834"], [1, "#22170f"]]));
    return x;
  }
  const svg = (x, body) => `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><defs>${x.D.join("")}</defs>${body}</svg>`;
  const shadow = (x, cx, cy, rx, ry) => `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry || 5)}" fill="${x.url("cs")}"/>`;
  const sway = (body, ox, oy, dur, delay, cls) => `<g class="${P}${cls || "sway"}" style="transform-origin:${f(ox)}px ${f(oy)}px;animation-duration:${dur || 6}s;animation-delay:-${delay || 0}s">${body}</g>`;
  function grad(x, key, a, v) { if (!x.done[key]) { x.done[key] = 1; x.D.push(lg(x.id(key), a, v)); } return x.url(key); }

  function pal(x, key, hex, raw) {
    const m = raw ? hex : x.tone(hex), l = H.mix(m, "#ffffff", .3 + .1 * x.lush), d = H.shade(m, -.42), k = H.shade(m, -.68);
    x.D.push(rg(x.id("lf" + key), [[0, l], [.5, m], [1, d]], .36, .3, .78));
    x.D.push(lg(x.id("ll" + key), [[0, l], [.47, m], [.53, d], [1, k]], 1));
    return { l, m, d, k, u: x.url("lf" + key), v: x.url("ll" + key) };
  }

  function qpt(x0, y0, cx, cy, x1, y1, t) {
    const u = 1 - t;
    return [u * u * x0 + 2 * u * t * cx + t * t * x1, u * u * y0 + 2 * u * t * cy + t * t * y1, Math.atan2(2 * u * (cy - y0) + 2 * t * (y1 - cy), 2 * u * (cx - x0) + 2 * t * (x1 - cx))];
  }
  function rib(x0, y0, cx, cy, x1, y1, wf, n, t0, t1) {
    n = n || 12; t0 = t0 || 0; t1 = t1 == null ? 1 : t1;
    const L = [], R = [];
    for (let i = 0; i <= n; i++) {
      const t = t0 + (t1 - t0) * i / n, [px, py, th] = qpt(x0, y0, cx, cy, x1, y1, t);
      const w = (typeof wf === "function" ? wf(t) : wf) / 2, nx = -Math.sin(th) * w, ny = Math.cos(th) * w;
      L.push(f(px + nx) + " " + f(py + ny)); R.push(f(px - nx) + " " + f(py - ny));
    }
    return "M" + L.join(" L") + " L" + R.reverse().join(" L") + "Z";
  }
  const taper = (a, b) => (t) => a + (b - a) * t;
  function limbs(x, segs, fill, hl) {
    return segs.map(([x0, y0, cx, cy, x1, y1, w0, w1]) => {
      let s = `<path d="${rib(x0, y0, cx, cy, x1, y1, taper(w0, w1))}" fill="${fill || x.url("bark")}"/>`;
      if (w0 > 3.5) { const o = w0 * .2, o1 = w1 * .2; s += `<path d="M${f(x0 - o)} ${f(y0)} Q${f(cx - o)} ${f(cy)} ${f(x1 - o1)} ${f(y1)}" stroke="#fff" stroke-opacity="${hl == null ? .16 : hl}" stroke-width="${f(Math.max(.7, w0 * .14))}" fill="none" stroke-linecap="round"/>`; }
      return s;
    }).join("");
  }
  const flare = (x, cx, y, w, fill) => `<path d="M${f(cx - w)} ${f(y + 1)} Q${f(cx - w * .45)} ${f(y - 2)} ${f(cx - w * .42)} ${f(y - 12)} L${f(cx + w * .42)} ${f(y - 12)} Q${f(cx + w * .45)} ${f(y - 2)} ${f(cx + w)} ${f(y + 1)} Q${cx} ${f(y + 3.5)} ${f(cx - w)} ${f(y + 1)}Z" fill="${fill || x.url("bark")}"/>`;
  function dro(a, amt) {
    let A = ((a % 360) + 540) % 360 - 180;
    if (Math.cos(A / DEG) >= 0) return Math.min(A + amt, Math.max(A, 85));
    if (A > 0) A -= 360; return Math.max(A - amt, Math.min(A, -265));
  }

  const STAR = (() => { let d = ""; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? .45 : 1; d += (i ? "L" : "M") + (Math.cos(a) * r).toFixed(2) + " " + (Math.sin(a) * r).toFixed(2); } return d + "Z"; })();
  function mark(cx, cy, s, a, col, op, shape) {
    const o = op < 1 ? ` fill-opacity="${op}"` : "";
    if (shape === "star") return `<path d="${STAR}" transform="translate(${f(cx)} ${f(cy)}) rotate(${a | 0}) scale(${(s * 1.15).toFixed(2)})" fill="${col}"${o}/>`;
    const rx = shape === "lance" ? s * 1.4 : shape === "round" ? s * .85 : s, ry = shape === "lance" ? s * .4 : shape === "round" ? s * .78 : s * .6;
    return `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" transform="rotate(${a | 0} ${f(cx)} ${f(cy)})" fill="${col}"${o}/>`;
  }
  const LEAF = {
    ovate: (L, W) => `M0 0 C${f(L * .12)} ${f(-W * 1.05)} ${f(L * .66)} ${f(-W * .9)} ${f(L)} 0 C${f(L * .66)} ${f(W * .9)} ${f(L * .12)} ${f(W * 1.05)} 0 0Z`,
    fiddle: (L, W) => `M0 0 C${f(L * .18)} ${f(-W * .4)} ${f(L * .36)} ${f(-W * .95)} ${f(L * .7)} ${f(-W)} C${f(L * .97)} ${f(-W * .95)} ${f(L * 1.04)} ${f(-W * .3)} ${f(L)} 0 C${f(L * 1.04)} ${f(W * .3)} ${f(L * .97)} ${f(W * .95)} ${f(L * .7)} ${f(W)} C${f(L * .36)} ${f(W * .95)} ${f(L * .18)} ${f(W * .4)} 0 0Z`,
    lance: (L, W) => `M0 0 C${f(L * .25)} ${f(-W)} ${f(L * .7)} ${f(-W * .7)} ${f(L)} 0 C${f(L * .7)} ${f(W * .7)} ${f(L * .25)} ${f(W)} 0 0Z`,
  };
  function leaf(x, px, py, L, W, a, p, o) {
    o = o || {};
    const sh = LEAF[o.shape || "ovate"](L, W), flip = Math.cos(a / DEG) < 0 ? " scale(1 -1)" : "";
    let s = `<g transform="translate(${f(px)} ${f(py)}) rotate(${f(a)})${flip}"><path d="${sh}" fill="${p.v}"/>`;
    if (o.edge) s += `<path d="${sh}" fill="none" stroke="${o.edge}" stroke-width="1.5" stroke-opacity=".85"/>`;
    if (!o.lite) {
      s += `<path d="M${f(L * .04)} 0 L${f(L * .92)} 0" stroke="${p.l}" stroke-opacity=".5" stroke-width="${o.vw || .8}"/>`;
      if (o.veins) for (let i = 0; i < 4; i++) { const t = L * (.2 + i * .17); s += `<path d="M${f(t)} 0 Q${f(t + L * .07)} ${f(-W * .35)} ${f(t + L * .12)} ${f(-W * .72)} M${f(t)} 0 Q${f(t + L * .07)} ${f(W * .35)} ${f(t + L * .12)} ${f(W * .72)}" stroke="${p.l}" stroke-opacity=".26" stroke-width=".55" fill="none"/>`; }
      s += `<path d="M${f(L * .2)} ${f(-W * .22)} Q${f(L * .46)} ${f(-W * .74)} ${f(L * .8)} ${f(-W * .28)}" stroke="#fff" stroke-opacity="${(o.gl || .26).toFixed(2)}" stroke-width="${f(Math.max(.8, W * .15))}" fill="none" stroke-linecap="round"/>`;
    }
    return s + "</g>";
  }

  function clumps(x, blobs, pals, opt) {
    opt = opt || {}; pals = Array.isArray(pals) ? pals : [pals];
    const r = x.r, s = .78 + .22 * x.dens, shape = opt.leaf || "dot", BRP = opt.noBrown ? 0 : x.brown;
    let x0 = 1e3, x1 = -1e3, y0 = 1e3, y1 = -1e3;
    blobs.forEach(([cx, cy, rr, ry]) => { x0 = Math.min(x0, cx - rr); x1 = Math.max(x1, cx + rr); y0 = Math.min(y0, cy - (ry || rr)); y1 = Math.max(y1, cy + (ry || rr)); });
    const W = x1 - x0, Hh = y1 - y0, gx = x0 + W * .36, gy = y0 + Hh * .22, gr = Math.max(W, Hh) * .85;
    x.cn = (x.cn || 0) + 1;
    const gu = pals.map((p, k) => { const gid = x.id("cg" + x.cn + "_" + k); x.D.push(`<radialGradient id="${gid}" gradientUnits="userSpaceOnUse" cx="${f(gx)}" cy="${f(gy)}" r="${f(gr)}">${st([[0, H.mix(p.m, "#fff", .2)], [.42, p.m], [.85, p.d], [1, p.k]])}</radialGradient>`); return `url(#${gid})`; });
    let out = "";
    blobs.forEach((b, i) => {
      const [cx, cy, rr, ry0, pi] = b, k = (pi == null ? i : pi) % pals.length, p = pals[k];
      const q = rr * s, qy = (ry0 || rr) * s;
      out += `<ellipse cx="${f(cx + q * .1)}" cy="${f(cy + qy * .16)}" rx="${f(q * .95)}" ry="${f(qy * .95)}" fill="${p.k}" fill-opacity="${opt.flat ? .3 : .75}"/>`;
      out += `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(q * .9)}" ry="${f(qy * .9)}" fill="${gu[k]}"/>`;
      const nmax = Math.round(rr * Math.sqrt((ry0 || rr) / rr) * (opt.n || .8) * 1.9), nshow = nmax * (.4 + .6 * x.dens);
      let t = "";
      for (let j = 0; j < nmax; j++) {
        const a = r() * 6.283, d = j % 3 === 0 ? .9 + .2 * r() : .12 + .9 * Math.sqrt(r()), rb = r(), rs = r(), ra = r();
        if (j >= nshow) continue;
        const dx = Math.cos(a) * d * q, dy = Math.sin(a) * d * qy;
        const lit = -(dx / q * .5 + dy / qy) * .55 - ((cx + dx - gx) / W * .7 + (cy + dy - gy) / Hh) * 1.1 + .25;
        const K = opt.soft ? p.d : p.k;
        let col = lit > .35 ? p.l : lit < -.5 ? K : lit < -.1 ? (opt.soft ? p.m : p.d) : p.m, op = lit > .35 ? .92 : lit < -.5 ? .7 : .85;
        if (rb < BRP) { col = BR[(i + j) % 5]; op = .95; }
        t += mark(cx + dx, cy + dy, Math.min(q, qy) * (opt.sz || .17) * 1.1 * (.7 + .6 * rs) + (opt.min || 0), ra * 180, col, op, shape);
      }
      out += opt.cls ? `<g class="${P}${opt.cls}" style="animation-delay:-${(i * .6).toFixed(1)}s">${t}</g>` : t;
    });
    return out;
  }
  function dew(x, blobs, n) {
    if (x.lush < .15) return "";
    const r = RND(blobs.length * 31 + 5); let s = "";
    for (let i = 0; i < (n || 5); i++) {
      const b = blobs[Math.floor(r() * blobs.length)], a = 3.4 + r() * 1.6, d = .35 + r() * .45, cx = b[0] + Math.cos(a) * b[2] * d, cy = b[1] + Math.sin(a) * (b[3] || b[2]) * d;
      s += `<g class="${P}dew" style="animation-delay:-${(i * .8).toFixed(1)}s"><circle cx="${f(cx)}" cy="${f(cy)}" r="1.5" fill="#dff4ff" fill-opacity="${(.45 + .5 * x.lush).toFixed(2)}"/><circle cx="${f(cx - .5)}" cy="${f(cy - .5)}" r=".6" fill="#fff"/></g>`;
    }
    return s;
  }
  function frond(x, x0, y0, ang, len, curl, p, o) {
    o = o || {};
    const sg = Math.cos(ang / DEG) >= 0 ? 1 : -1, cv = (curl + x.droop * (o.dr || 28)) * sg;
    const a1 = ang / DEG, a2 = (ang + cv) / DEG;
    const cx = x0 + Math.cos(a1) * len * .55, cy = y0 + Math.sin(a1) * len * .55;
    const x1 = cx + Math.cos(a2) * len * .55, y1 = cy + Math.sin(a2) * len * .55;
    const n = o.n || 12, t0 = o.t0 || .28, LL = o.ll || 11, r = x.r;
    let back = "", front = "";
    for (let i = 0; i < n; i++) {
      const t = t0 + (1 - t0) * (i + .5) / n, [px, py, th] = qpt(x0, y0, cx, cy, x1, y1, t);
      const L = LL * (1 - (t - t0) * .55);
      [-1, 1].forEach((sd) => {
        const r1 = r(), r2 = r(), r3 = r();
        if (r1 > x.dens + .3) return;
        const a = dro(th * DEG + sd * (o.spread || 60), (o.grav || 22) + x.droop * 30), up = Math.sin(a / DEG) < -.1;
        const col = r2 < x.brown ? BR[i % 5] : up ? (r3 > .6 ? p.l : p.m) : p.d;
        const lf = `<path d="${LEAF.lance(L * (.88 + .24 * r3), o.lw || 1.7)}" transform="translate(${f(px)} ${f(py)}) rotate(${f(a)})" fill="${col}"/>`;
        if (up) front += lf; else back += lf;
      });
    }
    const rach = `<path d="M${f(x0)} ${f(y0)} Q${f(cx)} ${f(cy)} ${f(x1)} ${f(y1)}" stroke="${o.stem || "#56652f"}" stroke-width="${o.sw || 1.5}" fill="none" stroke-linecap="round"/><path d="M${f(x0)} ${f(y0 - .6)} Q${f(cx)} ${f(cy - .6)} ${f(x1)} ${f(y1)}" stroke="#fff" stroke-opacity=".2" stroke-width=".5" fill="none"/>`;
    return back + rach + front;
  }

  function soil(x, cx, cy, rx, ry) {
    const w = cl(x.h * 1.4), top = H.mix("#8f7150", "#3d2819", w), dk = H.mix("#5e4630", "#1b110a", w);
    const k = "soil" + Math.round(cx) + Math.round(cy);
    x.D.push(rg(x.id(k), [[0, top], [1, dk]], .5, .38, .62));
    let s = `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="${x.url(k)}"/>`;
    const r = RND(Math.round(cx * 3 + cy));
    for (let i = 0; i < 10; i++) s += `<circle cx="${f(cx + (r() - .5) * rx * 1.6)}" cy="${f(cy + (r() - .5) * ry * 1.1)}" r="${f(.5 + r() * .9)}" fill="${H.shade(top, r() > .5 ? .2 : -.35)}" fill-opacity=".8"/>`;
    if (w < .3) s += `<path d="M${f(cx - rx * .6)} ${f(cy - ry * .1)} l${f(rx * .22)} ${f(ry * .35)} l${f(rx * .2)} ${f(-ry * .3)} M${f(cx + rx * .12)} ${f(cy + ry * .3)} l${f(rx * .2)} ${f(-ry * .35)} l${f(rx * .2)} ${f(ry * .15)}" stroke="#3a2a1c" stroke-opacity=".7" stroke-width=".7" fill="none"/>`;
    if (x.lush > .3) s += `<ellipse cx="${f(cx - rx * .3)}" cy="${f(cy - ry * .2)}" rx="${f(rx * .32)}" ry="${f(ry * .3)}" fill="#bfe3ff" fill-opacity="${(x.lush * .2).toFixed(2)}"/>`;
    return s;
  }
  function potGrad(x, key, c, gloss) {
    return grad(x, key, [[0, H.shade(c, -.58)], [.2, H.shade(c, -.12)], [.34, H.mix(c, "#fff", gloss ? .4 : .16)], [.55, c], [.82, H.shade(c, -.32)], [1, H.shade(c, -.62)]]);
  }
  function pot(x, o) {
    const cx = o.cx || 100, top = o.top, bot = o.bot, wt = o.wt, wb = o.wb, rim = o.rim || 0, R = wt + (rim ? (o.ro || 3) : 0), ry = R * .17, bl = o.belly || 0;
    const pu = potGrad(x, "pot", o.c, o.gloss);
    const y1 = top + (rim ? rim - 1 : 0), my = (y1 + bot) / 2;
    let s = o.noShadow ? "" : shadow(x, cx, bot + 1, wb + 16, 5);
    s += `<ellipse cx="${cx}" cy="${top}" rx="${R}" ry="${f(ry)}" fill="${H.mix(o.c, "#fff", .12)}"/>`;
    s += `<ellipse cx="${cx}" cy="${f(top + .5)}" rx="${R - 2.6}" ry="${f(ry - 1.2)}" fill="${H.shade(o.c, -.72)}"/>`;
    s += soil(x, cx, top + 1.6, R - 4, ry - 2.2);
    const body = `M${cx - wt} ${y1} Q${f(cx - (wt + wb) / 2 - bl)} ${f(my)} ${cx - wb} ${bot - 3} Q${cx} ${bot + 3} ${cx + wb} ${bot - 3} Q${f(cx + (wt + wb) / 2 + bl)} ${f(my)} ${cx + wt} ${y1} A${wt} ${f(wt * .17)} 0 0 1 ${cx - wt} ${y1}Z`;
    s += `<path d="${body}" fill="${pu}"/>`;
    if (o.ribs) { const id = x.id("pclip"); s += `<clipPath id="${id}"><path d="${body}"/></clipPath><g clip-path="url(#${id})">`; for (let yy = y1 + 6; yy < bot - 2; yy += 5) s += `<path d="M${cx - R - 6} ${yy} Q${cx} ${f(yy + wt * .2)} ${cx + R + 6} ${yy}" stroke="#000" stroke-opacity=".2" stroke-width="1.1" fill="none"/><path d="M${cx - R - 6} ${yy + 1.4} Q${cx} ${f(yy + 1.4 + wt * .2)} ${cx + R + 6} ${yy + 1.4}" stroke="#fff" stroke-opacity=".12" stroke-width=".8" fill="none"/>`; s += "</g>"; }
    if (o.speck) { const r = RND(7); for (let i = 0; i < 26; i++) { const yy = y1 + 4 + r() * (bot - y1 - 8), sp = wt + (wb - wt) * (yy - y1) / (bot - y1); s += `<circle cx="${f(cx + (r() - .5) * sp * 1.7)}" cy="${f(yy)}" r="${f(.4 + r() * .6)}" fill="${r() > .5 ? "#fff" : "#000"}" fill-opacity=".18"/>`; } }
    if (rim) s += `<path d="M${cx - wt} ${y1} A${wt} ${f(wt * .17)} 0 0 0 ${cx + wt} ${y1} L${cx + wt - 1} ${y1 + 5} A${wt} ${f(wt * .17)} 0 0 1 ${cx - wt + 1} ${y1 + 5}Z" fill="#000" fill-opacity=".22"/>`;
    const hx = (k) => cx - (wt + (wb - wt) * k) * .6 - (k > .2 && k < .8 ? bl * .55 : 0);
    s += `<path d="M${f(hx(.08))} ${f(y1 + (bot - y1) * .08)} Q${f(cx - ((wt + wb) / 2 + bl) * .64)} ${f(my)} ${f(hx(.86))} ${f(bot - (bot - y1) * .14)}" stroke="#fff" stroke-opacity="${o.gloss ? .42 : .12}" stroke-width="${o.gloss ? 2.4 : 4}" fill="none" stroke-linecap="round"/>`;
    if (o.gloss) s += `<path d="M${f(cx + wt * .55)} ${f(y1 + 6)} Q${f(cx + ((wt + wb) / 2 + bl) * .6)} ${f(my)} ${f(cx + wb * .55)} ${f(bot - 9)}" stroke="#fff" stroke-opacity=".12" stroke-width="1.2" fill="none" stroke-linecap="round"/>`;
    if (rim) {
      s += `<path d="M${cx - R} ${top} A${R} ${f(ry)} 0 0 0 ${cx + R} ${top} L${cx + R} ${top + rim} A${R} ${f(ry)} 0 0 1 ${cx - R} ${top + rim}Z" fill="${pu}"/>`;
      s += `<path d="M${cx - R} ${top} A${R} ${f(ry)} 0 0 0 ${cx + R} ${top}" stroke="#fff" stroke-opacity=".3" stroke-width=".9" fill="none"/><path d="M${cx - R} ${top + rim} A${R} ${f(ry)} 0 0 0 ${cx + R} ${top + rim}" stroke="#000" stroke-opacity=".3" stroke-width=".8" fill="none"/>`;
    } else s += `<path d="M${cx - wt} ${top} A${wt} ${f(ry)} 0 0 0 ${cx + wt} ${top}" stroke="#fff" stroke-opacity=".3" stroke-width="1" fill="none"/>`;
    return s;
  }
  function basket(x, cx, top, bot, wt, wb, c) {
    const ry = wt * .17;
    const body = `M${cx - wt} ${top} L${cx - wb} ${bot - 3} Q${cx} ${bot + 3} ${cx + wb} ${bot - 3} L${cx + wt} ${top} A${wt} ${f(ry)} 0 0 1 ${cx - wt} ${top}Z`;
    const wv = grad(x, "wv", [[0, H.mix(c, "#fff", .32)], [.55, c], [1, H.shade(c, -.45)]], 1);
    const sh = grad(x, "bsh", [[0, "#000", .5], [.28, "#000", .05], [.45, "#fff", .08], [.7, "#000", .1], [1, "#000", .55]]);
    const id = x.id("bclip");
    let s = shadow(x, cx, bot + 1, wb + 16, 5) + `<ellipse cx="${cx}" cy="${top}" rx="${wt}" ry="${f(ry)}" fill="${H.shade(c, -.6)}"/>` + soil(x, cx, top + 1.2, wt - 3, ry - 1.4);
    s += `<clipPath id="${id}"><path d="${body}"/></clipPath><path d="${body}" fill="${H.shade(c, -.6)}"/><g clip-path="url(#${id})">`;
    let k = 0;
    for (let yy = top - 2; yy < bot; yy += 6, k++) {
      const sp = wt + (wb - wt) * (yy - top) / (bot - top), bow = (1 - ((yy - top) / (bot - top))) * 0 + ry;
      for (let xx = cx - wt - 10 + (k % 2) * 5.5; xx < cx + wt + 6; xx += 11) {
        const off = bow * (1 - Math.pow((xx + 4.5 - cx) / (sp + 6), 2));
        s += `<rect x="${f(xx)}" y="${f(yy + off)}" width="10" height="5.2" rx="2.6" fill="${wv}"/>`;
      }
    }
    s += `</g><path d="${body}" fill="${sh}"/>`;
    for (let i = 0; i <= 22; i++) { const a = Math.PI * i / 22, px = cx - Math.cos(a) * wt, py = top + Math.sin(a) * ry; s += `<ellipse cx="${f(px)}" cy="${f(py)}" rx="3.6" ry="2.2" transform="rotate(${f(-35 + i * 2)} ${f(px)} ${f(py)})" fill="${wv}"/>`; }
    return s;
  }
  function mound(x, o) {
    o = o || {};
    const cx = 100, w = o.w || 82, top = o.top || 164, bot = o.bot || 186, wet = cl(x.h * 1.3), sand = o.sand;
    const g1 = sand ? H.mix("#ead7a2", "#c9ad78", wet * .8) : H.mix("#bba85f", "#6fba55", wet), g2 = sand ? H.mix("#a98d5c", "#7c6343", wet * .8) : H.mix("#6c5c2f", "#235c29", wet);
    x.D.push(lg(x.id("gr"), [[0, g1], [.65, H.mix(g1, g2, .6)], [1, g2]], 1));
    const P0 = [cx - w, bot], P1 = [cx - w * .62, top - 6], P2 = [cx + w * .62, top - 6], P3 = [cx + w, bot];
    const B = (t) => { const u = 1 - t, a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, d = t * t * t; return [a * P0[0] + b * P1[0] + c * P2[0] + d * P3[0], a * P0[1] + b * P1[1] + c * P2[1] + d * P3[1]]; };
    let s = shadow(x, cx, bot + 1, w + 8, 6) + `<path d="M${P0} C${P1} ${P2} ${P3} Q${cx} ${bot + 6} ${P0}Z" fill="${x.url("gr")}"/>`;
    s += `<path d="M${P0} C${P1} ${P2} ${P3}" stroke="${H.mix(g1, "#fff", .4)}" stroke-opacity=".45" stroke-width="1.1" fill="none"/>`;
    const r = RND(17);
    if (!sand) {
      let d1 = "", d2 = "";
      for (let i = 0; i < 46; i++) { const [bx, by] = B(.03 + .94 * r()), hh = 2.5 + r() * 3.5, lean = (r() - .5) * 3; d1 += `M${f(bx)} ${f(by + 1)} q${f(lean * .4)} ${f(-hh * .6)} ${f(lean)} ${f(-hh)}`; }
      for (let i = 0; i < 34; i++) { const [bx, by] = B(.08 + .84 * r()), dy = 3 + r() * (bot - by - 3), hh = 2 + r() * 2.5; d2 += `M${f(bx + (r() - .5) * 6)} ${f(by + dy)} l${f((r() - .5) * 2)} ${f(-hh)}`; }
      s += `<path d="${d2}" stroke="${H.shade(g2, -.3)}" stroke-opacity=".55" stroke-width=".9" stroke-linecap="round" fill="none"/><path d="${d1}" stroke="${H.mix(g1, "#fff", .25)}" stroke-width="1" stroke-linecap="round" fill="none"/>`;
    } else {
      for (let i = 0; i < 4; i++) s += `<path d="M${cx - w * .7 + i * 12} ${177 + i * 2.5} q${w * .4} -3 ${w * .9 - i * 10} 0" stroke="#fff" stroke-opacity=".18" stroke-width=".9" fill="none"/>`;
    }
    s += soil(x, o.bx || cx, 166.5, o.ring || 20, 4.2);
    (o.fallen || []).forEach(([px, py, col, sh, sz, a]) => { s += mark(px, py, sz || 3, a || 0, col, 1, sh || "dot"); });
    if (x.lush > .3 && !sand) for (let i = 0; i < 6; i++) { const [bx, by] = B(.1 + .8 * r()); s += `<circle cx="${f(bx)}" cy="${f(by + 3 + r() * 10)}" r=".9" fill="#e6f6ff" fill-opacity="${(x.lush * .8).toFixed(2)}"/>`; }
    return s;
  }
  function scatter(seed, n, cols, sh, sz) {
    const r = RND(seed), a = [];
    for (let i = 0; i < n; i++) { const t = r(), px = 30 + t * 140, py = 170 + r() * 12 - Math.sin(t * Math.PI) * 4; a.push([px, py, cols[i % cols.length], sh, sz || 2.6, r() * 180]); }
    return a;
  }
  const falling = (items, shape, sz) => items.map(([px, py, col, dl, a], i) => `<g class="${P}fall" style="animation-delay:-${dl}s">${mark(px, py, sz || 3.2, a || i * 50, col, 1, shape)}</g>`).join("");
  const fruit = (x, cx, cy, r, g, stem) => `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="${g}"/>${stem ? `<path d="M${f(cx)} ${f(cy - r + 1)} q.5 -2.4 1.6 -3.2" stroke="#4a3320" stroke-width=".9" fill="none"/>` : ""}<ellipse cx="${f(cx - r * .35)}" cy="${f(cy - r * .38)}" rx="${f(r * .28)}" ry="${f(r * .18)}" fill="#fff" fill-opacity=".5"/>`;

  const POT = ["#c8693e", "#ece6d8", "#3a3b44", "#8fa58a", "#2f4a6e", "#e2a593"];

  const icons = [

  { id: "fiddle", name: "Fiddle-leaf fig", colors: ["#c9a46a", "#e6dcc6", "#3b3431", "#a8743c", "#7e8a6a"], picker: true, colorLabel: "Basket",
    render(o) {
      const x = ctx(o, 11), p = pal(x, "a", "#2c6a33"), br = pal(x, "b", "#9a6a34", true);
      const stemF = grad(x, "stem", [[0, "#3e3020"], [.4, "#8a7350"], [1, "#30251a"]]);
      let s = basket(x, 100, 140, 188, 36, 28, o.color);
      const stems = [[100, 141, 95, 80, 103, 24], [97, 141, 92, 100, 66, 62], [103, 141, 110, 98, 137, 56]];
      let pl = stems.map((q) => `<path d="${rib(q[0], q[1], q[2], q[3], q[4], q[5], taper(4.2, 1.6))}" fill="${stemF}"/>`).join("");
      const L = [[0, .3, -1, 28], [0, .44, 1, 30], [1, .45, 1, 27], [2, .45, -1, 27], [0, .58, -1, 33], [1, .62, -1, 30], [2, .62, 1, 30], [0, .72, 1, 34], [1, .8, 1, 31], [2, .8, -1, 31], [0, .85, -1, 32], [1, 1, 0, 30], [2, 1, 0, 30], [0, .99, 0, 34]];
      const drop = 14 - Math.round(14 * (.5 + .5 * x.dens));
      L.forEach(([si, t, sd, len], i) => {
        const q = stems[si], [px, py, th] = qpt(...q, t), r1 = x.r(), r2 = x.r();
        if (i < drop) return;
        const a = dro(th * DEG + sd * 58, x.droop * 42 + (sd ? 6 : 0));
        const brown = r1 < x.brown * .7, edge = !brown && x.brown > .08 && r2 < .5 ? "#8a5a2b" : null;
        pl += leaf(x, px, py, len, len * .36, a, brown ? br : p, { shape: "fiddle", veins: true, edge, gl: .2 + .22 * x.lush });
      });
      if (x.lush > .2) pl += dew(x, [[78, 60, 10], [128, 52, 10], [104, 30, 10], [86, 100, 8]], 4);
      if (x.brown > .15) s += leaf(x, 128, 190, 24, 8.5, -14, br, { shape: "fiddle", lite: true });
      return svg(x, s + sway(pl, 100, 141, 6.5));
    } },

  { id: "olive", name: "Olive tree", colors: POT, picker: true, colorLabel: "Pot",
    render(o) {
      const x = ctx(o, 23), p = pal(x, "a", "#7d9466");
      p.l = H.mix(p.l, "#e6ecd8", .22);
      const bk = grad(x, "bk2", [[0, "#3a372f"], [.32, "#a39b8a"], [.6, "#6e685a"], [1, "#2b2822"]]);
      let s = pot(x, { top: 142, bot: 188, wt: 33, wb: 24, rim: 10, ro: 3, c: o.color, speck: true });
      const blobs = [[70, 68, 19], [130, 66, 20], [84, 44, 18], [118, 40, 18], [100, 54, 22], [58, 84, 12], [142, 84, 12], [100, 76, 17], [101, 26, 13], [76, 90, 10], [124, 90, 10]];
      let t = limbs(x, [[95, 144, 88, 124, 100, 102, 8, 6], [105, 144, 112, 122, 98, 102, 7, 5], [99, 104, 90, 90, 72, 74, 5, 2], [100, 104, 108, 86, 126, 70, 5, 2], [100, 102, 100, 84, 102, 56, 4, 2]], bk, .22);
      t += clumps(x, blobs, p, { leaf: "lance", sz: .2, n: 1.05 });
      const n = x.on ? Math.round(3 + 4 * x.dens) : 2;
      [[74, 84], [118, 76], [96, 62], [132, 58], [86, 50], [110, 88], [64, 70]].slice(0, n).forEach(([cx, cy], i) => { t += fruit(x, cx, cy, 2.6, i % 3 ? "#3e2a40" : "#6a7a34"); });
      t += dew(x, blobs, 5);
      return svg(x, s + sway(t, 100, 144, 7));
    } },

  { id: "kentia", name: "Kentia palm", colors: ["#3a3b44", "#ece6d8", "#2f4a6e", "#8fa58a", "#b6553a", "#d9b44a"], picker: true, colorLabel: "Pot",
    render(o) {
      const x = ctx(o, 31), p = pal(x, "a", "#357536");
      let s = pot(x, { top: 140, bot: 188, wt: 26, wb: 19, c: o.color, gloss: true });
      let t = "";
      [[-150, 80, 50], [-30, 80, 50], [-168, 60, 58], [-12, 60, 58], [-122, 96, 34], [-58, 96, 34], [-96, 108, 22], [-80, 100, 26]].forEach(([a, len, c]) => {
        t += frond(x, 100, 141, a, len, c, p, { n: 13, ll: 13, spread: 62, lw: 1.8 });
      });
      return svg(x, s + sway(t, 100, 141, 7));
    } },

  { id: "ficus", name: "Weeping fig", colors: ["#ece6d8", "#3a3b44", "#8fa58a", "#c8693e", "#2f4a6e", "#e2a593"], picker: true, colorLabel: "Pot",
    render(o) {
      const x = ctx(o, 41), p = pal(x, "a", "#3a7c33"), wood = grad(x, "wood", [[0, "#5a3a1e"], [.4, "#c08a52"], [1, "#4a2e16"]]);
      let s = shadow(x, 100, 190, 46, 4.5);
      s += `<path d="M96 160 L99 192 L102 192 L104 160Z" fill="${H.shade("#8a5a30", -.4)}"/>`;
      s += `<path d="M78 158 L70 191 L74 191 L84 160Z" fill="${wood}"/><path d="M122 158 L130 191 L126 191 L116 160Z" fill="${wood}"/>`;
      s += pot(x, { top: 128, bot: 166, wt: 30, wb: 27, c: o.color, gloss: true, noShadow: true });
      const blobs = [[100, 52, 25], [74, 64, 20], [126, 64, 20], [86, 36, 18], [116, 34, 18], [62, 82, 14], [138, 82, 14], [100, 74, 18], [100, 22, 12]];
      let t = limbs(x, [[97, 130, 94, 110, 100, 84, 4, 3], [103, 130, 108, 108, 100, 84, 4, 3], [100, 130, 100, 108, 100, 84, 3.5, 3], [100, 86, 90, 70, 80, 58, 3, 1.4], [100, 86, 112, 70, 120, 56, 3, 1.4], [100, 86, 100, 60, 100, 40, 3, 1.2]], grad(x, "bk3", [[0, "#55524a"], [.4, "#b5b0a2"], [1, "#4a473f"]]));
      t += clumps(x, blobs, p, { sz: .13, n: 1.15 });
      [[56, 88], [66, 96], [80, 94], [94, 92], [108, 92], [122, 94], [136, 96], [146, 88], [48, 74], [152, 74]].forEach(([tx, ty], i) => {
        const r1 = x.r(); if (r1 > x.dens + .2) return;
        const ln = 10 + (i % 3) * 4 + x.droop * 6;
        t += `<path d="M${tx} ${ty - 4} q${(i % 2 ? 2 : -2)} ${f(ln * .5)} ${(i % 2 ? 1 : -1)} ${f(ln)}" stroke="#5a5040" stroke-width=".8" fill="none"/>`;
        for (let j = 0; j < 3; j++) t += leaf(x, tx + (j % 2 ? 1.5 : -1.5), ty - 2 + j * ln / 3, 7.5, 3, j % 2 ? 70 : 110, x.r() < x.brown ? pal(x, "b" + i + j, "#a67b3c", true) : p, { lite: true });
      });
      t += dew(x, blobs, 5);
      return svg(x, s + sway(t, 100, 130, 6));
    } },

  { id: "money", name: "Money tree", colors: ["#3e7f86", "#ece6d8", "#3a3b44", "#c8693e", "#e2a593", "#d9b44a"], picker: true, colorLabel: "Pot",
    render(o) {
      const x = ctx(o, 53), p = pal(x, "a", "#4a9a3a");
      let s = `<rect x="84" y="182" width="32" height="6" rx="2" fill="${H.shade(o.color, -.45)}"/>`;
      s = shadow(x, 100, 189, 40, 4.5) + s + pot(x, { top: 156, bot: 184, wt: 44, wb: 22, belly: 9, c: o.color, gloss: true, noShadow: true });
      const segs = [];
      for (let k = 0; k < 3; k++) for (let y = 158; y > 92; y -= 2.4) {
        const ph = k * 2.094, w = 0.27, xa = 100 + 5.5 * Math.sin(w * y + ph), xb = 100 + 5.5 * Math.sin(w * (y - 2.6) + ph), z = Math.cos(w * y + ph);
        segs.push([z, xa, y, xb, y - 2.6]);
      }
      segs.sort((a, b) => a[0] - b[0]);
      let t = segs.map(([z, xa, ya, xb, yb]) => `<path d="M${f(xa)} ${f(ya)} L${f(xb)} ${f(yb)}" stroke="${H.mix("#4d4a2c", "#b7ad78", (z + 1) / 2)}" stroke-width="6" stroke-linecap="round"/>`).join("");
      t += `<path d="M97 156 L97 96" stroke="#fff" stroke-opacity=".1" stroke-width="1.5"/>`;
      const tips = [[60, 62], [84, 42], [112, 34], [138, 50], [100, 64], [152, 78], [48, 84]];
      t += limbs(x, tips.map(([tx, ty]) => [100, 96, (100 + tx) / 2, ty + 24, tx, ty + 6, 3.2, 1.4]), grad(x, "mst", [[0, "#4d4a2c"], [.4, "#a79f6c"], [1, "#3d3a22"]]));
      tips.forEach(([cx, cy], i) => {
        const nl = 6;
        for (let j = 0; j < nl; j++) {
          const r1 = x.r(); if (r1 > x.dens + .3) continue;
          const a = dro(-200 + j * 44 + (i % 2) * 10, x.droop * 40);
          t += leaf(x, cx, cy, 17, 5.6, a, r1 < x.brown ? pal(x, "b" + i + j, BR[j % 5], true) : p, { gl: .22 + .2 * x.lush });
        }
        t += `<circle cx="${cx}" cy="${cy}" r="1.6" fill="#3d5a26"/>`;
      });
      return svg(x, s + sway(t, 100, 158, 6));
    } },

  { id: "lemon", name: "Lemon tree", colors: ["#2f5d8a", "#ece6d8", "#c8693e", "#3a3b44", "#3e7f86", "#d9b44a"], picker: true, colorLabel: "Pot",
    render(o) {
      const x = ctx(o, 61), p = pal(x, "a", "#2e6b2f");
      const lem = grad(x, "lem", [[0, "#fff4a8"], [.5, H.mix("#f5d22e", "#c9b04a", x.dull)], [1, "#b88a0c"]]);
      x.D.push(rg(x.id("lemr"), [[0, "#fff8c0"], [.45, H.mix("#f5d22e", "#c9b04a", x.dull)], [1, "#b0840a"]], .36, .32, .7));
      let s = pot(x, { top: 146, bot: 188, wt: 30, wb: 20, belly: 12, rim: 7, ro: 3, c: o.color, gloss: true });
      const blobs = [[100, 60, 27], [74, 70, 20], [126, 70, 20], [84, 42, 20], [116, 42, 20], [100, 28, 17], [60, 52, 13], [140, 52, 13], [100, 86, 17]];
      let t = limbs(x, [[100, 148, 99, 120, 100, 92, 6, 4.5], [100, 96, 88, 84, 76, 72, 3, 1.4], [100, 96, 112, 84, 124, 72, 3, 1.4]]);
      t += clumps(x, blobs, p, { sz: .16 });
      const n = x.on ? Math.round(3 + 5 * cl(x.lv / .7)) : 2;
      [[78, 80], [120, 86], [134, 62], [92, 52], [108, 72], [66, 58], [100, 96], [124, 40]].slice(0, n).forEach(([cx, cy], i) => {
        t += `<ellipse cx="${cx}" cy="${cy}" rx="6.2" ry="4.8" transform="rotate(${i % 2 ? 24 : -18} ${cx} ${cy})" fill="${x.url("lemr")}"/><circle cx="${cx + (i % 2 ? 5.6 : -5.6)}" cy="${cy + (i % 2 ? 2.5 : 2)}" r="1.1" fill="#c99a10"/><ellipse cx="${cx - 2}" cy="${cy - 2}" rx="1.8" ry="1" fill="#fff" fill-opacity=".55"/>`;
      });
      if (x.lush > .4) [[88, 64], [114, 54], [70, 82]].forEach(([cx, cy]) => { for (let k = 0; k < 5; k++) { const a = k * 1.2566; t += `<circle cx="${f(cx + Math.cos(a) * 1.8)}" cy="${f(cy + Math.sin(a) * 1.8)}" r="1.5" fill="#fffaf0"/>`; } t += `<circle cx="${cx}" cy="${cy}" r=".9" fill="#f2c94c"/>`; });
      if (!x.on || x.lv < .3) s += `<ellipse cx="112" cy="149" rx="5.4" ry="4" transform="rotate(12 112 149)" fill="${x.url("lemr")}"/>`;
      t += dew(x, blobs, 5);
      return svg(x, s + sway(t, 100, 148, 7));
    } },

  { id: "bonsai", name: "Juniper bonsai", colors: ["#6a3b2a", "#2f3f5e", "#9fb8a6", "#ece6d8", "#26262c", "#b6553a"], picker: true, colorLabel: "Tray",
    render(o) {
      const x = ctx(o, 71), p = pal(x, "a", "#4c7f52"), c = o.color;
      const tr = grad(x, "tray", [[0, H.shade(c, -.5)], [.3, H.mix(c, "#fff", .25)], [.6, c], [1, H.shade(c, -.55)]]);
      const tv = grad(x, "trv", [[0, H.mix(c, "#fff", .1)], [1, H.shade(c, -.5)]], 1);
      const moss = H.mix("#a69a52", "#5f8f3a", cl(x.h * 1.3));
      let s = shadow(x, 100, 182, 70, 5);
      s += `<rect x="50" y="174" width="12" height="7" rx="1.5" fill="${H.shade(c, -.55)}"/><rect x="138" y="174" width="12" height="7" rx="1.5" fill="${H.shade(c, -.55)}"/>`;
      s += `<path d="M34 158 L166 158 L160 176 Q100 179 40 176Z" fill="${tr}"/><path d="M34 158 L166 158 L160 176 Q100 179 40 176Z" fill="${tv}" opacity=".35"/>`;
      s += `<path d="M32 155 L168 155 L166 159 L34 159Z" fill="${H.mix(c, "#fff", .2)}"/><path d="M38 155 L162 155 L160 157 L40 157Z" fill="${H.shade(c, -.6)}"/>`;
      s += `<path d="M44 156 Q60 148 86 151 Q110 146 136 150 Q152 149 158 156Z" fill="${moss}"/><path d="M50 154 Q70 149 92 152" stroke="#fff" stroke-opacity=".2" stroke-width="1.2" fill="none"/>`;
      s += `<path d="M126 154 Q128 144 138 143 Q148 145 148 154Z" fill="${grad(x, "rock", [[0, "#9a97a0"], [.6, "#5f5c66"], [1, "#3b3942"]], 1)}"/><path d="M130 148 Q134 144 140 145" stroke="#fff" stroke-opacity=".3" stroke-width="1" fill="none"/>`;
      const bk = grad(x, "bk4", [[0, "#3a1d12"], [.35, "#9a5a3a"], [.6, "#6b3a24"], [1, "#2a140c"]]);
      let t = limbs(x, [[84, 156, 66, 132, 96, 120, 14, 10], [96, 122, 124, 108, 104, 90, 10, 7], [104, 92, 88, 78, 98, 62, 7, 4], [95, 124, 70, 120, 50, 112, 5, 2], [107, 100, 130, 100, 146, 94, 5, 2], [100, 78, 82, 72, 70, 68, 4, 2], [99, 64, 100, 52, 104, 44, 3, 1.5]], bk);
      t += `<path d="M80 152 Q70 134 92 124 Q114 114 104 96" stroke="#cfc8b8" stroke-opacity=".75" stroke-width="1.4" fill="none" stroke-linecap="round"/><path d="M81 150 Q72 134 92 125" stroke="#fff" stroke-opacity=".5" stroke-width=".7" fill="none"/>`;
      const pads = [[50, 104, 26, 9], [146, 88, 26, 9], [72, 62, 22, 8], [104, 38, 22, 9], [124, 66, 15, 6]];
      const blobs = [];
      pads.forEach(([cx, cy, rx, ry]) => { blobs.push([cx, cy, rx, ry, 0]); blobs.push([cx - rx * .4, cy - ry * .55, ry * 1.1, ry * .9, 0], [cx + rx * .35, cy - ry * .5, ry * 1.05, ry * .85, 0], [cx, cy - ry * .8, ry * 1.05, ry * .8, 0]); });
      t += clumps(x, blobs, p, { sz: .2, n: 1.6 });
      return svg(x, s + sway(t, 84, 156, 9));
    } },

  { id: "dracaena", name: "Corn plant", colors: ["#a6a49d", "#ece6d8", "#3a3b44", "#c8693e", "#8fa58a", "#2f4a6e"], picker: true, colorLabel: "Pot",
    render(o) {
      const x = ctx(o, 83), c = o.color, g = x.tone("#3d7d34"), gd = H.shade(g, -.4), stripe = x.tone("#c2cf55");
      let s = shadow(x, 104, 189, 50, 5);
      s += `<path d="M132 142 L142 136 L142 182 L132 189Z" fill="${H.shade(c, -.42)}"/>`;
      s += `<rect x="64" y="142" width="68" height="47" fill="${grad(x, "cube", [[0, H.shade(c, -.25)], [.35, H.mix(c, "#fff", .18)], [1, H.shade(c, -.2)]])}"/>`;
      s += `<path d="M64 142 L74 136 L142 136 L132 142Z" fill="${H.mix(c, "#fff", .25)}"/><path d="M69 141 L76 137.5 L137 137.5 L130 141Z" fill="${H.shade(c, -.6)}"/>`;
      s += soil(x, 103, 139.3, 30, 1.6);
      const r0 = RND(5); for (let i = 0; i < 30; i++) s += `<circle cx="${f(66 + r0() * 64)}" cy="${f(145 + r0() * 42)}" r="${f(.4 + r0() * .7)}" fill="${r0() > .5 ? "#fff" : "#000"}" fill-opacity=".18"/>`;
      s += `<path d="M64.5 143 V188" stroke="#fff" stroke-opacity=".2"/>`;
      const cane = grad(x, "cane", [[0, "#4a3e30"], [.35, "#a8987c"], [.6, "#7d6e58"], [1, "#3a3024"]]);
      let t = "";
      [[86, 96, 10], [104, 60, 11], [121, 108, 9]].forEach(([cx, top, w], ci) => {
        t += `<rect x="${cx - w / 2}" y="${top}" width="${w}" height="${140 - top}" rx="2" fill="${cane}"/><ellipse cx="${cx}" cy="${top}" rx="${w / 2}" ry="1.6" fill="#c9b99a"/>`;
        for (let yy = top + 6; yy < 138; yy += 5.5) t += `<path d="M${cx - w / 2} ${f(yy)} q${w / 2} 1.6 ${w} 0" stroke="#2a2018" stroke-opacity=".35" stroke-width=".8" fill="none"/>`;
        const ang = [-150, -30, -125, -55, -170, -10, -105, -75, -92];
        let back = "", front = "";
        ang.forEach((a, i) => {
          const r1 = x.r(), r2 = x.r(); if (r1 > x.dens + .3) return;
          const L = 34 + (i % 3) * 6 - ci * 2, y0 = top + 4, x0 = cx;
          const c1x = x0 + Math.cos(a / DEG) * L * .55, c1y = y0 + Math.sin(a / DEG) * L * .55, a2 = dro(a, 40 + x.droop * 45) / DEG;
          const x1 = c1x + Math.cos(a2) * L * .5, y1 = c1y + Math.sin(a2) * L * .5;
          const wf = (tt) => 7 * (tt < .15 ? .45 + tt / .15 * .55 : 1 - Math.pow((tt - .15) / .85, 2.4));
          let l = `<path d="${rib(x0, y0, c1x, c1y, x1, y1, wf, 14)}" fill="${i % 2 ? g : gd}"/><path d="${rib(x0, y0, c1x, c1y, x1, y1, (tt) => wf(tt) * .3, 14, .05, .9)}" fill="${stripe}" fill-opacity=".85"/>`;
          if (r2 < x.brown * 1.6) l += `<path d="${rib(x0, y0, c1x, c1y, x1, y1, wf, 6, .72, 1)}" fill="#9c6a34"/>`;
          if (Math.abs(a + 90) < 40) back += l; else front += l;
        });
        t += back + front;
      });
      return svg(x, s + sway(t, 104, 140, 7));
    } },

  { id: "norfolk", name: "Norfolk pine", colors: ["#c9b48a", "#ece6d8", "#3a3b44", "#8fa58a", "#c8693e", "#2f4a6e"], picker: true, colorLabel: "Pot",
    render(o) {
      const x = ctx(o, 97), p = pal(x, "a", "#3c7a3c");
      let s = pot(x, { top: 148, bot: 188, wt: 26, wb: 21, c: o.color, ribs: true });
      let t = `<path d="${rib(100, 149, 100, 80, 100, 12, taper(4.5, 1.2))}" fill="${x.url("bark")}"/>`;
      [126, 107, 89, 72, 57, 43, 31, 21].forEach((y, i) => {
        const L = 12 + (y - 21) * .33;
        let lt = "", dk = "", bn = "";
        [-1, 1].forEach((sd) => {
          const ex = 100 + sd * L, ey = y - L * .12 + x.droop * L * .35, cx = 100 + sd * L * .55, cy = y + L * .06;
          t += `<path d="M100 ${y} Q${f(cx)} ${f(cy)} ${f(ex)} ${f(ey)}" stroke="#5a4a30" stroke-width="1.2" fill="none"/>`;
          for (let k = 2; k <= Math.round(L / 2.2); k++) {
            const tt = k / Math.round(L / 2.2), [px, py, th] = qpt(100, y, cx, cy, ex, ey, tt), nl = 5.2 * (1 - .45 * tt) + 1.6;
            [-1, 1].forEach((u) => {
              const r1 = x.r(); if (r1 > x.dens + .35) return;
              const a = th + u * 1.15 + x.droop * .5 * sd, seg = `M${f(px)} ${f(py)} l${f(Math.cos(a) * nl)} ${f(Math.sin(a) * nl)}`;
              if (x.r() < x.brown) bn += seg; else if (Math.sin(a) < 0) lt += seg; else dk += seg;
            });
          }
        });
        for (let k = 0; k < 9; k++) { const a = -Math.PI + k * Math.PI / 8, nl = 3 + L * .1; dk += `M100 ${y + 1} l${f(Math.cos(a) * nl)} ${f(Math.sin(a) * nl * .5 + 3)}`; }
        t += `<path d="${dk}" stroke="${p.d}" stroke-width="1.15" stroke-linecap="round" fill="none"/><path d="${lt}" stroke="${p.m}" stroke-width="1.15" stroke-linecap="round" fill="none"/><path d="${lt}" stroke="${p.l}" stroke-opacity=".45" stroke-width=".5" fill="none"/>${bn ? `<path d="${bn}" stroke="#a7783e" stroke-width="1.1" stroke-linecap="round" fill="none"/>` : ""}`;
      });
      return svg(x, s + sway(t, 100, 149, 6.5));
    } },

  { id: "jmaple", name: "Japanese maple", colors: ["#b3202a", "#6e1830", "#e0622a", "#5c9a3a", "#d9a02a"], picker: true, colorLabel: "Leaves",
    render(o) {
      const x = ctx(o, 101), p = pal(x, "a", o.color), p2 = pal(x, "b", H.mix(o.color, "#ff7a3a", .22)), p3 = pal(x, "c", H.shade(o.color, -.2));
      const wood = grad(x, "brl", [[0, "#3e2614"], [.25, "#8a5e36"], [.4, "#b7895a"], [.6, "#93653c"], [1, "#352010"]]);
      let s = shadow(x, 100, 189, 56, 5) + `<ellipse cx="100" cy="152" rx="42" ry="7" fill="#3a2414"/>` + soil(x, 100, 153, 38, 5.2);
      const body = "M58 152 Q55 170 62 186 Q100 192 138 186 Q145 170 142 152 A42 7 0 0 1 58 152Z";
      s += `<path d="${body}" fill="${wood}"/>`;
      for (let i = 1; i < 9; i++) { const xx = 58 + i * 84 / 9, bow = (xx - 100) * .08; s += `<path d="M${f(xx)} ${f(152 + 7 * Math.sqrt(1 - Math.pow((xx - 100) / 42, 2)))} Q${f(xx + bow)} 170 ${f(xx + bow * .4)} 188" stroke="#2a180a" stroke-opacity=".5" stroke-width=".8" fill="none"/>`; }
      [160, 179].forEach((yy) => { s += `<path d="M${yy === 160 ? 56.5 : 57.5} ${yy} Q100 ${yy + 8} ${yy === 160 ? 143.5 : 142.5} ${yy} L${yy === 160 ? 143.5 : 142.5} ${yy + 3.6} Q100 ${yy + 11.6} ${yy === 160 ? 56.5 : 57.5} ${yy + 3.6}Z" fill="${grad(x, "hoop", [[0, "#1d1d22"], [.35, "#6b6b74"], [.55, "#3a3a42"], [1, "#141418"]])}"/>`; });
      s += `<path d="M58 152 A42 7 0 0 0 142 152" stroke="#d9b080" stroke-opacity=".5" stroke-width="1.2" fill="none"/>`;
      const bk = grad(x, "bk5", [[0, "#3a302c"], [.35, "#8a7c74"], [1, "#2e2622"]]);
      let t = limbs(x, [[97, 154, 95, 138, 84, 122, 7, 4], [103, 154, 107, 138, 118, 120, 7, 4], [84, 123, 70, 112, 52, 104, 4, 1.5], [84, 123, 88, 108, 92, 94, 3.5, 1.5], [118, 121, 132, 112, 150, 104, 4, 1.5], [118, 121, 112, 106, 110, 92, 3.5, 1.5]], bk);
      const blobs = [[56, 100, 24, 12, 0], [144, 98, 24, 12, 1], [100, 86, 32, 14, 2], [76, 74, 24, 12, 1], [124, 72, 24, 12, 0], [100, 58, 26, 12, 1], [100, 104, 18, 8, 0], [38, 104, 12, 7, 2], [162, 102, 12, 7, 2]];
      t += clumps(x, blobs, [p, p2, p3], { leaf: "star", sz: .21, n: 1.4 });
      t += dew(x, blobs, 4);
      return svg(x, s + sway(t, 100, 154, 7.5));
    } },


  { id: "oak", name: "Oak tree", colors: ["#3f7a35", "#2c5f2e", "#6c8f2f", "#9a5a2a", "#c79a2e"], picker: true, colorLabel: "Leaves",
    render(o) {
      const x = ctx(o, 113), p = pal(x, "a", o.color), p2 = pal(x, "b", H.shade(o.color, -.2));
      let s = mound(x, { fallen: x.brown > .1 ? scatter(3, 6, BR, "dot", 2.4) : [] });
      let t = flare(x, 100, 167, 17) + limbs(x, [[100, 168, 97, 146, 100, 122, 17, 12], [100, 126, 84, 108, 56, 92, 9, 3], [100, 126, 118, 106, 146, 90, 9, 3], [100, 124, 102, 100, 98, 70, 8, 3], [84, 112, 68, 102, 38, 100, 4, 1.5], [122, 108, 138, 98, 166, 100, 4, 1.5]]);
      t += `<path d="M96 160 q-2 -8 1 -16 M104 158 q2 -6 0 -14" stroke="#1a110a" stroke-opacity=".45" stroke-width="1" fill="none"/>`;
      const blobs = [[100, 26, 18], [70, 42, 18], [130, 40, 18], [56, 62, 20], [146, 60, 20], [100, 52, 26], [76, 74, 24], [124, 72, 24], [42, 90, 18, 15], [158, 88, 18, 15], [100, 84, 22, 16], [26, 104, 12, 9], [174, 102, 12, 9]];
      t += clumps(x, blobs, [p, p2], { sz: .15 });
      t += dew(x, blobs, 6);
      return svg(x, s + sway(t, 100, 168, 7.5));
    } },

  { id: "fallmaple", name: "Fall maple", colors: ["#e0622a", "#c42a2a", "#e8a72a", "#8a2a3a", "#4f8f3a"], picker: true, colorLabel: "Leaves",
    render(o) {
      const x = ctx(o, 127), c = o.color, pa = pal(x, "a", c), pb = pal(x, "b", H.mix(c, "#f2c230", .55)), pc = pal(x, "c", H.mix(c, "#b01e28", .5));
      const fl = [pa.m, pb.m, pc.m, pb.l];
      let s = mound(x, { fallen: scatter(5, x.on && x.lv > .5 ? 7 : 13, fl.concat(BR.slice(0, 2)), "star", 2.6) });
      let t = flare(x, 100, 167, 13) + limbs(x, [[100, 168, 99, 148, 100, 128, 12, 9], [100, 130, 90, 112, 74, 98, 6, 2.5], [100, 130, 110, 110, 128, 94, 6, 2.5], [100, 128, 101, 108, 100, 84, 5, 2]]);
      const blobs = [[100, 18, 12], [86, 30, 16], [116, 30, 16], [100, 42, 22], [74, 52, 20], [126, 52, 20], [56, 70, 14], [144, 70, 14], [100, 66, 24], [72, 82, 19], [128, 82, 19], [100, 94, 20], [82, 106, 13], [118, 106, 13]];
      t += clumps(x, blobs, [pa, pb, pc], { leaf: "star", sz: .2, n: 1 });
      const fall = falling([[66, 112, pa.m, 0], [92, 116, pb.m, 2.1], [124, 112, pc.m, 4.3], [146, 104, pb.l, 6.2], [80, 108, pc.m, 5.2]], "star", 3);
      return svg(x, s + sway(t, 100, 168, 6.5) + fall);
    } },

  { id: "birch", name: "White birch", colors: ["#7fb24a", "#5c9a3a", "#a9c454", "#e0b030", "#c97a2a"], picker: true, colorLabel: "Leaves",
    render(o) {
      const x = ctx(o, 131), p = pal(x, "a", o.color), p2 = pal(x, "b", H.mix(o.color, "#2f6a2a", .25));
      const bw = grad(x, "bw", [[0, "#8a8780"], [.28, "#f6f4ee"], [.55, "#e4e1d8"], [1, "#77746c"]]);
      let s = mound(x, { ring: 22 });
      const tr = [[95, 168, 90, 120, 78, 36, 7, 3], [104, 168, 108, 118, 120, 28, 8, 3], [100, 168, 101, 130, 100, 56, 5.5, 2.5]];
      let t = limbs(x, tr.concat([[86, 92, 72, 84, 60, 72, 3, 1], [114, 84, 128, 74, 140, 66, 3, 1], [100, 96, 92, 80, 90, 70, 2.5, 1]]), bw, .3);
      const r = RND(9);
      tr.forEach((q) => { for (let k = 0; k < 13; k++) { const tt = .05 + k * .065, [px, py] = qpt(q[0], q[1], q[2], q[3], q[4], q[5], tt), w = q[6] + (q[7] - q[6]) * tt; t += `<path d="M${f(px - w * .45 + r() * w * .3)} ${f(py)} h${f(w * (.25 + r() * .3))}" stroke="#1d1a18" stroke-width="${f(.7 + r() * .7)}" stroke-linecap="round"/>`; } });
      t += `<path d="M92 128 l3 -2.5 l3 2.5 l-3 1Z M106 112 l3 -2.4 l3 2.4 l-3 1Z" fill="#1d1a18"/>`;
      const blobs = [[80, 36, 18], [118, 30, 19], [100, 52, 19], [64, 58, 17], [138, 54, 18], [86, 76, 16], [116, 78, 16], [100, 20, 13], [54, 82, 12], [148, 80, 12], [102, 94, 12], [70, 22, 10], [132, 16, 10]];
      t += clumps(x, blobs, [p, p2], { sz: .15, n: 1.4, flat: true });
      [[48, 88], [60, 70], [150, 86], [140, 62], [84, 86], [118, 90]].forEach(([tx, ty], i) => {
        const ln = 12 + (i % 3) * 5; t += `<path d="M${tx} ${ty} q${i % 2 ? 3 : -3} ${f(ln * .6)} ${i % 2 ? 1 : -1} ${ln}" stroke="#4a3a2e" stroke-width=".7" fill="none"/>`;
        for (let j = 1; j <= 3; j++) t += mark(tx + (i % 2 ? 1.6 : -1.6), ty + j * ln / 3.3, 2.4, 90, j % 2 ? p.m : p.l, 1, "dot");
      });
      t += dew(x, blobs, 5);
      return svg(x, s + sway(t, 100, 168, 5.2));
    } },

  { id: "spruce", name: "Blue spruce", colors: ["#5f8f98", "#2f5e3c", "#3f6f4a", "#7aa0a6", "#9aa548"], picker: true, colorLabel: "Needles",
    render(o) {
      const x = ctx(o, 149), p = pal(x, "a", o.color);
      let s = mound(x, { ring: 24, fallen: x.brown > .1 ? scatter(8, 6, ["#9c7a44", "#7a5a30"], "lance", 2) : [] });
      x.D.push(lg(x.id("spr"), [[0, p.l], [.35, p.m], [.75, p.d], [1, p.k]]));
      let t = `<rect x="96" y="148" width="8" height="21" fill="${x.url("bark")}"/>` + flare(x, 100, 168, 9);
      const N = 10, r = x.r;
      for (let i = 0; i < N; i++) {
        const k = i / (N - 1), yb = 160 - k * 128 + x.droop * 3 * (1 - k), w = 66 * (1 - k) + 6, h = 30 - k * 10, ap = yb - h, lt = 100 - w, rt = 100 + w;
        let d = `M100 ${f(ap)} Q${f(100 - w * .4)} ${f(yb - h * .5)} ${f(lt)} ${f(yb + 1)}`;
        const nS = Math.max(2, Math.round(w / 9));
        for (let j = 1; j <= nS; j++) { const xx = lt + (rt - lt) * j / nS; d += ` Q${f(xx - (rt - lt) / nS / 2)} ${f(yb + 5)} ${f(xx)} ${f(yb + (j === nS ? 1 : -.5))}`; }
        d += ` Q${f(100 + w * .4)} ${f(yb - h * .5)} 100 ${f(ap)}Z`;
        let lt1 = "", dk1 = "", bn = "";
        const cnt = Math.round(w * 1.3);
        for (let j = 0; j < cnt; j++) {
          const u = r() * 2 - 1, v = r(), rb = r(), xx = 100 + u * w * .92, yy = yb + 2 - v * h * (1 - Math.abs(u)) * .9, a = (u < 0 ? 115 : 65) + (r() - .5) * 40, nl = 3 + r() * 2;
          if (r() > x.dens + .3) continue;
          const seg = `M${f(xx)} ${f(yy)} l${f(Math.cos(a / DEG) * nl)} ${f(Math.sin(a / DEG) * nl)}`;
          if (rb < x.brown) bn += seg; else if (u < .15 && v > .25) lt1 += seg; else dk1 += seg;
        }
        t += `<path d="${d}" fill="${p.k}" transform="translate(1.5 2)"/><path d="${d}" fill="${x.url("spr")}"/>`;
        t += `<path d="${dk1}" stroke="${p.k}" stroke-opacity=".7" stroke-width="1" stroke-linecap="round" fill="none"/><path d="${lt1}" stroke="${p.l}" stroke-opacity=".75" stroke-width="1" stroke-linecap="round" fill="none"/>${bn ? `<path d="${bn}" stroke="#a7783e" stroke-width="1" stroke-linecap="round" fill="none"/>` : ""}`;
      }
      t += `<path d="M100 10 l-1.4 6 h2.8Z" fill="${p.l}"/>`;
      if (x.lush > .2) t += dew(x, [[80, 140, 16], [86, 100, 12], [92, 64, 8], [112, 120, 12]], 5);
      return svg(x, s + sway(t, 100, 168, 8));
    } },

  { id: "cherry", name: "Cherry blossom", colors: ["#f4b3c6", "#f7eef0", "#e57aa0", "#d9b3e6", "#f6c9b0"], picker: true, colorLabel: "Blossoms",
    render(o) {
      const x = ctx(o, 151), c = o.color, p = pal(x, "a", c), p2 = pal(x, "b", H.mix(c, "#ffffff", .35)), p3 = pal(x, "c", H.shade(c, -.12));
      const bk = grad(x, "bkc", [[0, "#1e1414"], [.35, "#5e4440"], [.6, "#3e2c2a"], [1, "#160e0e"]]);
      let s = mound(x, { fallen: scatter(11, 12, [p.l, p.m, p2.m], "round", 1.6) });
      let t = flare(x, 100, 167, 12, bk) + limbs(x, [[100, 168, 95, 150, 98, 132, 12, 9], [98, 134, 80, 120, 48, 104, 7, 2], [98, 134, 118, 118, 152, 100, 7, 2], [98, 132, 92, 110, 78, 82, 6, 2], [98, 132, 108, 108, 122, 78, 5, 2], [64, 112, 50, 98, 32, 98, 3, 1], [138, 106, 156, 96, 170, 98, 3, 1], [100, 120, 101, 100, 100, 62, 4, 1.5]], bk, .12);
      const blobs = [[44, 90, 19], [156, 86, 19], [70, 70, 24], [130, 66, 24], [100, 50, 26], [78, 42, 18], [122, 38, 18], [100, 78, 18], [28, 102, 11], [172, 100, 11], [100, 26, 15], [58, 98, 13], [142, 94, 13]];
      t += clumps(x, blobs, [p, p2, p3], { leaf: "round", sz: .15, n: 1.9, soft: true, flat: true });
      t += `<path d="M100 120 L100 112" stroke="#000" stroke-opacity="0"/>`;
      const fall = falling([[52, 104, p.l, 0], [80, 96, p.m, 1.4], [112, 98, p2.m, 2.9], [142, 104, p.l, 4.3], [66, 90, p2.m, 5.6], [128, 84, p.m, 7]], "round", 1.7);
      return svg(x, s + sway(t, 100, 168, 6.5) + fall);
    } },

  { id: "palm", name: "Coconut palm", colors: ["#3f8a3a", "#2f6e34", "#6aa040", "#8f9a3a", "#4f9a7a"], picker: true, colorLabel: "Fronds",
    render(o) {
      const x = ctx(o, 163), p = pal(x, "a", o.color);
      let s = mound(x, { sand: true, ring: 14, bx: 88 });
      const pt = grad(x, "pt", [[0, "#4e4030"], [.35, "#b9a27e"], [.6, "#8a7458"], [1, "#43362a"]]);
      let tr = `<path d="${rib(88, 168, 64, 118, 112, 62, taper(12, 7), 18)}" fill="${pt}"/>`;
      for (let k = 1; k < 22; k++) { const tt = k / 22, [px, py, th] = qpt(88, 168, 64, 118, 112, 62, tt), w = (12 - 5 * tt) / 2, nx = -Math.sin(th) * w, ny = Math.cos(th) * w; tr += `<path d="M${f(px + nx)} ${f(py + ny)} Q${f(px + Math.cos(th) * 1.6)} ${f(py + Math.sin(th) * 1.6)} ${f(px - nx)} ${f(py - ny)}" stroke="#2e2418" stroke-opacity=".45" stroke-width=".9" fill="none"/>`; }
      let cr = "";
      [[200, 66, 40], [-20, 62, 40], [-150, 66, 34], [-38, 56, 30], [-118, 48, 28], [-78, 44, 26], [160, 60, 30], [20, 54, 34]].forEach(([a, len, cv]) => { cr += frond(x, 112, 62, a, len, cv, p, { n: 14, t0: .1, ll: 14, grav: 40, spread: 50, lw: 1.9, stem: "#6f7436", sw: 2, dr: 35 }); });
      const nut = grad(x, "nut", [[0, "#9a8a3a"], [.5, "#6a5a24"], [1, "#2e2510"]]);
      x.D.push(rg(x.id("nutr"), [[0, "#b8a65a"], [.5, "#6b5a26"], [1, "#2a210c"]], .36, .32, .7));
      let nuts = "";
      const nn = x.on ? 4 : 2;
      [[106, 69], [117, 70], [111, 75], [121, 65]].slice(0, nn).forEach(([cx, cy]) => { nuts += `<circle cx="${cx}" cy="${cy}" r="5.2" fill="${x.url("nutr")}"/><ellipse cx="${cx - 1.6}" cy="${cy - 1.8}" rx="1.4" ry=".9" fill="#fff" fill-opacity=".35"/>`; });
      if (!x.on) s += `<circle cx="132" cy="176" r="4.6" fill="${x.url("nutr")}"/>`;
      const crown = sway(cr + nuts + `<circle cx="112" cy="62" r="4" fill="#5a4a2a"/>`, 112, 62, 4.5, 1, "whip");
      return svg(x, s + sway(tr + crown, 88, 168, 7));
    } },

  { id: "willow", name: "Weeping willow", colors: ["#8dbb4a", "#6a9a3a", "#b0c45a", "#d9b440", "#5a8a5a"], picker: true, colorLabel: "Leaves",
    render(o) {
      const x = ctx(o, 173), p = pal(x, "a", o.color), p2 = pal(x, "b", H.shade(o.color, -.18));
      let s = mound(x, { ring: 22 });
      const r = x.r;
      const strand = (sx, sy, ey, pp, i) => {
        const bow = (sx - 100) * .14, len = ey - sy;
        let g = `<path d="M${f(sx)} ${f(sy)} Q${f(sx + bow)} ${f(sy + len * .5)} ${f(sx + bow * .6)} ${f(ey)}" stroke="${pp.d}" stroke-width="1.1" fill="none"/>`;
        for (let k = 0; k < len / 4; k++) { const tt = k * 4 / len, [px, py] = qpt(sx, sy, sx + bow, sy + len * .5, sx + bow * .6, ey, tt), rb = r(); g += mark(px + (k % 2 ? 1.6 : -1.6), py, 2.6, k % 2 ? 72 : 108, rb < x.brown ? BR[k % 5] : k % 3 ? pp.m : pp.l, .95, "lance"); }
        return `<g class="${P}whip" style="transform-origin:${f(sx)}px ${f(sy)}px;animation-duration:${(4 + (i % 4) * .6).toFixed(1)}s;animation-delay:-${(i * .45).toFixed(2)}s">${g}</g>`;
      };
      let back = "", front = "";
      for (let i = 0; i < 26; i++) {
        const sx = 26 + i * 148 / 25 + (r() - .5) * 4, e = 1 - Math.pow((sx - 100) / 76, 2), sy = 56 + 20 * (1 - e), ey = 150 + r() * 12 - (1 - x.dens) * 34 - (1 - e) * 22, rk = r();
        if (rk > x.dens + .3) continue;
        if (i % 2) back += strand(sx, sy - 6, ey - 4, p2, i); else if (Math.abs(sx - 100) > 14) front += strand(sx, sy + 4, ey, p, i);
      }
      let t = flare(x, 100, 167, 14) + limbs(x, [[100, 168, 98, 148, 100, 124, 14, 10], [100, 126, 86, 110, 72, 90, 7, 3], [100, 126, 114, 108, 128, 88, 7, 3], [100, 124, 100, 104, 100, 78, 6, 3]]);
      const blobs = [[100, 40, 24], [74, 50, 21], [126, 50, 21], [50, 64, 16], [150, 64, 16], [100, 62, 20], [86, 28, 15], [114, 28, 15]];
      const dome = clumps(x, blobs, [p, p2], { leaf: "lance", sz: .15, n: 1.1 });
      return svg(x, s + sway(back + t + dome + front + dew(x, blobs, 4), 100, 168, 8));
    } },

  { id: "apple", name: "Apple tree", colors: ["#c8283a", "#8cc63f", "#e8c440", "#e2556b", "#8a1a2a"], picker: true, colorLabel: "Apples",
    render(o) {
      const x = ctx(o, 181), p = pal(x, "a", "#4a8a35"), p2 = pal(x, "b", "#3a7430"), c = o.color;
      x.D.push(rg(x.id("apl"), [[0, H.mix(c, "#fff", .55)], [.4, c], [1, H.shade(c, -.5)]], .36, .32, .72));
      const fallen = (!x.on || x.lv < .35) ? [[64, 176], [132, 178], [116, 182]] : [[136, 178]];
      let s = mound(x, { fallen: x.brown > .1 ? scatter(4, 5, BR, "dot", 2.4) : [] });
      fallen.forEach(([cx, cy]) => { s += fruit(x, cx, cy, 4.4, x.url("apl")); });
      let t = flare(x, 100, 167, 13) + limbs(x, [[100, 168, 98, 150, 100, 130, 13, 10], [100, 132, 86, 118, 64, 104, 7, 3], [100, 132, 116, 116, 138, 104, 7, 3], [100, 130, 100, 112, 100, 90, 6, 3]]);
      const blobs = [[100, 30, 16], [82, 44, 20], [118, 44, 20], [64, 58, 14], [136, 58, 14], [100, 62, 27], [72, 76, 22], [128, 76, 22], [54, 90, 14], [146, 90, 14], [100, 92, 20]];
      t += clumps(x, blobs, [p, p2], { sz: .15 });
      const n = x.on ? Math.round(5 + 7 * cl(x.lv / .7)) : 4;
      [[80, 82], [120, 88], [104, 70], [62, 66], [138, 64], [92, 48], [114, 40], [70, 96], [132, 98], [100, 100], [86, 62], [148, 82]].slice(0, n).forEach(([cx, cy]) => { t += fruit(x, cx, cy, 4.6, x.url("apl"), 1); });
      t += dew(x, blobs, 4);
      return svg(x, s + sway(t, 100, 168, 7));
    } },

  { id: "aspen", name: "Aspen grove", colors: ["#e6b42c", "#8fbf3a", "#e0782a", "#c9c94a", "#5c9a3a"], picker: true, colorLabel: "Leaves",
    render(o) {
      const x = ctx(o, 191), c = o.color, p = pal(x, "a", c), p2 = pal(x, "b", H.mix(c, "#f6dc6a", .3)), p3 = pal(x, "c", H.shade(c, -.15));
      const ab = grad(x, "ab", [[0, "#8a8c80"], [.3, "#eef0e2"], [.6, "#d4d8c6"], [1, "#6e7066"]]);
      let s = mound(x, { ring: 34, fallen: scatter(13, 8, [p.m, p2.m], "round", 1.8) });
      const tr = [[72, 170, 70, 120, 74, 44, 5, 2], [102, 168, 100, 110, 104, 24, 6, 2.5], [132, 170, 134, 120, 128, 54, 4.5, 2]];
      let t = limbs(x, tr, ab, .3);
      tr.forEach((q, qi) => { for (let k = 0; k < 7; k++) { const tt = .08 + k * .12, [px, py] = qpt(q[0], q[1], q[2], q[3], q[4], q[5], tt); t += `<path d="M${f(px - 2)} ${f(py)} Q${f(px)} ${f(py - 1.3)} ${f(px + 2)} ${f(py)} Q${f(px)} ${f(py + 1.3)} ${f(px - 2)} ${f(py)}Z" fill="#26241f" transform="rotate(${k % 2 ? 8 : -8} ${f(px)} ${f(py)})"/>`; } });
      const blobs = [[74, 48, 13, 15, 0], [66, 64, 12, 0, 1], [82, 66, 12, 0, 2], [74, 80, 10, 0, 0], [74, 32, 9, 0, 1],
        [104, 28, 13, 14, 1], [94, 44, 14, 0, 0], [114, 44, 14, 0, 2], [104, 60, 14, 0, 1], [94, 76, 11, 0, 2], [114, 74, 11, 0, 0], [104, 14, 8, 0, 2],
        [128, 58, 12, 14, 2], [120, 74, 11, 0, 0], [136, 74, 11, 0, 1], [128, 88, 10, 0, 2], [128, 44, 8, 0, 0]];
      t += clumps(x, blobs, [p, p2, p3], { leaf: "round", sz: .17, n: 1.6, cls: "shim", flat: true });
      return svg(x, s + sway(t, 102, 168, 5));
    } },

  { id: "magnolia", name: "Magnolia", colors: ["#f5efe6", "#e9a7c4", "#9b4f96", "#efe0a8", "#f2c7b8"], picker: true, colorLabel: "Flowers",
    render(o) {
      const x = ctx(o, 211), p = pal(x, "a", "#2c5a2e"), p2 = pal(x, "b", "#3a6a34"), c = o.color;
      const mf = grad(x, "mf", [[0, "#ffffff"], [.55, H.mix(H.mix(c, "#fff", .2), "#b8a070", x.dull * .6)], [1, H.shade(c, -.2)]], 1);
      let s = mound(x, { fallen: x.brown > .1 ? scatter(6, 5, ["#8a6a3a", "#6a4a24"], "lance", 2.6) : [] });
      let t = flare(x, 100, 167, 12) + limbs(x, [[96, 168, 92, 150, 82, 128, 9, 5], [104, 168, 108, 150, 118, 126, 9, 5], [100, 168, 100, 148, 100, 118, 7, 4]]);
      const blobs = [[100, 20, 12], [86, 34, 18], [114, 34, 18], [100, 50, 22], [72, 60, 20], [128, 60, 20], [100, 76, 24], [56, 84, 16], [144, 84, 16], [78, 98, 18], [122, 98, 18], [100, 106, 14], [40, 104, 11], [160, 104, 11]];
      t += clumps(x, blobs, [p, p2], { leaf: "lance", sz: .24, n: .75 });
      const n = x.on ? Math.round(3 + 5 * cl(x.lv / .7)) : 2;
      [[100, 42, 9], [72, 66, 8], [130, 62, 8], [100, 86, 9], [58, 92, 7], [146, 90, 7], [84, 28, 6], [120, 104, 7]].slice(0, n).forEach(([cx, cy, sz], i) => {
        const pet = `M0 0 C${f(-sz * .55)} ${f(-sz * .3)} ${f(-sz * .5)} ${f(-sz * 1.15)} 0 ${f(-sz * 1.3)} C${f(sz * .5)} ${f(-sz * 1.15)} ${f(sz * .55)} ${f(-sz * .3)} 0 0Z`;
        let fl = "";
        [-52, 52].forEach((a) => { fl += `<path d="${pet}" transform="rotate(${a})" fill="${mf}"/><path d="${pet}" transform="rotate(${a})" fill="#000" fill-opacity=".14"/>`; });
        fl += `<ellipse cx="0" cy="${f(-sz * .4)}" rx="${f(sz * .22)}" ry="${f(sz * .4)}" fill="#c9b85a"/>`;
        [-24, 24, 0].forEach((a) => { fl += `<path d="${pet}" transform="rotate(${a}) scale(${a ? .95 : .85})" fill="${mf}"/>`; });
        fl += `<path d="M${f(-sz * .1)} ${f(-sz * .2)} Q${f(-sz * .25)} ${f(-sz * .7)} 0 ${f(-sz * 1)}" stroke="#fff" stroke-opacity=".6" stroke-width=".8" fill="none"/>`;
        t += `<g transform="translate(${cx} ${cy + sz * .5}) rotate(${i % 2 ? 12 : -10})">${fl}</g>`;
      });
      t += dew(x, blobs, 5);
      return svg(x, s + sway(t, 100, 168, 7.5));
    } },
  ];

  (window.HDA = window.HDA || []).push({
    id: "trees", tab: "Trees", group: "Plants", kind: "plant",
    intro: "Ten indoor trees in pots and ten yard trees on a grassy mound. The Water slider is the soil moisture: lush and glossy when watered, thinning, drooping and browning when dry.",
    
    css: `
.hda-trees-sway,.hda-trees-whip{transform-box:view-box}
.hda-anim .hda-trees-sway{animation:hda-trees-sway 6s ease-in-out infinite}
@keyframes hda-trees-sway{0%,100%{transform:rotate(-.9deg)}50%{transform:rotate(.9deg)}}
.hda-anim .hda-trees-whip{animation:hda-trees-whip 4.5s ease-in-out infinite}
@keyframes hda-trees-whip{0%,100%{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}
.hda-trees-fall{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-trees-fall{animation:hda-trees-fall 8s linear infinite;opacity:0}
@keyframes hda-trees-fall{0%{transform:translate(0,0) rotate(0deg);opacity:0}8%{opacity:1}35%{transform:translate(7px,20px) rotate(120deg)}65%{transform:translate(-5px,42px) rotate(240deg)}88%{opacity:1}100%{transform:translate(3px,60px) rotate(360deg);opacity:0}}
.hda-anim .hda-trees-shim{animation:hda-trees-shim 1.9s ease-in-out infinite}
@keyframes hda-trees-shim{0%,100%{opacity:1}50%{opacity:.6}}
.hda-anim .hda-trees-dew{animation:hda-trees-dew 3.2s ease-in-out infinite}
@keyframes hda-trees-dew{0%,100%{opacity:.3}50%{opacity:1}}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-trees-sway,.hda-anim .hda-trees-whip,.hda-anim .hda-trees-fall,.hda-anim .hda-trees-shim,.hda-anim .hda-trees-dew{animation:none!important;opacity:1}}
`,
    icons,
  });
})();
