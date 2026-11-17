
(function () {
  const H = window.HDAH, P = "hda-chickenlamp-";
  const f = (n) => (+n).toFixed(1);
  const cl = (v) => Math.max(0, Math.min(1, v));
  const rnd = (seed) => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
  const stops = (a) => a.map(([o, c, op]) => `<stop offset="${o}" stop-color="${c}"${op == null ? "" : ` stop-opacity="${op}"`}/>`).join("");
  const lg = (id, a, x1, y1, x2, y2) => `<linearGradient id="${id}" x1="${x1 || 0}" y1="${y1 || 0}" x2="${x2 == null ? 1 : x2}" y2="${y2 || 0}">${stops(a)}</linearGradient>`;
  const rg = (id, a, cx, cy, r) => `<radialGradient id="${id}" cx="${cx == null ? .5 : cx}" cy="${cy == null ? .5 : cy}" r="${r || .5}">${stops(a)}</radialGradient>`;
  const E = (cx, cy, rx, ry, fill, more) => `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}" ${more || ""}/>`;
  const R = (x, y, w, h, fill, more) => `<rect x="${f(x)}" y="${f(y)}" width="${f(Math.max(0, w))}" height="${f(Math.max(0, h))}" fill="${fill}" ${more || ""}/>`;
  const PA = (d, fill, more) => `<path d="${d}" fill="${fill}" ${more || ""}/>`;
  const ST = (d, col, w, op, more) => `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-opacity="${op == null ? 1 : op}" stroke-linecap="round" stroke-linejoin="round" ${more || ""}/>`;
  const lum = (h) => { const c = H.hx(h); return (.299 * c[0] + .587 * c[1] + .114 * c[2]) / 255; };

  
  const SPECK = "#8e908c";
  const CHICK = { white: "#f2efe8", buff: "#d9a45a", brown: "#8a4e2a", black: "#26262b", speck: SPECK, blue: "#b9cde6", pink: "#f2bccb", mint: "#bfe3cf", yellow: "#f6dc7a" };
  const HENS = [CHICK.white, CHICK.buff, CHICK.brown, CHICK.black, CHICK.speck, CHICK.blue, CHICK.pink, CHICK.mint];
  const WARM = ["#ffd9a0", "#fff1dc", "#ffb760", "#e3eeff", "#ff8fb8", "#8fd0ff", "#b98cff"];

  function ctx(o, def) {
    const c = o.color || def.colors[0], on = !!o.on, lv = o.level == null ? 1 : cl(+o.level);
    const L = on ? .3 + .7 * lv : 0;
    const c2 = o.color2 || def.colors2[0];
    const id = (s) => `${o.uid}-${s}`, url = (s) => `url(#${o.uid}-${s})`;
    return { c, c2, on, L, lv, anim: !!o.anim, opt: o.opt || {}, id, url, hot: H.mix(c, "#ffffff", .6), op: (k) => cl(k * L).toFixed(2), speck: String(c2).toLowerCase() === SPECK };
  }

  
  function skin(x, tag, col, mat) {
    const S = H.shade, M = H.mix, { c, hot, L, on, id } = x;
    let base = col;
    if (mat === "frost") base = M(col, "#e4e6ea", .3);
    let off, lit;
    if (mat === "glass") {
      off = [[0, S(col, .45), .32], [.6, col, .22], [1, S(col, -.3), .42]];
      lit = [[0, M(col, hot, .7), .5 + .4 * L], [.55, M(col, c, .4), .35 + .3 * L], [1, S(M(col, c, .3), -.2), .5]];
    } else {
      off = [[0, S(base, mat === "frost" ? .22 : .34)], [.5, base], [1, S(base, mat === "frost" ? -.32 : -.48)]];
      const dk = lum(col) < .25 ? .06 : 0;            
      lit = [[0, M(col, hot, .22 + .3 * L + dk)], [.5, M(col, c, .1 + .18 * L + dk)], [1, M(S(col, -.32), c, .06 + .1 * L)]];
    }
    return rg(id(tag + "b"), on ? lit : off, on ? .46 : .38, on ? .6 : .3, on ? .72 : .78) +
      rg(id(tag + "g"), [[0, hot, .95], [.45, c, .5], [1, c, 0]]) +
      lg(id(tag + "v"), [[0, "#000", 0], [.55, "#000", 0], [1, "#000", on ? .22 : .42]], 0, 0, 0, 1);
  }

  function defs(x, extra) {
    const { c, id, hot } = x;
    return `<defs>
<clipPath id="${id("wc")}"><rect x="8" y="8" width="184" height="184" rx="16"/></clipPath>
${rg(id("vig"), [[0, "#000", 0], [.62, "#000", .05], [1, "#000", .5]], .5, .46, .74)}
${rg(id("halo"), [[0, c, .8], [.42, c, .28], [1, c, 0]])}
${rg(id("pool"), [[0, hot, .7], [.4, c, .4], [1, c, 0]])}
${rg(id("sh"), [[0, "#000", .6], [.6, "#000", .22], [1, "#000", 0]])}
${lg(id("wall"), [[0, "#4b4651"], [1, "#2c2a32"]], 0, 0, 0, 1)}
${lg(id("tab"), [[0, "#8a6440"], [.1, "#6e4e30"], [1, "#3a2818"]], 0, 0, 0, 1)}
${lg(id("wood"), [[0, "#5a3a20"], [.25, "#9a6e42"], [.5, "#b98650"], [.8, "#7a5230"], [1, "#4a2e18"]])}
${lg(id("brs"), [[0, "#6e4a17"], [.22, "#c99a48"], [.38, "#fbe7a6"], [.58, "#b07f33"], [.82, "#7a5118"], [1, "#4d3210"]])}
${lg(id("chr"), [[0, "#4a4f5c"], [.2, "#e9ecf4"], [.36, "#8e94a6"], [.55, "#f4f6fb"], [.8, "#6c7284"], [1, "#3a3e4a"]])}
${lg(id("blk"), [[0, "#0f0f15"], [.28, "#3a3b47"], [.45, "#5a5c6a"], [.72, "#22232c"], [1, "#0b0b10"]])}
${lg(id("plas"), [[0, "#bdbac2"], [.3, "#f4f2f6"], [.6, "#e6e3ea"], [1, "#a7a4ae"]])}
${lg(id("comb"), [[0, "#f0523e"], [.6, "#c8221e"], [1, "#8a1214"]], 0, 0, 0, 1)}
${lg(id("beak"), [[0, "#ffd36a"], [.5, "#f2a52e"], [1, "#c9761a"]], 0, 0, 0, 1)}
${lg(id("leg"), [[0, "#f5c24a"], [1, "#c98a1e"]])}
${rg(id("egg"), x.on ? [[0, "#fffaf0"], [.35, H.mix("#f6ead2", hot, .6)], [.8, H.mix("#e9d6b2", c, .35)], [1, H.mix("#b89a70", c, .2)]] : [[0, "#fbf4e6"], [.55, "#eadcc2"], [1, "#a8916e"]], .42, .4, .7)}
${extra || ""}</defs>`;
  }
  function svg(x, s) {
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs(x, s.defs)}
<g clip-path="${x.url("wc")}"><g class="hda-bg"><rect x="8" y="8" width="184" height="184" fill="#1c1b24"/>${s.bg || ""}</g>${s.fx || ""}<g class="hda-bg"><rect x="8" y="8" width="184" height="184" fill="${x.url("vig")}"/></g></g>
<g class="hda-bg"><rect x="8.5" y="8.5" width="183" height="183" rx="15.5" fill="none" stroke="#fff" stroke-opacity=".08"/></g></svg>`;
  }

  
  const wallBg = (x, y1, seed) => R(8, 8, 184, y1 - 8, x.url("wall")) + (() => { const r = rnd(seed || 7); let s = ""; for (let i = 0; i < 34; i++) s += `<circle cx="${f(10 + r() * 180)}" cy="${f(10 + r() * (y1 - 14))}" r="${f(.3 + r() * .6)}" fill="${r() > .5 ? "#000" : "#fff"}" fill-opacity="${(.04 + r() * .07).toFixed(2)}"/>`; return s; })();
  function table(x, ty) {
    let s = R(8, ty, 184, 192 - ty, x.url("tab")) + R(8, ty, 184, 1, "#fff", 'fill-opacity=".18"');
    const r = rnd(ty * 7);
    for (let i = 0; i < 9; i++) { const yy = ty + 4 + r() * (186 - ty); s += `<path d="M8 ${f(yy)} q92 ${f((r() - .5) * 3)} 184 0" stroke="#000" stroke-opacity="${(.1 + r() * .12).toFixed(2)}" stroke-width=".6" fill="none"/>`; }
    return s;
  }
  const wallHalo = (x, cx, cy, rx, ry) => x.on ? E(cx, cy, rx, ry, x.url("halo"), `opacity="${x.op(.34)}"`) : "";
  const halo = (x, cx, cy, rx, ry, k) => x.on ? `<g class="${P}pulse">` + E(cx, cy, rx, ry, x.url("halo"), `opacity="${x.op(k == null ? .55 : k)}"`) + `</g>` : "";
  const pool = (x, cx, cy, rx, k) => x.on ? E(cx, cy, rx, rx * .12, x.url("pool"), `opacity="${x.op(k == null ? .5 : k)}"`) : "";
  const shadow = (x, cx, cy, rx) => E(cx, cy, rx, Math.max(2.5, rx * .09), x.url("sh"));

  
  const HEN = "M-36 10 C-44 -6 -38 -22 -30 -26 C-34 -34 -30 -44 -20 -44 C-10 -44 -6 -36 -8 -28 C-4 -18 10 -16 22 -20 C30 -30 36 -40 42 -38 C48 -30 46 -10 40 4 C38 20 24 30 4 31 L-14 31 C-26 30 -33 22 -36 10 Z";
  const HEN_COMB = "M-26 -41.5 C-29 -47 -25.5 -51.5 -21.5 -46.8 C-21.5 -52.8 -14.5 -53.5 -14.8 -46.3 C-12 -50.6 -6.5 -48.5 -9.6 -41.6 C-15 -44.2 -21 -44.2 -26 -41.5 Z";
  const HEN_BEAK = "M-29.6 -39.6 C-33 -39.4 -36.5 -38 -39 -36 C-36 -35 -33 -34 -30 -33.4 Z";
  const HEN_WAT = "M-30.2 -33.2 C-33.4 -29.4 -32 -24.2 -28.8 -25.4 C-26.6 -26.6 -27 -30.6 -28 -33.2 Z";
  const HEN_WING = "M-13 -3 C-1 -12 19 -10 30 1 C26 12 12 18 -4 15 C-12 11 -15 3 -13 -3 Z";
  const HEN_FEATH = ["M-4 9 C4 11 14 10 24 4", "M-7 3 C2 5 13 4 26 -2", "M10 14 C16 12 22 9 27 4"];
  const HEN_TAIL = ["M23 -17 C29 -25 35 -32 40 -34", "M28 -9 C34 -17 40 -24 43.5 -26", "M32 -1 C37 -7 42 -14 44.5 -16"];

  const ROO = "M-30 -2 C-38 -14 -34 -28 -28 -36 C-32 -42 -30 -54 -20 -56 C-10 -56 -8 -46 -12 -38 C-8 -26 0 -20 12 -20 C16 -36 26 -50 40 -52 C52 -50 54 -30 46 -10 C40 6 26 18 6 20 C-14 20 -26 12 -30 -2 Z";
  const ROO_COMB = "M-25.5 -53.6 C-30 -59.5 -27 -65.5 -22.4 -60.4 C-22.8 -67.6 -15.6 -69 -15.8 -61 C-13.6 -67.4 -6.8 -66.6 -9.6 -58.6 C-5.6 -62.2 -1.4 -58.6 -6.6 -53.2 C-12 -56.8 -20 -57 -25.5 -53.6 Z";
  const ROO_BEAK = "M-29 -49.6 C-32.8 -49.4 -36.4 -48 -38.6 -46 C-35.8 -45 -32.6 -44 -29.4 -43.4 Z";
  const ROO_WAT = "M-29.6 -43 C-34.4 -37.4 -32.4 -29.4 -28 -31.2 C-25.6 -32.8 -26.2 -38.6 -27.6 -43 Z";
  const ROO_WING = "M-14 -8 C-2 -16 18 -12 26 -2 C22 10 8 14 -6 11 C-14 7 -16 -1 -14 -8 Z";

  
  function body(x, tag, d, col, mat, o) {
    const { url, on, L } = x, S = H.shade;
    const clip = x.id(tag + "c");
    const dark = lum(col) < .3;
    const line = dark ? "#000" : S(col, -.6);
    let s = `<clipPath id="${clip}"><path d="${d}"/></clipPath>`;
    s += PA(d, url(tag + "b"));
    s += `<g clip-path="url(#${clip})">`;
    if (x.speck && mat !== "glass") { const r = rnd(41 + tag.length); for (let i = 0; i < 70; i++) s += `<circle cx="${f(-46 + r() * 94)}" cy="${f(-56 + r() * 90)}" r="${f(.5 + r() * 1)}" fill="${r() > .45 ? "#202124" : "#f4f2ee"}" fill-opacity="${(.45 + r() * .4).toFixed(2)}"/>`; }
    if (on) {
      const g = o.glow || [0, 0, 40, 34];
      s += `<g class="${P}pulse">` + E(g[0], g[1], g[2], g[3], url(tag + "g"), `opacity="${x.op(o.gk == null ? .6 : o.gk)}"`) + `</g>`;
    }
    if (mat !== "glass") s += R(-60, -80, 120, 120, url(tag + "v"));
    
    if (o.wing) {
      if (mat === "frost") s += ST(o.wing, "#fff", 1.1, on ? .55 : .5);
      else s += PA(o.wing, "#000", `fill-opacity="${on ? .07 : .12}"`) + ST(o.wing, line, .9, on ? .3 : .45) +
        ST(o.wing.replace(/^M(-?[\d.]+) (-?[\d.]+) C(-?[\d.]+) (-?[\d.]+) (-?[\d.]+) (-?[\d.]+) (-?[\d.]+) (-?[\d.]+).*$/, "M$1 $2 C$3 $4 $5 $6 $7 $8"), "#fff", .9, on ? .3 : .22, 'transform="translate(0 1.2)"');
      for (const fl of o.feath || []) s += ST(fl, mat === "frost" ? "#fff" : line, .8, mat === "frost" ? .45 : (on ? .2 : .32));
    }
    for (const tl of o.tail || []) s += ST(tl, mat === "frost" ? "#fff" : line, .9, mat === "frost" ? .45 : (on ? .22 : .38));
    
    if (mat === "ceramic") s += E(o.hx == null ? -24 : o.hx, o.hy == null ? -12 : o.hy, 6, 13, "#fff", `fill-opacity="${on ? .22 : .4}" transform="rotate(28 ${o.hx == null ? -24 : o.hx} ${o.hy == null ? -12 : o.hy})"`);
    if (mat === "glass") s += E(-22, -14, 4, 14, "#fff", `fill-opacity=".38" transform="rotate(24 -22 -14)"`) + E(28, -26, 2, 6, "#fff", 'fill-opacity=".3"');
    s += `</g>`;
    
    s += ST(d, mat === "glass" ? "#fff" : (dark ? "#000" : S(col, -.55)), mat === "glass" ? .9 : 1.1, mat === "glass" ? .35 : .55);
    if (mat === "frost") s += ST(d, on ? x.hot : "#fff", 1.6, on ? x.op(.8) : .35);
    if (mat === "ceramic" && on) s += ST(d, x.hot, .7, x.op(.35));
    return s;
  }
  
  function face(x, p, mat) {
    const { url, on } = x;
    const gl = on ? `<path d="${p.comb}" fill="${x.hot}" opacity="${x.op(.22)}"/>` : "";
    let s = PA(p.comb, url("comb"), `stroke="#6a0e10" stroke-width=".6" stroke-opacity=".6"`) + gl + ST(p.combHi, "#fff", .8, .35);
    s += PA(p.wat, url("comb"), `stroke="#6a0e10" stroke-width=".5" stroke-opacity=".5"`) + (on ? `<path d="${p.wat}" fill="${x.hot}" opacity="${x.op(.18)}"/>` : "");
    s += PA(p.beak, url("beak"), `stroke="#8a4e10" stroke-width=".5" stroke-opacity=".6"`) + ST(p.beakLine, "#7a420c", .5, .6);
    const [ex, ey] = p.eye;
    if (mat === "frost") s += `<circle cx="${ex}" cy="${ey}" r="1.9" fill="#2a2420" fill-opacity=".75"/>`;
    else s += `<circle cx="${ex}" cy="${ey}" r="2.6" fill="#f7e2a8"/><circle cx="${ex}" cy="${ey}" r="1.8" fill="#1a1410"/><circle cx="${ex - .6}" cy="${ey - .7}" r=".65" fill="#fff"/>`;
    return s;
  }
  const HEN_FACE = { comb: HEN_COMB, combHi: "M-24.5 -44.5 C-24 -47 -22.6 -48 -21.8 -46", wat: HEN_WAT, beak: HEN_BEAK, beakLine: "M-30 -36.4 L-37 -36.1", eye: [-22, -37] };
  const ROO_FACE = { comb: ROO_COMB, combHi: "M-23.6 -56.6 C-23.4 -59.6 -21.6 -61 -21 -58.6", wat: ROO_WAT, beak: ROO_BEAK, beakLine: "M-29.4 -46.4 L-36.4 -46.1", eye: [-21, -49] };

  function hen(x, tag, mat, o) {
    o = o || {};
    return body(x, tag, HEN, x.c2, mat, Object.assign({ wing: HEN_WING, feath: HEN_FEATH, tail: HEN_TAIL, glow: [-6, 10, 34, 24], gk: .7 }, o)) + face(x, HEN_FACE, mat);
  }
  const at = (tx, ty, s, inner) => `<g transform="translate(${f(tx)} ${f(ty)}) scale(${s})">${inner}</g>`;

  
  function chick(x, tag, col, r, o) {
    o = o || {};
    const { url, on } = x, S = H.shade, dark = lum(col) < .3;
    const clip = x.id(tag + "c" + Math.round(r));
    let s = "";
    
    s += ST(`M${f(-r * .3)} ${f(r * .9)} l-1.2 ${f(r * .28)} M${f(-r * .3)} ${f(r * 1.18)} l-2.4 .8 M${f(-r * .3)} ${f(r * 1.18)} l1.6 .9`, "#d98a1c", Math.max(1, r * .1));
    s += ST(`M${f(r * .3)} ${f(r * .9)} l-1.2 ${f(r * .28)} M${f(r * .3)} ${f(r * 1.18)} l-2.4 .8 M${f(r * .3)} ${f(r * 1.18)} l1.6 .9`, "#d98a1c", Math.max(1, r * .1));
    
    s += PA(`M${f(-r * .16)} ${f(-r * .9)} C${f(-r * .3)} ${f(-r * 1.12)} ${f(-r * .18)} ${f(-r * 1.26)} ${f(-r * .02)} ${f(-r * 1.2)} C${f(-r * .06)} ${f(-r * 1.32)} ${f(r * .16)} ${f(-r * 1.3)} ${f(r * .14)} ${f(-r * 1.16)} C${f(r * .26)} ${f(-r * 1.18)} ${f(r * .3)} ${f(-r * 1.02)} ${f(r * .18)} ${f(-r * .9)} Z`, S(col, dark ? .12 : -.08), `stroke="${dark ? "#000" : S(col, -.5)}" stroke-width=".6" stroke-opacity=".45"`);
    s += `<clipPath id="${clip}"><circle cx="0" cy="0" r="${r}"/></clipPath><circle cx="0" cy="0" r="${r}" fill="${url(tag + "b")}"/>`;
    s += `<g clip-path="url(#${clip})">`;
    if (x.speck) { const rr = rnd(77 + r); for (let i = 0; i < Math.round(r * 2.4); i++) s += `<circle cx="${f((rr() - .5) * 2 * r)}" cy="${f((rr() - .5) * 2 * r)}" r="${f(.4 + rr() * .8)}" fill="${rr() > .45 ? "#202124" : "#f4f2ee"}" fill-opacity=".6"/>`; }
    if (on) s += `<g class="${P}pulse">` + E(0, r * .2, r * .9, r * .8, url(tag + "g"), `opacity="${x.op(o.gk == null ? .55 : o.gk)}"`) + `</g>`;
    s += R(-r, -r, 2 * r, 2 * r, url(tag + "v"));
    
    const wing = `M${f(r * .05)} ${f(r * .05)} C${f(r * .4)} ${f(-r * .1)} ${f(r * .72)} ${f(r * .12)} ${f(r * .7)} ${f(r * .42)} C${f(r * .45)} ${f(r * .6)} ${f(r * .1)} ${f(r * .5)} ${f(r * .05)} ${f(r * .05)} Z`;
    s += PA(wing, "#000", `fill-opacity="${on ? .07 : .12}"`) + ST(wing, dark ? "#000" : S(col, -.55), .7, .4);
    s += E(-r * .38, -r * .4, r * .16, r * .32, "#fff", `fill-opacity="${on ? .2 : .38}" transform="rotate(38 ${f(-r * .38)} ${f(-r * .4)})"`);
    s += `</g>`;
    s += `<circle cx="0" cy="0" r="${r}" fill="none" stroke="${dark ? "#000" : S(col, -.55)}" stroke-width=".9" stroke-opacity=".5"/>`;
    if (on) s += `<circle cx="0" cy="0" r="${f(r - .4)}" fill="none" stroke="${x.hot}" stroke-width=".7" stroke-opacity="${x.op(.35)}"/>`;
    
    s += PA(`M${f(-r * .78)} ${f(-r * .3)} L${f(-r * 1.12)} ${f(-r * .14)} L${f(-r * .78)} ${f(r * .02)} Z`, url("beak"), 'stroke="#8a4e10" stroke-width=".4" stroke-opacity=".6"');
    s += `<circle cx="${f(-r * .42)}" cy="${f(-r * .34)}" r="${f(Math.max(1.2, r * .11))}" fill="#1a1410"/><circle cx="${f(-r * .46)}" cy="${f(-r * .39)}" r="${f(Math.max(.4, r * .04))}" fill="#fff"/>`;
    if (o.cheek) s += E(-r * .5, -r * .02, r * .13, r * .08, "#ff8a8a", 'fill-opacity=".45"');
    return s;
  }

  
  function base(x, kind, cx, y, w) {
    if (kind === "wood") {
      const h = 12;
      return { h, back: "", front: R(cx - w / 2, y + 3, w, h - 4, x.url("wood")) + E(cx, y + h - 1, w / 2, 3, x.url("wood")) + E(cx, y + 3, w / 2, 3.2, "#b98650") + E(cx, y + 3, w / 2 - 2, 2.2, "#c8955c") +
        `<path d="M${f(cx - w / 2 + 6)} ${f(y + 3)} q${f(w / 2 - 6)} 1.6 ${f(w - 12)} 0" stroke="#6e4a2a" stroke-opacity=".5" stroke-width=".6" fill="none"/>` + R(cx - w / 2, y + 4, w, .7, "#000", 'fill-opacity=".25"') };
    }
    if (kind === "metal") {
      const h = 11;
      return { h, back: "", front: `<path d="M${f(cx - w / 2)} ${f(y + h)} C${f(cx - w / 2 + 4)} ${f(y + 2)} ${f(cx + w / 2 - 4)} ${f(y + 2)} ${f(cx + w / 2)} ${f(y + h)} Z" fill="${x.url("brs")}"/>` +
        E(cx, y + h, w / 2, 2.6, x.url("brs")) + E(cx, y + 3.4, w / 2 - 9, 1.8, "#fbe7a6", 'fill-opacity=".5"') + E(cx - w * .18, y + 6.5, w * .1, 1.2, "#fff", 'fill-opacity=".45"') };
    }
    if (kind === "egg") {
      
      const h = 6, top = y - 14, r0 = w / 2;
      let zig = `M${f(cx - r0)} ${f(top + 4)}`;
      const n = 9;
      for (let i = 1; i <= n; i++) zig += ` L${f(cx - r0 + (2 * r0 * i) / n)} ${f(top + (i % 2 ? -2 : 4) + (i === n ? 4 : 0))}`;
      const d = zig + ` C${f(cx + r0 + 2)} ${f(y + 6)} ${f(cx + r0 * .5)} ${f(y + h + 1)} ${f(cx)} ${f(y + h + 1)} C${f(cx - r0 * .5)} ${f(y + h + 1)} ${f(cx - r0 - 2)} ${f(y + 6)} ${f(cx - r0)} ${f(top + 4)} Z`;
      return { h, back: "", front: PA(d, x.url("egg"), 'stroke="#8a7458" stroke-width=".7" stroke-opacity=".6"') + E(cx - r0 * .55, top + 9, 3, 6, "#fff", 'fill-opacity=".45" transform="rotate(-20 ' + f(cx - r0 * .55) + " " + f(top + 9) + ')"') + (x.on ? PA(d, x.hot, `opacity="${x.op(.15)}"`) : "") };
    }
    return { h: 0, back: "", front: "" };
  }
  const BASE = { id: "base", name: "Base", values: [["none", "None"], ["wood", "Wood"], ["egg", "Egg cup"], ["metal", "Metal"]] };

  function card(o) {
    const def = Object.assign({ picker: true, colorLabel: "Light", colors: WARM, picker2: true, colorLabel2: "Chicken", colors2: HENS, cast: "around", glow: { x: .5, y: .55, r: 1.1 } }, o);
    const draw = o.draw;
    def.render = function (oo) { return draw(ctx(oo, def), def); };
    delete def.draw;
    return def;
  }

  const icons = [
    
    card({ id: "ceramichen", name: "Ceramic hen", options: [BASE], draw(x) {
      const k = x.opt.base || "none";
      const yb = (k === "wood" || k === "metal") ? 166 - (k === "wood" ? 12 : 11) : 166;
      const s = 1.42;
      const defsX = skin(x, "h", x.c2, "ceramic");
      const bg = wallBg(x, 162, 3) + table(x, 162) + wallHalo(x, 100, 100, 92, 74);
      let fx = halo(x, 98, 108, 86, 70) + shadow(x, 100, 167, 62) + pool(x, 100, 168, 72);
      fx += at(98, yb - 31 * s, s, hen(x, "h", "ceramic", { glow: [-6, 12, 34, 22], gk: .8 }));
      fx += base(x, k, 100, yb, 116).front;
      return svg(x, { bg, fx, defs: defsX });
    } }),

    
    card({ id: "nightlight", name: "Hen night light", glow: { x: .5, y: .38, r: .9 }, draw(x) {
      const defsX = skin(x, "h", x.c2, "frost");
      const bg = wallBg(x, 192, 9) + wallHalo(x, 100, 70, 90, 70);
      let fx = halo(x, 100, 64, 76, 62, .6);
      
      fx += `<rect x="70" y="88" width="60" height="98" rx="5" fill="${x.url("plas")}" stroke="#7d7a86" stroke-width=".8"/>` + R(71, 89, 58, 1, "#fff", 'fill-opacity=".6"');
      fx += `<circle cx="100" cy="137" r="1.6" fill="#8d8a96"/><path d="M98.8 137 h2.4" stroke="#55525d" stroke-width=".6"/>`;
      fx += `<rect x="84" y="148" width="32" height="30" rx="10" fill="#ebe8ee" stroke="#a9a6b0" stroke-width=".8"/>` + R(91, 156, 3, 8, "#3a3840", 'rx="1"') + R(106, 156, 3, 8, "#3a3840", 'rx="1"') + `<path d="M98 168 a2 2.4 0 0 1 4 0 v3 h-4 Z" fill="#3a3840"/>`;
      if (x.on) fx += E(100, 140, 28, 46, x.url("halo"), `opacity="${x.op(.3)}"`);
      
      fx += shadow(x, 100, 131, 22) + `<rect x="78" y="96" width="44" height="34" rx="7" fill="${x.url("plas")}" stroke="#8d8a96" stroke-width=".8"/>` + R(82, 98, 36, 1.2, "#fff", 'fill-opacity=".7"');
      fx += `<circle cx="100" cy="122" r="3" fill="#3a3840"/><circle cx="100" cy="122" r="1.6" fill="${x.on ? x.hot : "#6a6874"}"/>`;
      fx += R(90, 105, 20, 2, "#000", 'fill-opacity=".12" rx="1"');
      
      const s = 1.02;
      fx += at(100, 99 - 31 * s, s, hen(x, "h", "frost", { glow: [0, -6, 46, 40], gk: .55, hx: -24, hy: -12 }));
      fx += R(80, 95, 40, 4, "#c9c6cf", 'rx="1.5"') + R(80, 95, 40, 1, "#fff", 'fill-opacity=".7"');
      return svg(x, { bg, fx, defs: defsX });
    } }),

    
    card({ id: "rooster", name: "Rooster lamp", options: [BASE], glow: { x: .5, y: .5, r: 1.1 }, draw(x) {
      const S = H.shade, col = x.c2, dark = lum(col) < .3;
      const k = x.opt.base || "none";
      const yb = (k === "wood" || k === "metal") ? 170 - (k === "wood" ? 12 : 11) : 170;
      const s = 1.16;
      const defsX = skin(x, "r", col, "ceramic") + lg(x.id("sick"), [[0, S(col, dark ? .2 : -.35)], [1, S(col, dark ? -.2 : -.6)]], 0, 0, 1, 1);
      const bg = wallBg(x, 166, 11) + table(x, 166) + wallHalo(x, 100, 92, 90, 78);
      let fx = halo(x, 100, 98, 82, 78) + shadow(x, 100, 171, 52) + pool(x, 100, 172, 64);
      let r = "";
      
      const sk = [["M12 -20 C18 -52 50 -70 64 -46 C60 -54 44 -60 30 -46", 0], ["M16 -16 C26 -44 54 -56 62 -30 C56 -40 42 -44 32 -32", 1], ["M20 -10 C32 -32 56 -38 58 -16 C52 -26 42 -28 34 -18", 2]];
      for (const [d] of sk) r += PA(d + " Z", x.url("sick"), `stroke="${dark ? "#000" : S(col, -.7)}" stroke-width=".7" stroke-opacity=".6"`) + ST(d.split(" C")[0] + " C" + d.split(" C")[1], "#fff", .8, x.on ? .25 : .18);
      if (x.on) r += `<g class="${P}pulse">` + ST(sk[0][0].split(" C").slice(0, 2).join(" C"), x.hot, 2.4, x.op(.35)) + `</g>`;
      
      r += ST("M-6 18 L-8 34 M-8 34 l-6 3 M-8 34 l1 4 M-8 34 l5 2.4 M6 18 L7 34 M7 34 l-6 3 M7 34 l1 4 M7 34 l5 2.4", x.url("leg"), 2.4) + ST("M-6 18 L-8 34 M6 18 L7 34", "#fff", .6, .35);
      r += body(x, "r", ROO, col, "ceramic", { wing: ROO_WING, feath: ["M-6 6 C2 8 12 7 20 2", "M-8 0 C0 2 12 1 22 -4"], tail: ["M16 -18 C22 -28 30 -38 38 -44", "M24 -10 C30 -20 38 -30 46 -34"], glow: [0, -8, 42, 34], gk: .7, hx: -22, hy: -22 });
      
      for (let i = 0; i < 6; i++) r += ST(`M${f(-26 + i * 3)} ${f(-36 + i * .8)} q${f(2 + i * .4)} 8 ${f(4 + i * .6)} 14`, dark ? "#fff" : S(col, -.55), .7, dark ? .14 : .26);
      r += face(x, ROO_FACE, "ceramic");
      fx += at(100, yb - 38 * s, s, r);
      fx += base(x, k, 100, yb, 92).front;
      return svg(x, { bg, fx, defs: defsX });
    } }),

    
    card({ id: "chickglobe", name: "Chick globe", options: [BASE], colors2: [CHICK.yellow, CHICK.white, CHICK.buff, CHICK.pink, CHICK.blue, CHICK.mint, CHICK.speck, CHICK.black], glow: { x: .5, y: .52, r: 1.1 }, draw(x) {
      const k = x.opt.base || "none";
      const yb = (k === "wood" || k === "metal") ? 170 - (k === "wood" ? 12 : 11) : 170;
      const r = 50;
      const defsX = skin(x, "k", x.c2, "ceramic");
      const bg = wallBg(x, 166, 13) + table(x, 166) + wallHalo(x, 100, 104, 90, 80);
      let fx = halo(x, 100, 108, 84, 80) + shadow(x, 100, 171, 46) + pool(x, 100, 172, 64);
      fx += at(100, yb - r * 1.22, 1, chick(x, "k", x.c2, r, { gk: .7, cheek: true }));
      fx += base(x, k, 100, yb, 88).front;
      return svg(x, { bg, fx, defs: defsX });
    } }),

    
    card({ id: "mamahen", name: "Hen & chicks", glow: { x: .5, y: .55, r: 1.2 }, draw(x) {
      const S = H.shade, M = H.mix;
      const cc = M(x.c2, "#f6dc7a", lum(x.c2) > .7 ? .55 : .25);    
      const defsX = skin(x, "h", x.c2, "ceramic") + (() => { const y = Object.assign({}, x, { c2: cc }); return skin(y, "k", cc, "ceramic"); })();
      const bg = wallBg(x, 162, 17) + table(x, 162) + wallHalo(x, 104, 104, 94, 74);
      let fx = halo(x, 108, 104, 88, 68) + shadow(x, 110, 167, 56) + shadow(x, 52, 168, 18) + shadow(x, 74, 170, 15) + pool(x, 96, 168, 80);
      const s = 1.2;
      fx += at(114, 166 - 31 * s, s, hen(x, "h", "ceramic", { glow: [-6, 10, 36, 26], gk: .75 }));
      const xk = Object.assign({}, x, { speck: false });
      fx += at(52, 166 - 17 * 1.2, 1, chick(xk, "k", cc, 14.5, { gk: .6 }));
      fx += at(76, 168 - 12 * 1.2, 1, chick(xk, "k", cc, 12, { gk: .6 }));
      return svg(x, { bg, fx, defs: defsX });
    } }),

    
    card({ id: "chickenbulb", name: "Chicken bulb", glow: { x: .5, y: .44, r: 1 }, draw(x) {
      const col = x.c2, s = 1.2;
      const defsX = skin(x, "g", col, "glass") + lg(x.id("fil"), [[0, x.hot], [1, x.c]], 0, 0, 0, 1);
      const bg = wallBg(x, 170, 21) + table(x, 170) + wallHalo(x, 100, 86, 90, 76);
      let fx = halo(x, 100, 86, 88, 76, .7) + shadow(x, 100, 172, 30) + pool(x, 100, 173, 56, .4);
      
      fx += `<path d="M76 172 h48 l-4 -10 h-40 Z" fill="${x.url("wood")}"/>` + R(80, 161, 40, 1, "#fff", 'fill-opacity=".18"');
      fx += R(88, 140, 24, 22, x.url("blk"), 'rx="2"') + R(86, 137, 28, 5, x.url("blk"), 'rx="1.5"') + ST("M88 150 h24 M88 155 h24", "#000", .7, .5);
      
      let sc = R(90, 124, 20, 14, x.url("brs"));
      for (let i = 0; i < 5; i++) sc += `<path d="M90 ${f(125 + i * 2.8)} l20 1.4" stroke="#5a3c10" stroke-width=".8" stroke-opacity=".6"/>`;
      fx += sc + `<path d="M91 124 h18 l-2 -4 h-14 Z" fill="${x.url("brs")}"/>`;
      
      const ty = 121 - 31 * s;
      let g = "";
      const fil = "M-6 30 L-6 2 M6 30 L6 2 M-6 2 C-6 -6 -14 -8 -14 -16 C-14 -24 -4 -24 0 -16 C4 -24 14 -24 14 -16 C14 -8 6 -6 6 2";
      g += ST("M-3 31 L-3 8 M3 31 L3 8 M-3 8 L3 8", "#c9c6c0", 1.6, .7);          
      g += ST(fil, x.on ? x.url("fil") : "#6a5a44", x.on ? 1.3 : 1, x.on ? 1 : .8);
      if (x.on) g += `<g class="${P}pulse">` + ST(fil, x.hot, 4, x.op(.35)) + E(0, -12, 22, 18, x.url("gg"), `opacity="${x.op(.55)}"`) + `</g>`;
      g += body(x, "g", HEN, col, "glass", { wing: null, tail: [], glow: [0, -4, 44, 36], gk: .5 });
      g += face(x, HEN_FACE, "ceramic");
      fx += at(100, ty, s, g);
      return svg(x, { bg, fx, defs: defsX });
    } }),

    
    card({ id: "neonchicken", name: "Neon chicken", colors2: ["#fff4e0", "#ffd36a", "#ff8a3c", "#ff5ca8", "#5ce0ff", "#8dff7a", "#b98cff", CHICK.white], glow: { x: .5, y: .5, r: 1.2 }, draw(x) {
      const M = H.mix, S = H.shade, on = x.on;
      const tube = M(S(x.c2, lum(x.c2) < .3 ? .35 : 0), x.c, on ? .25 : 0);
      const bg = wallBg(x, 192, 23) + (on ? E(100, 98, 88, 78, x.url("halo"), `opacity="${x.op(.3)}"`) : "");
      let fx = "";
      
      fx += `<rect x="22" y="28" width="156" height="144" rx="10" fill="#fff" fill-opacity=".05" stroke="#fff" stroke-opacity=".22" stroke-width=".8"/>` + R(24, 30, 152, 1, "#fff", 'fill-opacity=".2"');
      for (const [sx, sy] of [[32, 38], [168, 38], [32, 162], [168, 162]]) fx += `<circle cx="${sx}" cy="${sy}" r="3.2" fill="${x.url("chr")}"/><circle cx="${sx - .8}" cy="${sy - .8}" r="1" fill="#fff" fill-opacity=".7"/>`;
      const s = 1.42, tx = 104, ty = 104;
      const tubeGroup = (d, colr, w) => {
        let t = "";
        if (on) t += ST(d, colr, w * 4.2, x.op(.22)) + ST(d, colr, w * 2.2, x.op(.5));
        t += ST(d, on ? M(colr, "#ffffff", .1 + .5 * x.L) : S(colr, -.35), w, on ? 1 : .75);
        t += ST(d, "#fff", w * .35, on ? x.op(.7) : .28, 'transform="translate(-.3 -.3)"');
        return t;
      };
      const comb = M("#ff3a30", x.c, on ? .1 : 0), beak = M("#ffb52e", x.c, on ? .1 : 0);
      let n = "";
      n += tubeGroup(HEN, tube, 2.2);
      n += tubeGroup("M-13 -3 C-1 -12 19 -10 30 1 C26 12 12 18 -4 15", tube, 1.6);
      n += tubeGroup(HEN_TAIL[1], tube, 1.4);
      n += tubeGroup(HEN_COMB, comb, 1.6) + tubeGroup(HEN_BEAK, beak, 1.4) + tubeGroup(HEN_WAT, comb, 1.3);
      n += `<circle cx="-22" cy="-37" r="1.9" fill="${on ? M(tube, "#fff", .5) : S(tube, -.4)}"/>`;
      
      n += tubeGroup("M-8 31 l-3 7 M-11 38 l-4 1 M-11 38 l2 2", beak, 1.2) + tubeGroup("M8 31 l-2 7 M6 38 l-4 1 M6 38 l2 2", beak, 1.2);
      fx += `<g class="${on ? P + "flick" : ""}">` + at(tx, ty - 6, s, n) + `</g>`;
      
      fx += R(92, 166, 16, 8, x.url("blk"), 'rx="2"') + ST("M100 174 C100 182 112 184 118 192", "#18181e", 2.2);
      return svg(x, { bg, fx, defs: "" });
    } }),

    
    card({ id: "henonegg", name: "Hen on egg", glow: { x: .5, y: .62, r: 1.1 }, draw(x) {
      const defsX = skin(x, "h", x.c2, "ceramic");
      const bg = wallBg(x, 168, 31) + table(x, 168) + wallHalo(x, 100, 112, 92, 78);
      let fx = halo(x, 100, 120, 80, 72, .65) + shadow(x, 100, 172, 40) + pool(x, 100, 172, 70, .6);
      
      const ex = 100, ey = 128, erx = 35, ery = 42;
      fx += E(ex, ey, erx, ery, x.url("egg"));
      if (x.on) fx += `<g class="${P}pulse">` + E(ex, ey + 4, erx * .8, ery * .78, x.url("hg"), `opacity="${x.op(.6)}"`) + `</g>`;
      fx += E(ex - 16, ey - 14, 6, 13, "#fff", `fill-opacity="${x.on ? .25 : .45}" transform="rotate(24 ${ex - 16} ${ey - 14})"`);
      fx += E(ex, ey, erx, ery, "none", `stroke="${x.on ? x.hot : "#8a7458"}" stroke-width=".9" stroke-opacity="${x.on ? x.op(.6) : .6}"`);
      
      fx += `<path d="M76 168 C78 160 122 160 124 168 Z" fill="${x.url("brs")}"/>` + E(100, 168, 24, 2.6, x.url("brs"));
      
      const s = .8;
      const ty = ey - ery + 9 - 31 * s;
      fx += E(ex - 2, ey - ery + 9, 30, 6, x.url("sh"), 'opacity=".7"');
      fx += at(100, ty, s, hen(x, "h", "ceramic", { glow: [-6, 12, 34, 22], gk: .5 }));
      return svg(x, { bg, fx, defs: defsX });
    } }),
  ];

  
  const OUT = ["nightlight", "chickenbulb", "neonchicken", "henonegg"];
  for (let i = icons.length - 1; i >= 0; i--) if (OUT.includes(icons[i].id)) icons.splice(i, 1);
  (window.HDA = window.HDA || []).push({
    id: "chickenlamp",
    tab: "Chicken lamps",
    group: "Lights",
    kind: "light",
    intro: "Chicken lamps that light up from inside like a bulb. The first swatch row is the light, the second the chicken; some have a Base menu.",
    css: `.hda-anim .hda-chickenlamp-pulse{animation:hda-chickenlamp-pulse 4.5s ease-in-out infinite}
@keyframes hda-chickenlamp-pulse{0%,100%{opacity:1}50%{opacity:.82}}
.hda-anim .hda-chickenlamp-flick{animation:hda-chickenlamp-flick 9s linear infinite}
@keyframes hda-chickenlamp-flick{0%,91%,93%,95%,100%{opacity:1}92%{opacity:.72}94%{opacity:.86}}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-chickenlamp-pulse,.hda-anim .hda-chickenlamp-flick{animation:none}}`,
    icons,
  });
})();
