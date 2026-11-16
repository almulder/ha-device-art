(function () {
  const H = window.HDAH, P = "hda-switch-";
  const f = (n) => (+n).toFixed(1);
  const rnd = (seed) => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
  const stops = (a) => a.map(([o, c, op]) => `<stop offset="${o}" stop-color="${c}"${op == null ? "" : ` stop-opacity="${op}"`}/>`).join("");
  const lg = (id, a, x1, y1, x2, y2) => `<linearGradient id="${id}" x1="${x1 || 0}" y1="${y1 || 0}" x2="${x2 == null ? 1 : x2}" y2="${y2 || 0}">${stops(a)}</linearGradient>`;
  const rg = (id, a, cx, cy, r) => `<radialGradient id="${id}" cx="${cx == null ? .5 : cx}" cy="${cy == null ? .5 : cy}" r="${r || .5}">${stops(a)}</radialGradient>`;

  function ctx(o) {
    const c = o.color || "#f4f7ff", on = !!o.on, lv = o.level == null ? 1 : Math.max(0, Math.min(1, o.level));
    const id = (s) => `${o.uid}-${s}`, url = (s) => `url(#${o.uid}-${s})`;
    const x = { c, on, lv, id, url, hot: H.mix(c, "#ffffff", .55), defs: [], have: {} };
    x.add = (k, s) => { if (!x.have[k]) { x.have[k] = 1; x.defs.push(s); } };
    return x;
  }

  const FIN = {
    white: ["#ffffff", "#eeecf2", "#c9c5d1", "#8f8b9a"],
    ivory: ["#fffaee", "#efe5cf", "#cdbd9b", "#958563"],
    almond: ["#f7ead4", "#e0cfb1", "#b8a483", "#86745a"],
    black: ["#5d5d6a", "#2e2e37", "#18181d", "#060608"],
    steel: ["#f3f5f9", "#bcc1ca", "#7f8590", "#454a53"],
    brass: ["#fbe9ad", "#d3a757", "#94692b", "#4d3210"],
    alum: ["#c9ccd2", "#979ca5", "#676c75", "#383c43"],
    glass: ["#3c3e4a", "#17181e", "#0b0b10", "#000000"],
  };
  const isDark = (fin) => { const v = H.hx(FIN[fin][1]); return v[0] * .3 + v[1] * .59 + v[2] * .11 < 90; };
  function need(x, fin) {
    x.add("fin-" + fin, (() => { const [l, m, d, k] = FIN[fin];
      return lg(x.id("pb-" + fin), [[0, l], [.45, m], [1, d]], 0, 0, 1, 1) +
        lg(x.id("pf-" + fin), [[0, l], [.6, m], [1, H.mix(m, d, .55)]], 0, 0, .25, 1) +
        lg(x.id("ph-" + fin), [[0, d], [.2, m], [.42, l], [.7, m], [1, H.mix(d, k, .4)]]) +
        rg(x.id("sc-" + fin), [[0, l], [.6, m], [1, d]], .36, .3, .7); })());
  }

  const WALL = {
    plaster: ["#57525f", "#3c3845"], greige: ["#5c564e", "#403b35"], sage: ["#48544c", "#313a34"], clay: ["#62493f", "#45332c"],
    green: ["#304b41", "#20342d"], navy: ["#303a53", "#1f2739"], slate: ["#434c59", "#2d343e"], blush: ["#5c4954", "#41333c"],
    dark: ["#2f2e39", "#1d1c25"], stucco: ["#605a50", "#46413a"], concrete: ["#5a5d61", "#3f4246"], tile: ["#5d6470", "#454b55"],
    mint: ["#3f5a55", "#2b403c"], denim: ["#344459", "#232f3f"], wood: ["#544a5c", "#3a3242"], brick: ["#64402f", "#452a20"],
    linen: ["#6a6359", "#4d473f"], plum: ["#4d3a50", "#342737"], stripe: ["#3c4a44", "#2a3530"], sand: ["#655b4c", "#494134"],
  };
  function texture(kind) {
    const r = rnd(kind.length * 977 + kind.charCodeAt(0) * 13 + kind.charCodeAt(1)); let s = "";
    if (kind === "brick") {
      for (let row = 0, y = 8; y < 192; y += 12, row++) {
        for (let bx = 8 - (row % 2) * 13; bx < 192; bx += 26) { const v = r();
          s += `<rect x="${f(bx + .8)}" y="${f(y + .8)}" width="24.4" height="10.4" rx="1.2" fill="${v > .5 ? "#000" : "#e09a7c"}" fill-opacity="${(.04 + v * .09).toFixed(2)}"/><path d="M${bx} ${y} v12" stroke="#c9b8a8" stroke-opacity=".16" stroke-width="1.6"/>`; }
        s += `<path d="M8 ${y} H192" stroke="#c9b8a8" stroke-opacity=".18" stroke-width="1.6"/><path d="M8 ${y + 1.4} H192" stroke="#000" stroke-opacity=".2" stroke-width=".8"/>`;
      }
    } else if (kind === "tile") {
      for (let row = 0, y = 8; y < 192; y += 15, row++) {
        for (let bx = 8 - (row % 2) * 22; bx < 192; bx += 44) { const v = r();
          s += `<rect x="${bx + 1}" y="${y + 1}" width="42" height="13" rx="2.2" fill="#fff" fill-opacity="${(.04 + v * .05).toFixed(2)}"/><path d="M${bx + 4} ${y + 3.4} H${bx + 22}" stroke="#fff" stroke-opacity=".16" stroke-width="1.2" stroke-linecap="round"/><path d="M${bx + 2} ${y + 13.6} H${bx + 42}" stroke="#000" stroke-opacity=".22" stroke-width="1"/>`; }
        s += `<path d="M8 ${y} H192" stroke="#d6d2dc" stroke-opacity=".2" stroke-width="1.2"/>`;
      }
    } else if (kind === "wood") {
      for (let bx = 8; bx < 192; bx += 16) { const v = r();
        s += `<rect x="${bx}" y="8" width="16" height="184" fill="${v > .5 ? "#fff" : "#000"}" fill-opacity="${(.02 + v * .04).toFixed(2)}"/><path d="M${bx + .8} 8 V192" stroke="#000" stroke-opacity=".38" stroke-width="1.4"/><path d="M${bx + 2.2} 8 V192" stroke="#fff" stroke-opacity=".09" stroke-width="1"/>`; }
    } else if (kind === "stripe") {
      for (let bx = 8; bx < 192; bx += 20) s += `<rect x="${bx}" y="8" width="10" height="184" fill="#d9e8d4" fill-opacity=".06"/><path d="M${bx + 10} 8 V192" stroke="#e8d9a8" stroke-opacity=".12" stroke-width=".8"/>`;
    } else if (kind === "concrete") {
      s += `<path d="M8 150 H192" stroke="#000" stroke-opacity=".28" stroke-width="1"/><path d="M8 151 H192" stroke="#fff" stroke-opacity=".06" stroke-width=".8"/>`;
      [[28, 30], [172, 30], [28, 172], [172, 172]].forEach(([cx, cy]) => { s += `<circle cx="${cx}" cy="${cy}" r="3.2" fill="#1f2124" fill-opacity=".55"/><circle cx="${cx - .6}" cy="${cy - .6}" r="2.2" fill="#000" fill-opacity=".4"/>`; });
      for (let i = 0; i < 80; i++) s += `<circle cx="${f(10 + r() * 180)}" cy="${f(10 + r() * 180)}" r="${f(.3 + r() * .9)}" fill="${r() > .5 ? "#000" : "#fff"}" fill-opacity="${(.06 + r() * .12).toFixed(2)}"/>`;
    } else {
      const n = kind === "stucco" ? 130 : 46, big = kind === "stucco" ? 1.1 : .6;
      for (let i = 0; i < n; i++) s += `<circle cx="${f(10 + r() * 180)}" cy="${f(10 + r() * 180)}" r="${f(.3 + r() * big)}" fill="${r() > .5 ? "#000" : "#fff"}" fill-opacity="${(.04 + r() * .08).toFixed(2)}"/>`;
    }
    return s;
  }

  let GM = null, AUX = false;
  function scene(x, kind, body, sc) {
    sc = sc || 1.24;
    const w = WALL[kind] || WALL.plaster, c = x.c;
    if (GM) { GM.kind = kind; GM.sc = sc; GM.defs = sceneDefs(x); GM.body = body; return ""; }
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><defs>
${lg(x.id("wallg"), [[0, w[0]], [1, w[1]]], 0, 0, 0, 1)}
<clipPath id="${x.id("wc")}"><rect x="8" y="8" width="184" height="184" rx="16"/></clipPath>
${rg(x.id("vig"), [[0, "#000", 0], [.6, "#000", .06], [1, "#000", .5]], .5, .46, .76)}
${rg(x.id("halo"), [[0, c, .9], [.35, c, .34], [1, c, 0]])}
${rg(x.id("lens"), [[0, "#ffffff"], [.38, x.hot], [1, c]], .42, .36, .66)}
${rg(x.id("glos"), [[0, "#fff", .6], [.5, "#fff", .1], [1, "#fff", 0]], .3, .22, .85)}
<filter id="${x.id("bl")}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.2"/></filter>
${x.defs.join("")}</defs>
<g class="hda-bg"><rect x="8" y="8" width="184" height="184" rx="16" fill="${x.url("wallg")}"/>
<g clip-path="${x.url("wc")}">${texture(kind)}<rect x="8" y="8" width="184" height="184" fill="${x.url("vig")}"/></g>
<rect x="8.5" y="8.5" width="183" height="183" rx="15.5" fill="none" stroke="#fff" stroke-opacity=".07"/></g>
<g clip-path="${x.url("wc")}"><g transform="translate(100 100) scale(${sc}) translate(-100 -100)">${body}</g></g></svg>`;
  }

  function sceneDefs(x) {
    const c = x.c;
    return `${rg(x.id("halo"), [[0, c, .9], [.35, c, .34], [1, c, 0]])}
${rg(x.id("lens"), [[0, "#ffffff"], [.38, x.hot], [1, c]], .42, .36, .66)}
${rg(x.id("glos"), [[0, "#fff", .6], [.5, "#fff", .1], [1, "#fff", 0]], .3, .22, .85)}
<filter id="${x.id("bl")}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.2"/></filter>${x.defs.join("")}`;
  }

  const hl = (d, a, w) => `<path d="${d}" fill="none" stroke="#fff" stroke-opacity="${a}" stroke-width="${w}" stroke-linecap="round"/>`;
  const drop = (x, shape, dx, dy, a) => `<g transform="translate(${dx == null ? 3 : dx} ${dy == null ? 5 : dy})" fill="#000" opacity="${a || .5}" filter="${x.url("bl")}">${shape}</g>`;
  const rr = (X, Y, W, Hh, r) => `<rect x="${f(X)}" y="${f(Y)}" width="${f(W)}" height="${f(Hh)}" rx="${r}"/>`;

  function plate(x, X, Y, W, Hh, fin, o2) {
    if (GM && !GM.plate) { GM.plate = [X, Y, W, Hh, fin, o2 || {}]; return ""; }
    o2 = o2 || {}; need(x, fin); const [l, m, d, k] = FIN[fin], r = o2.r == null ? 3.5 : o2.r, b = o2.b == null ? 3.2 : o2.b, dk = isDark(fin);
    let s = drop(x, rr(X, Y, W, Hh, r + 1), 3, 5.5, .55) +
      `<rect x="${X - .6}" y="${Y - .6}" width="${W + 1.2}" height="${Hh + 1.2}" rx="${r + .5}" fill="#000" opacity=".35"/>
<rect x="${X}" y="${Y}" width="${W}" height="${Hh}" rx="${r}" fill="${x.url("pb-" + fin)}"/>
<rect x="${X + b}" y="${Y + b}" width="${W - 2 * b}" height="${Hh - 2 * b}" rx="${Math.max(r - 1, 1)}" fill="${x.url("pf-" + fin)}"/>`;
    if (o2.brush) { const R = rnd(W * 7 + Hh); for (let yy = Y + b + 1; yy < Y + Hh - b; yy += 1.6) s += `<path d="M${X + b} ${f(yy)} H${X + W - b}" stroke="${R() > .5 ? "#fff" : "#000"}" stroke-opacity="${(.03 + R() * .06).toFixed(2)}" stroke-width=".6"/>`; }
    if (o2.seam) s += `<rect x="${X + b + 1.4}" y="${Y + b + 1.4}" width="${W - 2 * b - 2.8}" height="${Hh - 2 * b - 2.8}" rx="${Math.max(r - 1.5, 1)}" fill="none" stroke="${d}" stroke-opacity=".45" stroke-width=".6"/>`;
    s += `<path d="M${X + r} ${Y + .7} H${X + W - r}" stroke="#fff" stroke-opacity="${dk ? .22 : .75}" stroke-width="1"/>
<path d="M${X + .7} ${Y + r} V${Y + Hh - r}" stroke="#fff" stroke-opacity="${dk ? .12 : .45}" stroke-width=".8"/>
<path d="M${X + r} ${Y + Hh - .6} H${X + W - r} M${X + W - .6} ${Y + r} V${Y + Hh - r}" stroke="${k}" stroke-opacity=".55" stroke-width=".9"/>`;
    if (o2.gloss) s += `<path d="M${X + b} ${Y + b} H${X + W * .62} L${X + W * .25} ${Y + Hh - b} H${X + b} Z" fill="#fff" opacity="${dk ? .06 : .18}"/>`;
    (o2.screws || []).forEach(([cx, cy], i) => { s += screw(x, cx, cy, o2.screwFin || fin, 30 + i * 55); });
    return s;
  }
  function screw(x, cx, cy, fin, a) {
    need(x, fin); const k = FIN[fin][3];
    return `<circle cx="${cx}" cy="${cy}" r="3.2" fill="#000" opacity=".28"/><circle cx="${cx}" cy="${cy}" r="2.7" fill="${x.url("sc-" + fin)}"/>
<path d="M-1.9 0 H1.9" transform="translate(${cx} ${cy}) rotate(${a})" stroke="${k}" stroke-width="1" stroke-linecap="round"/><path d="M${cx - 1.6} ${cy - 1.4} A2.2 2.2 0 0 1 ${cx + .8} ${cy - 2}" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width=".5"/>`;
  }
  const gap = (X, Y, W, Hh, r) => `<rect x="${f(X - 1.6)}" y="${f(Y - 1.6)}" width="${f(W + 3.2)}" height="${f(Hh + 3.2)}" rx="${(r || 2) + 1.2}" fill="#000" opacity=".3"/><rect x="${f(X - .8)}" y="${f(Y - .8)}" width="${f(W + 1.6)}" height="${f(Hh + 1.6)}" rx="${(r || 2) + .6}" fill="#000" opacity=".25"/><path d="M${f(X - 1)} ${f(Y - .9)} H${f(X + W + 1)}" stroke="#000" stroke-opacity=".3" stroke-width="1"/>`;
  function frame(x, X, Y, W, Hh, fin) {
    need(x, fin);
    return gap(X, Y, W, Hh, 2) + `<rect x="${X}" y="${Y}" width="${W}" height="${Hh}" rx="2" fill="${x.url("pf-" + fin)}"/><rect x="${X}" y="${Y}" width="${W}" height="${Hh}" rx="2" fill="#000" opacity=".08"/>`;
  }

  function rocker(x, cx, cy, w, h, fin, up) {
    if (AUX) return paddle(x, cx - w / 2, cy - h / 2, w, h, fin, 2.4); 
    need(x, fin); const [l, m, d, k] = FIN[fin], X = cx - w / 2, Y = cy - h / 2, gid = `rk-${fin}-${up ? 1 : 0}`, dk = isDark(fin);
    x.add(gid, lg(x.id(gid), up
      ? [[0, H.mix(m, d, .25)], [.05, l], [.46, H.mix(l, m, .45)], [.5, H.mix(m, d, .7)], [.535, H.mix(m, d, .2)], [.93, H.mix(m, d, .6)], [1, H.mix(d, k, .5)]]
      : [[0, H.mix(d, k, .4)], [.06, H.mix(m, d, .6)], [.46, H.mix(m, d, .15)], [.5, l], [.54, H.mix(l, m, .25)], [.94, l], [1, H.mix(m, d, .4)]], 0, 0, 0, 1));
    return `${gap(X, Y, w, h, 2.2)}<rect x="${f(X + 1)}" y="${f(up ? Y + h - 1.5 : Y - 1)}" width="${f(w - 2)}" height="4" rx="2" fill="#000" opacity=".4" filter="${x.url("bl")}"/>
<rect x="${f(X)}" y="${f(Y)}" width="${w}" height="${h}" rx="2.4" fill="${x.url(gid)}"/>
<path d="M${f(X + 1)} ${f(cy)} H${f(X + w - 1)}" stroke="${up ? "#000" : "#fff"}" stroke-opacity="${up ? .14 : (dk ? .25 : .7)}" stroke-width=".8"/>
${hl(`M${f(X + 1.5)} ${f(Y + 3)} V${f(Y + h - 3)}`, dk ? .14 : .45, 1)}
<rect x="${f(X + .3)}" y="${f(Y + .3)}" width="${f(w - .6)}" height="${f(h - .6)}" rx="2.2" fill="none" stroke="${k}" stroke-opacity=".35" stroke-width=".6"/>`;
  }
  function paddle(x, X, Y, w, h, fin, r) {
    need(x, fin); const [l, m, d, k] = FIN[fin], dk = isDark(fin), gid = "pd-" + fin;
    x.add(gid, lg(x.id(gid), [[0, l], [.5, H.mix(l, m, .6)], [1, H.mix(m, d, .55)]], 0, 0, .15, 1));
    r = r == null ? 3 : r;
    return `${gap(X, Y, w, h, r)}<rect x="${f(X + 1)}" y="${f(Y + h - 1.6)}" width="${f(w - 2)}" height="4" rx="2" fill="#000" opacity=".35" filter="${x.url("bl")}"/>
<rect x="${f(X)}" y="${f(Y)}" width="${w}" height="${h}" rx="${r}" fill="${x.url(gid)}"/>
<path d="M${f(X + 2)} ${f(Y + .8)} H${f(X + w - 2)}" stroke="#fff" stroke-opacity="${dk ? .3 : .9}" stroke-width=".9"/>
${hl(`M${f(X + 1.6)} ${f(Y + 4)} V${f(Y + h - 4)}`, dk ? .12 : .4, 1)}
<rect x="${f(X + .3)}" y="${f(Y + .3)}" width="${f(w - .6)}" height="${f(h - .6)}" rx="${r}" fill="none" stroke="${k}" stroke-opacity=".3" stroke-width=".6"/>`;
  }

  function led(x, cx, cy, r, o2) {
    o2 = o2 || {};
    if (x.on && !o2.off) {
      const k = o2.k == null ? 1 : o2.k, dl = o2.delay || 0;
      const core = `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r * 1.25)}" fill="${H.shade(x.c, -.55)}" opacity=".35"/><circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="${x.url("lens")}" opacity="${k}"/><circle cx="${f(cx - r * .3)}" cy="${f(cy - r * .32)}" r="${f(r * .38)}" fill="#fff" opacity=".85"/>`;
      const hal = `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r * (o2.hr || 4.2))}" fill="${x.url("halo")}" opacity="${(.8 * k).toFixed(2)}"/>`;
      return `<g class="${P}in" style="animation-delay:${dl}s">${o2.blink ? `<g class="${P}blink">${hal}${core}</g>` : `<g class="${P}pulse">${hal}</g>${core}`}</g>`;
    }
    if (o2.locator) return `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r * 1.1)}" fill="#000" opacity=".3"/><circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r * .7)}" fill="${x.c}" opacity=".45"/><circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r * 2.2)}" fill="${x.url("halo")}" opacity=".18"/>`;
    return `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="#000" opacity=".3"/><circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r * .8)}" fill="${H.mix(x.c, "#4a4a55", .7)}" opacity=".55"/><circle cx="${f(cx - r * .3)}" cy="${f(cy - r * .3)}" r="${f(r * .3)}" fill="#fff" opacity=".3"/>`;
  }
  function dots(x, x0, y0, x1, y1, n, lit, r) {
    let s = "";
    if (AUX) return led(x, x0, y0, r, { locator: 1, hr: 3.2 }); 
    for (let i = 0; i < n; i++) { const t = n === 1 ? 0 : i / (n - 1), cx = x0 + (x1 - x0) * t, cy = y0 + (y1 - y0) * t;
      if (x.on && i < lit) s += led(x, cx, cy, r, { hr: 3.2, k: .9, delay: i * .07 });
      else if (!x.on && i === 0) s += led(x, cx, cy, r, { off: 1, locator: 1 });
      else s += `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="#000" opacity=".22"/><circle cx="${f(cx)}" cy="${f(cy + .3)}" r="${f(r * .75)}" fill="#fff" opacity=".1"/>`; }
    return s;
  }
  const litN = (x, n) => x.on ? Math.max(1, Math.round(x.lv * n)) : 0;

  const pon = (o, k) => (o.parts && o.parts[k] != null ? !!o.parts[k] : !o.mf && !!o.on);
  const plv = (o, k, d) => (o.plevel && o.plevel[k] != null ? Math.max(0, Math.min(1, +o.plevel[k] || 0)) : d);
  const sx = (x, on, lv) => Object.assign({}, x, { on, lv: lv == null ? x.lv : lv });
  const SP = (a, b) => [{ id: a[0], name: a[1], type: "switch" }, { id: b[0], name: b[1], type: "switch" }];
  function bulb(x, on) {
    const d = "M100 78.4c-2 0-3.5 1.5-3.5 3.4 0 1.3.7 2.1 1.3 2.8.4.4.6.8.6 1.4h3.2c0-.6.2-1 .6-1.4.6-.7 1.3-1.5 1.3-2.8 0-1.9-1.5-3.4-3.5-3.4z";
    return (on ? `<g class="${P}in"><g class="${P}pulse"><circle cx="100" cy="82" r="9" fill="${x.url("halo")}" opacity=".7"/></g><path d="${d}" fill="${x.url("lens")}"/></g>`
      : `<path d="${d}" fill="none" stroke="#000" stroke-opacity=".3" stroke-width=".9"/>`) +
      `<path d="M98.5 86.9H101.5M98.8 88.2H101.2" stroke="#000" stroke-opacity="${on ? .45 : .3}" stroke-width=".8" stroke-linecap="round"/>`;
  }

  const engr = (X, Y, w, dk) => `<path d="M${f(X)} ${f(Y)} H${f(X + w)}" stroke="${dk ? "#fff" : "#000"}" stroke-opacity="${dk ? .5 : .28}" stroke-width="1.3" stroke-linecap="round"/><path d="M${f(X)} ${f(Y + .9)} H${f(X + w)}" stroke="#fff" stroke-opacity="${dk ? .05 : .55}" stroke-width=".6" stroke-linecap="round"/>`;
  const chev = (cx, cy, s, upward, dk) => { const d = upward ? `M${f(cx - s)} ${f(cy + s * .5)} L${f(cx)} ${f(cy - s * .5)} L${f(cx + s)} ${f(cy + s * .5)}` : `M${f(cx - s)} ${f(cy - s * .5)} L${f(cx)} ${f(cy + s * .5)} L${f(cx + s)} ${f(cy - s * .5)}`;
    return `<path d="${d}" fill="none" stroke="${dk ? "#fff" : "#000"}" stroke-opacity="${dk ? .45 : .3}" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>`; };

  function lever(x, cx, cy, len, fin, up, o2) {
    o2 = o2 || {}; need(x, fin); const dir = up ? -1 : 1, Y = (v) => f(cy + dir * v), w0 = o2.w0 || 3.8, w1 = o2.w1 || 5.6;
    const d = `M${f(cx - w0)} ${Y(-1)} L${f(cx - w1 + .4)} ${Y(len - 3)} C${f(cx - w1)} ${Y(len + 2.4)} ${f(cx + w1)} ${Y(len + 2.4)} ${f(cx + w1 - .4)} ${Y(len - 3)} L${f(cx + w0)} ${Y(-1)} Z`;
    let s = drop(x, `<path d="${d}"/>`, 3.5, up ? 7 : 4, .5) + `<path d="${d}" fill="${x.url("ph-" + fin)}"/>`;
    s += `<path d="M${f(cx - w0 + 1.4)} ${Y(1)} L${f(cx - w1 + 2)} ${Y(len - 3)}" stroke="#fff" stroke-opacity=".55" stroke-width="1" stroke-linecap="round"/>`;
    const ty = cy + dir * (len - .4);
    if (o2.tip) {
      s += `<ellipse cx="${cx}" cy="${f(ty)}" rx="${f(w1 - .6)}" ry="2.6" fill="${x.on ? x.url("lens") : H.mix(x.c, "#3a3440", .55)}" opacity="${x.on ? 1 : .8}"/>`;
      if (x.on) s += `<g class="${P}in"><g class="${P}pulse"><ellipse cx="${cx}" cy="${f(ty)}" rx="16" ry="12" fill="${x.url("halo")}" opacity=".75"/></g></g>`;
      s += `<ellipse cx="${f(cx - 1.4)}" cy="${f(ty - .8)}" rx="1.8" ry=".8" fill="#fff" opacity=".7"/>`;
    } else s += `<ellipse cx="${cx}" cy="${f(ty)}" rx="${f(w1 - .6)}" ry="2.4" fill="${x.url("sc-" + fin)}"/><ellipse cx="${f(cx - 1.4)}" cy="${f(ty - .8)}" rx="1.8" ry=".7" fill="#fff" opacity=".75"/>`;
    return s;
  }

  const SEG7 = { "0": "abcdef", "1": "bc", "2": "abged", "3": "abgcd", "4": "fgbc", "5": "afgcd", "6": "afgedc", "7": "abc", "8": "abcdefg", "9": "abcdfg", "-": "g", "O": "abcdef", "F": "aefg" };
  function seg7(ox, oy, w, h, ch, col, ghost) {
    const t = w * .22, on = SEG7[ch] || "", R = {
      a: [ox + t * .7, oy, w - t * 1.4, t], d: [ox + t * .7, oy + h - t, w - t * 1.4, t], g: [ox + t * .7, oy + h / 2 - t / 2, w - t * 1.4, t],
      b: [ox + w - t, oy + t * .6, t, h / 2 - t * .9], c: [ox + w - t, oy + h / 2 + t * .3, t, h / 2 - t * .9],
      f: [ox, oy + t * .6, t, h / 2 - t * .9], e: [ox, oy + h / 2 + t * .3, t, h / 2 - t * .9] };
    let s = "";
    Object.keys(R).forEach((k) => { const [a, b, c, d] = R[k], lit = on.indexOf(k) >= 0;
      if (lit || ghost) s += `<rect x="${f(a)}" y="${f(b)}" width="${f(c)}" height="${f(d)}" rx="${f(t / 2)}" fill="${lit ? col : "#fff"}" opacity="${lit ? 1 : ghost}"/>`; });
    return `<g transform="translate(${f(oy * .14)} 0) skewX(-8)">${s}</g>`;
  }

  function pearl(x, k, tint) {
    x.add("pearl-" + k, rg(x.id("pearl-" + k), [[0, "#ffffff"], [.25, H.mix(tint, "#ffe6f2", .5)], [.5, H.mix(tint, "#d8f4ff", .45)], [.72, H.mix(tint, "#fff3d6", .4)], [1, H.shade(tint, -.3)]], .38, .32, .75));
    return x.url("pearl-" + k);
  }

  function ino(x, fin, fx) {
    need(x, fin); const dk = isDark(fin), y0 = 131, y1 = 78, h = (y0 - y1) * (x.on ? Math.max(.08, x.lv) : 0), top = y0 - h;
    x.add("ib", lg(x.id("ib"), [[0, x.hot], [.5, x.c], [1, x.hot]]));
    let s = plate(x, 63, 40, 74, 120, fin, { r: 4, seam: 1, gloss: dk }) + frame(x, 82, 67, 36, 66, fin) + paddle(x, 82.6, 67.6, 26.8, 64.8, fin, 2.2) +
      `<path d="M83.6 100 H108.6" stroke="#000" stroke-opacity="${dk ? .3 : .08}" stroke-width=".7"/>` +
      `<rect x="111.4" y="68.6" width="5.6" height="6.6" rx="1.2" fill="#000" opacity=".35"/><rect x="111.8" y="68.8" width="4.8" height="5.8" rx="1" fill="${x.url("ph-" + fin)}"/>${hl("M112.4 69.4 H116", dk ? .3 : .9, .5)}` +
      `<rect x="112.6" y="${y1 - 1}" width="3.2" height="${y0 - y1 + 2}" rx="1.6" fill="#000" opacity="${dk ? .55 : .2}"/><rect x="113.1" y="${y1 - .5}" width="2.2" height="${y0 - y1 + 1}" rx="1.1" fill="#fff" opacity="${dk ? .06 : .35}"/>`;
    if (AUX) s += led(x, 114.2, y0 - 1.4, 1.3, { locator: 1, hr: 3.6 });
    else if (x.on) {
      s += `<g class="${P}in"><g class="${P}${fx === "pulse" ? "breathe" : "pulse"}"><rect x="104" y="${f(top - 6)}" width="20" height="${f(h + 12)}" rx="9" fill="${x.url("halo")}" opacity=".75"/>` +
        `<rect x="112.8" y="${f(top)}" width="2.8" height="${f(h)}" rx="1.4" fill="${x.url("ib")}"/></g><rect x="113.7" y="${f(top + .8)}" width="1" height="${f(Math.max(0, h - 1.6))}" rx=".5" fill="#fff" opacity=".8"/>`;
      if (fx === "chase") s += `<clipPath id="${x.id("ic")}"><rect x="110" y="${f(top)}" width="8" height="${f(h)}"/></clipPath><g clip-path="${x.url("ic")}"><rect class="${P}chase" x="111.6" y="${y0 - 3}" width="5.2" height="9" rx="2.6" fill="#fff" opacity="0"/></g>`;
      s += `</g>`;
    } else s += led(x, 114.2, y0 - 1.4, 1.2, { locator: 1 });
    return s;
  }

  const LED = ["#f4f7ff", "#4dabf7", "#51cf66", "#ffb340", "#ff6b6b", "#b197fc"];
  const led6 = (first) => { const i = LED.indexOf(first); return LED.slice(i).concat(LED.slice(0, i)); };
  const W_ = LED[0], BL = LED[1], GR = LED[2], AM = LED[3], RD = LED[4], PU = LED[5];
  const PLATE = ["#f3f2ee", "#e6d9c0", "#eee4c9", "#8f9296", "#26272a", "#a9aaa6"];
  const base = (o) => {
    const src = String(o._src || o.render); let main = "white", best = -1;
    Object.keys(FIN).forEach((k) => { const n = (src.match(new RegExp('"' + k + '"', "g")) || []).length; if (n > best) { best = n; main = k; } });
    const def = FIN[main][1], led = o.colors, orig = o.render;
    const cols = [def].concat(PLATE.filter((c) => c.toLowerCase() !== def.toLowerCase()));
    return Object.assign({ cast: "around" }, o, {
      colors: cols, picker: true, colorLabel: "Color", colors2: led, picker2: true, colorLabel2: o.colorLabel || "LED",
      render(oo) {
        const c = String(oo.color || def).toLowerCase(), o2 = Object.assign({}, oo, { color: oo.color2 || led[0] });
        if (c === def.toLowerCase()) return orig.call(this, o2);
        const pal = [H.shade(c, .42), c, H.shade(c, -.25), H.shade(c, -.6)], saved = {};
        Object.keys(FIN).forEach((k) => { if (k === "glass" && main !== "glass") return; saved[k] = FIN[k]; FIN[k] = pal; });
        try { return orig.call(this, o2); } finally { Object.assign(FIN, saved); }
      },
    });
  };

  const GANGS = { id: "gangs", name: "Gangs", values: [["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"]] };
  const ROLE = { id: "role", name: "Role", values: [["main", "Main"], ["aux", "Aux"]] };
  const CTRL = (first) => ({ id: "ctrl", name: "Control", values: [["paddle", first], ["rotary", "Rotary"], ["slide", "Slide"], ["touch", "Touch"]] });
  const ACT = { id: "act", name: "Action", values: [["idle", "Idle"], ["single", "Single"], ["double", "Double"], ["long", "Long press"]] };
  const GPARTS = [1, 2, 3, 4].map((i) => ({ id: "g" + i, name: "Gang " + i, when: { opt: "gangs", is: ["2", "3", "4"].filter((v) => +v >= i) } }));
  function gang(o, extra, bs) {
    const orig = o.render;
    return Object.assign({}, o, { _src: String(orig), options: [GANGS].concat(extra || []), parts: o.parts || GPARTS, render(oo) {
      const op = oo.opt || {}, n = Math.max(1, Math.min(4, +op.gangs || 1));
      AUX = op.role === "aux";
      try {
        if (n === 1) return orig.call(this, oo);
        const outs = [];
        for (let i = 0; i < n; i++) {
          const pv = oo.parts ? oo.parts["g" + (i + 1)] : null;
          GM = {};
          try { orig.call(this, Object.assign({}, oo, { on: pv == null ? !!oo.on : !!pv, uid: oo.uid + "g" + i })); outs.push(GM); } finally { GM = null; }
        }
        const [X, Y, W, Hh, fin, o2] = outs[0].plate, pitch = Math.round(W * .66), Wn = W + (n - 1) * pitch, cx = X + W / 2;
        const dx = (i) => (i - (n - 1) / 2) * pitch, xm = ctx(oo), screws = [];
        (o2.screws || []).forEach(([sx, sy]) => { for (let i = 0; i < n; i++) screws.push([sx + dx(i), sy]); });
        let body = plate(xm, cx - Wn / 2, Y, Wn, Hh, fin, Object.assign({}, o2, { screws }));
        const k = bs ? bs(op) : 1, sk = k === 1 ? "" : ` translate(100 100) scale(${k}) translate(-100 -100)`;
        outs.forEach((g, i) => { xm.defs.push(g.defs); body += `<g transform="translate(${f(dx(i))} 0)${sk}">${g.body}</g>`; });
        return scene(xm, outs[0].kind, body, Math.min(outs[0].sc, 170 / Wn));
      } finally { AUX = false; }
    } });
  }
  const optv = (o, k, d) => (o.opt && o.opt[k]) || d;

  function ctlRotary(x, fin) {
    need(x, fin); const [l, m, d, k] = FIN[fin], lit = AUX ? 0 : litN(x, 11), ang = -135 + 270 * x.lv;
    x.add("knb-" + fin, rg(x.id("knb-" + fin), [[0, H.mix(l, "#ffffff", .5)], [.55, l], [.85, m], [1, d]], .4, .34, .7) +
      lg(x.id("knbs-" + fin), [[0, d], [.3, m], [.55, l], [.8, m], [1, k]]));
    let s = "";
    for (let i = 0; i < 11; i++) { const a = (-135 + 27 * i) * Math.PI / 180, sn = Math.sin(a), cs = -Math.cos(a);
      const p1 = [100 + sn * 25, 100 + cs * 25], p2 = [100 + sn * 29, 100 + cs * 29];
      s += x.on && i < lit ? `<g class="${P}in" style="animation-delay:${(i * .05).toFixed(2)}s"><circle cx="${f((p1[0] + p2[0]) / 2)}" cy="${f((p1[1] + p2[1]) / 2)}" r="5" fill="${x.url("halo")}" opacity=".7"/><path d="M${f(p1[0])} ${f(p1[1])} L${f(p2[0])} ${f(p2[1])}" stroke="${x.hot}" stroke-width="2.1" stroke-linecap="round"/></g>`
        : `<path d="M${f(p1[0])} ${f(p1[1])} L${f(p2[0])} ${f(p2[1])}" stroke="#000" stroke-opacity=".22" stroke-width="1.9" stroke-linecap="round"/><path d="M${f(p1[0] + .4)} ${f(p1[1] + .5)} L${f(p2[0] + .4)} ${f(p2[1] + .5)}" stroke="#fff" stroke-opacity="${isDark(fin) ? .12 : .5}" stroke-width=".7" stroke-linecap="round"/>`; }
    let knurl = ""; for (let i = 0; i < 36; i++) { const a = i * 10 * Math.PI / 180; knurl += `<path d="M${f(100 + Math.sin(a) * 15.6)} ${f(101.5 - Math.cos(a) * 15.6)} L${f(100 + Math.sin(a) * 17.6)} ${f(101.5 - Math.cos(a) * 17.6)}" stroke="#000" stroke-opacity=".16" stroke-width="1"/>`; }
    s += drop(x, `<circle cx="100" cy="101" r="18"/>`, 3, 6, .6) + `<circle cx="100" cy="101.5" r="18" fill="${x.url("knbs-" + fin)}"/>${knurl}<circle cx="100" cy="99.5" r="14.6" fill="${x.url("knb-" + fin)}"/>
<path d="M89.5 92.5 A12.6 12.6 0 0 1 100 86.8" fill="none" stroke="#fff" stroke-opacity="${isDark(fin) ? .3 : .8}" stroke-width="1.3" stroke-linecap="round"/>
<g transform="rotate(${f(AUX ? 0 : ang)} 100 99.5)"><path d="M100 87.6 V95.4" stroke="${k}" stroke-width="2.4" stroke-linecap="round"/><path d="M100.6 88 V95" stroke="#fff" stroke-opacity=".6" stroke-width=".7" stroke-linecap="round"/></g>`;
    if (AUX) s += led(x, 100, 136, 1.6, { locator: 1 });
    return s;
  }
  function ctlSlide(x, fin) {
    need(x, fin); const top = 68, bot = 132, sy = AUX ? (top + bot) / 2 : bot - (bot - top) * x.lv;
    let s = frame(x, 80, 60, 40, 80, fin) + rocker(x, 92, 100, 20, 76, fin, x.on) + `<rect x="110" y="${top - 2}" width="5" height="${bot - top + 4}" rx="2.5" fill="#000" opacity=".5"/>`;
    if (x.on && !AUX) s += `<g class="${P}in"><rect x="106" y="${f(sy)}" width="13" height="${f(bot - sy + 2)}" rx="5" fill="${x.url("halo")}" opacity=".6"/><rect x="111" y="${f(sy)}" width="3" height="${f(bot - sy + 1)}" rx="1.5" fill="${x.url("lens")}"/></g>`;
    else s += led(x, 112.5, bot, 1.3, { locator: 1 });
    s += drop(x, rr(106, sy - 5, 13, 10, 2), 2, 3.5, .55) + `<rect x="106" y="${f(sy - 5)}" width="13" height="10" rx="2" fill="${x.url("ph-" + fin)}"/>` +
      [-2.4, 0, 2.4].map((dd) => `<path d="M107.6 ${f(sy + dd)} H117.4" stroke="#000" stroke-opacity=".2" stroke-width=".8"/>`).join("") + hl(`M107 ${f(sy - 4.2)} H118`, isDark(fin) ? .3 : .9, .7);
    return s;
  }
  function ctlTouch(x, fin) {
    need(x, fin);
    x.add("tch", lg(x.id("tch"), [[0, "#30313a"], [.5, "#17181e"], [1, "#0b0b10"]], 0, 0, .3, 1));
    let s = gap(80, 58, 40, 84, 4) + `<rect x="80" y="58" width="40" height="84" rx="4" fill="${x.url("tch")}"/>`;
    const n = 7, lit = AUX ? 0 : litN(x, n);
    for (let i = 0; i < n; i++) { const Y = 124 - i * 8;
      s += x.on && i < lit ? `<g class="${P}in" style="animation-delay:${(i * .05).toFixed(2)}s"><rect x="90" y="${f(Y - 3.5)}" width="20" height="7" rx="3.5" fill="${x.url("halo")}" opacity=".55"/><rect x="93" y="${f(Y - 1.2)}" width="14" height="2.4" rx="1.2" fill="${x.hot}"/></g>`
        : `<rect x="93" y="${f(Y - 1.2)}" width="14" height="2.4" rx="1.2" fill="#fff" opacity=".1"/>`; }
    s += `<circle cx="100" cy="134" r="4.2" fill="none" stroke="${x.on ? x.hot : "#fff"}" stroke-opacity="${x.on ? .85 : .25}" stroke-width="1"/><path d="M100 131.4 V134" stroke="${x.on ? x.hot : "#fff"}" stroke-opacity="${x.on ? .85 : .25}" stroke-width="1" stroke-linecap="round"/>` +
      led(x, 100, 65, 1.2, { locator: 1, hr: 3.4 }) +
      `<path d="M81 59 H106 L88 141 H81 Z" fill="#fff" opacity=".06"/><rect x="80.4" y="58.4" width="39.2" height="83.2" rx="3.8" fill="none" stroke="#fff" stroke-opacity=".14" stroke-width=".7"/>`;
    return s;
  }
  function ctlFace(x, ct, fin) { return ct === "rotary" ? ctlRotary(x, fin) : ct === "slide" ? ctlSlide(x, fin) : ctlTouch(x, fin); }

  const actCls = (o, act, kind) => o.on && o.anim && act !== "idle" ? `${P}${kind}-${act}` : "";
  function actMark(x, cx, cy, act) {
    if (!x.on || act === "idle") return "";
    const m = act === "single" ? `<circle cx="${f(cx)}" cy="${f(cy)}" r="1.5"/>` : act === "double" ? `<circle cx="${f(cx - 2.6)}" cy="${f(cy)}" r="1.5"/><circle cx="${f(cx + 2.6)}" cy="${f(cy)}" r="1.5"/>`
      : `<rect x="${f(cx - 5)}" y="${f(cy - 1.3)}" width="10" height="2.6" rx="1.3"/>`;
    return `<g class="${P}f-${act}"><circle cx="${f(cx)}" cy="${f(cy)}" r="7" fill="${x.url("halo")}" opacity=".6"/><g fill="${x.hot}">${m}</g></g>`;
  }

  const icons = [
     base(gang({ id: "toggle", name: "Classic toggle", colors: led6(AM), glow: { x: .5, y: .36, r: .4 }, render(o) {
      const x = ctx(o);
      const b = plate(x, 64, 40, 72, 120, "ivory", { r: 3, screws: [[100, 51], [100, 149]] }) +
        `<rect x="95" y="88" width="10" height="24" rx="2.2" fill="#2a2218"/><rect x="95.8" y="89" width="8.4" height="22" rx="1.8" fill="#000" opacity=".5"/>
<path d="M95.4 111.6 H104.6" stroke="#fff" stroke-opacity=".6" stroke-width=".8"/><circle cx="100" cy="100" r="3.4" fill="${x.url("sc-steel")}"/>` +
        lever(x, 100, 100, 27, "ivory", x.on, { tip: 1 }) + "";
      need(x, "steel");
      return scene(x, "wood", b);
    } })),

     base(gang({ id: "paddle-rocker", name: "Paddle rocker", colors: led6(GR), glow: { x: .5, y: .63, r: .42 }, render(o) {
      const x = ctx(o);
      const ct = optv(o, "ctrl", "paddle");
      const b = plate(x, 63, 40, 74, 120, "white", { r: 4, seam: 1 }) + (ct !== "paddle" ? ctlFace(x, ct, "white") : rocker(x, 100, 100, 34, 66, "white", x.on) +
        `<circle cx="100" cy="126" r="2.6" fill="#000" opacity=".2"/>` + led(x, 100, 126, 1.9, { locator: 1 }));
      return scene(x, "sage", b);
    } }, [ROLE, CTRL("Rocker")], (op) => op.ctrl === "rotary" ? .8 : 1)),

     base(gang({ id: "red-bar-dimmer", name: "Red-bar dimmer", colors: led6(RD), glow: { x: .59, y: .55, r: .5 }, render(o) {
      const x = ctx(o);
      return scene(x, "linen", ino(x, "black", "chase"));
    } }, [ROLE])),

     base(gang({ id: "dimmer", name: "LED bar dimmer", colors: led6(W_), glow: { x: .43, y: .5, r: .5 }, render(o) {
      const x = ctx(o);
      const ct = optv(o, "ctrl", "paddle");
      const b = plate(x, 62, 38, 76, 124, "almond", { r: 4, seam: 1 }) + (ct !== "paddle" ? ctlFace(x, ct, "almond") : frame(x, 81, 58, 38, 84, "almond") +
        paddle(x, 94, 60, 24, 80, "almond", 2.4) + dots(x, 87.5, 132, 87.5, 68, 7, litN(x, 7), 1.7));
      return scene(x, "greige", b);
    } }, [ROLE, CTRL("Paddle")], (op) => op.ctrl === "rotary" ? .8 : 1)),

     base(gang({ id: "rotary", name: "Rotary dimmer", colors: led6(AM), glow: { x: .5, y: .5, r: .5 }, render(o) {
      const x = ctx(o), lit = litN(x, 11), ang = -135 + 270 * x.lv;
      x.add("knob", rg(x.id("knob"), [[0, "#fffdf6"], [.55, "#efe5cf"], [.85, "#cdbd9b"], [1, "#a08f6c"]], .4, .34, .7) +
        lg(x.id("knobs"), [[0, "#7a6a4c"], [.3, "#d9cbad"], [.55, "#fff8e8"], [.8, "#c4b48f"], [1, "#6e5f42"]]));
      let ticks = "";
      for (let i = 0; i < 11; i++) { const a = (-135 + 27 * i) * Math.PI / 180, s = Math.sin(a), c = -Math.cos(a);
        const p1 = [100 + s * 27, 100 + c * 27], p2 = [100 + s * 31, 100 + c * 31];
        if (x.on && i < lit) ticks += `<g class="${P}in" style="animation-delay:${(i * .05).toFixed(2)}s"><circle cx="${f((p1[0] + p2[0]) / 2)}" cy="${f((p1[1] + p2[1]) / 2)}" r="5.5" fill="${x.url("halo")}" opacity=".7"/><path d="M${f(p1[0])} ${f(p1[1])} L${f(p2[0])} ${f(p2[1])}" stroke="${x.hot}" stroke-width="2.2" stroke-linecap="round"/></g>`;
        else ticks += `<path d="M${f(p1[0])} ${f(p1[1])} L${f(p2[0])} ${f(p2[1])}" stroke="#000" stroke-opacity=".22" stroke-width="2" stroke-linecap="round"/><path d="M${f(p1[0] + .4)} ${f(p1[1] + .5)} L${f(p2[0] + .4)} ${f(p2[1] + .5)}" stroke="#fff" stroke-opacity=".5" stroke-width=".7" stroke-linecap="round"/>`; }
      let knurl = ""; for (let i = 0; i < 36; i++) { const a = i * 10 * Math.PI / 180; knurl += `<path d="M${f(100 + Math.sin(a) * 17.4)} ${f(101.5 - Math.cos(a) * 17.4)} L${f(100 + Math.sin(a) * 19.6)} ${f(101.5 - Math.cos(a) * 19.6)}" stroke="#000" stroke-opacity=".16" stroke-width="1"/>`; }
      const b = plate(x, 63, 38, 74, 124, "ivory", { r: 3, screws: [[100, 48], [100, 152]] }) + ticks +
        drop(x, `<circle cx="100" cy="101" r="20"/>`, 3, 6, .6) +
        `<circle cx="100" cy="101.5" r="20" fill="${x.url("knobs")}"/>${knurl}<circle cx="100" cy="99.5" r="16.4" fill="${x.url("knob")}"/>
<path d="M88 92 A14 14 0 0 1 100 85.5" fill="none" stroke="#fff" stroke-opacity=".8" stroke-width="1.4" stroke-linecap="round"/>
<g transform="rotate(${f(ang)} 100 99.5)"><path d="M100 86 V95" stroke="#6e5f42" stroke-width="2.6" stroke-linecap="round"/><path d="M100.6 86.4 V94.6" stroke="#fff" stroke-opacity=".7" stroke-width=".7" stroke-linecap="round"/></g>`;
      return scene(x, "clay", b);
    } }, null, () => .78)),

     base(gang({ id: "slide", name: "Slide dimmer", colors: led6(GR), glow: { x: .565, y: .55, r: .45 }, render(o) {
      const x = ctx(o), top = 68, bot = 132, sy = bot - (bot - top) * x.lv;
      let b = plate(x, 62, 38, 76, 124, "white", { r: 4, seam: 1 }) + frame(x, 80, 60, 40, 80, "white") + rocker(x, 92, 100, 20, 76, "white", x.on) +
        `<rect x="110" y="${top - 2}" width="5" height="${bot - top + 4}" rx="2.5" fill="#000" opacity=".5"/>`;
      if (x.on) b += `<g class="${P}in"><rect x="106" y="${f(sy)}" width="13" height="${f(bot - sy + 2)}" rx="5" fill="${x.url("halo")}" opacity=".6"/><rect x="111" y="${f(sy)}" width="3" height="${f(bot - sy + 1)}" rx="1.5" fill="${x.url("lens")}"/></g>`;
      else b += led(x, 112.5, bot, 1.3, { locator: 1 });
      b += drop(x, rr(106, sy - 5, 13, 10, 2), 2, 3.5, .55) + `<rect x="106" y="${f(sy - 5)}" width="13" height="10" rx="2" fill="${x.url("ph-white")}"/>` +
        [-2.4, 0, 2.4].map((d) => `<path d="M107.6 ${f(sy + d)} H117.4" stroke="#000" stroke-opacity=".2" stroke-width=".8"/>`).join("") + hl(`M107 ${f(sy - 4.2)} H118`, .9, .7);
      return scene(x, "blush", b);
    } })),

     base({ id: "twogang", name: "2-gang black", colors: led6(BL), glow: { x: .58, y: .5, r: .5 }, parts: SP(["a", "Left switch"], ["b", "Right dimmer"]), render(o) {
      const x = ctx(o), a = sx(x, pon(o, "a")), d = sx(x, pon(o, "b"), plv(o, "b", x.lv));
      const b = plate(x, 40, 40, 120, 120, "black", { r: 4, seam: 1, gloss: 1 }) + rocker(a, 78, 100, 34, 66, "black", a.on) +
        led(a, 78, 126, 1.6, { locator: 1 }) + frame(x, 104, 67, 36, 66, "black") + paddle(x, 116, 69, 22, 62, "black", 2) +
        dots(d, 110, 126, 110, 74, 7, litN(d, 7), 1.5);
      return scene(x, "linen", b, 1.3);
    } }),

     base(gang({ id: "blue-bar-2-in-1", name: "Blue-bar 2-in-1", colors: led6(BL), glow: { x: .59, y: .55, r: .5 }, parts: SP(["load", "Load"], ["led", "LED bar"]), render(o) {
      const x = ctx(o), nb = !!o.mf && pon(o, "led");
      const y = !o.mf ? x : nb ? sx(x, true, 1) : sx(x, pon(o, "load"), plv(o, "load", x.lv));
      return scene(y, "slate", ino(y, "white", nb ? "chase" : "pulse"));
    } }, [ROLE])),

     base({ id: "fan", name: "Fan controller", colors: led6(BL), glow: { x: .5, y: .63, r: .45 }, parts: SP(["fan", "Fan"], ["light", "Light"]),
      options: [{ id: "speed", name: "Speed", values: [["slider", "Slider"], ["off", "Off"], ["low", "Low"], ["med", "Med"], ["mhigh", "Med-high"], ["high", "High"]] }], render(o) {
      const x0 = ctx(o), x = sx(x0, pon(o, "fan"), plv(o, "fan", x0.lv)), sp = optv(o, "speed", "slider"), STEP = { off: 0, low: 1, med: 2, mhigh: 3, high: 4 };
      if (sp === "off") x.on = false;
      const n = sp === "slider" ? litN(x, 4) : x.on ? STEP[sp] : 0;
      const blades = [0, 120, 240].map((a) => `<path d="M100 114 C97.6 111 98 106.6 100.6 106 C103 105.8 103 110 100 114Z" transform="rotate(${a} 100 114)"/>`).join("");
      let b = plate(x, 62, 38, 76, 124, "ivory", { r: 4, seam: 1 }) + frame(x, 80, 58, 40, 84, "ivory") + paddle(x, 82, 60, 36, 44, "ivory", 2.4) +
        chev(100, 72, 3.2, true) + chev(100, 92, 3.2, false) + (o.mf && o.parts && o.parts.light != null ? bulb(x, !!o.parts.light) : "");
      const dur = (1.6 - 1.2 * (sp === "slider" ? x.lv : n / 4)).toFixed(2);
      b += `<circle cx="100" cy="114" r="6.4" fill="#000" opacity=".08"/>` + (x.on
        ? `<g class="${P}in"><circle cx="100" cy="114" r="11" fill="${x.url("halo")}" opacity=".45"/></g><g class="${P}spin" style="animation-duration:${dur}s"><circle cx="100" cy="114" r="6" fill="none"/><g fill="${x.hot}">${blades}</g></g><circle cx="100" cy="114" r="1.2" fill="#fff"/>`
        : `<g fill="#000" fill-opacity=".28">${blades}</g><circle cx="100" cy="114" r="1.1" fill="#000" opacity=".3"/>`);
      b += dots(x, 88, 128, 112, 128, 4, n, 1.6) + [88, 96, 104, 112].map((cx, i) => `<path d="M${f(cx - .5 - i * .4)} 133.6 H${f(cx + .5 + i * .4)}" stroke="#000" stroke-opacity=".3" stroke-width="1" stroke-linecap="round"/>`).join("");
      return scene(x, "green", b);
    } }),

     base({ id: "scene", name: "Scene keypad", colors: led6(W_), glow: { x: .43, y: .5, r: .45 }, options: [ACT], render(o) {
      const x = ctx(o), sel = Math.min(4, Math.floor(x.lv * 5)), act = optv(o, "act", "idle"), ac = actCls(o, act, "p");
      need(x, "black"); x.add("btn", lg(x.id("btn"), [[0, "#4a4a56"], [.5, "#2c2c35"], [1, "#16161b"]], 0, 0, 0, 1));
      let b = plate(x, 62, 36, 76, 128, "black", { r: 4, seam: 1, gloss: 1 }) + gap(80, 56, 40, 88, 2);
      for (let i = 0; i < 5; i++) { const Y = 56 + i * 15.2, pressed = x.on && i === sel && !ac;
        if (x.on && i === sel && ac) b += `<g class="${ac}">`;
        b += `<rect x="80" y="${f(Y)}" width="40" height="13.2" rx="2" fill="${x.url("btn")}"/>${pressed ? `<rect x="80" y="${f(Y)}" width="40" height="13.2" rx="2" fill="#000" opacity=".25"/>` : hl(`M82 ${f(Y + .8)} H118`, .2, .7)}
${engr(92, Y + 5.6, 8 + (i * 5) % 14, 1)}${engr(92, Y + 8.6, 6 + (i * 3) % 9, 1)}`;
        b += x.on && i === sel ? led(x, 86, Y + 6.6, 1.5, { hr: 4 }) : (!x.on && i === 4 ? led(x, 86, Y + 6.6, 1.3, { off: 1, locator: 1 }) : `<circle cx="86" cy="${f(Y + 6.6)}" r="1.4" fill="#000" opacity=".5"/><circle cx="86" cy="${f(Y + 6.6)}" r="1" fill="#fff" opacity=".1"/>`);
        if (x.on && i === sel) b += (ac ? `<rect x="80" y="${f(Y)}" width="40" height="13.2" rx="2" fill="#000" fill-opacity=".3" class="${P}f-${act}"/></g>` : "") + actMark(x, 113, Y + 6.6, act); }
      b += `<rect x="80" y="132" width="19.4" height="12" rx="2" fill="${x.url("btn")}"/><rect x="100.6" y="132" width="19.4" height="12" rx="2" fill="${x.url("btn")}"/>` + chev(89.7, 138, 2.6, false, 1) + chev(110.3, 138, 2.6, true, 1);
      return scene(x, "stucco", b);
    } }),

     base({ id: "glass", name: "Touch glass panel", colors: led6(PU), glow: { x: .5, y: .45, r: .55 }, render(o) {
      const x = ctx(o);
      x.add("gl", lg(x.id("gls"), [[0, "#fff", .22], [.4, "#fff", .04], [.41, "#fff", 0], [1, "#fff", 0]], 0, 0, 1, 1));
      const ic = [
        `<path d="M-3.2 3.5 C-3.2 1 -5 0 -5 -2.4 C-5 -5.4 -2.6 -7 0 -7 C2.6 -7 5 -5.4 5 -2.4 C5 0 3.2 1 3.2 3.5 Z M-2.4 5.4 H2.4 M-1.6 7.2 H1.6"/>`,
        `<circle r="1.4"/><path d="M0 -1.4 C-1 -4 0 -7 2.4 -6.6 C4.4 -6 3 -2.6 1.2 -.6 M1.2 .7 C4 .3 6.6 1.8 5.6 4 C4.6 5.8 1.8 3.8 .4 1.4 M-1.3 .4 C-2.8 2.8 -5.4 4 -6.2 2 C-6.8 -.2 -3.4 -1.2 -1.4 -.7"/>`,
        `<path d="M2.6 -6.4 C-2.4 -6.6 -5.8 -2 -4.8 2.4 C-3.8 6.4 1.6 7.6 5.6 4.2 C1 4.4 -1.8 .4 -.6 -3.2 C0 -4.8 1.2 -5.8 2.6 -6.4 Z"/>`];
      let b = plate(x, 54, 54, 92, 92, "glass", { r: 7, b: 1.6 }) + `<rect x="55.6" y="55.6" width="88.8" height="88.8" rx="6" fill="${x.url("gls")}"/>`;
      [76, 100, 124].forEach((cx, i) => { const lit = x.on && i !== 2;
        if (lit) b += `<g class="${P}in" style="animation-delay:${i * .1}s"><g class="${P}pulse"><circle cx="${cx}" cy="88" r="13" fill="${x.url("halo")}" opacity=".55"/></g>
<circle cx="${cx}" cy="88" r="9.6" fill="none" stroke="${x.c}" stroke-opacity=".6" stroke-width=".9"/><g transform="translate(${cx} 88)" fill="none" stroke="${x.hot}" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">${ic[i]}</g></g>`;
        else b += `<circle cx="${cx}" cy="88" r="9.6" fill="none" stroke="#fff" stroke-opacity=".1" stroke-width=".9"/><g transform="translate(${cx} 88)" fill="none" stroke="#fff" stroke-opacity="${x.on ? .45 : .22}" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">${ic[i]}</g>`; });
      const n = 12, lit = litN(x, n);
      for (let i = 0; i < n; i++) { const X = 70 + i * 5.2;
        b += x.on && i < lit ? `<g class="${P}in" style="animation-delay:${(i * .04).toFixed(2)}s"><rect x="${f(X - 1)}" y="118" width="5.4" height="7" rx="2" fill="${x.c}" opacity=".35"/><rect x="${f(X)}" y="120" width="3.4" height="3" rx="1" fill="${x.hot}"/></g>`
          : `<rect x="${f(X)}" y="120" width="3.4" height="3" rx="1" fill="#fff" opacity="${!x.on && i === 0 ? .4 : .1}"/>`; }
      if (!x.on) b += `<circle cx="100" cy="134" r="1.3" fill="${x.c}" opacity=".6"/>`;
      else b += `<circle cx="100" cy="134" r="1.3" fill="${x.hot}"/>`;
      return scene(x, "concrete", b, 1.5);
    } }),

     base({ id: "vintage", name: "Push-button", colorLabel: "Buttons", colors: ["#f6eef8", "#f3e6cc", "#bfe6da", "#2c2a30", "#e8a0a8"], glow: { x: .5, y: .43, r: .35 }, render(o) {
      const x = ctx(o), tint = x.c;
      need(x, "brass"); x.add("cup", rg(x.id("cup"), [[0, "#4d3210"], [.7, "#94692b"], [.88, "#fbe9ad"], [1, "#8a5f22"]], .5, .5, .5));
      const btn = (cy, pressed, k) => { const p = pearl(x, k, tint);
        return `<circle cx="100" cy="${cy}" r="10" fill="${x.url("cup")}"/><circle cx="100" cy="${cy}" r="7.6" fill="#000" opacity=".55"/>` +
          (pressed ? `<circle cx="100" cy="${cy + .6}" r="6.6" fill="${p}"/><circle cx="100" cy="${cy + .6}" r="6.6" fill="#000" opacity=".22"/><path d="M95 ${cy - 1.4} A6 6 0 0 1 100 ${cy - 5.4}" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="1.2"/>`
            : `<circle cx="101.4" cy="${cy + 3}" r="7" fill="#000" opacity=".45" filter="${x.url("bl")}"/><circle cx="100" cy="${cy - .4}" r="7" fill="${H.shade(tint, -.35)}"/><circle cx="100" cy="${cy - 1.4}" r="6.6" fill="${p}"/><ellipse cx="98" cy="${cy - 3.6}" rx="2.8" ry="1.6" fill="#fff" opacity=".7"/>`); };
      let b = plate(x, 64, 38, 72, 124, "brass", { r: 2.5, b: 4.2, screws: [[100, 50], [100, 150]] }) +
        `<rect x="69" y="43" width="62" height="114" rx="1.5" fill="none" stroke="#4d3210" stroke-opacity=".45" stroke-width=".8"/><rect x="70" y="44" width="60" height="112" rx="1.2" fill="none" stroke="#fbe9ad" stroke-opacity=".5" stroke-width=".6"/>`;
      b += btn(86, x.on, "a") + btn(114, !x.on, "b");
      return scene(x, "stripe", b);
    } }),

     base({ id: "remote", name: "Wall remote", colors: led6(GR), glow: { x: .5, y: .34, r: .35 }, options: [ACT], render(o) {
      const x = ctx(o), act = optv(o, "act", "idle"), ac = actCls(o, act, "p");
      x.add("rm", lg(x.id("rm"), [[0, "#ffffff"], [.55, "#f1eff4"], [1, "#c9c5d1"]], 0, 0, .4, 1) + lg(x.id("rb"), [[0, "#fbfafc"], [1, "#d6d2dc"]], 0, 0, 0, 1));
      let b = plate(x, 63, 40, 74, 120, "white", { r: 4, seam: 1 }) + gap(81, 61, 38, 78, 3) + `<rect x="81" y="61" width="38" height="78" rx="3" fill="#000" opacity=".3"/>` +
        drop(x, rr(84, 58, 32, 84, 13), 2.5, 4, .6) + `<rect x="84" y="58" width="32" height="84" rx="13" fill="${x.url("rm")}"/>` + hl("M86.5 70 V130", .8, 1.2) +
        `<rect x="84.3" y="58.3" width="31.4" height="83.4" rx="13" fill="none" stroke="#8f8b9a" stroke-opacity=".5" stroke-width=".6"/>`;
      const key = (Y, h, pressed) => `<rect x="90" y="${Y}" width="20" height="${h}" rx="${h / 2.4}" fill="#000" opacity=".16"/><rect x="90.4" y="${Y + (pressed ? .8 : 0)}" width="19.2" height="${h - .6}" rx="${h / 2.4}" fill="${x.url("rb")}"/>${pressed ? `<rect x="90.4" y="${Y + .8}" width="19.2" height="${h - .6}" rx="${h / 2.4}" fill="#000" opacity=".1"/>` : hl(`M93 ${Y + .9} H107`, .9, .7)}`;
      b += (ac ? `<g class="${ac}">${key(74, 13, false)}</g>` : key(74, 13, x.on)) + actMark(x, 100, 80.5, act) + key(90, 9, false) + `<circle cx="100" cy="106" r="5.4" fill="#000" opacity=".16"/><circle cx="100" cy="105.6" r="5" fill="${x.url("rb")}"/>` + key(114, 9, false) + key(126, 13, !x.on && false);
      b += chev(100, 94.5, 2.4, true) + chev(100, 118.5, 2.4, false) + `<circle cx="100" cy="105.6" r="1.6" fill="none" stroke="#000" stroke-opacity=".25" stroke-width=".8"/>`;
      b += led(x, 100, 67, 1.4, { blink: 1, hr: 5 });
      return scene(x, "plaster", b);
    } }),

     base(gang({ id: "display", name: "Display switch", colors: led6(BL), glow: { x: .5, y: .38, r: .5 }, render(o) {
      const x = ctx(o), pct = String(Math.round(x.lv * 100));
      x.add("lcd", lg(x.id("lcd"), [[0, "#0d0e14"], [1, "#1b1c26"]], 0, 0, 0, 1));
      let b = plate(x, 62, 36, 76, 128, "white", { r: 4, seam: 1 }) + frame(x, 80, 56, 40, 88, "white") +
        `<rect x="82.5" y="62" width="35" height="22" rx="2.4" fill="#000" opacity=".4"/><rect x="83.2" y="62.6" width="33.6" height="20.8" rx="2" fill="${x.url("lcd")}"/>`;
      if (x.on) { const chars = ("   " + pct).slice(-3).split("");
        b += `<g class="${P}in"><rect x="83.2" y="62.6" width="33.6" height="20.8" rx="2" fill="${x.c}" opacity=".12"/><ellipse cx="100" cy="73" rx="22" ry="15" fill="${x.url("halo")}" opacity=".4"/>` +
          chars.map((ch, i) => seg7(86 + i * 9, 66.5, 7, 13, ch, x.hot, .07)).join("") + `</g>`;
      } else b += [0, 1, 2].map((i) => seg7(86 + i * 9, 66.5, 7, 13, "8", "#fff", .06)).join("") + `<circle cx="113.6" cy="80.4" r=".9" fill="${x.c}" opacity=".6"/>`;
      b += `<rect x="83.2" y="62.6" width="33.6" height="9" rx="2" fill="#fff" opacity=".06"/>` +
        paddle(x, 83, 89, 34, 52, "white", 2.4) + chev(100, 100, 3.6, true) + chev(100, 130, 3.6, false) +
        `<path d="M86 115 H114" stroke="#000" stroke-opacity=".1" stroke-width=".8"/>`;
      return scene(x, "dark", b);
    } })),

     base(gang({ id: "timer", name: "Countdown timer", colors: led6(AM), glow: { x: .43, y: .6, r: .45 }, render(o) {
      const x = ctx(o), n = litN(x, 5);
      let b = plate(x, 62, 36, 76, 128, "white", { r: 4, seam: 1 }) + frame(x, 80, 54, 40, 92, "white") + rocker(x, 100, 72, 36, 30, "white", x.on);
      need(x, "white");
      for (let i = 0; i < 5; i++) { const Y = 133 - i * 10.4, lit = x.on && i < n, last = lit && i === n - 1;
        b += `<rect x="82" y="${f(Y - 4)}" width="36" height="8.6" rx="1.6" fill="#000" opacity=".2"/><rect x="82.3" y="${f(Y - 4.3)}" width="35.4" height="8.4" rx="1.6" fill="${x.url("pd-white")}"/>${hl(`M84 ${f(Y - 3.6)} H116`, .8, .5)}`;
        b += lit ? led(x, 88, Y, 1.4, { hr: 3.4, blink: last, delay: i * .08 }) : (!x.on && i === 0 ? led(x, 88, Y, 1.3, { off: 1, locator: 1 }) : `<circle cx="88" cy="${f(Y)}" r="1.4" fill="#000" opacity=".22"/>`);
        for (let t = 0; t <= i; t++) b += `<path d="M${f(97 + t * 3.4)} ${f(Y - 1.6)} V${f(Y + 1.6)}" stroke="#000" stroke-opacity=".32" stroke-width="1" stroke-linecap="round"/>`; }
      return scene(x, "plum", b);
    } })),

     base({ id: "outlet", name: "Switch + outlet", colors: led6(GR), glow: { x: .5, y: .38, r: .42 }, parts: SP(["load", "Switch"], ["outlet", "Outlet"]), render(o) {
      const x = ctx(o), l = sx(x, pon(o, "load"));
      need(x, "white"); x.add("rec", rg(x.id("rec"), [[0, "#ffffff"], [.7, "#efedf2"], [1, "#c9c5d1"]], .4, .3, .8));
      let b = plate(x, 63, 40, 74, 120, "white", { r: 4, seam: 1 }) + frame(x, 82, 60, 36, 80, "white") + rocker(l, 100, 78, 32, 32, "white", l.on) +
        led(l, 100, 89.4, 1.3, { locator: 1 }) + `<path d="M83 99.6 H117" stroke="#000" stroke-opacity=".3" stroke-width="1"/>`;
      b += `<rect x="84" y="103" width="32" height="34" rx="9" fill="#000" opacity=".2"/><rect x="84.4" y="102.4" width="31.2" height="33.6" rx="9" fill="${x.url("rec")}"/>${hl("M88 104 H112", .9, .7)}
<rect x="92" y="111" width="2.8" height="9" rx=".8" fill="#1c1a22"/><rect x="105.2" y="110" width="2.8" height="11" rx=".8" fill="#1c1a22"/>
<path d="M97.6 131 V128.4 A2.4 2.4 0 0 1 102.4 128.4 V131 Z" fill="#1c1a22"/>`;
      if (o.mf) b += led(sx(x, pon(o, "outlet")), 100, 106.4, .9, { hr: 3.4 });
      return scene(x, "tile", b);
    } }),

     base(gang({ id: "lighted", name: "Lighted rocker", colors: led6(AM), glow: { x: .5, y: .5, r: .5 }, render(o) {
      const x = ctx(o), k = x.on ? 1 : .2;
      x.add("tr", lg(x.id("tr"), x.on
        ? [[0, H.mix(x.c, "#fff", .4)], [.47, H.mix(x.c, "#fff", .7)], [.5, H.mix(x.c, "#000", .1)], [1, H.mix(x.c, "#000", .2)]]
        : [[0, H.mix(x.c, "#2a2632", .7)], [.48, H.mix(x.c, "#6a6470", .55)], [.5, H.mix(x.c, "#fff", .6)], [1, H.mix(x.c, "#e8e4ec", .55)]], 0, 0, 0, 1));
      const b = plate(x, 63, 40, 74, 120, "steel", { r: 3, brush: 1, screws: [[100, 51], [100, 149]] }) + gap(83, 67, 34, 66, 2) +
        `<rect x="83" y="67" width="34" height="66" rx="2.4" fill="${x.url("tr")}"/>` +
        `<g class="${P}in"><g class="${P}pulse"><ellipse cx="100" cy="100" rx="30" ry="44" fill="${x.url("halo")}" opacity="${(.6 * k).toFixed(2)}"/></g></g>` +
        `<rect x="88" y="71" width="24" height="58" rx="2" fill="${x.url("lens")}" opacity="${(.55 * k).toFixed(2)}"/>` +
        `<path d="M84 100 H116" stroke="${x.on ? "#000" : "#fff"}" stroke-opacity="${x.on ? .12 : .35}" stroke-width=".8"/>` + hl("M84.6 70 V130", .5, 1) +
        `<rect x="83.3" y="67.3" width="33.4" height="65.4" rx="2.2" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width=".6"/>` +
        `<rect x="83" y="${x.on ? 129 : 67}" width="34" height="4" rx="2" fill="#000" opacity=".22"/>`;
      return scene(x, "denim", b);
    } })),

     base({ id: "nightlight", name: "Nightlight switch", colors: led6(AM), glow: { x: .5, y: .6, r: .55 }, parts: SP(["load", "Switch"], ["light", "Night light"]), render(o) {
      const x = ctx(o), l = sx(x, pon(o, "load")), nl = pon(o, "light");
      x.add("nl", rg(x.id("nl"), [[0, "#ffffff", .9], [.6, "#eeeaf4", .7], [1, "#bdb7c8", .7]], .45, .35, .7));
      const star = (cx, cy, r) => "M" + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => { const a = (i * 36 - 90) * Math.PI / 180, rr2 = i % 2 ? r * .45 : r; return `${f(cx + rr2 * Math.cos(a))} ${f(cy + rr2 * Math.sin(a))}`; }).join(" L") + " Z";
      const art = `<path d="M96 108 C89 108 85.6 114 87 119.4 C88.4 124.6 94.4 126.6 99 124 C94 123.6 91.4 118.6 92.8 114 C93.4 111.6 94.6 109.4 96 108 Z"/><path d="${star(106, 113, 3.4)}"/><path d="${star(110.6, 122.4, 2.2)}"/><path d="${star(101.6, 129, 1.6)}"/>`;
      let b = plate(x, 62, 38, 76, 124, "white", { r: 10, seam: 1 }) + rocker(l, 100, 74, 34, 36, "white", l.on) +
        led(l, 100, 87, 1.2, { locator: 1 }) + gap(82, 102, 36, 40, 10) + `<rect x="82" y="102" width="36" height="40" rx="10" fill="${x.url("nl")}"/>`;
      if (nl) b += `<g class="${P}in"><g class="${P}pulse"><ellipse cx="100" cy="124" rx="30" ry="28" fill="${x.url("halo")}" opacity=".7"/></g><rect x="84" y="104" width="32" height="36" rx="9" fill="${x.url("lens")}" opacity=".75"/><g fill="#fff" opacity=".95">${art}</g></g>`;
      else b += `<g fill="#9a94a8" opacity=".55">${art}</g>`;
      b += hl("M86 106 C92 104 108 104 114 106", .7, 1) + `<rect x="82.3" y="102.3" width="35.4" height="39.4" rx="10" fill="none" stroke="#8f8b9a" stroke-opacity=".4" stroke-width=".6"/>`;
      return scene(x, "mint", b);
    } }),

     base({ id: "button", name: "Wireless button", colors: led6(PU), glow: { x: .5, y: .5, r: .5 }, options: [ACT], render(o) {
      const x = ctx(o), act = optv(o, "act", "idle"), ac = actCls(o, act, "s"), dip = x.on && act !== "idle" && !ac;
      x.add("pk", rg(x.id("pk"), [[0, "#ffffff"], [.6, "#eceaf0"], [.92, "#c4c0cc"], [1, "#a6a2b0"]], .42, .36, .62) + lg(x.id("pks"), [[0, "#7f7b8a"], [.35, "#d6d2dc"], [.6, "#f4f2f6"], [1, "#6f6b7a"]]));
      let b = drop(x, `<circle cx="100" cy="102" r="31"/>`, 4, 7, .6) + `<circle cx="100" cy="104" r="30" fill="${x.url("pks")}"/>` +
        (ac ? `<g class="${ac}">` : dip ? `<g transform="translate(100 101.5) scale(.955) translate(-100 -100)">` : "") + `<circle cx="100" cy="100" r="30" fill="${x.url("pk")}"/>`;
      if (x.on) b += `<g class="${P}in"><g class="${P}pulse"><circle cx="100" cy="100" r="34" fill="none" stroke="${x.c}" stroke-opacity=".25" stroke-width="10"/></g><circle cx="100" cy="100" r="25" fill="none" stroke="${x.c}" stroke-width="3.4" opacity=".45"/><circle cx="100" cy="100" r="25" fill="none" stroke="${x.hot}" stroke-width="1.6"/></g>`;
      else b += `<circle cx="100" cy="100" r="25" fill="none" stroke="#000" stroke-opacity=".1" stroke-width="2"/>` + led(x, 100, 125, 1.3, { off: 1, locator: 1 });
      b += `<circle cx="100" cy="100" r="20" fill="#000" opacity=".04"/><path d="M80 88 A23 23 0 0 1 104 77.4" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".9"/>
<circle cx="100" cy="100" r="3" fill="none" stroke="#000" stroke-opacity=".18" stroke-width="1"/><path d="M100 96.6 V99" stroke="#000" stroke-opacity=".18" stroke-width="1" stroke-linecap="round"/>` + (ac || dip ? "</g>" : "") + actMark(x, 100, 117, act);
      return scene(x, "sand", b, 1.6);
    } }),

     base({ id: "industrial", name: "Metal box switch", colors: led6(RD), glow: { x: .5, y: .37, r: .4 }, render(o) {
      const x = ctx(o);
      need(x, "alum"); need(x, "steel");
      x.add("emt", lg(x.id("emt"), [[0, "#4a4f58"], [.3, "#c9ced6"], [.5, "#f0f2f6"], [.75, "#8e949e"], [1, "#3c4048"]]) +
        rg(x.id("jw"), [[0, "#ffffff", .9], [.3, x.hot], [.8, x.c], [1, H.shade(x.c, -.5)]], .4, .35, .6) +
        rg(x.id("jo"), [[0, H.mix(x.c, "#fff", .25)], [.4, H.shade(x.c, -.45)], [1, H.shade(x.c, -.75)]], .4, .35, .6));
      let b = `<rect x="94" y="0" width="12" height="54" fill="${x.url("emt")}"/>` + drop(x, `<rect x="94" y="8" width="12" height="46"/>`, 3, 0, .45) +
        `<rect x="92.4" y="30" width="15.2" height="10" rx="1.4" fill="${x.url("emt")}"/><circle cx="100" cy="35" r="1.6" fill="${x.url("sc-steel")}"/><path d="M92.4 30.6 H107.6" stroke="#fff" stroke-opacity=".4"/>` +
        `<rect x="92" y="50" width="16" height="7" rx="1.4" fill="${x.url("ph-alum")}"/>`;
      b += plate(x, 66, 54, 68, 104, "alum", { r: 9, b: 4 }) + `<rect x="72" y="60" width="56" height="92" rx="5" fill="${x.url("pb-steel")}" opacity=".55"/><rect x="72" y="60" width="56" height="92" rx="5" fill="none" stroke="#000" stroke-opacity=".3" stroke-width=".8"/>` +
        [[77, 65], [123, 65], [77, 147], [123, 147]].map(([cx, cy], i) => screw(x, cx, cy, "steel", 20 + 40 * i)).join("");
      b += `<circle cx="100" cy="76" r="8.4" fill="${x.url("ph-steel")}"/><circle cx="100" cy="76" r="8.4" fill="none" stroke="#000" stroke-opacity=".35" stroke-width=".6"/><circle cx="100" cy="76" r="6" fill="${x.url(x.on ? "jw" : "jo")}"/>` +
        [0, 60, 120].map((a) => `<path d="M100 70.4 V81.6" transform="rotate(${a} 100 76)" stroke="#fff" stroke-opacity=".12" stroke-width=".6"/>`).join("") +
        (x.on ? `<g class="${P}in"><g class="${P}pulse"><circle cx="100" cy="76" r="20" fill="${x.url("halo")}" opacity=".75"/></g></g>` : "") + `<ellipse cx="98" cy="73.4" rx="2.2" ry="1.4" fill="#fff" opacity=".75"/>`;
      b += `<path d="M93 112 L96.5 106 H103.5 L107 112 L103.5 118 H96.5 Z" fill="${x.url("ph-steel")}"/><circle cx="100" cy="112" r="4" fill="#2a2d33"/>` + lever(x, 100, 112, 25, "steel", x.on, { w0: 2.6, w1: 3.8 });
      return scene(x, "brick", b, 1.2);
    } }),
  ];

  (window.HDA = window.HDA || []).push({
    id: "switch",
    tab: "Switches & dimmers",
    group: "More",
    kind: "light",
    intro: "Twenty wall switches, dimmers and keypads on painted walls. On flips each one to its ON position and lights its status LED in the LED color; dimmers fill their LED bar to the brightness. Plates come in white, ivory, almond, black, stainless, brass and glass by model. Gangs makes 1 to 4 of the same switch on one plate (each gang can follow its own entity), Role picks Main or Aux, and some dimmers let you pick the Control (paddle, rotary, slide or touch).",
    css: `.hda-switch-pulse,.hda-switch-spin{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-switch-pulse{animation:hda-switch-pulse 3.2s ease-in-out infinite}
@keyframes hda-switch-pulse{50%{opacity:.6;transform:scale(.9)}}
.hda-anim .hda-switch-blink{animation:hda-switch-blink 1.4s ease-in-out infinite}
@keyframes hda-switch-blink{50%{opacity:.15}}
.hda-switch-breathe{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-switch-breathe{animation:hda-switch-breathe 2.4s ease-in-out infinite}
@keyframes hda-switch-breathe{50%{opacity:.35}}
.hda-anim .hda-switch-chase{animation:hda-switch-chase 1.6s ease-in infinite}
@keyframes hda-switch-chase{0%{opacity:0;transform:translate(0,0)}15%{opacity:.95}85%{opacity:.95}100%{opacity:0;transform:translate(0,-52px)}}
.hda-anim .hda-switch-spin{animation:hda-switch-spin 1s linear infinite}
.hda-switch-p-single,.hda-switch-p-double,.hda-switch-p-long,.hda-switch-s-single,.hda-switch-s-double,.hda-switch-s-long{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-switch-p-single,.hda-anim .hda-switch-s-single,.hda-anim .hda-switch-f-single{animation:hda-switch-p-single 1.6s ease-out infinite}
.hda-anim .hda-switch-p-double,.hda-anim .hda-switch-s-double,.hda-anim .hda-switch-f-double{animation:hda-switch-p-double 1.6s ease-out infinite}
.hda-anim .hda-switch-p-long,.hda-anim .hda-switch-s-long,.hda-anim .hda-switch-f-long{animation:hda-switch-p-long 2.2s ease-in-out infinite}
.hda-anim .hda-switch-s-single{animation-name:hda-switch-s-single}.hda-anim .hda-switch-s-double{animation-name:hda-switch-s-double}.hda-anim .hda-switch-s-long{animation-name:hda-switch-s-long}
.hda-anim .hda-switch-f-single{animation-name:hda-switch-f-single}.hda-anim .hda-switch-f-double{animation-name:hda-switch-f-double}.hda-anim .hda-switch-f-long{animation-name:hda-switch-f-long}
@keyframes hda-switch-p-single{0%,30%,100%{transform:translate(0,0)}10%,18%{transform:translate(0,1.6px)}}
@keyframes hda-switch-p-double{0%,40%,100%{transform:translate(0,0)}7%{transform:translate(0,1.6px)}14%{transform:translate(0,0)}21%{transform:translate(0,1.6px)}28%{transform:translate(0,0)}}
@keyframes hda-switch-p-long{0%,85%,100%{transform:translate(0,0)}8%,75%{transform:translate(0,1.6px)}}
@keyframes hda-switch-s-single{0%,30%,100%{transform:scale(1)}10%,18%{transform:scale(.95)}}
@keyframes hda-switch-s-double{0%,40%,100%{transform:scale(1)}7%{transform:scale(.95)}14%{transform:scale(1)}21%{transform:scale(.95)}28%{transform:scale(1)}}
@keyframes hda-switch-s-long{0%,85%,100%{transform:scale(1)}8%,75%{transform:scale(.95)}}
@keyframes hda-switch-f-single{0%,32%,100%{opacity:.15}10%,20%{opacity:1}}
@keyframes hda-switch-f-double{0%,42%,100%{opacity:.15}7%,11%{opacity:1}14%{opacity:.15}21%,25%{opacity:1}}
@keyframes hda-switch-f-long{0%,88%,100%{opacity:.15}8%,78%{opacity:1}}
@keyframes hda-switch-spin{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-switch-in,.hda-anim .hda-switch-pulse,.hda-anim .hda-switch-blink,.hda-switch-breathe{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-switch-breathe{animation:hda-switch-breathe 2.4s ease-in-out infinite}
@keyframes hda-switch-breathe{50%{opacity:.35}}
.hda-anim .hda-switch-chase{animation:hda-switch-chase 1.6s ease-in infinite}
@keyframes hda-switch-chase{0%{opacity:0;transform:translate(0,0)}15%{opacity:.95}85%{opacity:.95}100%{opacity:0;transform:translate(0,-52px)}}
.hda-anim .hda-switch-spin,.hda-anim .hda-switch-breathe,.hda-anim .hda-switch-chase,.hda-anim [class*="hda-switch-p-"],.hda-anim [class*="hda-switch-s-"],.hda-anim [class*="hda-switch-f-"]{animation:none}}`,
    icons,
  });
})();
