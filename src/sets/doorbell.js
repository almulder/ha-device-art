(function () {
  const H = window.HDAH, P = "hda-doorbell-";
  const f = (n) => (+n).toFixed(1);
  const rnd = (seed) => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };

  function ctx(o) {
    const c = o.color || "#4da3ff", on = !!o.on, lv = o.level == null ? 1 : o.level, act = o.act == null ? on : o.act; 
    const L = act ? .45 + .55 * lv : 0;
    const id = (s) => `${o.uid}-${s}`, url = (s) => `url(#${o.uid}-${s})`;
    const body = o.body && o.bodyDef && String(o.body).toLowerCase() !== o.bodyDef ? o.body : null;
    return { c, on, act, bst: o.bst, cam: o.cam, ir: !!o.ir, lv, L, id, url, hot: H.mix(c, "#ffffff", .62), op: (k) => (k * L).toFixed(2), sp: (1.7 - .9 * lv), wave: o.color2 || null, body, bodyMain: o.bodyMain };
  }
  const stops = (a) => a.map(([o, c, op]) => `<stop offset="${o}" stop-color="${c}"${op == null ? "" : ` stop-opacity="${op}"`}/>`).join("");
  const lg = (id, a, x1, y1, x2, y2) => `<linearGradient id="${id}" x1="${x1 || 0}" y1="${y1 || 0}" x2="${x2 == null ? 1 : x2}" y2="${y2 || 0}">${stops(a)}</linearGradient>`;
  const rg = (id, a, cx, cy, r) => `<radialGradient id="${id}" cx="${cx == null ? .5 : cx}" cy="${cy == null ? .5 : cy}" r="${r || .5}">${stops(a)}</radialGradient>`;
  const rrp = (x, y, w, h, r) => `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`;

  const WALL = {
    siding: ["#4f5966", "#353c46"], brick: ["#64402f", "#452a20"], trim: ["#4b505a", "#33373f"], stucco: ["#625b50", "#463f37"],
    stone: ["#3a3833", "#28261f"], battens: ["#3d434c", "#272b32"], block: ["#5b5d62", "#3e4045"], yard: ["#252f55", "#43395e"],
    interior: ["#55505e", "#3b3744"], sage: ["#48544c", "#313a34"], blush: ["#5c4954", "#41333c"], navywall: ["#323b54", "#20273a"],
    door: ["#6a4529", "#43291a"], reddoor: ["#7a2b2b", "#4c1a1b"], navydoor: ["#2c3550", "#1b2135"], greendoor: ["#2f4b3d", "#1d3127"],
  };
  const DOORS = { door: 1, reddoor: 1, navydoor: 1, greendoor: 1 };

  function fpal(c) { return { l: H.shade(c, .5), m: c, d: H.shade(c, -.32), k: H.shade(c, -.58) }; }

  function tint(x, key) {
    const p = fpal(x.body);
    return lg(x.id(key), [[0, p.k], [.22, p.d], [.42, p.l], [.62, p.m], [1, p.k]]) + lg(x.id(key + "v"), [[0, p.l], [.45, p.m], [1, p.k]], 0, 0, 0, 1);
  }
  function defs(x, kind, extra) {
    const { c, id } = x, w = WALL[kind] || WALL.interior, p = fpal(c);
    const t = x.on ? H.mix(w[0], c, .05 * x.L) : w[0];
    return `<defs>
${lg(id("wallg"), [[0, t], [1, w[1]]], 0, 0, 0, 1)}
<clipPath id="${id("wc")}"><rect x="8" y="8" width="184" height="184" rx="16"/></clipPath>
${rg(id("vig"), [[0, "#000", 0], [.62, "#000", .05], [1, "#000", .5]], .5, .48, .74)}
${rg(id("halo"), [[0, c, .85], [.42, c, .3], [1, c, 0]])}
${rg(id("haloW"), [[0, "#ffe9c4", .7], [.45, "#ffe9c4", .2], [1, "#ffe9c4", 0]])}
${rg(id("sh"), [[0, "#000", .6], [.6, "#000", .22], [1, "#000", 0]])}
${x.body && x.bodyMain === "blk" ? tint(x, "blk") : lg(id("blk"), [[0, "#07080b"], [.22, "#262a35"], [.4, "#454a5c"], [.62, "#1c1f28"], [1, "#06070a"]]) + lg(id("blkv"), [[0, "#3c4152"], [.45, "#1a1d25"], [1, "#09090d"]], 0, 0, 0, 1)}
${x.body && x.bodyMain === "wht" ? tint(x, "wht") : lg(id("wht"), [[0, "#8d8996"], [.22, "#e6e3ea"], [.45, "#ffffff"], [.78, "#d5d1da"], [1, "#86828f"]]) + lg(id("whtv"), [[0, "#ffffff"], [.6, "#dcd8e1"], [1, "#a8a4b0"]], 0, 0, 0, 1)}
${x.body && x.bodyMain === "sil" ? tint(x, "sil") : lg(id("sil"), [[0, "#4d525c"], [.18, "#9ca2ad"], [.4, "#eef1f6"], [.58, "#c9ced8"], [.82, "#7d838e"], [1, "#454a54"]]) + lg(id("silv"), [[0, "#eef1f6"], [.5, "#a3a9b4"], [1, "#575c66"]], 0, 0, 0, 1)}
${rg(id("silr"), [[0, "#ffffff"], [.45, "#c3c8d2"], [1, "#5b606b"]], .38, .32, .7)}
${lg(id("brs"), [[0, "#5e3e12"], [.2, "#b8893a"], [.38, "#fbe7a6"], [.56, "#c99a48"], [.8, "#7a5118"], [1, "#4d3210"]])}
${lg(id("fin"), [[0, p.k], [.2, p.d], [.4, p.l], [.56, p.m], [.82, p.d], [1, p.k]])}
${lg(id("finv"), [[0, p.l], [.45, p.m], [1, p.k]], 0, 0, 0, 1)}
${rg(id("finr"), [[0, H.shade(c, .7)], [.35, p.l], [.7, p.m], [1, p.k]], .36, .3, .75)}
${rg(id("lens"), [[0, "#5c6fb0"], [.25, "#28335e"], [.6, "#0e1226"], [1, "#03040a"]], .4, .36, .6)}
${lg(id("gloss"), [[0, "#fff", .5], [.5, "#fff", .06], [1, "#fff", 0]], 0, 0, 1, 1)}
${rg(id("ivory"), [[0, "#fffaf0"], [.55, "#e9dfca"], [1, "#a39578"]], .38, .32, .75)}
${lg(id("glass"), [[0, "#1c2030"], [.5, "#0b0d15"], [1, "#05060a"]], 0, 0, 1, 1)}
${lg(id("wood"), [[0, "#c8996a"], [.5, "#a87a4e"], [1, "#6a4528"]], 0, 0, 0, 1)}
${lg(id("woodh"), [[0, "#5e3d22"], [.35, "#b4845a"], [.7, "#8d6140"], [1, "#4e3119"]])}
${lg(id("case"), [[0, "#7f7b86"], [.07, "#d9d6de"], [.5, "#cbc7d0"], [.93, "#bcb8c2"], [1, "#6e6a75"]])}
<filter id="${id("bl")}" x="-25%" y="-25%" width="150%" height="150%"><feGaussianBlur stdDeviation="2.6"/></filter>
${extra || ""}</defs>`;
  }

  function panels(kind) {
    let s = "";
    [[24, 18, 62, 76], [114, 18, 62, 76], [24, 110, 62, 76], [114, 110, 62, 76]].forEach(([px, py, pw, ph]) => {
      s += `<rect x="${px}" y="${py}" width="${pw}" height="${ph}" rx="1.5" fill="#000" fill-opacity=".14"/>
<path d="M${px} ${py + ph}V${py}H${px + pw}" fill="none" stroke="#000" stroke-opacity=".42" stroke-width="2"/>
<path d="M${px} ${py + ph}H${px + pw}V${py}" fill="none" stroke="#fff" stroke-opacity=".1" stroke-width="1.6"/>
<rect x="${px + 7}" y="${py + 7}" width="${pw - 14}" height="${ph - 14}" fill="#fff" fill-opacity=".05"/>
<path d="M${px + 7} ${py + ph - 7}V${py + 7}H${px + pw - 7}" fill="none" stroke="#fff" stroke-opacity=".14" stroke-width="1.4"/>
<path d="M${px + 7} ${py + ph - 7}H${px + pw - 7}V${py + 7}" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="1.4"/>`;
    });
    return s;
  }
  function texture(kind, x) {
    const r = rnd(kind.length * 977 + kind.charCodeAt(0) * 31 + kind.charCodeAt(1)); let s = "";
    const noise = (n, big, a) => { let t = ""; for (let i = 0; i < n; i++) t += `<circle cx="${f(10 + r() * 180)}" cy="${f(10 + r() * 180)}" r="${f(.3 + r() * big)}" fill="${r() > .5 ? "#000" : "#fff"}" fill-opacity="${(a + r() * .07).toFixed(2)}"/>`; return t; };
    const laps = (x0, x1) => { let t = ""; for (let y = 8; y < 192; y += 16) t += `<rect x="${x0}" y="${y}" width="${x1 - x0}" height="7" fill="#fff" fill-opacity=".035"/><path d="M${x0} ${y + 15} H${x1}" stroke="#000" stroke-opacity=".45" stroke-width="2.2"/><path d="M${x0} ${y + 16.6} H${x1}" stroke="#fff" stroke-opacity=".08" stroke-width="1"/>`; return t; };
    if (kind === "siding") s += laps(8, 192);
    else if (kind === "brick") {
      for (let row = 0, y = 8; y < 192; y += 12, row++) {
        for (let bx = 8 - (row % 2) * 13; bx < 192; bx += 26) { const v = r();
          s += `<rect x="${f(bx + .9)}" y="${f(y + .9)}" width="24.2" height="10.2" rx="1.3" fill="${v > .5 ? "#000" : "#e3a07f"}" fill-opacity="${(.04 + v * .1).toFixed(2)}"/><path d="M${bx} ${y}v12" stroke="#c9b8a8" stroke-opacity=".16" stroke-width="1.6"/>`; }
        s += `<path d="M8 ${y}H192" stroke="#c9b8a8" stroke-opacity=".18" stroke-width="1.6"/><path d="M8 ${y + 1.5}H192" stroke="#000" stroke-opacity=".2" stroke-width=".8"/>`;
      }
    } else if (kind === "battens") {
      for (let bx = 8; bx < 192; bx += 30) { const v = r();
        s += `<rect x="${bx}" y="8" width="30" height="184" fill="${v > .5 ? "#fff" : "#000"}" fill-opacity="${(.02 + v * .04).toFixed(2)}"/>
<rect x="${bx - 3}" y="8" width="6" height="184" fill="#fff" fill-opacity=".06"/><path d="M${bx + 3} 8V192" stroke="#000" stroke-opacity=".45" stroke-width="1.6"/><path d="M${bx - 3} 8V192" stroke="#fff" stroke-opacity=".09" stroke-width=".8"/>`; }
    } else if (kind === "stone") {
      const rows = [24, 21, 28, 23, 26, 22, 28, 24]; let y = 8;
      rows.forEach((h) => { let bx = 8 - r() * 26;
        while (bx < 192) { const w = 28 + r() * 30, v = r(), col = H.mix("#8f877a", "#5b554c", v);
          s += `<rect x="${f(bx + 1.2)}" y="${f(y + 1.2)}" width="${f(w - 2.4)}" height="${f(h - 2.4)}" rx="3.5" fill="${col}"/>
<path d="M${f(bx + 3)} ${f(y + 2)}H${f(bx + w - 4)}" stroke="#fff" stroke-opacity=".14" stroke-width="1.2" stroke-linecap="round"/>
<path d="M${f(bx + 3)} ${f(y + h - 1.6)}H${f(bx + w - 3)}" stroke="#000" stroke-opacity=".3" stroke-width="1.4" stroke-linecap="round"/>`;
          bx += w; }
        y += h; });
      s += noise(60, .7, .05);
    } else if (kind === "block") {
      for (let row = 0, y = 8; y < 192; y += 20, row++) {
        for (let bx = 8 - (row % 2) * 20; bx < 192; bx += 40) { const v = r();
          s += `<rect x="${f(bx + 1.2)}" y="${f(y + 1.2)}" width="37.6" height="17.6" rx="1" fill="${v > .5 ? "#000" : "#fff"}" fill-opacity="${(.02 + v * .05).toFixed(2)}"/><path d="M${bx} ${y}v20" stroke="#d6d4d0" stroke-opacity=".14" stroke-width="2"/>`; }
        s += `<path d="M8 ${y}H192" stroke="#d6d4d0" stroke-opacity=".16" stroke-width="2"/><path d="M8 ${y + 1.8}H192" stroke="#000" stroke-opacity=".18" stroke-width=".8"/>`;
      }
      s += noise(90, .8, .05);
    } else if (kind === "trim") {
      s += laps(8, 62);
      s += `<rect x="140" y="8" width="52" height="184" fill="#2a3249"/><rect x="152" y="24" width="44" height="92" fill="none" stroke="#000" stroke-opacity=".4" stroke-width="2"/>
<rect x="155" y="27" width="38" height="86" fill="none" stroke="#fff" stroke-opacity=".08" stroke-width="1.2"/><rect x="152" y="130" width="44" height="70" fill="none" stroke="#000" stroke-opacity=".4" stroke-width="2"/>
<rect x="140" y="8" width="8" height="184" fill="#000" fill-opacity=".35"/>
<rect x="60" y="8" width="80" height="184" fill="${x.url("case")}"/>
<path d="M69 8V192M73 8V192M127 8V192M131 8V192" stroke="#000" stroke-opacity=".2" stroke-width="1.4"/><path d="M70 8V192M128 8V192" stroke="#fff" stroke-opacity=".35" stroke-width=".8"/>
<rect x="56" y="8" width="4" height="184" fill="#000" fill-opacity=".3"/>`;
    } else if (kind === "yard") {
      for (let i = 0; i < 18; i++) s += `<circle cx="${f(12 + r() * 176)}" cy="${f(12 + r() * 80)}" r="${f(.4 + r() * .8)}" fill="#fff" fill-opacity="${(.3 + r() * .5).toFixed(2)}"/>`;
      s += `<path d="M8 128 C18 112 30 116 38 120 C46 106 62 110 70 118 C80 106 96 110 104 118 C114 104 130 108 138 118 C148 108 164 110 172 120 C180 112 188 114 192 118 V160 H8Z" fill="#1d3224"/>
<path d="M14 124 C22 116 30 118 36 124 M44 118 C52 110 62 112 68 120 M112 116 C120 108 130 110 136 118 M146 116 C154 110 164 112 170 120" fill="none" stroke="#3d6446" stroke-opacity=".7" stroke-width="2" stroke-linecap="round"/>
<path d="M8 150 C60 144 140 144 192 150 V192 H8Z" fill="#1c2b18"/><path d="M8 150 C60 144 140 144 192 150" fill="none" stroke="#3b5a32" stroke-opacity=".7" stroke-width="1.6"/>`;
      for (let i = 0; i < 40; i++) { const gx = 10 + r() * 180, gy = 154 + r() * 36; s += `<path d="M${f(gx)} ${f(gy)}l${f(r() * 2 - 1)} -3" stroke="#4a6e3c" stroke-opacity=".5" stroke-width=".8"/>`; }
    } else if (DOORS[kind]) {
      if (kind === "door") for (let i = 0; i < 26; i++) { const gx = 10 + r() * 180, w2 = 1 + r() * 2.5;
        s += `<path d="M${f(gx)} 8 C${f(gx + w2)} 60 ${f(gx - w2)} 130 ${f(gx + w2 * .5)} 192" fill="none" stroke="#2a170a" stroke-opacity="${(.12 + r() * .14).toFixed(2)}" stroke-width="${f(.5 + r() * .7)}"/>`; }
      else s += noise(40, .5, .03);
      s += panels(kind);
    } else s += noise(kind === "stucco" ? 150 : 46, kind === "stucco" ? 1.1 : .6, .04);
    return s;
  }

  function scene(x, kind, body, extra, under) {
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs(x, kind, extra)}
<g class="hda-bg"><rect x="8" y="8" width="184" height="184" rx="16" fill="${x.url("wallg")}"/>
<g clip-path="${x.url("wc")}">${texture(kind, x)}<rect x="8" y="8" width="184" height="184" fill="${x.url("vig")}"/></g>
<rect x="8.5" y="8.5" width="183" height="183" rx="15.5" fill="none" stroke="#fff" stroke-opacity=".07"/></g>
<g clip-path="${x.url("wc")}">${under || ""}</g>
${body}${camOv(x)}</svg>`;
  }
  const camOv = (x) => { const q = x.cam; if (!q) return "";
    return (x.ir ? CK.irDots(q[0], q[1], q[2] + 3.5, 6, 1) : "") + CK.bellOver(x.bst, q[0], q[1], q[2], q[3]); };

  const drop = (x, shape, dx, dy, a) => `<g transform="translate(${dx == null ? 3.5 : dx} ${dy == null ? 5 : dy})" fill="#000" stroke="none" opacity="${a || .5}" filter="${x.url("bl")}">${shape}</g>`;
  const hl = (d, a, w) => `<path d="${d}" fill="none" stroke="#fff" stroke-opacity="${a}" stroke-width="${w}" stroke-linecap="round"/>`;
  const glowE = (x, cx, cy, rx, ry, k, g) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${x.url(g || "halo")}" opacity="${x.on ? x.op(k == null ? .5 : k) : 0}"/>`;
  const anim = (x, cls, dur, delay, extra) => `class="${P}${cls}" style="animation-duration:${f(dur)}s;animation-delay:${(delay || 0).toFixed(2)}s${extra ? ";" + extra : ""}"`;
  const screw = (x, cx, cy, r, a) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${x.url("silr")}"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#000" stroke-opacity=".35" stroke-width=".6"/><path d="M${f(cx - r * .65)} ${f(cy + r * .3)}L${f(cx + r * .65)} ${f(cy - r * .3)}" stroke="#2a2d33" stroke-width="${f(r * .35)}" stroke-linecap="round"/>`;

  function lens(x, cx, cy, r) {
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#020306"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#5a6070" stroke-opacity=".6" stroke-width="${f(r * .1)}"/>
<circle cx="${cx}" cy="${cy}" r="${f(r * .7)}" fill="${x.url("lens")}"/><circle cx="${cx}" cy="${cy}" r="${f(r * .3)}" fill="#010104"/>
<circle cx="${cx}" cy="${cy}" r="${f(r * .5)}" fill="none" stroke="#8a7cf0" stroke-opacity=".28" stroke-width="${f(r * .08)}"/>
<ellipse cx="${f(cx - r * .3)}" cy="${f(cy - r * .32)}" rx="${f(r * .22)}" ry="${f(r * .13)}" fill="#fff" fill-opacity=".7" transform="rotate(-35 ${f(cx - r * .3)} ${f(cy - r * .32)})"/>
<circle cx="${f(cx + r * .3)}" cy="${f(cy + r * .3)}" r="${f(r * .07)}" fill="#fff" fill-opacity=".45"/>`;
  }
  function holes(cx, cy, R, step, hr) {
    let s = "";
    for (let yy = -R; yy <= R; yy += step) for (let xx = -R; xx <= R; xx += step) {
      const ox = (Math.round((yy + R) / step) % 2) * step / 2;
      if ((xx + ox) * (xx + ox) + yy * yy > R * R) continue;
      s += `<circle cx="${f(cx + xx + ox)}" cy="${f(cy + yy)}" r="${hr}" fill="#000" fill-opacity=".7"/>`;
    }
    return s;
  }
  function ringLight(x, cx, cy, r, w, standby) {
    const c = x.c, n = 10, seg = 2 * Math.PI * r / n;
    let s = x.on ? `<circle cx="${cx}" cy="${cy}" r="${f(r * 2.6)}" fill="${x.url("halo")}" opacity="${x.op(.6)}" ${anim(x, "pulse", x.sp, 0)}/>`
      : `<circle cx="${cx}" cy="${cy}" r="${f(r * 1.7)}" fill="${x.url("halo")}" opacity="${(standby || .14).toFixed(2)}"/>`;
    s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#020306" stroke-width="${f(w + 2)}"/>`;
    if (x.on) {
      s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${c}" stroke-width="${w}" opacity="${(.6 + .4 * x.L).toFixed(2)}"/>
<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${x.hot}" stroke-width="${f(w * .42)}" opacity="${x.op(1)}"/>`;
      for (let i = 0; i < n; i++) s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#fff" stroke-width="${f(w * .7)}" stroke-dasharray="${f(seg * .5)} ${f(seg * (n - .5))}" transform="rotate(${-90 + i * 36} ${cx} ${cy})" opacity="${i === 0 ? .9 : .15}" ${anim(x, "chase", x.sp, -x.sp * (1 - i / n))}/>`;
    } else {
      s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${H.shade(c, -.45)}" stroke-width="${w}" opacity=".85"/>
<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${c}" stroke-width="${f(w * .5)}" opacity="${((standby || .14) * 2.4).toFixed(2)}"/>`;
    }
    return s;
  }
  function waves(x, cx, cy, r0, sides, col, gap, span) {
    if (!x.on) return "";
    gap = gap || 8; span = span || 34; col = x.wave || col || x.c;
    const arc = (r, a1, a2) => { const p = (a) => [cx + r * Math.cos(a * Math.PI / 180), cy + r * Math.sin(a * Math.PI / 180)]; const A = p(a1), B = p(a2);
      return `M${f(A[0])} ${f(A[1])}A${r} ${r} 0 0 1 ${f(B[0])} ${f(B[1])}`; };
    const dirs = []; if (sides.indexOf("r") >= 0) dirs.push(0); if (sides.indexOf("l") >= 0) dirs.push(180); if (sides.indexOf("up") >= 0) dirs.push(-90);
    let s = ""; const d = x.sp * 1.3;
    dirs.forEach((a) => { for (let i = 0; i < 3; i++) {
      const rr = r0 + i * gap, sp2 = span - i * 3;
      s += `<path d="${arc(rr, a - sp2, a + sp2)}" fill="none" stroke="${col}" stroke-width="${f(3 - i * .6)}" stroke-linecap="round" opacity="${(.85 - i * .22).toFixed(2)}" ${anim(x, "wave", d, i * d * .2)}/>`;
    } });
    return `<g opacity="${(.55 + .45 * x.L).toFixed(2)}">${s}</g>`;
  }
  const gl = (x, d, a) => `<path d="${d}" fill="${x.url("gloss")}" opacity="${a || .35}"/>`;
  const led = (x, cx, cy, r, col, blink) => x.act
    ? `<circle cx="${cx}" cy="${cy}" r="${f(r * 3)}" fill="${x.url("halo")}" opacity="${x.op(.7)}"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="${col || x.hot}" ${blink ? anim(x, "blink", x.sp * .8, 0) : ""}/>`
    : `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#1b1e28"/><circle cx="${cx}" cy="${cy}" r="${f(r * .5)}" fill="${col || x.c}" opacity=".35"/>`;

  const RING = ["#4da3ff", "#f2f6ff", "#34d399", "#a78bfa", "#ffb547"];
  const rs = (first) => [first].concat(RING.filter((c) => c !== first));
  const FIN = ["#c9a04e", "#c3c8d0", "#3a3c44", "#6b4f3a", "#c07a4a"];
  const fs = (first, list) => { const L = list || FIN; return [first].concat(L.filter((c) => c !== first)); };
  const WAVES = ["#ffffff", "#16171b", "#4da3ff", "#34d399", "#ffb547", "#ff5a7a", "#a78bfa"];
  const BODY = { blk: "#22252e", wht: "#eeecf1", sil: "#b9bec7" };
  const ring = (d) => {
    const src = String(d.render); let main = "blk", best = -1;
    Object.keys(BODY).forEach((k) => { const n = (src.match(new RegExp('url\\("' + k + 'v?"\\)', "g")) || []).length; if (n > best) { best = n; main = k; } });
    const def = BODY[main], lit = d.colors[0], orig = d.render;
    const cols = [def].concat(["#22252e", "#eeecf1", "#b9bec7", "#c9a04e", "#6b4f3a", "#2f5e3c", "#8a2b2b"].filter((c) => c !== def));
    return Object.assign({}, d, { colors: cols, picker: true, colorLabel: "Body", colors2: [lit].concat(WAVES.filter((c) => c !== lit)), picker2: true, colorLabel2: "Waves",
      options: d.cam ? [CK.BELL, CK.IR] : d.options,
      render(o) { const st = d.cam ? CK.bell(o) : null, m3 = st ? { on: st === "ring", act: st !== "idle", bst: st, cam: d.cam, ir: (o.opt || {}).ir === "on" } : {};
        return orig.call(this, Object.assign({}, o, { color: o.color2 || lit, color2: o.color2 || null, body: o.color || def, bodyDef: def, bodyMain: main }, m3)); } });
  };
  const fin = (d) => Object.assign({ picker: true, colorLabel: "Body", colors2: WAVES, picker2: true, colorLabel2: "Waves" }, d);

  const CK = (() => {
    const g = (n) => (+n).toFixed(1);
    const STATE = { id: "state", name: "State", values: [["auto", "From on/off"], ["live", "Live"], ["rec", "Recording"], ["motion", "Motion"], ["privacy", "Privacy"], ["offline", "Offline"]] };
    const BELL = { id: "state", name: "State", values: [["ring", "Ringing"], ["motion", "Motion"], ["live", "Live view"], ["talk", "Talking"], ["idle", "Idle"]] };
    const IR = { id: "ir", name: "Night IR", values: [["off", "Off"], ["on", "On"]] };
    const IRA = { id: "ir", name: "Night IR", values: [["auto", "Auto"], ["off", "Off"], ["on", "On"]] };
    const PAN = { id: "pan", name: "Pan", values: [["center", "Center"], ["left", "Left"], ["right", "Right"]] };
    const cam = (o) => { const s = (o.opt || {}).state || "auto"; return s === "auto" ? (o.on ? "on" : "off") : s; };
    const bell = (o) => o.on ? ((o.opt || {}).state || "ring") : "idle";
    const active = (s) => s === "on" || s === "live" || s === "rec" || s === "motion";
    const COL = { rec: "#ff3b3b", live: "#3ee08f", motion: "#ffa940", privacy: "#c9ced6", offline: "#8a8f98" };
    const LED = { rec: "#ff3b3b", live: "#3ee08f", motion: "#ffa940" };
    function badge(s, bx, by) {
      const c = COL[s]; if (!c) return "";
      bx = bx == null ? 28 : bx; by = by == null ? 28 : by;
      let gl = "";
      if (s === "rec") gl = `<circle cx="${bx}" cy="${by}" r="7" fill="${c}" opacity=".22"/><g class="${P}ckblink"><circle cx="${bx}" cy="${by}" r="4.4" fill="${c}"/><circle cx="${g(bx - 1.4)}" cy="${g(by - 1.4)}" r="1.3" fill="#fff" fill-opacity=".6"/></g>`;
      else if (s === "live") gl = `<circle cx="${bx}" cy="${by}" r="2.3" fill="${c}"/><path d="M${g(bx - 3.2)} ${g(by - 3.6)}A5 5 0 0 0 ${g(bx - 3.2)} ${g(by + 3.6)}M${g(bx + 3.2)} ${g(by - 3.6)}A5 5 0 0 1 ${g(bx + 3.2)} ${g(by + 3.6)}" fill="none" stroke="${c}" stroke-width="1.4" stroke-linecap="round"/>` +
        `<path class="${P}ckglow" d="M${g(bx - 5.6)} ${g(by - 5.4)}A7.8 7.8 0 0 0 ${g(bx - 5.6)} ${g(by + 5.4)}M${g(bx + 5.6)} ${g(by - 5.4)}A7.8 7.8 0 0 1 ${g(bx + 5.6)} ${g(by + 5.4)}" fill="none" stroke="${c}" stroke-width="1.4" stroke-linecap="round"/>`;
      else if (s === "motion") gl = `<g class="${P}ckglow" fill="none" stroke="${c}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="${g(bx + 1.2)}" cy="${g(by - 5.6)}" r="1.9" fill="${c}" stroke="none"/>` +
        `<path d="M${g(bx + .4)} ${g(by - 2.8)}L${g(bx - 1)} ${g(by + 2)}L${g(bx - 4.4)} ${g(by + 6.2)}M${g(bx - 1)} ${g(by + 2)}L${g(bx + 2.6)} ${g(by + 3.4)}L${g(bx + 3.4)} ${g(by + 6.6)}M${g(bx - 4.6)} ${g(by - .6)}L${g(bx + .4)} ${g(by - 2.8)}L${g(bx + 4)} ${g(by)}"/></g>`;
      else if (s === "privacy") gl = `<path d="M${g(bx - 6.4)} ${by}Q${bx} ${g(by - 6)} ${g(bx + 6.4)} ${by}Q${bx} ${g(by + 6)} ${g(bx - 6.4)} ${by}Z" fill="none" stroke="${c}" stroke-width="1.3"/><circle cx="${bx}" cy="${by}" r="2" fill="${c}"/>` +
        `<path d="M${g(bx - 5.6)} ${g(by + 5.6)}L${g(bx + 5.6)} ${g(by - 5.6)}" stroke="#16181e" stroke-width="3.4"/><path d="M${g(bx - 5.6)} ${g(by + 5.6)}L${g(bx + 5.6)} ${g(by - 5.6)}" stroke="${c}" stroke-width="1.4" stroke-linecap="round"/>`;
      else if (s === "offline") gl = `<circle cx="${bx}" cy="${g(by + 4)}" r="1.2" fill="${c}"/><path d="M${g(bx - 2.8)} ${g(by + 1.2)}A4 4 0 0 1 ${g(bx + 2.8)} ${g(by + 1.2)}M${g(bx - 5.3)} ${g(by - 1.3)}A7.5 7.5 0 0 1 ${g(bx + 5.3)} ${g(by - 1.3)}" fill="none" stroke="${c}" stroke-width="1.4" stroke-linecap="round"/>` +
        `<path d="M${g(bx - 5.8)} ${g(by - 5.8)}L${g(bx + 5.8)} ${g(by + 5.8)}" stroke="#16181e" stroke-width="3.4"/><path d="M${g(bx - 5.8)} ${g(by - 5.8)}L${g(bx + 5.8)} ${g(by + 5.8)}" stroke="#ff5a5a" stroke-width="1.5" stroke-linecap="round"/>`;
      return `<g><circle cx="${g(bx + 1)}" cy="${g(by + 1.6)}" r="11" fill="#000" fill-opacity=".45"/><circle cx="${bx}" cy="${by}" r="11" fill="#16181e"/><circle cx="${bx}" cy="${by}" r="10.2" fill="none" stroke="${c}" stroke-width="1.3"/>` +
        `<path d="M${g(bx - 7)} ${g(by - 6)}A9 9 0 0 1 ${g(bx + 6)} ${g(by - 7)}" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="1"/>${gl}</g>`;
    }
    const motion = (cx, cy, r) => [0, 1].map((i) => `<circle class="${P}ckring" style="animation-delay:${(-i * .8).toFixed(1)}s" cx="${g(cx)}" cy="${g(cy)}" r="${g(r * (1.3 + i * .5))}" fill="none" stroke="#ffa940" stroke-opacity="${i ? .4 : .75}" stroke-width="${i ? 1.4 : 1.8}"${i ? ` stroke-dasharray="3 3"` : ""}/>`).join("");
    function cap(u, k, cx, cy, r, col) {
      const id = `${u}-ckc${k}`;
      return `<defs><radialGradient id="${id}" cx=".36" cy=".3" r=".8"><stop offset="0" stop-color="${H.shade(col, .55)}"/><stop offset=".6" stop-color="${col}"/><stop offset="1" stop-color="${H.shade(col, -.45)}"/></radialGradient></defs>` +
        `<circle cx="${g(cx)}" cy="${g(cy + r * .14)}" r="${g(r)}" fill="#000" fill-opacity=".4"/><circle cx="${g(cx)}" cy="${g(cy)}" r="${g(r)}" fill="url(#${id})"/>` +
        `<path d="M${g(cx - r * .97)} ${g(cy)}H${g(cx + r * .97)}" stroke="${H.shade(col, -.5)}" stroke-width="${g(Math.max(.8, r * .09))}"/><path d="M${g(cx - r * .9)} ${g(cy + r * .1)}H${g(cx + r * .9)}" stroke="#fff" stroke-opacity=".28" stroke-width="${g(Math.max(.5, r * .05))}"/>` +
        `<circle cx="${g(cx)}" cy="${g(cy)}" r="${g(r)}" fill="none" stroke="#000" stroke-opacity=".38" stroke-width=".8"/><ellipse cx="${g(cx - r * .32)}" cy="${g(cy - r * .5)}" rx="${g(r * .36)}" ry="${g(r * .15)}" fill="#fff" fill-opacity=".4" transform="rotate(-18 ${g(cx - r * .32)} ${g(cy - r * .5)})"/>`;
    }
    const irDots = (cx, cy, R, n, rr) => { let s = ""; rr = rr || 1.1;
      for (let i = 0; i < n; i++) { const a = i * 2 * Math.PI / n - Math.PI / 2, px = g(cx + Math.cos(a) * R), py = g(cy + Math.sin(a) * R);
        s += `<circle cx="${px}" cy="${py}" r="${g(rr * 3)}" fill="#ff3a4a" opacity=".22"/><circle cx="${px}" cy="${py}" r="${g(rr)}" fill="#ff3a4a"/>`; }
      return s; };
    function bellOver(s, cx, ly, lr, w) {
      if (s === "motion") return `<g class="${P}ckglow">` + [0, 1].map((i) => { const r = lr + 5 + i * 6; return `<path d="M${g(cx - r)} ${g(ly - 2)}A${g(r)} ${g(r)} 0 0 1 ${g(cx + r)} ${g(ly - 2)}" fill="none" stroke="#ff8a6a" stroke-opacity="${(.8 - i * .3).toFixed(2)}" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="3 3"/>`; }).join("") + `</g>`;
      if (s === "live") return `<g class="${P}ckglow"><circle cx="${g(cx)}" cy="${g(ly)}" r="${g(lr * 1.9)}" fill="#6aa8ff" opacity=".22"/><circle cx="${g(cx)}" cy="${g(ly)}" r="${g(lr * 1.05)}" fill="none" stroke="#6aa8ff" stroke-opacity=".8" stroke-width="1.4"/></g>` +
        `<circle class="${P}ckblink" cx="${g(cx + w / 2 + 7)}" cy="${g(ly - lr)}" r="3" fill="#ff3b3b"/>`;
      if (s === "talk") return [0, 1, 2].map((i) => `<path class="${P}ckwave" style="animation-delay:${(-i * .4).toFixed(1)}s" d="M${g(cx + w / 2 + 4 + i * 6)} ${g(ly - 6 - i * 2)}q${g(5 + i)} ${g(6 + i * 2)} 0 ${g(12 + i * 4)}" fill="none" stroke="#7ee7ff" stroke-opacity="${(.9 - i * .2).toFixed(2)}" stroke-width="1.5" stroke-linecap="round"/>`).join("");
      return "";
    }
    const css = `
.${P}ckring{transform-box:fill-box;transform-origin:center}
.hda-anim .${P}ckblink{animation:${P}ckblink 1.1s steps(1,end) infinite}
@keyframes ${P}ckblink{0%{opacity:1}50%{opacity:.15}}
.hda-anim .${P}ckring{animation:${P}ckring 1.6s ease-out infinite}
@keyframes ${P}ckring{0%{transform:scale(.75);opacity:1}100%{transform:scale(1.35);opacity:0}}
.hda-anim .${P}ckglow{animation:${P}ckglow 1.8s ease-in-out infinite}
@keyframes ${P}ckglow{0%,100%{opacity:1}50%{opacity:.4}}
.hda-anim .${P}ckwave{animation:${P}ckwave 1.3s ease-out infinite}
@keyframes ${P}ckwave{0%{opacity:0}30%{opacity:1}100%{opacity:0}}
@media (prefers-reduced-motion:reduce){.hda-anim .${P}ckblink,.hda-anim .${P}ckring,.hda-anim .${P}ckglow,.hda-anim .${P}ckwave{animation:none!important}}`;
    return { STATE, BELL, IR, IRA, PAN, cam, bell, active, LED, badge, motion, cap, irDots, bellOver, css };
  })();

  const icons = [
     ring({ id: "tall", name: "Video doorbell", colors: rs("#4da3ff"), cam: [100, 56, 14, 48], render(o) {
      const x = ctx(o), B = rrp(76, 20, 48, 160, 24);
      const F = drop(x, `<path d="${B}"/>`, 4, 6, .55) +
        `<path d="${rrp(73, 17, 54, 166, 27)}" fill="${x.url("sil")}" opacity=".85"/>
<path d="${B}" fill="${x.url("blk")}"/><path d="${rrp(80, 24, 40, 152, 20)}" fill="${x.url("blkv")}" opacity=".55"/>
<path d="${rrp(82, 28, 36, 60, 18)}" fill="#04050a"/><path d="${rrp(82, 28, 36, 60, 18)}" fill="none" stroke="#fff" stroke-opacity=".1"/>
${lens(x, 100, 56, 14)}${led(x, 100, 35, 1.6, null, true)}
<circle cx="100" cy="80" r="2.4" fill="#151824"/><circle cx="99.4" cy="79.4" r=".8" fill="#fff" fill-opacity=".4"/>
${[98, 103, 108, 113].map((y) => `<rect x="90" y="${y}" width="20" height="2" rx="1" fill="#000" fill-opacity=".7"/><rect x="90" y="${y + 2}" width="20" height=".6" fill="#fff" fill-opacity=".08"/>`).join("")}
${ringLight(x, 100, 144, 16, 4.6, .16)}
<circle cx="100" cy="144" r="11.5" fill="${x.url("blkv")}"/><circle cx="100" cy="144" r="11.5" fill="none" stroke="#fff" stroke-opacity=".14"/>
<ellipse cx="96" cy="139" rx="6" ry="3.5" fill="#fff" fill-opacity=".14"/>
${gl(x, rrp(80, 24, 18, 140, 9), .28)}${hl("M81 46V156", .2, 1.6)}
<path d="${B}" fill="none" stroke="#fff" stroke-opacity=".12"/>`;
      return scene(x, "siding", F + waves(x, 100, 144, 36, "lr"), "", glowE(x, 100, 144, 70, 70, .35));
    } }),

     ring({ id: "square", name: "Square-head video", colors: rs("#f2f6ff"), cam: [100, 64, 16, 76], render(o) {
      const x = ctx(o), B = rrp(62, 26, 76, 150, 14);
      const F = drop(x, `<path d="${B}"/>`, 4, 6, .55) +
        `<path d="${B}" fill="${x.url("sil")}"/><path d="${B}" fill="${x.url("silv")}" opacity=".35"/>
<path d="${rrp(68, 32, 64, 66, 10)}" fill="${x.url("glass")}"/><path d="${rrp(68, 32, 64, 66, 10)}" fill="none" stroke="#000" stroke-opacity=".5"/>
${lens(x, 100, 64, 16)}
<circle cx="78" cy="44" r="2.2" fill="#3a1820"/><circle cx="122" cy="44" r="2.2" fill="#3a1820"/><circle cx="78" cy="84" r="1.8" fill="#151824"/>
${led(x, 122, 84, 1.7, null, true)}
${gl(x, rrp(70, 34, 60, 26, 9), .3)}
${[80, 87, 94, 101, 108, 115, 122].map((cx) => `<circle cx="${cx}" cy="112" r="1.6" fill="#000" fill-opacity=".6"/>`).join("")}
${ringLight(x, 100, 146, 19, 5, .16)}
<circle cx="100" cy="146" r="13.5" fill="${x.url("silr")}"/><circle cx="100" cy="146" r="13.5" fill="none" stroke="#000" stroke-opacity=".3"/>
<circle cx="100" cy="146" r="9" fill="none" stroke="#000" stroke-opacity=".14"/>
${hl("M66 44V160", .45, 1.4)}<path d="${B}" fill="none" stroke="#000" stroke-opacity=".35" stroke-width=".8"/>`;
      return scene(x, "brick", F + waves(x, 100, 146, 48, "lr"), "", glowE(x, 100, 146, 74, 70, .35));
    } }),

     ring({ id: "wedge", name: "Battery doorbell", colors: rs("#34d399"), cam: [95, 58, 12, 58], render(o) {
      const x = ctx(o), B = rrp(66, 22, 58, 156, 22);
      const F = drop(x, `<path d="${rrp(66, 22, 70, 156, 22)}"/>`, 5, 6, .55) +
        `<path d="${rrp(76, 26, 60, 150, 20)}" fill="#8f8b97"/><path d="${rrp(76, 26, 60, 150, 20)}" fill="${x.url("whtv")}" opacity=".35"/>
${[40, 60, 80, 100, 120, 140, 160].map((y) => `<path d="M130 ${y}H135" stroke="#000" stroke-opacity=".25"/>`).join("")}
<path d="M118 24 C124 26 128 34 128 44 V156 C128 166 124 174 118 176 Z" fill="#a39fab"/>
<path d="${B}" fill="${x.url("wht")}"/>
<path d="${rrp(72, 30, 46, 58, 16)}" fill="${x.url("glass")}"/>
${lens(x, 95, 58, 12)}${led(x, 95, 37, 1.5, null, true)}
<circle cx="95" cy="80" r="2.2" fill="#1a1d28"/>
${gl(x, rrp(74, 32, 40, 20, 10), .3)}
${ringLight(x, 95, 134, 15, 4.2, .16)}
<circle cx="95" cy="134" r="10.5" fill="${x.url("whtv")}"/><circle cx="95" cy="134" r="10.5" fill="none" stroke="#000" stroke-opacity=".2"/>
${screw(x, 95, 167, 2.4)}
${hl("M70 42V160", .7, 1.6)}<path d="${B}" fill="none" stroke="#000" stroke-opacity=".3" stroke-width=".8"/>`;
      return scene(x, "stucco", F + waves(x, 100, 134, 42, "lr"), "", glowE(x, 95, 134, 66, 66, .32));
    } }),

     ring({ id: "package", name: "Package camera", colors: rs("#a78bfa"), cam: [100, 47, 13, 60], render(o) {
      const x = ctx(o), B = rrp(70, 14, 60, 172, 14);
      const F = drop(x, `<path d="${B}"/>`, 4, 6, .55) +
        `<path d="${B}" fill="${x.url("sil")}"/><path d="${rrp(75, 19, 50, 162, 10)}" fill="${x.url("blkv")}"/>
<path d="${rrp(78, 24, 44, 46, 10)}" fill="#04050a"/>${lens(x, 100, 47, 13)}${led(x, 116, 30, 1.5, null, true)}
${ringLight(x, 100, 104, 15, 4.4, .16)}
<circle cx="100" cy="104" r="10.5" fill="${x.url("blkv")}"/><circle cx="100" cy="104" r="10.5" fill="none" stroke="#fff" stroke-opacity=".14"/>
<path d="${rrp(82, 134, 36, 38, 14)}" fill="#05060a"/><path d="M84 146 C90 138 110 138 116 146" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="1.2"/>
${lens(x, 100, 155, 10)}${led(x, 100, 140.5, 1.2, null, false)}
${gl(x, rrp(76, 20, 16, 150, 8), .25)}${hl("M73 30V170", .5, 1.3)}
<path d="${B}" fill="none" stroke="#000" stroke-opacity=".35" stroke-width=".8"/>`;
      return scene(x, "battens", F + waves(x, 100, 104, 40, "lr"), "", glowE(x, 100, 104, 70, 70, .35) + (x.on ? glowE(x, 100, 192, 60, 26, .2) : ""));
    } }),

     fin({ id: "brass", name: "Brass button", colors: fs("#c9a04e"), render(o) {
      const x = ctx(o);
      const btn = x.on
        ? `<circle cx="100" cy="100" r="10" fill="${x.url("ivory")}"/><circle cx="100" cy="100" r="10" fill="#000" fill-opacity=".22"/><circle cx="100" cy="100" r="9.5" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="2"/>`
        : `<circle cx="100" cy="100" r="11" fill="${x.url("ivory")}"/><ellipse cx="96.5" cy="96" rx="5" ry="3.2" fill="#fff" fill-opacity=".6"/>`;
      const F = drop(x, `<circle cx="100" cy="100" r="36"/>`, 4, 6, .6) +
        `<circle cx="100" cy="100" r="36" fill="${x.url("fin")}"/><circle cx="100" cy="100" r="32.5" fill="none" stroke="${H.shade(x.c, -.5)}" stroke-opacity=".6" stroke-width="2"/>
<circle cx="100" cy="100" r="31" fill="${x.url("finr")}"/>
<circle cx="100" cy="100" r="26" fill="none" stroke="#fff" stroke-opacity=".18" stroke-width=".8"/><circle cx="100" cy="100" r="25" fill="none" stroke="#000" stroke-opacity=".18" stroke-width=".8"/>
${screw(x, 100, 76, 2.8)}${screw(x, 100, 124, 2.8)}
<circle cx="100" cy="100" r="15" fill="${x.url("finv")}"/><circle cx="100" cy="100" r="15" fill="#000" fill-opacity=".25"/><circle cx="100" cy="100" r="13" fill="#2a1d0c"/>
${btn}${hl("M74 86 C78 76 86 70 96 67", .55, 2.2)}`;
      return scene(x, "brick", F + waves(x, 100, 100, 46, "lr", "#ffe7b0"), "", glowE(x, 100, 100, 64, 64, .14, "haloW"));
    } }),

     ring({ id: "lighted", name: "Lighted button", colors: rs("#ffb547"), render(o) {
      const x = ctx(o), B = rrp(82, 50, 36, 100, 8);
      const btn = x.on
        ? `<circle cx="100" cy="100" r="8.5" fill="${H.mix(x.c, "#fff", .7)}"/><circle cx="100" cy="100" r="8.5" fill="${x.url("halo")}" opacity="${x.op(.9)}"/>`
        : `<circle cx="100" cy="100" r="8.5" fill="${H.mix(x.c, "#e9e4dc", .7)}" opacity=".85"/><circle cx="100" cy="100" r="8.5" fill="#000" fill-opacity=".25"/>`;
      const F = drop(x, `<path d="${B}"/>`, 3, 5, .55) +
        `<path d="${B}" fill="${x.url("sil")}"/><path d="${rrp(85, 53, 30, 94, 6)}" fill="none" stroke="#000" stroke-opacity=".22"/><path d="${rrp(85.6, 53.6, 28.8, 92.8, 5.5)}" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width=".7"/>
${screw(x, 100, 61, 2.3)}${screw(x, 100, 139, 2.3)}
<circle cx="100" cy="100" r="14" fill="#1e2027"/>${ringLight(x, 100, 100, 11.5, 2.8, .3)}
${btn}<ellipse cx="97" cy="96.5" rx="4" ry="2.4" fill="#fff" fill-opacity=".55"/>
${hl("M85 58V142", .5, 1.2)}`;
      return scene(x, "trim", F + waves(x, 100, 100, 32, "lr"), "", glowE(x, 100, 100, 52, 52, .35));
    } }),

     ring({ id: "intercom", name: "Apartment intercom", colors: rs("#4da3ff"), cam: [100, 32, 6.5, 92], render(o) {
      const x = ctx(o), B = rrp(54, 16, 92, 170, 6), rows = [96, 114, 132, 150, 168];
      let R = "";
      rows.forEach((ry, i) => { const lit = x.on && i === 1;
        R += `<path d="${rrp(64, ry - 6, 52, 12, 2)}" fill="#1a1c22"/><path d="${rrp(65, ry - 5, 50, 10, 1.5)}" fill="${lit ? H.mix("#ece6d4", x.c, .18) : "#cfc8b6"}" opacity="${lit ? 1 : .78}"/>
<path d="M70 ${ry - 1}H104M70 ${ry + 2}H92" stroke="#7d7564" stroke-opacity=".6" stroke-width="1"/>
<circle cx="132" cy="${ry}" r="7" fill="#2a2d35"/>
${lit ? ringLight(x, 132, ry, 5.5, 2, .2) : `<circle cx="132" cy="${ry}" r="5.5" fill="none" stroke="${x.c}" stroke-width="1.6" opacity=".35"/>`}
<circle cx="132" cy="${ry}" r="4" fill="${x.url("silr")}"/>`; });
      const F = drop(x, `<path d="${B}"/>`, 4, 6, .6) +
        `<path d="${B}" fill="${x.url("sil")}"/>${[30, 46, 62, 78, 140, 160].map((y) => `<path d="M56 ${y}H144" stroke="#fff" stroke-opacity=".06"/>`).join("")}
<path d="${rrp(58, 20, 84, 162, 4)}" fill="none" stroke="#000" stroke-opacity=".2"/>
${screw(x, 62, 24, 1.8)}${screw(x, 138, 24, 1.8)}${screw(x, 62, 178, 1.8)}${screw(x, 138, 178, 1.8)}
<path d="${rrp(86, 23, 28, 18, 9)}" fill="#08090d"/>${lens(x, 100, 32, 6.5)}${led(x, 120, 32, 1.6, null, true)}
<circle cx="100" cy="62" r="17" fill="#2a2d35"/><circle cx="100" cy="62" r="15.5" fill="${x.url("silv")}"/>${holes(100, 62, 13, 4.2, 1.15)}
<circle cx="100" cy="62" r="17" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width=".8"/>
${R}${hl("M58 30V176", .4, 1.2)}`;
      return scene(x, "stone", F + waves(x, 100, 62, 52, "lr", null, 7, 26), "", glowE(x, 132, 114, 44, 44, .3));
    } }),

     ring({ id: "gatepost", name: "Gate keypad", colors: rs("#34d399"), cam: [100, 69, 5.6, 44], render(o) {
      const x = ctx(o);
      let gate = "";
      for (let gx = 146; gx < 194; gx += 10) gate += `<rect x="${gx}" y="58" width="3.4" height="112" fill="#15161b"/><path d="M${gx + .8} 58V170" stroke="#5b5f6b" stroke-opacity=".5" stroke-width=".8"/><path d="M${gx - 1} 60 L${gx + 1.7} 52 L${gx + 4.4} 60Z" fill="#15161b"/>`;
      gate += `<rect x="140" y="70" width="56" height="4" fill="#1d1f25"/><rect x="140" y="150" width="56" height="4" fill="#1d1f25"/>`;
      let K = "";
      [100, 112, 124, 136].forEach((ky) => [87, 100, 113].forEach((kx) => {
        K += `<path d="${rrp(kx - 5, ky - 4, 10, 8, 2)}" fill="#16181e"/><path d="${rrp(kx - 5, ky - 4, 10, 8, 2)}" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width=".6"/>
<rect x="${kx - 1.4}" y="${ky - 1.4}" width="2.8" height="2.8" rx=".6" fill="${x.on ? x.hot : x.c}" opacity="${x.on ? x.op(1) : .3}"/>`; }));
      const post = lg(x.id("post"), [[0, "#14161b"], [.35, "#3f4450"], [.55, "#2a2e37"], [1, "#0e0f13"]]);
      const F = `<ellipse cx="100" cy="190" rx="38" ry="5" fill="${x.url("sh")}"/>` +
        `<rect x="72" y="40" width="56" height="152" fill="${x.url("post")}"/><path d="M66 40 L100 26 L134 40Z" fill="#2d313b"/><path d="M66 40 L100 26 L100 40Z" fill="#fff" fill-opacity=".08"/><rect x="66" y="40" width="68" height="5" fill="#1a1c22"/>
${drop(x, `<path d="${rrp(78, 54, 44, 110, 6)}"/>`, 3, 5, .6)}
<path d="${rrp(78, 54, 44, 110, 6)}" fill="${x.url("sil")}"/><path d="${rrp(75, 50, 50, 10, 3)}" fill="${x.url("blk")}"/>
<path d="${rrp(88, 62, 24, 14, 7)}" fill="#07080c"/>${lens(x, 100, 69, 5.6)}${led(x, 114, 69, 1.3, null, true)}
${[82, 85.5, 89].map((y) => `<rect x="88" y="${y}" width="24" height="1.6" rx=".8" fill="#000" fill-opacity=".6"/>`).join("")}
<path d="${rrp(80, 94, 40, 48, 3)}" fill="#0b0c10" opacity=".6"/>${K}
<path d="${rrp(84, 147, 32, 11, 3.5)}" fill="#16181e"/>
${x.on ? `<path d="${rrp(84, 147, 32, 11, 3.5)}" fill="${x.c}" opacity="${x.op(.75)}" ${anim(x, "pulse", x.sp, 0)}/>` : ""}
<path d="M96 155 C96 150 104 150 104 155 Z M99 156 h2" fill="none" stroke="${x.on ? "#fff" : x.c}" stroke-opacity="${x.on ? .95 : .45}" stroke-width="1.1"/>
${hl("M80 64V160", .45, 1.2)}`;
      return scene(x, "yard", F + waves(x, 100, 104, 32, "lr", null, 8, 30), post, `<g class="hda-bg">${gate}</g>` + glowE(x, 100, 118, 60, 60, .3));
    } }),

     ring({ id: "peephole", name: "Peephole camera", colors: rs("#f2f6ff"), cam: [100, 64, 8.5, 32], render(o) {
      const x = ctx(o), B = rrp(84, 40, 32, 112, 16);
      const F = drop(x, `<path d="${B}"/>`, 3, 5, .6) +
        `<path d="${B}" fill="${x.url("blk")}"/><path d="${B}" fill="none" stroke="#fff" stroke-opacity=".12"/>
<circle cx="100" cy="64" r="12" fill="${x.url("sil")}"/><circle cx="100" cy="64" r="12" fill="none" stroke="#000" stroke-opacity=".4" stroke-width=".7"/>${lens(x, 100, 64, 8.5)}
<circle cx="100" cy="88" r="4" fill="#e6e2ea" fill-opacity=".35"/><circle cx="100" cy="88" r="4" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width=".6"/>
${led(x, 100, 101, 1.3, null, true)}
${ringLight(x, 100, 126, 11, 3.4, .18)}
<circle cx="100" cy="126" r="7.5" fill="${x.url("blkv")}"/><circle cx="100" cy="126" r="7.5" fill="none" stroke="#fff" stroke-opacity=".16"/>
${gl(x, rrp(86, 42, 12, 100, 6), .3)}`;
      return scene(x, "reddoor", F + waves(x, 100, 126, 26, "lr", null, 7, 30), "", glowE(x, 100, 126, 48, 48, .32));
    } }),

     ring({ id: "plugin", name: "Plug-in chime", colors: rs("#a78bfa"), render(o) {
      const x = ctx(o);
      const F = drop(x, `<path d="${rrp(66, 26, 68, 150, 6)}"/>`, 2, 3, .45) +
        `<path d="${rrp(66, 26, 68, 150, 6)}" fill="${x.url("wht")}"/><path d="${rrp(66, 26, 68, 150, 6)}" fill="none" stroke="#000" stroke-opacity=".25" stroke-width=".8"/>
<path d="${rrp(84, 124, 32, 38, 10)}" fill="${x.url("whtv")}"/><path d="${rrp(84, 124, 32, 38, 10)}" fill="none" stroke="#000" stroke-opacity=".3"/>
<rect x="91" y="134" width="2.6" height="9" rx="1" fill="#2a2830"/><rect x="106.4" y="134" width="2.6" height="10.5" rx="1" fill="#2a2830"/>
<path d="M97.6 155 V152 A2.4 2.4 0 0 1 102.4 152 V155Z" fill="#2a2830"/>
${screw(x, 100, 117, 2.4)}
${drop(x, `<path d="${rrp(62, 30, 76, 82, 18)}"/>`, 4, 7, .6)}
<path d="${rrp(63, 34, 76, 82, 18)}" fill="#8d8996"/>
<path d="${rrp(62, 30, 76, 82, 18)}" fill="${x.url("wht")}"/><path d="${rrp(62, 30, 76, 82, 18)}" fill="${x.url("whtv")}" opacity=".35"/>
<circle cx="100" cy="68" r="22" fill="#e9e6ee"/><circle cx="100" cy="68" r="22" fill="none" stroke="#000" stroke-opacity=".15"/>${holes(100, 68, 19, 4.6, 1.1)}
${x.on ? `<g ${anim(x, "blink", x.sp * .9, 0)}>${ringLight(x, 100, 68, 26, 2.6, .2)}</g>` : ringLight(x, 100, 68, 26, 2.6, .2)}
<circle cx="126" cy="102" r="3" fill="${x.url("whtv")}"/><circle cx="126" cy="102" r="3" fill="none" stroke="#000" stroke-opacity=".25" stroke-width=".6"/>
${gl(x, rrp(64, 32, 40, 30, 15), .5)}<path d="${rrp(62, 30, 76, 82, 18)}" fill="none" stroke="#000" stroke-opacity=".25" stroke-width=".8"/>`;
      return scene(x, "interior", F + waves(x, 100, 70, 46, "lr"), "", glowE(x, 100, 68, 76, 66, .32));
    } }),

     fin({ id: "tubes", name: "Tube chime", colors: fs("#7a4e2c", ["#b48a5a", "#e8e4dc", "#33353c", "#8a3b2a"]), render(o) {
      const x = ctx(o), T = [[68, 98], [89, 88], [111, 78], [132, 68]];
      let tubes = "", shad = "";
      T.forEach(([tx, len], i) => {
        const y0 = 80;
        shad += `<rect x="${tx - 5.5}" y="${y0}" width="11" height="${len}" rx="5.5"/>`;
        const g = `<path d="M${tx} 68V${y0}" stroke="#1a1410" stroke-width="1.2"/>
<rect x="${tx - 5.5}" y="${y0}" width="11" height="${len}" rx="5.5" fill="${x.url("brs")}"/>
<rect x="${tx - 6}" y="${y0 - 1}" width="12" height="5" rx="2" fill="${x.url("sil")}"/>
<rect x="${tx - 6}" y="${y0 + len - 4}" width="12" height="4" rx="2" fill="#000" fill-opacity=".25"/>
<path d="M${tx - 2.4} ${y0 + 8}V${y0 + len - 8}" stroke="#fff" stroke-opacity=".5" stroke-width="1.4" stroke-linecap="round"/>`;
        tubes += x.on ? `<g ${anim(x, "swing", x.sp * 1.6, -x.sp * .37 * i, "transform-origin:50% 0")}>${g}</g>` : g;
      });
      const p = fpal(x.c);
      const F = drop(x, `<path d="${rrp(52, 22, 96, 48, 6)}"/>`, 3, 6, .6) + drop(x, shad, 6, 6, .4) +
        `${tubes}
<path d="${rrp(52, 22, 96, 48, 6)}" fill="${x.url("finv")}"/><path d="${rrp(52, 22, 96, 48, 6)}" fill="${x.url("fin")}" opacity=".35"/>
<rect x="52" y="22" width="96" height="5" rx="2.5" fill="${p.l}" opacity=".5"/>
<path d="${rrp(62, 30, 76, 32, 3)}" fill="${p.k}" opacity=".85"/>
${[34, 38, 42, 46, 50, 54, 58].map((y) => `<path d="M64 ${y}H136" stroke="${p.l}" stroke-opacity=".18" stroke-width="1.2"/>`).join("")}
<path d="M100 32 C92 38 92 54 100 60 C108 54 108 38 100 32Z" fill="${p.l}" opacity=".25"/>
<path d="${rrp(62, 30, 76, 32, 3)}" fill="none" stroke="#000" stroke-opacity=".4"/>
<path d="M54 68H146" stroke="#000" stroke-opacity=".3" stroke-width="1.4"/>${hl("M56 25H144", .35, 1)}`;
      return scene(x, "sage", F + waves(x, 100, 46, 56, "lr", "#ffe7b0", 8, 26), "", glowE(x, 100, 120, 80, 70, .12, "haloW"));
    } }),

     ring({ id: "smartchime", name: "Smart chime", colors: rs("#4da3ff"), render(o) {
      const x = ctx(o);
      const fab = lg(x.id("fab"), [[0, "#1d1f26"], [.3, "#4b4f5c"], [.5, "#5b6070"], [.75, "#33363f"], [1, "#16171c"]]) +
        `<pattern id="${x.id("knit")}" width="3" height="3" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r=".7" fill="#000" fill-opacity=".35"/></pattern>`;
      const body = `M64 82 V156 A36 9 0 0 0 136 156 V82Z`;
      let top = "";
      if (x.on) {
        top = `<ellipse cx="100" cy="72" rx="56" ry="26" fill="${x.url("halo")}" opacity="${x.op(.65)}" ${anim(x, "pulse", x.sp, 0)}/>
<ellipse cx="100" cy="82" rx="30" ry="7.5" fill="none" stroke="${x.c}" stroke-width="3.4"/><ellipse cx="100" cy="82" rx="30" ry="7.5" fill="none" stroke="${x.hot}" stroke-width="1.4" opacity="${x.op(1)}"/>`;
        for (let i = 0; i < 8; i++) top += `<ellipse cx="100" cy="82" rx="30" ry="7.5" fill="none" stroke="#fff" stroke-width="2.2" stroke-dasharray="7 160" stroke-dashoffset="${-i * 21}" opacity="${i === 0 ? .9 : .12}" ${anim(x, "chase", x.sp, -x.sp * (1 - i / 8))}/>`;
      } else top = `<ellipse cx="100" cy="82" rx="30" ry="7.5" fill="none" stroke="${H.shade(x.c, -.45)}" stroke-width="3.4"/><ellipse cx="100" cy="82" rx="30" ry="7.5" fill="none" stroke="${x.c}" stroke-width="1.4" opacity=".35"/>`;
      const F = `<g class="hda-bg"><rect x="8" y="164" width="184" height="14" fill="${x.url("wood")}"/><rect x="8" y="164" width="184" height="2" fill="#fff" fill-opacity=".2"/><rect x="8" y="176" width="184" height="3" fill="#000" fill-opacity=".35"/>
<rect x="8" y="178" width="184" height="14" fill="#000" fill-opacity=".25"/></g>
<ellipse cx="100" cy="165" rx="44" ry="6" fill="${x.url("sh")}"/>
<path d="${body}" fill="${x.url("fab")}"/><path d="${body}" fill="url(#${x.id("knit")})"/>
<path d="M64 150 A36 9 0 0 0 136 150 V156 A36 9 0 0 1 64 156Z" fill="#000" fill-opacity=".3"/>
<ellipse cx="100" cy="82" rx="36" ry="9" fill="${x.url("blkv")}"/><ellipse cx="100" cy="82" rx="36" ry="9" fill="none" stroke="#fff" stroke-opacity=".18" stroke-width=".8"/>
${top}<ellipse cx="100" cy="82" rx="16" ry="4" fill="#111318"/><ellipse cx="97" cy="81" rx="8" ry="1.6" fill="#fff" fill-opacity=".12"/>
${hl("M72 92V150", .16, 4)}`;
      return scene(x, "navywall", F + waves(x, 100, 114, 50, "lr", null, 8, 28), fab, glowE(x, 100, 80, 90, 60, .25));
    } }),

     fin({ id: "school", name: "School bell", colors: fs("#c8352f", ["#c3c8d0", "#c9a04e", "#7c828c", "#2f6a4a"]), render(o) {
      const x = ctx(o), p = fpal(x.c);
      const arm = `<path d="M100 146 L126 123" stroke="#3a3d45" stroke-width="4.2" stroke-linecap="round"/><path d="M100 146 L126 123" stroke="${x.url("sil")}" stroke-width="2.4" stroke-linecap="round"/>
<circle cx="128" cy="121" r="5.4" fill="${x.url("silr")}"/><circle cx="128" cy="121" r="5.4" fill="none" stroke="#000" stroke-opacity=".35" stroke-width=".7"/>`;
      const F = drop(x, `<circle cx="100" cy="88" r="44"/><rect x="84" y="136" width="32" height="26" rx="4"/>`, 4, 7, .6) +
        `<path d="${rrp(84, 136, 32, 26, 4)}" fill="#5b5f68"/><path d="${rrp(84, 136, 32, 26, 4)}" fill="${x.url("silv")}" opacity=".45"/>
${screw(x, 89, 156, 1.8)}${screw(x, 111, 156, 1.8)}
<circle cx="100" cy="88" r="44" fill="${x.url("finr")}"/><circle cx="100" cy="88" r="44" fill="none" stroke="${p.k}" stroke-width="1.4"/>
<circle cx="100" cy="88" r="39" fill="none" stroke="#000" stroke-opacity=".22" stroke-width="2"/><circle cx="100" cy="88" r="37.4" fill="none" stroke="#fff" stroke-opacity=".16" stroke-width="1"/>
<circle cx="100" cy="88" r="26" fill="none" stroke="#000" stroke-opacity=".14" stroke-width="1.4"/><circle cx="100" cy="88" r="24.6" fill="none" stroke="#fff" stroke-opacity=".12"/>
<path d="M66 70 C72 56 86 48 100 47" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="3.2" stroke-linecap="round"/>
<ellipse cx="82" cy="70" rx="11" ry="6" fill="#fff" fill-opacity=".22" transform="rotate(-35 82 70)"/>
<circle cx="100" cy="88" r="7.5" fill="${x.url("silr")}"/><circle cx="100" cy="88" r="3.4" fill="#2a2d33"/>
${x.on ? `<g ${anim(x, "buzz", Math.max(.1, x.sp * .12), 0, "transform-origin:15% 90%")}>${arm}</g>` : arm}
${hl("M88 139H112", .4, 1)}`;
      return scene(x, "block", F + waves(x, 100, 88, 52, "lr", "#ffe7b0", 8, 30), "", glowE(x, 100, 88, 80, 76, .1, "haloW"));
    } }),

     fin({ id: "twist", name: "Twist bell", colors: fs("#c9a04e"), render(o) {
      const x = ctx(o), B = rrp(80, 44, 40, 112, 20), p = fpal(x.c);
      const key = `<ellipse cx="100" cy="100" rx="17" ry="5.6" fill="${x.url("finv")}"/><ellipse cx="100" cy="100" rx="17" ry="5.6" fill="none" stroke="${p.k}" stroke-width=".9"/>
<path d="M86 98.5 C92 96.5 108 96.5 114 98.5" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1.1" stroke-linecap="round"/>
<circle cx="100" cy="100" r="4.4" fill="${x.url("finr")}"/><circle cx="100" cy="100" r="4.4" fill="none" stroke="${p.k}" stroke-width=".7"/>`;
      const F = drop(x, `<path d="${B}"/>`, 4, 6, .6) +
        `<path d="${B}" fill="${x.url("fin")}"/><path d="${rrp(84, 48, 32, 104, 16)}" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="1.2"/><path d="${rrp(85, 49, 30, 102, 15)}" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width=".7"/>
<path d="M100 60 C94 68 94 74 100 80 C106 74 106 68 100 60Z M100 140 C94 132 94 126 100 120 C106 126 106 132 100 140Z" fill="#000" fill-opacity=".14"/>
${screw(x, 100, 54, 2.4)}${screw(x, 100, 146, 2.4)}
<circle cx="100" cy="100" r="13" fill="${x.url("finr")}"/><circle cx="100" cy="100" r="13" fill="none" stroke="#000" stroke-opacity=".3"/>
${drop(x, `<ellipse cx="100" cy="100" rx="17" ry="5.6"/>`, 1.5, 2.5, .5)}
${x.on ? `<g ${anim(x, "twist", x.sp * 1.4, 0, "transform-origin:50% 50%")}>${key}</g>` : key}
${hl("M83 62V138", .4, 1.4)}`;
      return scene(x, "door", F + waves(x, 100, 100, 32, "lr", "#ffe7b0", 8, 30), "", "");
    } }),

     fin({ id: "shopbell", name: "Shop door bell", colors: fs("#c9a04e"), render(o) {
      const x = ctx(o), p = fpal(x.c);
      const bell = `<path d="M100 36 C100 50 128 46 126 60 C124 70 108 66 108 76" fill="none" stroke="#1c1d22" stroke-width="3.4" stroke-linecap="round"/>
<path d="M100 36 C100 50 128 46 126 60 C124 70 108 66 108 76" fill="none" stroke="#6c707b" stroke-width="1.4" stroke-linecap="round"/>
<circle cx="108" cy="80" r="4.4" fill="${x.url("finr")}"/>
<circle cx="108" cy="133" r="4.4" fill="#2a2116"/>
<path d="M108 82 C95 82 92 92 91 106 C90 118 86 124 79 128 L137 128 C130 124 126 118 125 106 C124 92 121 82 108 82Z" fill="${x.url("fin")}"/>
<path d="M108 82 C95 82 92 92 91 106 C90 118 86 124 79 128 L137 128 C130 124 126 118 125 106 C124 92 121 82 108 82Z" fill="none" stroke="${p.k}" stroke-width=".8"/>
<path d="M96 92 C94 100 94 112 90 122" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="2.4" stroke-linecap="round"/>
<path d="M92 112 C102 115 114 115 124 112" fill="none" stroke="#000" stroke-opacity=".2" stroke-width="1.2"/>
<ellipse cx="108" cy="128" rx="29" ry="4" fill="${p.d}"/><ellipse cx="108" cy="128" rx="25" ry="2.6" fill="${p.k}"/>`;
      const F = `<g class="hda-bg"><rect x="8" y="8" width="184" height="22" fill="${x.url("case")}"/><rect x="8" y="30" width="184" height="4" fill="#000" fill-opacity=".35"/></g>
${drop(x, `<path d="M108 82 C95 82 92 92 91 106 C90 118 86 124 79 128 L137 128 C130 124 126 118 125 106 C124 92 121 82 108 82Z"/>`, 6, 8, .5)}
<path d="${rrp(92, 26, 16, 12, 2)}" fill="#24262c"/>${screw(x, 96, 32, 1.5)}${screw(x, 104, 32, 1.5)}
${x.on ? `<g ${anim(x, "swing", x.sp * 1.2, 0, "transform-origin:15% 0")}>${bell}</g>` : bell}`;
      return scene(x, "greendoor", F + waves(x, 108, 106, 40, "lr", "#ffe7b0", 8, 30), "", glowE(x, 108, 106, 70, 60, .1, "haloW"));
    } }),

     fin({ id: "knocker", name: "Smart knocker", colors: fs("#c9a04e"), render(o) {
      const x = ctx(o), p = fpal(x.c);
      const ring = `<circle cx="100" cy="108" r="30" fill="none" stroke="${p.k}" stroke-width="10"/><circle cx="100" cy="108" r="30" fill="none" stroke="${x.url("fin")}" stroke-width="8"/>
<path d="M76 92 C82 82 92 78 100 78" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1.8" stroke-linecap="round"/>
<circle cx="100" cy="108" r="26" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="1"/>`;
      const F = drop(x, `<path d="${rrp(84, 48, 32, 22, 9)}"/><circle cx="100" cy="108" r="30" fill="none" stroke="#000" stroke-width="10"/><circle cx="100" cy="146" r="8"/>`, 4, 6, .55) +
        `<circle cx="100" cy="146" r="8" fill="${x.url("finr")}"/><circle cx="100" cy="146" r="8" fill="none" stroke="#000" stroke-opacity=".35" stroke-width=".7"/>
<path d="${rrp(84, 48, 32, 22, 9)}" fill="${x.url("fin")}"/><path d="${rrp(84, 48, 32, 22, 9)}" fill="none" stroke="${p.k}" stroke-width=".8"/>
<rect x="88" y="70" width="24" height="7" rx="3" fill="${x.url("finv")}"/>
${x.on ? `<g ${anim(x, "knock", x.sp * 1.1, 0, "transform-origin:50% 0")}>${ring}</g>` : ring}
${drop(x, `<path d="${rrp(132, 50, 18, 24, 7)}"/>`, 2, 3, .5)}
<path d="${rrp(132, 50, 18, 24, 7)}" fill="${x.url("blk")}"/>${led(x, 141, 58, 1.6, "#8fd0ff", true)}
<path d="${rrp(132, 50, 18, 24, 7)}" fill="none" stroke="#fff" stroke-opacity=".14"/>`;
      return scene(x, "navydoor", F + waves(x, 100, 140, 26, "lr", "#ffe7b0", 8, 30), "", glowE(x, 141, 58, 30, 30, .2));
    } }),

     fin({ id: "monitor", name: "Indoor monitor", colors: fs("#2b2d34", ["#e9e7ec", "#b9bec7", "#55585f", "#c9a04e"]), render(o) {
      const x = ctx(o), Fr = rrp(32, 44, 136, 104, 10), p = fpal(x.c);
      const scr = lg(x.id("porch"), [[0, "#f2c58a"], [.35, "#9a6e60"], [1, "#2a2236"]], 0, 0, .6, 1) +
        `<clipPath id="${x.id("sc")}"><rect x="40" y="52" width="94" height="88" rx="3"/></clipPath>`;
      const screen = x.on
        ? `<g clip-path="url(#${x.id("sc")})" opacity="${(.6 + .4 * x.L).toFixed(2)}">
<rect x="40" y="52" width="94" height="88" fill="url(#${x.id("porch")})"/>
<rect x="52" y="58" width="44" height="82" fill="#000" fill-opacity=".15"/><path d="M52 58V140M96 58V140M52 58H96" stroke="#1a1420" stroke-opacity=".5" stroke-width="2"/>
<circle cx="114" cy="62" r="18" fill="#ffe1b0" fill-opacity=".35"/><circle cx="114" cy="62" r="5" fill="#fff4dc"/>
<path d="M58 140 C58 120 66 112 80 110 C94 112 102 120 102 140Z" fill="#17121c"/><circle cx="80" cy="96" r="12" fill="#17121c"/>
<path d="M90 87 C94 91 94 101 90 106" fill="none" stroke="#ffd9a8" stroke-opacity=".6" stroke-width="1.6"/><path d="M96 116 C100 122 101 130 101 138" fill="none" stroke="#ffd9a8" stroke-opacity=".45" stroke-width="1.6"/>
<rect x="40" y="52" width="94" height="88" fill="#000" fill-opacity="${(.45 * (1 - x.L)).toFixed(2)}"/>
<g ${anim(x, "pulse", x.sp, 0)}><path d="${rrp(108, 124, 22, 11, 5.5)}" fill="#22c55e"/><path d="M114 131.5 C115 127 117.5 127 119 129.5 L121 128 C121.5 130.5 119 133 115 132.5Z" fill="#fff"/></g>
</g>`
        : `<rect x="40" y="52" width="94" height="88" rx="3" fill="${x.url("glass")}"/>`;
      const btn = (cy, col, lit) => `<circle cx="151" cy="${cy}" r="6.5" fill="${p.k}"/><circle cx="151" cy="${cy}" r="5.4" fill="${x.url("finr")}"/>
<circle cx="151" cy="${cy}" r="6.5" fill="none" stroke="${col}" stroke-width="1.4" opacity="${lit ? 1 : .35}"/>`;
      const F = drop(x, `<path d="${Fr}"/>`, 4, 7, .6) +
        `<path d="${Fr}" fill="${x.url("finv")}"/><path d="${Fr}" fill="${x.url("fin")}" opacity=".3"/>
${screen}<rect x="40" y="52" width="94" height="88" rx="3" fill="none" stroke="#000" stroke-opacity=".6"/>
<path d="M42 54 L84 54 L44 132Z" fill="#fff" fill-opacity="${x.on ? .06 : .1}"/>
${btn(70, "#22c55e", x.on)}${btn(94, "#8fd0ff", x.on)}${btn(118, "#ff6b6b", false)}
${[134, 137, 140].map((y) => `<rect x="144" y="${y}" width="14" height="1.4" rx=".7" fill="#000" fill-opacity=".45"/>`).join("")}
${led(x, 151, 52, 1.4, "#8fd0ff", false)}
${hl("M38 52 V140", .3, 1.2)}<path d="${Fr}" fill="none" stroke="#000" stroke-opacity=".3" stroke-width=".8"/>`;
      return scene(x, "blush", F, scr, glowE(x, 87, 96, 86, 72, .25, "haloW"));
    } }),

     fin({ id: "mailbox", name: "Mailbox post", colors: fs("#2b2d34", ["#2f5e3c", "#b23a32", "#e9e7ec", "#6b4f3a"]), render(o) {
      const x = ctx(o), p = fpal(x.c), rl = { c: "#8fd0ff" };
      const box = `M40 98 V68 C40 52 52 42 68 42 H134 C150 42 160 52 160 68 V98Z`;
      const xr = Object.assign({}, x, { c: rl.c, hot: H.mix(rl.c, "#fff", .6), url: (s) => s === "halo" ? `url(#${x.id("haloB")})` : x.url(s) });
      const ex = rg(x.id("haloB"), [[0, rl.c, .85], [.42, rl.c, .3], [1, rl.c, 0]]);
      const F = `<ellipse cx="100" cy="190" rx="34" ry="5" fill="${x.url("sh")}"/>
<rect x="84" y="100" width="32" height="92" fill="${x.url("woodh")}"/><path d="M90 104V190M104 102V190" stroke="#2a170a" stroke-opacity=".3" stroke-width=".8"/>
<rect x="50" y="98" width="100" height="7" fill="${x.url("wood")}"/><rect x="50" y="105" width="100" height="2" fill="#000" fill-opacity=".35"/>
${drop(x, `<path d="${box}"/>`, 3, 5, .5)}
<path d="${box}" fill="${x.url("finv")}"/><path d="M40 98 V68 C40 52 52 42 68 42 H76 C60 42 50 52 50 68 V98Z" fill="#000" fill-opacity=".25"/>
<path d="M46 62 C50 50 60 46 72 46 H132" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="2" stroke-linecap="round"/>
<path d="M58 44 V98 M146 46 V98" stroke="#000" stroke-opacity=".2" stroke-width="1.2"/>
<path d="M150 64 V82" stroke="#1a1b20" stroke-width="3"/><path d="M146 58 H160 V70 H146Z" fill="#c8352f"/><path d="M146 58 H160 V61 H146Z" fill="#fff" fill-opacity=".25"/>
${drop(x, `<path d="${rrp(89, 116, 22, 48, 10)}"/>`, 2, 4, .55)}
<path d="${rrp(89, 116, 22, 48, 10)}" fill="${x.url("blk")}"/>${lens(x, 100, 128, 5)}
${ringLight(xr, 100, 148, 7.5, 2.4, .18)}<circle cx="100" cy="148" r="5" fill="${x.url("blkv")}"/>
<path d="${rrp(89, 116, 22, 48, 10)}" fill="none" stroke="#fff" stroke-opacity=".14"/>`;
      return scene(x, "yard", F + waves(xr, 100, 148, 20, "lr", null, 7, 30), ex, glowE(xr, 100, 148, 44, 44, .3));
    } }),
  ];

  (window.HDA = window.HDA || []).push({
    id: "doorbell",
    tab: "Doorbells",
    group: "More",
    kind: "device",
    intro: "Doorbells and chimes, each on its own door, frame or wall. On means it is ringing (someone is at the door): rings chase, sound ripples, tubes and bells swing, screens light up. Off is idle with a soft standby glow. The video doorbells now live as styles in the Video doorbell builder.",
    css: `.hda-doorbell-chase,.hda-doorbell-wave,.hda-doorbell-pulse,.hda-doorbell-blink{animation-timing-function:linear;animation-iteration-count:infinite}
.hda-anim .hda-doorbell-chase{animation-name:hda-doorbell-chase}
.hda-anim .hda-doorbell-wave{animation-name:hda-doorbell-wave;animation-timing-function:ease-out}
.hda-anim .hda-doorbell-pulse{animation-name:hda-doorbell-pulse;animation-timing-function:ease-in-out}
.hda-anim .hda-doorbell-blink{animation-name:hda-doorbell-blink;animation-timing-function:steps(1,end)}
.hda-doorbell-swing,.hda-doorbell-buzz,.hda-doorbell-twist,.hda-doorbell-knock{transform-box:fill-box}
.hda-anim .hda-doorbell-swing{animation:hda-doorbell-swing 1.6s ease-in-out infinite}
.hda-anim .hda-doorbell-buzz{animation:hda-doorbell-buzz .14s linear infinite}
.hda-anim .hda-doorbell-twist{animation:hda-doorbell-twist 2s ease-in-out infinite}
.hda-anim .hda-doorbell-knock{animation:hda-doorbell-knock 1.4s ease-in-out infinite}
@keyframes hda-doorbell-chase{0%{opacity:1}35%{opacity:.15}100%{opacity:.15}}
@keyframes hda-doorbell-wave{0%{opacity:0}25%{opacity:1}100%{opacity:0}}
@keyframes hda-doorbell-pulse{0%,100%{opacity:1}50%{opacity:.45}}
@keyframes hda-doorbell-blink{0%{opacity:1}50%{opacity:.12}}
@keyframes hda-doorbell-swing{0%,100%{transform:rotate(-7deg)}50%{transform:rotate(7deg)}}
@keyframes hda-doorbell-buzz{0%,100%{transform:rotate(0deg)}50%{transform:rotate(-9deg)}}
@keyframes hda-doorbell-twist{0%,100%{transform:rotate(0deg)}35%,65%{transform:rotate(85deg)}}
@keyframes hda-doorbell-knock{0%,30%,100%{transform:scale(1,1)}45%{transform:scale(1,.8)}60%{transform:scale(1,1)}70%{transform:scale(1,.9)}80%{transform:scale(1,1)}}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-doorbell-chase,.hda-anim .hda-doorbell-wave,.hda-anim .hda-doorbell-pulse,.hda-anim .hda-doorbell-blink,.hda-anim .hda-doorbell-swing,.hda-anim .hda-doorbell-buzz,.hda-anim .hda-doorbell-twist,.hda-anim .hda-doorbell-knock{animation:none}}` + CK.css,
    icons,
    all: icons, 
  });
})();
