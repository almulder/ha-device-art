(function () {
  const H = window.HDAH, P = "hda-security-";
  const f = (n) => (+n).toFixed(1);
  const R = Math.PI / 180;
  const rnd = (seed) => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
  const rot = (px, py, cx, cy, d) => { const a = d * R, c = Math.cos(a), s = Math.sin(a), dx = px - cx, dy = py - cy; return [cx + dx * c - dy * s, cy + dx * s + dy * c]; };
  const RED = "#ff3b3b", BLUE = "#4da3ff", GREEN = "#34d399", WARM = "#fff1d1", IRC = "#ff3a52", FOV = "#bfe3ff";

  // ---------- (parts) Multi-Function: floodlight / spotlight cameras = Light + Siren (switches) + Motion (stage);
  // sirens = an Alarm stage (off / siren / strobe / both, Hubitat's alarm attribute); alarm keypads / panels = an Arm
  // state stage (disarmed / home / away / night / alarm). Stage values come in o.pval[id] and are used only as a
  // Multi-Function Image (o.mf); a Device Image (no o.mf, no parts) is drawn exactly as before.
  const SV = (o, k) => (o.mf && o.pval && o.pval[k] != null && o.pval[k] !== "" ? String(o.pval[k]) : null);
  const pon = (o, k) => (o.parts && o.parts[k] != null ? !!o.parts[k] : !o.mf && !!o.on);
  const ARM = { id: "arm", name: "Arm state", type: "stage", values: [["disarmed", "Disarmed"], ["home", "Armed home"], ["away", "Armed away"], ["night", "Armed night"], ["alarm", "Alarm"]], def: "disarmed" };
  const ALM = { id: "alarm", name: "Alarm", type: "stage", values: [["off", "Off"], ["siren", "Siren"], ["strobe", "Strobe"], ["both", "Siren + strobe"]], def: "off" };
  const CAM = [{ id: "light", name: "Light", type: "switch" }, { id: "siren", name: "Siren", type: "switch" },
    { id: "motion", name: "Motion", type: "stage", values: [["inactive", "No motion"], ["active", "Motion"]], def: "inactive" }];
  function ctx(o) {
    const c = o.color || "#eceef1", lv = o.level == null ? 1 : o.level, arm = SV(o, "arm"), al = SV(o, "alarm");
    const on = arm ? arm !== "disarmed" : al ? al !== "off" : !!o.on;
    const L = on ? .4 + .6 * lv : 0;
    return { c, on, lv, L, id: (s) => `${o.uid}-${s}`, url: (s) => `url(#${o.uid}-${s})`, op: (k) => (k * L).toFixed(2), sp: 1.7 - .9 * lv,
      mf: !!o.mf, st: arm || (on ? "away" : "disarmed"), alarm: arm === "alarm",
      siren: al ? al === "siren" || al === "both" : on, strobe: al ? al === "strobe" || al === "both" : on };
  }
  // the same drawing context with another on (a part's own on)
  const xo = (x, on) => { if (on === x.on) return x; const L = on ? .4 + .6 * x.lv : 0; return Object.assign({}, x, { on, L, op: (k) => (k * L).toFixed(2) }); };
  const homeish = (x) => x.mf && (x.st === "home" || x.st === "night");
  // armed home = a house in place of the lock, armed night = a crescent moon
  const modeG = (x, cx, cy, s, col, lockFn) => !homeish(x) ? lockFn() : x.st === "home"
    ? `<path d="M${f(cx - 6 * s)} ${f(cy + 7 * s)}V${f(cy + 1 * s)}L${cx} ${f(cy - 5 * s)}L${f(cx + 6 * s)} ${f(cy + 1 * s)}V${f(cy + 7 * s)}Z" fill="${col}"/><rect x="${f(cx - 1.6 * s)}" y="${f(cy + 3 * s)}" width="${f(3.2 * s)}" height="${f(4 * s)}" fill="#000" fill-opacity=".35"/>`
    : `<path d="M${f(cx + 1 * s)} ${f(cy - 5 * s)}A${f(6.5 * s)} ${f(6.5 * s)} 0 1 0 ${f(cx + 6 * s)} ${f(cy + 5 * s)}A${f(5 * s)} ${f(5 * s)} 0 1 1 ${f(cx + 1 * s)} ${f(cy - 5 * s)}Z" fill="${col}"/>`;
  const alarmFx = (x, cx, cy, r) => (x.alarm ? `<g class="${P}strobe" style="animation-duration:.9s"><circle cx="${cx || 100}" cy="${cy || 100}" r="${r || 92}" fill="${x.url("hR")}" opacity=".75"/></g>` : "");
  const stops = (a) => a.map(([o, c, op]) => `<stop offset="${o}" stop-color="${c}"${op == null ? "" : ` stop-opacity="${op}"`}/>`).join("");
  const lg = (id, a, x1, y1, x2, y2) => `<linearGradient id="${id}" x1="${x1 || 0}" y1="${y1 || 0}" x2="${x2 == null ? 1 : x2}" y2="${y2 || 0}">${stops(a)}</linearGradient>`;
  const rg = (id, a, cx, cy, r) => `<radialGradient id="${id}" cx="${cx == null ? .5 : cx}" cy="${cy == null ? .5 : cy}" r="${r || .5}">${stops(a)}</radialGradient>`;
  const rrp = (x, y, w, h, r) => `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`;

  const WALL = {
    siding: ["#4f5966", "#353c46"], brick: ["#64402f", "#452a20"], stucco: ["#625b50", "#463f37"], battens: ["#3d434c", "#272b32"],
    stone: ["#3a3833", "#28261f"], block: ["#5b5d62", "#3e4045"], garage: ["#55575c", "#393b40"], soffit: ["#4b5563", "#323a46"],
    fence: ["#6a4a30", "#3f2a1b"], interior: ["#55505e", "#3b3744"], sage: ["#48544c", "#313a34"], blush: ["#5c4954", "#41333c"],
    navy: ["#323b54", "#20273a"], slate: ["#4a5361", "#323945"], cream: ["#655d4f", "#463f34"], ceiling: ["#565062", "#3b3646"],
    nursery: ["#5e4d5c", "#433642"], casing: ["#4f4a57", "#36323d"], corner: ["#5b5d62", "#3e4045"],
  };

  function bpal(c) { return { l: H.shade(c, .5), m: c, d: H.shade(c, -.3), k: H.shade(c, -.56) }; }

  function defs(x, kind, extra) {
    const { c, id } = x, w = WALL[kind] || WALL.interior, p = bpal(c);
    return `<defs>
${lg(id("wallg"), [[0, w[0]], [1, w[1]]], 0, 0, 0, 1)}
<clipPath id="${id("wc")}"><rect x="8" y="8" width="184" height="184" rx="16"/></clipPath>
${rg(id("vig"), [[0, "#000", 0], [.62, "#000", .05], [1, "#000", .5]], .5, .48, .74)}
${rg(id("sh"), [[0, "#000", .6], [.6, "#000", .22], [1, "#000", 0]])}
${lg(id("bh"), [[0, p.k], [.14, p.d], [.36, p.l], [.55, p.m], [.84, p.d], [1, p.k]])}
${lg(id("bv"), [[0, p.l], [.45, p.m], [1, p.k]], 0, 0, 0, 1)}
${lg(id("bvd"), [[0, p.d], [1, p.k]], 0, 0, 0, 1)}
${rg(id("br"), [[0, H.shade(c, .72)], [.35, p.l], [.72, p.m], [1, p.k]], .36, .3, .78)}
${lg(id("blk"), [[0, "#07080b"], [.22, "#262a35"], [.4, "#454a5c"], [.62, "#1c1f28"], [1, "#06070a"]])}
${lg(id("blkv"), [[0, "#3c4152"], [.45, "#1a1d25"], [1, "#09090d"]], 0, 0, 0, 1)}
${rg(id("lens"), [[0, "#5c6fb0"], [.25, "#28335e"], [.6, "#0e1226"], [1, "#03040a"]], .4, .36, .6)}
${lg(id("gloss"), [[0, "#fff", .55], [.5, "#fff", .06], [1, "#fff", 0]], 0, 0, 1, 1)}
${lg(id("glass"), [[0, "#1c2030"], [.5, "#0b0d15"], [1, "#05060a"]], 0, 0, 1, 1)}
${rg(id("dome"), [[0, "#6a7494", .55], [.5, "#1d2232", .82], [1, "#05060a", .96]], .4, .2, .8)}
${lg(id("sil"), [[0, "#4d525c"], [.18, "#9ca2ad"], [.4, "#eef1f6"], [.58, "#c9ced8"], [.82, "#7d838e"], [1, "#454a54"]])}
${rg(id("silr"), [[0, "#ffffff"], [.45, "#c3c8d2"], [1, "#5b606b"]], .38, .32, .7)}
${lg(id("brs"), [[0, "#5e3e12"], [.2, "#b8893a"], [.38, "#fbe7a6"], [.56, "#c99a48"], [.8, "#7a5118"], [1, "#4d3210"]])}
${lg(id("wood"), [[0, "#c8996a"], [.5, "#a87a4e"], [1, "#6a4528"]], 0, 0, 0, 1)}
${lg(id("woodt"), [[0, "#8a5f3c"], [1, "#b4845a"]], 0, 0, 0, 1)}
${lg(id("white"), [[0, "#f4f1ec"], [1, "#c9c4bb"]], 0, 0, 0, 1)}
${lg(id("whitet"), [[0, "#bdb7ad"], [1, "#e9e5de"]], 0, 0, 0, 1)}
${lg(id("dark"), [[0, "#3a3532"], [1, "#1f1b19"]], 0, 0, 0, 1)}
${lg(id("darkt"), [[0, "#2a2522"], [1, "#4a433e"]], 0, 0, 0, 1)}
${lg(id("rub"), [[0, "#e6e4ea"], [.6, "#b9b6c0"], [1, "#7f7c88"]], 0, 0, 0, 1)}
${rg(id("lampOn"), [[0, "#ffffff"], [.5, "#fff6e2"], [1, "#ffd99a"]], .5, .4, .7)}
${lg(id("lampOff"), [[0, "#e3e5ea"], [.5, "#b2b7bf"], [1, "#7d838c"]], 0, 0, 0, 1)}
${rg(id("redb"), [[0, "#ff8a8f"], [.4, "#e2343c"], [1, "#7a0f16"]], .38, .32, .75)}
${rg(id("frost"), [[0, "#ffffff"], [.5, "#dfe3ea"], [1, "#8d95a3"]], .38, .32, .75)}
${rg(id("hR"), [[0, RED, .85], [.42, RED, .3], [1, RED, 0]])}
${rg(id("hB"), [[0, BLUE, .85], [.42, BLUE, .3], [1, BLUE, 0]])}
${rg(id("hG"), [[0, GREEN, .8], [.42, GREEN, .25], [1, GREEN, 0]])}
${rg(id("hW"), [[0, WARM, .9], [.45, WARM, .3], [1, WARM, 0]])}
${rg(id("hI"), [[0, IRC, .7], [.45, IRC, .22], [1, IRC, 0]])}
<pattern id="${id("cells")}" width="7" height="7" patternUnits="userSpaceOnUse"><rect width="7" height="7" fill="#16244a"/><rect x=".5" y=".5" width="6" height="6" fill="#203668"/><path d="M0 3.5H7M3.5 0V7" stroke="#6f8ac0" stroke-opacity=".25" stroke-width=".4"/></pattern>
<filter id="${id("bl")}" x="-25%" y="-25%" width="150%" height="150%"><feGaussianBlur stdDeviation="2.6"/></filter>
${extra || ""}</defs>`;
  }

  function texture(kind, x) {
    const r = rnd(kind.length * 977 + kind.charCodeAt(0) * 31 + kind.charCodeAt(1)); let s = "";
    const noise = (n, big, a) => { let t = ""; for (let i = 0; i < n; i++) t += `<circle cx="${f(10 + r() * 180)}" cy="${f(10 + r() * 180)}" r="${f(.3 + r() * big)}" fill="${r() > .5 ? "#000" : "#fff"}" fill-opacity="${(a + r() * .07).toFixed(2)}"/>`; return t; };
    const laps = (y0) => { let t = ""; for (let y = y0; y < 192; y += 16) t += `<rect x="8" y="${y}" width="184" height="7" fill="#fff" fill-opacity=".035"/><path d="M8 ${y + 15} H192" stroke="#000" stroke-opacity=".45" stroke-width="2.2"/><path d="M8 ${y + 16.6} H192" stroke="#fff" stroke-opacity=".08" stroke-width="1"/>`; return t; };
    const blocks = () => { let t = ""; for (let row = 0, y = 8; y < 192; y += 20, row++) {
      for (let bx = 8 - (row % 2) * 20; bx < 192; bx += 40) { const v = r();
        t += `<rect x="${f(bx + 1.2)}" y="${f(y + 1.2)}" width="37.6" height="17.6" rx="1" fill="${v > .5 ? "#000" : "#fff"}" fill-opacity="${(.02 + v * .05).toFixed(2)}"/><path d="M${bx} ${y}v20" stroke="#d6d4d0" stroke-opacity=".14" stroke-width="2"/>`; }
      t += `<path d="M8 ${y}H192" stroke="#d6d4d0" stroke-opacity=".16" stroke-width="2"/><path d="M8 ${y + 1.8}H192" stroke="#000" stroke-opacity=".18" stroke-width=".8"/>`; } return t + noise(80, .8, .05); };
    if (kind === "siding") s += laps(8);
    else if (kind === "soffit") {
      s += laps(46) + `<rect x="8" y="8" width="184" height="30" fill="#868b95"/><rect x="8" y="8" width="184" height="30" fill="#000" fill-opacity=".25"/>`;
      for (let vx = 10; vx < 192; vx += 6) s += `<path d="M${vx} 8V38" stroke="#000" stroke-opacity=".22" stroke-width="1.2"/><path d="M${vx + 1.2} 8V38" stroke="#fff" stroke-opacity=".08" stroke-width=".6"/>`;
      s += `<rect x="8" y="36" width="184" height="9" fill="#9da2ab"/><rect x="8" y="36" width="184" height="2" fill="#fff" fill-opacity=".25"/><rect x="8" y="44" width="184" height="18" fill="#000" fill-opacity=".28"/><rect x="8" y="45" width="184" height="5" fill="#000" fill-opacity=".25"/>`;
    } else if (kind === "brick") {
      for (let row = 0, y = 8; y < 192; y += 12, row++) {
        for (let bx = 8 - (row % 2) * 13; bx < 192; bx += 26) { const v = r();
          s += `<rect x="${f(bx + .9)}" y="${f(y + .9)}" width="24.2" height="10.2" rx="1.3" fill="${v > .5 ? "#000" : "#e3a07f"}" fill-opacity="${(.04 + v * .1).toFixed(2)}"/><path d="M${bx} ${y}v12" stroke="#c9b8a8" stroke-opacity=".16" stroke-width="1.6"/>`; }
        s += `<path d="M8 ${y}H192" stroke="#c9b8a8" stroke-opacity=".18" stroke-width="1.6"/><path d="M8 ${y + 1.5}H192" stroke="#000" stroke-opacity=".2" stroke-width=".8"/>`;
      }
    } else if (kind === "battens") {
      for (let bx = 8; bx < 192; bx += 30) { const v = r();
        s += `<rect x="${bx}" y="8" width="30" height="184" fill="${v > .5 ? "#fff" : "#000"}" fill-opacity="${(.02 + v * .04).toFixed(2)}"/><rect x="${bx - 3}" y="8" width="6" height="184" fill="#fff" fill-opacity=".06"/><path d="M${bx + 3} 8V192" stroke="#000" stroke-opacity=".45" stroke-width="1.6"/>`; }
    } else if (kind === "stone") {
      const rows = [24, 21, 28, 23, 26, 22, 28, 24]; let y = 8;
      rows.forEach((h) => { let bx = 8 - r() * 26;
        while (bx < 192) { const w = 28 + r() * 30, v = r(), col = H.mix("#8f877a", "#5b554c", v);
          s += `<rect x="${f(bx + 1.2)}" y="${f(y + 1.2)}" width="${f(w - 2.4)}" height="${f(h - 2.4)}" rx="3.5" fill="${col}"/><path d="M${f(bx + 3)} ${f(y + 2)}H${f(bx + w - 4)}" stroke="#fff" stroke-opacity=".14" stroke-width="1.2" stroke-linecap="round"/><path d="M${f(bx + 3)} ${f(y + h - 1.6)}H${f(bx + w - 3)}" stroke="#000" stroke-opacity=".3" stroke-width="1.4" stroke-linecap="round"/>`;
          bx += w; }
        y += h; });
      s += noise(60, .7, .05);
    } else if (kind === "block" || kind === "corner") {
      s += blocks();
      if (kind === "corner") s += `<rect x="8" y="8" width="34" height="184" fill="#000" fill-opacity=".32"/><path d="M42 8V192" stroke="#fff" stroke-opacity=".14" stroke-width="1.4"/>`;
    } else if (kind === "garage") {
      s += blocks() + `<rect x="8" y="8" width="184" height="24" fill="${x.url("wood")}"/><path d="M8 14C60 12 120 16 192 13M8 22C70 24 130 20 192 23" stroke="#3a2414" stroke-opacity=".35" stroke-width=".7" fill="none"/><rect x="8" y="30" width="184" height="2" fill="#2a170a" fill-opacity=".6"/><rect x="8" y="32" width="184" height="16" fill="#000" fill-opacity=".22"/>
<path d="M150 192V120Q150 112 158 112H192" fill="none" stroke="#9aa0aa" stroke-width="5"/><path d="M150 192V120Q150 112 158 112H192" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="1.2"/>`;
    } else if (kind === "fence") {
      for (let bx = 8; bx < 192; bx += 23) { const v = r();
        s += `<rect x="${bx + 1}" y="8" width="21" height="184" fill="${H.mix("#8a6342", "#5a3c26", v)}"/>`;
        for (let k = 0; k < 4; k++) { const gx = bx + 3 + r() * 16; s += `<path d="M${f(gx)} 8C${f(gx + 2)} 70 ${f(gx - 2)} 130 ${f(gx + 1)} 192" fill="none" stroke="#2a170a" stroke-opacity="${(.15 + r() * .15).toFixed(2)}" stroke-width=".7"/>`; }
        s += `<path d="M${bx + .5} 8V192" stroke="#120a05" stroke-opacity=".7" stroke-width="1.6"/><path d="M${bx + 2.2} 8V192" stroke="#fff" stroke-opacity=".1" stroke-width=".8"/>`; }
      s += `<rect x="8" y="160" width="184" height="12" fill="#6e4d32"/><rect x="8" y="160" width="184" height="2" fill="#fff" fill-opacity=".14"/><rect x="8" y="172" width="184" height="4" fill="#000" fill-opacity=".35"/>`;
    } else if (kind === "nursery") {
      for (let yy = 18, row = 0; yy < 192; yy += 22, row++) for (let xx = 18 + (row % 2) * 11; xx < 192; xx += 22)
        s += `<path d="M${xx} ${yy - 3}L${f(xx + .9)} ${f(yy - .9)}L${xx + 3} ${yy}L${f(xx + .9)} ${f(yy + .9)}L${xx} ${yy + 3}L${f(xx - .9)} ${f(yy + .9)}L${xx - 3} ${yy}L${f(xx - .9)} ${f(yy - .9)}Z" fill="#ffe6f0" fill-opacity=".16"/>`;
      s += noise(30, .5, .03);
    } else if (kind === "ceiling") {
      s += noise(40, .5, .03) + `<rect x="8" y="8" width="184" height="16" fill="#8f8a9a"/><rect x="8" y="24" width="184" height="6" fill="#d9d5e0" fill-opacity=".55"/><rect x="8" y="30" width="184" height="3" fill="#000" fill-opacity=".3"/><rect x="8" y="33" width="184" height="12" fill="#000" fill-opacity=".12"/><path d="M8 25H192" stroke="#fff" stroke-opacity=".4" stroke-width="1"/>`;
    } else if (kind === "casing") {
      s += noise(40, .5, .03) + `<rect x="152" y="8" width="40" height="184" fill="#d8d3cb"/><rect x="152" y="8" width="40" height="184" fill="#000" fill-opacity=".38"/><path d="M158 8V192M164 8V192" stroke="#000" stroke-opacity=".25" stroke-width="1.2"/><path d="M153 8V192" stroke="#fff" stroke-opacity=".3" stroke-width="1.2"/><rect x="146" y="8" width="6" height="184" fill="#000" fill-opacity=".22"/><rect x="176" y="8" width="16" height="184" fill="#2a2420" fill-opacity=".85"/>`;
    } else if (kind === "stucco") s += noise(150, 1.1, .04);
    else s += noise(46, .6, .04);
    return s;
  }
  function shelf(x, y, mat) {
    const m = mat || "wood";
    return `<rect x="8" y="${y + 16}" width="184" height="14" fill="#000" fill-opacity=".3"/><rect x="8" y="${y - 8}" width="184" height="12" fill="${x.url(m + "t")}"/>
<rect x="8" y="${y + 4}" width="184" height="13" fill="${x.url(m === "wood" ? "wood" : m)}"/><path d="M8 ${y + 4.5}H192" stroke="#fff" stroke-opacity=".3" stroke-width="1"/><path d="M8 ${y + 17}H192" stroke="#000" stroke-opacity=".45" stroke-width="1.4"/>
${m === "wood" ? `<path d="M8 ${y + 9}C60 ${y + 7} 120 ${y + 11} 192 ${y + 8}M8 ${y + 13}C70 ${y + 14} 130 ${y + 11} 192 ${y + 13}M8 ${y - 3}C70 ${y - 4} 130 ${y - 1} 192 ${y - 3}" stroke="#3a2414" stroke-opacity=".3" stroke-width=".7" fill="none"/>` : ""}`;
  }
  function scene(x, kind, body, o2) {
    o2 = o2 || {};
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs(x, kind, o2.extra)}
<g class="hda-bg"><rect x="8" y="8" width="184" height="184" rx="16" fill="${x.url("wallg")}"/>
<g clip-path="${x.url("wc")}">${texture(kind, x)}${o2.shelf ? shelf(x, o2.shelf, o2.mat) : ""}${o2.under || ""}<rect x="8" y="8" width="184" height="184" fill="${x.url("vig")}"/>
${o2.clip || ""}</g>
<rect x="8.5" y="8.5" width="183" height="183" rx="15.5" fill="none" stroke="#fff" stroke-opacity=".07"/></g>
<g clip-path="${x.url("wc")}">${body}</g></svg>`;
  }

  const drop = (x, shape, dx, dy, a) => `<g transform="translate(${dx == null ? 3.5 : dx} ${dy == null ? 5 : dy})" fill="#000" stroke="none" opacity="${a || .5}" filter="${x.url("bl")}">${shape}</g>`;
  const hl = (d, a, w) => `<path d="${d}" fill="none" stroke="#fff" stroke-opacity="${a}" stroke-width="${w}" stroke-linecap="round"/>`;
  const edge = (d, a) => `<path d="${d}" fill="none" stroke="#000" stroke-opacity="${a || .35}" stroke-width=".8"/>`;
  const gl = (x, d, a) => `<path d="${d}" fill="${x.url("gloss")}" opacity="${a || .35}"/>`;
  const anim = (cls, dur, delay) => `class="${P}${cls}" style="animation-duration:${f(dur)}s;animation-delay:${(delay || 0).toFixed(2)}s"`;
  const glowE = (x, cx, cy, rx, ry, k, g) => x.on ? `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${x.url(g)}" opacity="${x.op(k)}"/>` : "";
  const contact = (x, cx, cy, rx, ry) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${x.url("sh")}"/>`;
  const screw = (x, cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${x.url("silr")}"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#000" stroke-opacity=".35" stroke-width=".6"/><path d="M${f(cx - r * .6)} ${f(cy + r * .3)}L${f(cx + r * .6)} ${f(cy - r * .3)}" stroke="#2a2d33" stroke-width="${f(r * .35)}" stroke-linecap="round"/>`;

  function lens(x, cx, cy, r) {
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#020306"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#5a6070" stroke-opacity=".6" stroke-width="${f(r * .1)}"/>
<circle cx="${cx}" cy="${cy}" r="${f(r * .7)}" fill="${x.url("lens")}"/><circle cx="${cx}" cy="${cy}" r="${f(r * .3)}" fill="#010104"/>
<circle cx="${cx}" cy="${cy}" r="${f(r * .5)}" fill="none" stroke="${x.on ? "#ff6a7a" : "#8a7cf0"}" stroke-opacity="${x.on ? .45 : .28}" stroke-width="${f(r * .08)}"/>
<ellipse cx="${f(cx - r * .3)}" cy="${f(cy - r * .32)}" rx="${f(r * .22)}" ry="${f(r * .13)}" fill="#fff" fill-opacity=".7" transform="rotate(-35 ${f(cx - r * .3)} ${f(cy - r * .32)})"/>
<circle cx="${f(cx + r * .3)}" cy="${f(cy + r * .3)}" r="${f(r * .07)}" fill="#fff" fill-opacity=".45"/>`;
  }
  function irRing(x, cx, cy, Rr, n, r) {
    let s = "", g = "";
    for (let i = 0; i < n; i++) {
      const a = (i / n) * 2 * Math.PI - Math.PI / 2, px = f(cx + Rr * Math.cos(a)), py = f(cy + Rr * Math.sin(a));
      s += `<circle cx="${px}" cy="${py}" r="${r}" fill="#120c10"/><circle cx="${px}" cy="${py}" r="${f(r * .6)}" fill="${x.on ? "#ff4a5e" : "#3a2a36"}" opacity="${x.on ? x.op(1) : .9}"/>`;
      if (x.on) g += `<circle cx="${px}" cy="${py}" r="${f(r * 3.4)}" fill="${x.url("hI")}"/>`;
    }
    if (!x.on) return s;
    return `<circle cx="${cx}" cy="${cy}" r="${f(Rr * 2)}" fill="${x.url("hI")}" opacity="${x.op(.55)}" ${anim("ir", 2.6, 0)}/>${s}<g opacity="${x.op(.9)}" ${anim("ir", 2.6, 0)}>${g}</g>`;
  }
  function sled(x, cx, cy, r, col, offGreen) {
    const h = col === BLUE ? "hB" : "hR";
    if (x.on) return `<g ${anim("blink", 1.2, 0)}><circle cx="${cx}" cy="${cy}" r="${f(r * 4.5)}" fill="${x.url(h)}" opacity="${x.op(1)}"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="${col || RED}"/><circle cx="${f(cx - r * .3)}" cy="${f(cy - r * .3)}" r="${f(r * .45)}" fill="#fff" fill-opacity=".85"/></g>`;
    if (offGreen) return `<circle cx="${cx}" cy="${cy}" r="${f(r * 2.6)}" fill="${x.url("hG")}" opacity=".35"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="${GREEN}"/><circle cx="${f(cx - r * .3)}" cy="${f(cy - r * .3)}" r="${f(r * .4)}" fill="#fff" fill-opacity=".7"/>`;
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#1b1e28"/><circle cx="${cx}" cy="${cy}" r="${f(r * .5)}" fill="${H.shade(col || RED, -.5)}" opacity=".6"/>`;
  }
  function cone(x, ax, ay, ang, len, spread, col, k, sweep) {
    if (!x.on) return "";
    const a1 = (ang - spread) * R, a2 = (ang + spread) * R, gid = x.id(`cn${Math.round(ax)}x${Math.round(ay)}`);
    const p1 = `${f(ax + len * Math.cos(a1))} ${f(ay + len * Math.sin(a1))}`, p2 = `${f(ax + len * Math.cos(a2))} ${f(ay + len * Math.sin(a2))}`;
    const kk = (k || 1) * x.L;
    let s = `<defs><radialGradient id="${gid}" gradientUnits="userSpaceOnUse" cx="${f(ax)}" cy="${f(ay)}" r="${len}">${stops([[0, col, (.5 * kk).toFixed(2)], [.55, col, (.17 * kk).toFixed(2)], [1, col, 0]])}</radialGradient></defs>
<path d="M${f(ax)} ${f(ay)}L${p1}A${len} ${len} 0 0 1 ${p2}Z" fill="url(#${gid})"/>
<path d="M${f(ax)} ${f(ay)}L${p1}M${f(ax)} ${f(ay)}L${p2}" stroke="url(#${gid})" stroke-width="1.2" stroke-dasharray="3 4"/>`;
    if (sweep) s = `<g ${anim("sweep", sweep, 0)}><circle cx="${f(ax)}" cy="${f(ay)}" r="${len}" fill="none"/>${s}</g>`;
    return s;
  }
  function waves(x, cx, cy, r0, col, gap, span) {
    if (!x.on) return "";
    gap = gap || 9; span = span || 32; col = col || RED;
    const arc = (r, a1, a2) => { const p = (a) => [cx + r * Math.cos(a * R), cy + r * Math.sin(a * R)]; const A = p(a1), B = p(a2); return `M${f(A[0])} ${f(A[1])}A${r} ${r} 0 0 1 ${f(B[0])} ${f(B[1])}`; };
    let s = ""; const d = x.sp * 1.2;
    [0, 180].forEach((a) => { for (let i = 0; i < 3; i++) {
      const rr = r0 + i * gap, sp2 = span - i * 4;
      s += `<path d="${arc(rr, a - sp2, a + sp2)}" fill="none" stroke="${col}" stroke-width="${f(3.2 - i * .7)}" stroke-linecap="round" opacity="${(.9 - i * .22).toFixed(2)}" ${anim("wave", d, i * d * .22)}/>`;
    } });
    return `<g opacity="${(.5 + .5 * x.L).toFixed(2)}">${s}</g>`;
  }
  function lockG(cx, cy, s, col, open) {
    const w = 10 * s, h = 8 * s, sh = open ? `M${f(cx - w * .3)} ${f(cy - h * .1)}V${f(cy - h * .62)}A${f(w * .3)} ${f(w * .3)} 0 0 1 ${f(cx + w * .3)} ${f(cy - h * .62)}V${f(cy - h * .55)}` : `M${f(cx - w * .3)} ${f(cy)}V${f(cy - h * .5)}A${f(w * .3)} ${f(w * .3)} 0 0 1 ${f(cx + w * .3)} ${f(cy - h * .5)}V${f(cy)}`;
    const shift = open ? ` transform="translate(${f(-w * .32)} ${f(-h * .1)})"` : "";
    return `<path d="${sh}" fill="none" stroke="${col}" stroke-width="${f(1.6 * s)}" stroke-linecap="round"${shift}/><rect x="${f(cx - w / 2)}" y="${f(cy)}" width="${f(w)}" height="${f(h)}" rx="${f(1.4 * s)}" fill="${col}"/><circle cx="${cx}" cy="${f(cy + h * .45)}" r="${f(1 * s)}" fill="#000" fill-opacity=".45"/>`;
  }
  const shield = (cx, cy, s) => `M${cx} ${f(cy - 20 * s)}L${f(cx + 16 * s)} ${f(cy - 14 * s)}V${cy}Q${f(cx + 16 * s)} ${f(cy + 15 * s)} ${cx} ${f(cy + 22 * s)}Q${f(cx - 16 * s)} ${f(cy + 15 * s)} ${f(cx - 16 * s)} ${cy}V${f(cy - 14 * s)}Z`;
  function strobe(x, d, cx, cy, col, h, rr) {
    const base = H.shade(col, -.55);
    let s = `<path d="${d}" fill="${base}"/><path d="${d}" fill="${col}" opacity=".28"/>`;
    if (x.on) s += `<path d="${d}" fill="${H.mix(col, "#ffffff", .25)}" opacity="${x.op(.75)}"/><g ${anim("strobe", 1.1, 0)}><circle cx="${cx}" cy="${cy}" r="${rr || 64}" fill="${x.url(h)}" opacity="${x.op(.9)}"/><path d="${d}" fill="${H.mix(col, "#ffffff", .55)}"/><path d="${d}" fill="#fff" opacity="${x.op(.5)}"/></g>`;
    return s + `<path d="${d}" fill="${x.url("gloss")}" opacity=".45"/><path d="${d}" fill="none" stroke="#000" stroke-opacity=".4" stroke-width=".8"/>`;
  }

  const SW = ["#eceef1", "#2a2c31", "#8d939b", "#6b4e36", "#4a4e55", "#cbbd9f"];
  const sw = (first, n) => [first].concat(SW.filter((c) => c !== first)).slice(0, n || 5);
  const body = (d) => Object.assign({ picker: true, colorLabel: "Body" }, d);

  const icons = [
     body({ id: "bullet", name: "Bullet camera", colors: sw("#eceef1"), render(o) {
      const x = ctx(o), A = rot(42, 98, 108, 96, -14);
      const F = cone(x, A[0], A[1], 166, 150, 20, FOV, 1) +
        drop(x, `<path d="${rrp(40, 70, 124, 46, 16)}" transform="rotate(-14 108 96)"/><rect x="110" y="40" width="12" height="40"/>`, 3, 8, .5) +
        `<rect x="104" y="35" width="24" height="6" rx="2" fill="${x.url("bvd")}"/><rect x="111" y="40" width="10" height="40" fill="${x.url("bh")}"/>${edge("M111 40V80M121 40V80", .3)}
<circle cx="116" cy="80" r="8" fill="${x.url("br")}"/>
<g transform="rotate(-14 108 96)">
<path d="${rrp(138, 83, 22, 28, 9)}" fill="${x.url("bvd")}"/><path d="M156 86V108" stroke="#000" stroke-opacity=".25" stroke-width="1.4"/>
<path d="${rrp(54, 82, 92, 31, 14)}" fill="${x.url("bv")}"/><path d="${rrp(54, 82, 92, 31, 14)}" fill="${x.url("bh")}" opacity=".25"/>
<path d="M62 108H140" stroke="#000" stroke-opacity=".2" stroke-width="2"/>${hl("M66 98H136", .25, 1.4)}
<path d="M38 80Q38 73 46 73H146Q153 73 153 80V87H46Q38 87 38 80Z" fill="${x.url("bv")}"/>${hl("M46 74.6H146", .6, 1.2)}<path d="M46 87H153" stroke="#000" stroke-opacity=".4" stroke-width="1.4"/>
<ellipse cx="53" cy="99" rx="11" ry="15" fill="${x.url("blk")}"/><ellipse cx="52" cy="99" rx="8.6" ry="12.6" fill="#05060a"/>
<g transform="translate(52 99) scale(.62 1) translate(-52 -99)">${irRing(x, 52, 99, 10, 8, 1.2)}${lens(x, 52, 99, 6.6)}</g>
${sled(x, 72, 106, 1.6)}<path d="${rrp(54, 82, 92, 31, 14)}" fill="none" stroke="#000" stroke-opacity=".3" stroke-width=".8"/>
</g>`;
      return scene(x, "soffit", F);
    } }),

     body({ id: "dome", name: "Dome camera", colors: sw("#eceef1"), render(o) {
      const x = ctx(o), D = "M56 54A44 46 0 0 0 144 54Z";
      const F = cone(x, 100, 90, 92, 110, 30, FOV, 1) + drop(x, `<path d="${rrp(50, 34, 100, 22, 8)}"/><path d="${D}"/>`, 3, 7, .55) +
        `<path d="${rrp(50, 34, 100, 22, 8)}" fill="${x.url("bh")}"/>${hl("M58 36.5H142", .6, 1.2)}<path d="M52 47H148" stroke="#000" stroke-opacity=".18" stroke-width="1"/>
<ellipse cx="100" cy="54" rx="47" ry="5" fill="${x.url("bvd")}"/>
<path d="${D}" fill="#0a0c12"/><path d="M68 56A32 27 0 0 0 132 56Z" fill="#14171f"/><path d="M76 58H124" stroke="#2c3140" stroke-width="2"/>
<g transform="translate(100 76) scale(1 .82) translate(-100 -76)"><circle cx="100" cy="76" r="20" fill="${x.url("blk")}"/>${irRing(x, 100, 76, 16, 10, 1.3)}${lens(x, 100, 76, 10)}</g>
<path d="${D}" fill="${x.url("dome")}" opacity=".55"/>
<path d="M64 60A38 40 0 0 0 84 92" fill="none" stroke="#fff" stroke-opacity=".38" stroke-width="3.4" stroke-linecap="round"/><ellipse cx="124" cy="66" rx="7" ry="3" fill="#fff" fill-opacity=".18" transform="rotate(35 124 66)"/>
<path d="${D}" fill="none" stroke="#fff" stroke-opacity=".15"/>${sled(x, 136, 45, 1.7)}`;
      return scene(x, "soffit", F);
    } }),

     body({ id: "turret", name: "Turret camera", colors: sw("#eceef1"), render(o) {
      const x = ctx(o);
      const F = drop(x, `<circle cx="100" cy="112" r="54"/>`, 4, 7, .55) +
        `<circle cx="100" cy="112" r="54" fill="${x.url("bv")}"/><circle cx="100" cy="112" r="54" fill="${x.url("bh")}" opacity=".3"/><circle cx="100" cy="112" r="50" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="1.2"/>
<circle cx="100" cy="112" r="54" fill="none" stroke="#000" stroke-opacity=".35" stroke-width=".8"/>
${screw(x, 100, 64, 2.2)}${screw(x, 58, 136, 2.2)}${screw(x, 142, 136, 2.2)}
<circle cx="100" cy="110" r="42" fill="${x.url("bvd")}"/><circle cx="100" cy="110" r="42" fill="none" stroke="#000" stroke-opacity=".3"/>
${drop(x, `<circle cx="100" cy="106" r="36"/>`, 2, 4, .5)}<circle cx="100" cy="106" r="36" fill="${x.url("br")}"/>
${glowE(x, 100, 116, 46, 42, .45, "hI")}
<ellipse cx="100" cy="116" rx="25" ry="23" fill="${x.url("blk")}"/><ellipse cx="100" cy="116" rx="22" ry="20" fill="${x.url("glass")}"/>
${irRing(x, 100, 116, 16, 10, 1.3)}${lens(x, 100, 116, 9.5)}
<path d="M70 104A32 30 0 0 1 130 104L126 99A28 26 0 0 0 74 99Z" fill="${x.url("bv")}"/>${hl("M76 99A27 25 0 0 1 124 99", .5, 1)}
<ellipse cx="88" cy="84" rx="12" ry="6" fill="#fff" fill-opacity=".3" transform="rotate(-25 88 84)"/>
${sled(x, 100, 136, 1.6)}`;
      return scene(x, "brick", F);
    } }),

     body({ id: "cube", name: "Indoor cube", colors: sw("#eceef1"), render(o) {
      const x = ctx(o);
      const F = contact(x, 100, 150, 30, 5) + `<path d="M108 146C120 150 150 150 192 151" fill="none" stroke="#1a1c22" stroke-width="2.4"/>
<ellipse cx="100" cy="149" rx="20" ry="4.6" fill="${x.url("bvd")}"/><path d="${rrp(92, 124, 16, 26, 5)}" fill="${x.url("bh")}"/>
${drop(x, `<path d="${rrp(64, 60, 72, 72, 18)}"/>`, 3, 6, .5)}
<path d="${rrp(64, 60, 72, 72, 18)}" fill="${x.url("bh")}"/><path d="${rrp(64, 60, 72, 72, 18)}" fill="${x.url("bv")}" opacity=".4"/>${hl("M80 62H120", .6, 1.4)}
<path d="${rrp(71, 67, 58, 58, 12)}" fill="${x.url("blk")}"/><path d="${rrp(71, 67, 58, 58, 12)}" fill="${x.url("blkv")}" opacity=".5"/>
${glowE(x, 100, 92, 30, 30, .4, "hI")}<circle cx="100" cy="92" r="17" fill="#05060a"/>${irRing(x, 100, 92, 14.5, 6, 1.1)}${lens(x, 100, 92, 11)}
<circle cx="118" cy="76" r="1.6" fill="#2a2e3a"/>${sled(x, 100, 115, 1.8, BLUE)}
${gl(x, rrp(73, 69, 54, 24, 10), .25)}<path d="${rrp(64, 60, 72, 72, 18)}" fill="none" stroke="#000" stroke-opacity=".3" stroke-width=".8"/>`;
      return scene(x, "interior", F, { shelf: 150 });
    } }),

     body({ id: "pantilt", name: "Pan-tilt camera", colors: sw("#eceef1"), render(o) {
      const x = ctx(o), u = x.id("hc");
      const face = `<ellipse cx="100" cy="92" rx="23" ry="23" fill="${x.url("blk")}"/><ellipse cx="100" cy="92" rx="20" ry="20" fill="${x.url("glass")}"/>${lens(x, 100, 92, 11)}<circle cx="100" cy="76" r="1.4" fill="#2a2e3a"/>
<ellipse cx="94" cy="83" rx="8" ry="4" fill="#fff" fill-opacity=".16" transform="rotate(-30 94 83)"/>`;
      const F = contact(x, 100, 156, 38, 6) +
        `<path d="M70 128V150A30 6 0 0 0 130 150V128Z" fill="${x.url("bh")}"/><ellipse cx="100" cy="128" rx="30" ry="6" fill="${x.url("bv")}"/>${hl("M72 134V148", .3, 1.2)}
<path d="M74 140A26 4.5 0 0 0 126 140" fill="none" stroke="#000" stroke-opacity=".25"/>${sled(x, 100, 147, 1.7, BLUE)}
<path d="${rrp(90, 112, 20, 18, 5)}" fill="${x.url("bh")}"/>
${drop(x, `<circle cx="100" cy="88" r="34"/>`, 3, 5, .5)}<circle cx="100" cy="88" r="34" fill="${x.url("br")}"/>
<clipPath id="${u}"><circle cx="100" cy="88" r="33"/></clipPath>
${glowE(x, 100, 92, 34, 30, .3, "hI")}
<g clip-path="url(#${u})"><g ${x.on ? anim("pan", 6, 0) : ""}>${face}</g></g>
<path d="M68 82A34 10 0 0 0 132 82" fill="none" stroke="#000" stroke-opacity=".14" stroke-width="1.2"/><ellipse cx="88" cy="66" rx="10" ry="5" fill="#fff" fill-opacity=".35" transform="rotate(-25 88 66)"/>`;
      return scene(x, "sage", F, { shelf: 156 });
    } }),

     body({ id: "flood", name: "Floodlight camera", colors: sw("#eceef1"), parts: CAM, render(o) {
      const x = ctx(o), Lc = rot(58, 75, 82, 54, -24), Rc = rot(142, 75, 118, 54, 24);
      const lt = xo(x, pon(o, "light")), xm = o.mf ? xo(x, SV(o, "motion") === "active") : x, sir = o.mf && pon(o, "siren");
      const lamp = (x0, face) => `<path d="${rrp(x0, 46, 56, 32, 10)}" fill="${x.url("bh")}"/><path d="${rrp(x0, 46, 56, 32, 10)}" fill="${x.url("bv")}" opacity=".45"/>${hl(`M${x0 + 8} 47.5H${x0 + 48}`, .55, 1.2)}
<path d="${rrp(x0 + 4, 58, 48, 17, 6)}" fill="${face}"/>${lt.on ? "" : `<path d="M${x0 + 10} 62H${x0 + 46}M${x0 + 10} 66.5H${x0 + 46}M${x0 + 10} 71H${x0 + 46}" stroke="#000" stroke-opacity=".2" stroke-width=".8"/>`}
<path d="${rrp(x0 + 4, 58, 48, 17, 6)}" fill="none" stroke="#000" stroke-opacity=".35" stroke-width=".8"/>`;
      const face = lt.on ? x.url("lampOn") : x.url("lampOff");
      const F = cone(lt, Lc[0], Lc[1], 118, 150, 26, WARM, 1.2) + cone(lt, Rc[0], Rc[1], 62, 150, 26, WARM, 1.2) +
        drop(x, `<path d="${rrp(80, 26, 40, 30, 8)}"/><path d="${rrp(28, 46, 56, 32, 10)}" transform="rotate(-24 82 54)"/><path d="${rrp(116, 46, 56, 32, 10)}" transform="rotate(24 118 54)"/><path d="${rrp(80, 82, 40, 48, 18)}"/>`, 3, 7, .5) +
        `<path d="${rrp(80, 26, 40, 30, 8)}" fill="${x.url("bv")}"/>${hl("M86 28H114", .6, 1)}${edge(rrp(80, 26, 40, 30, 8))}
<g transform="rotate(-24 82 54)">${lamp(28, face)}</g><g transform="rotate(24 118 54)">${lamp(116, face)}</g>
<circle cx="82" cy="54" r="5" fill="${x.url("br")}"/><circle cx="118" cy="54" r="5" fill="${x.url("br")}"/>
${glowE(lt, Lc[0], Lc[1], 34, 22, .9, "hW")}${glowE(lt, Rc[0], Rc[1], 34, 22, .9, "hW")}
<path d="${rrp(94, 54, 12, 32, 4)}" fill="${x.url("bh")}"/>
<path d="${rrp(80, 82, 40, 48, 18)}" fill="${x.url("bh")}"/><path d="${rrp(80, 82, 40, 48, 18)}" fill="${x.url("bv")}" opacity=".4"/>
<ellipse cx="100" cy="110" rx="14" ry="15" fill="${x.url("blk")}"/>${irRing(xm, 100, 110, 11, 6, 1)}${lens(x, 100, 110, 7.5)}
${sled(xm, 100, 90, 1.5)}<circle cx="100" cy="125" r="2.4" fill="${x.url("frost")}"/>${edge(rrp(80, 82, 40, 48, 18))}${sir ? waves(xo(x, true), 100, 106, 30, RED, 9, 30) : ""}`;
      return scene(x, "siding", F);
    } }),

     body({ id: "spot", name: "Spotlight camera", colors: sw("#2a2c31"), parts: CAM, render(o) {
      const x = ctx(o), lt = xo(x, pon(o, "light")), xm = o.mf ? xo(x, SV(o, "motion") === "active") : x, sir = o.mf && pon(o, "siren");
      const strip = lt.on ? `<path d="${rrp(76, 66, 48, 11, 5.5)}" fill="${x.url("lampOn")}"/><path d="${rrp(76, 66, 48, 11, 5.5)}" fill="#fff" opacity="${lt.op(.5)}"/>`
        : `<path d="${rrp(76, 66, 48, 11, 5.5)}" fill="#2c3038"/>${[84, 92, 100, 108, 116].map((cx) => `<circle cx="${cx}" cy="71.5" r="2.2" fill="#4a505c"/><circle cx="${cx - .6}" cy="70.9" r=".7" fill="#fff" fill-opacity=".4"/>`).join("")}`;
      const F = (lt.on ? `<ellipse cx="100" cy="190" rx="90" ry="40" fill="${x.url("hW")}" opacity="${lt.op(.6)}"/>` : "") +
        `<path d="${rrp(86, 168, 28, 12, 4)}" fill="${x.url("bv")}"/><path d="${rrp(95, 148, 10, 22, 4)}" fill="${x.url("bh")}"/><circle cx="100" cy="148" r="7" fill="${x.url("br")}"/>
${drop(x, `<path d="${rrp(62, 50, 76, 96, 24)}"/>`, 4, 7, .55)}
<path d="${rrp(62, 50, 76, 96, 24)}" fill="${x.url("bh")}"/><path d="${rrp(62, 50, 76, 96, 24)}" fill="${x.url("bv")}" opacity=".35"/>
<path d="${rrp(68, 56, 64, 84, 19)}" fill="${x.url("blk")}"/><path d="${rrp(68, 56, 64, 84, 19)}" fill="${x.url("blkv")}" opacity=".5"/>
${strip}${glowE(lt, 100, 71, 60, 34, 1, "hW")}
<circle cx="100" cy="104" r="20" fill="#05060a"/>${irRing(xm, 100, 104, 17, 8, 1.2)}${lens(x, 100, 104, 12.5)}
${[90, 95, 100, 105, 110].map((cx) => `<circle cx="${cx}" cy="131" r="1.1" fill="#000" fill-opacity=".8"/>`).join("")}${sled(xm, 122, 126, 1.6)}
${gl(x, rrp(70, 58, 60, 30, 16), .22)}${edge(rrp(62, 50, 76, 96, 24))}${sir ? waves(xo(x, true), 100, 100, 46, RED, 8, 26) : ""}`;
      return scene(x, "battens", F);
    } }),

     body({ id: "battery", name: "Wire-free camera", colors: sw("#eceef1"), render(o) {
      const x = ctx(o);
      const F = `<circle cx="108" cy="166" r="13" fill="${x.url("bv")}"/>${edge("M95 166A13 13 0 0 0 121 166", .3)}<path d="M104 164L102 142H110L112 164Z" fill="${x.url("bh")}"/><circle cx="105" cy="140" r="7.5" fill="${x.url("br")}"/>
${drop(x, `<ellipse cx="104" cy="94" rx="36" ry="46"/>`, 4, 7, .55)}
<g transform="rotate(-8 104 94)"><ellipse cx="104" cy="94" rx="36" ry="46" fill="${x.url("br")}"/><ellipse cx="104" cy="94" rx="36" ry="46" fill="${x.url("bh")}" opacity=".25"/>
<ellipse cx="104" cy="80" rx="26" ry="24" fill="${x.url("blk")}"/><ellipse cx="104" cy="80" rx="26" ry="24" fill="${x.url("blkv")}" opacity=".5"/>
${glowE(x, 104, 82, 30, 28, .4, "hI")}${irRing(x, 104, 82, 15.5, 6, 1.1)}${lens(x, 104, 82, 10.5)}
${sled(x, 104, 63, 1.6, BLUE)}
<circle cx="104" cy="120" r="7.5" fill="${x.url("frost")}"/><path d="M98 120H110M104 114V126" stroke="#000" stroke-opacity=".1" stroke-width=".8"/>
<ellipse cx="90" cy="66" rx="10" ry="5" fill="#fff" fill-opacity=".2" transform="rotate(-35 90 66)"/>
<ellipse cx="104" cy="94" rx="36" ry="46" fill="none" stroke="#000" stroke-opacity=".3" stroke-width=".8"/></g>`;
      return scene(x, "stucco", F);
    } }),

     body({ id: "solar", name: "Solar camera", colors: sw("#eceef1"), render(o) {
      const x = ctx(o), A = [55, 69], B = [143, 56], C = [149, 85], D = [61, 98];
      const lp = (p, q, t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
      let grid = "";
      [.2, .4, .6, .8].forEach((t) => { const a = lp(A, B, t), b = lp(D, C, t); grid += `M${f(a[0])} ${f(a[1])}L${f(b[0])} ${f(b[1])}`; });
      const m1 = lp(A, D, .5), m2 = lp(B, C, .5); grid += `M${f(m1[0])} ${f(m1[1])}L${f(m2[0])} ${f(m2[1])}`;
      const F = drop(x, `<path d="M50 66L146 52L154 88L58 102Z"/><path d="${rrp(70, 106, 60, 46, 16)}"/>`, 4, 8, .55) +
        `<path d="${rrp(93, 150, 14, 26, 3)}" fill="${x.url("bvd")}"/>${screw(x, 100, 170, 1.8)}
<path d="${rrp(96, 86, 8, 24, 3)}" fill="${x.url("bh")}"/><circle cx="100" cy="88" r="5" fill="${x.url("br")}"/>
<path d="M50 66L146 52L154 88L58 102Z" fill="${x.url("sil")}"/><path d="M55 69L143 56L149 85L61 98Z" fill="${x.url("cells")}"/>
<path d="${grid}" stroke="#c9d4ea" stroke-opacity=".5" stroke-width=".9"/>
<path d="M55 69L143 56L146 70L58 83Z" fill="#fff" opacity=".12"/>${hl("M51 66L146 52", .55, 1)}
${x.on ? `<path d="M70 92L120 70" stroke="#fff" stroke-opacity="${x.op(.3)}" stroke-width="5" stroke-linecap="round"/>` : ""}
<path d="${rrp(70, 106, 60, 46, 16)}" fill="${x.url("bh")}"/><path d="${rrp(70, 106, 60, 46, 16)}" fill="${x.url("bv")}" opacity=".4"/>
<path d="${rrp(76, 112, 48, 34, 12)}" fill="${x.url("blk")}"/>${irRing(x, 100, 129, 12.5, 6, 1)}${lens(x, 100, 129, 9)}
${sled(x, 118, 119, 1.5)}${edge(rrp(70, 106, 60, 46, 16))}`;
      return scene(x, "fence", F);
    } }),

     body({ id: "baby", name: "Baby monitor", colors: sw("#eceef1", 6).filter((c) => c !== "#4a4e55").concat(["#f3c6d3", "#bfe3d0"]).slice(0, 6), render(o) {
      const x = ctx(o);
      const note = (nx, ny, d) => `<g ${anim("float", 3.2, d)}><g opacity="${x.op(.85)}"><ellipse cx="${nx}" cy="${ny}" rx="3.6" ry="2.7" fill="#ffe6f0" transform="rotate(-20 ${nx} ${ny})"/><path d="M${nx + 3.2} ${ny - 1}V${ny - 15}Q${nx + 8} ${ny - 12} ${nx + 9} ${ny - 7}" fill="none" stroke="#ffe6f0" stroke-width="1.4" stroke-linecap="round"/></g></g>`;
      const F = contact(x, 100, 150, 34, 5) +
        `${x.on ? `<ellipse cx="100" cy="150" rx="46" ry="12" fill="${x.url("hW")}" opacity="${x.op(.75)}"/>` : ""}
<path d="M74 140V147A26 5 0 0 0 126 147V140Z" fill="${x.url("bh")}"/><ellipse cx="100" cy="140" rx="26" ry="5" fill="${x.url("bv")}"/>
<path d="M76 145A24 4.4 0 0 0 124 145" fill="none" stroke="${x.on ? "#fff3d8" : "#9a958f"}" stroke-width="2" opacity="${x.on ? .95 : .6}"/>
<path d="M95 138L96 112H104L105 138Z" fill="${x.url("bh")}"/>
${drop(x, `<ellipse cx="100" cy="86" rx="38" ry="31"/>`, 3, 6, .5)}
<ellipse cx="100" cy="86" rx="38" ry="31" fill="${x.url("br")}"/><ellipse cx="100" cy="86" rx="38" ry="31" fill="none" stroke="#000" stroke-opacity=".25" stroke-width=".8"/>
<ellipse cx="100" cy="89" rx="25" ry="20" fill="${x.url("blk")}"/>${glowE(x, 100, 89, 28, 24, .35, "hI")}
${irRing(x, 100, 89, 15, 4, 1)}${lens(x, 100, 89, 9)}${sled(x, 100, 64, 1.5, BLUE)}
<ellipse cx="84" cy="66" rx="11" ry="5" fill="#fff" fill-opacity=".35" transform="rotate(-20 84 66)"/>
${x.on ? note(142, 70, 0) + note(52, 64, -1.6) : ""}`;
      return scene(x, "nursery", F, { shelf: 150, mat: "white" });
    } }),

     body({ id: "ptz", name: "PTZ camera", colors: sw("#eceef1"), render(o) {
      const x = ctx(o), D = "M78 98A32 32 0 0 0 142 98Z";
      const F = cone(x, 110, 124, 90, 70, 18, FOV, 1.1, 7) +
        drop(x, `<path d="${rrp(20, 34, 18, 48, 5)}"/><rect x="30" y="44" width="84" height="12"/><path d="${rrp(76, 70, 68, 30, 8)}"/><path d="${D}"/>`, 4, 7, .55) +
        `<path d="${rrp(20, 34, 18, 48, 5)}" fill="${x.url("bv")}"/>${screw(x, 29, 42, 1.8)}${screw(x, 29, 74, 1.8)}
<path d="M34 44H104Q114 44 114 54V64H102V56H34Z" fill="${x.url("bv")}"/>${hl("M36 45.5H104", .55, 1)}${edge("M34 56H102V64")}
<path d="${rrp(100, 60, 20, 12, 3)}" fill="${x.url("bh")}"/>
<path d="${rrp(76, 70, 68, 30, 8)}" fill="${x.url("bh")}"/><ellipse cx="110" cy="71" rx="33" ry="4" fill="${x.url("bv")}"/>${hl("M80 76V94", .3, 1.2)}
<path d="M78 98H142" stroke="#000" stroke-opacity=".4" stroke-width="1.4"/>
<path d="${D}" fill="#0a0c12"/>
<g transform="translate(110 110) scale(1 .78) translate(-110 -110)"><circle cx="110" cy="110" r="15" fill="${x.url("blk")}"/>${irRing(x, 110, 110, 12, 8, 1.1)}${lens(x, 110, 110, 8)}</g>
<path d="${D}" fill="${x.url("dome")}" opacity=".5"/><path d="M84 102A26 26 0 0 0 98 124" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="2.6" stroke-linecap="round"/>
${sled(x, 134, 86, 1.6)}${edge(rrp(76, 70, 68, 30, 8))}`;
      return scene(x, "corner", F);
    } }),

     body({ id: "dual", name: "4K dual-lens", colors: sw("#2a2c31"), render(o) {
      const x = ctx(o);
      const F = drop(x, `<path d="${rrp(148, 86, 26, 48, 6)}"/><path d="${rrp(64, 38, 72, 124, 24)}"/>`, 4, 7, .55) +
        `<path d="${rrp(148, 86, 26, 48, 6)}" fill="${x.url("bv")}"/>${screw(x, 161, 94, 1.8)}${screw(x, 161, 126, 1.8)}
<rect x="128" y="102" width="22" height="14" fill="${x.url("bv")}"/>${edge("M128 102H150M128 116H150")}
<path d="${rrp(66, 46, 68, 114, 22)}" fill="${x.url("bh")}"/><path d="${rrp(66, 46, 68, 114, 22)}" fill="${x.url("bv")}" opacity=".35"/>
<path d="M60 52Q60 38 76 38H124Q140 38 140 52V58Q120 52 100 52Q80 52 60 58Z" fill="${x.url("bv")}"/>${hl("M74 40H126", .55, 1.2)}<path d="M60 58Q80 52 100 52Q120 52 140 58" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="1.2"/>
<path d="${rrp(72, 60, 56, 94, 18)}" fill="${x.url("blk")}"/><path d="${rrp(72, 60, 56, 94, 18)}" fill="${x.url("blkv")}" opacity=".5"/>
${glowE(x, 100, 104, 40, 56, .35, "hI")}
<circle cx="100" cy="82" r="17" fill="#05060a"/>${lens(x, 100, 82, 13)}<circle cx="100" cy="126" r="17" fill="#05060a"/>${lens(x, 100, 126, 13)}
${[84, 92, 108, 116].map((cx) => `<circle cx="${cx}" cy="104" r="1.8" fill="#120c10"/><circle cx="${cx}" cy="104" r="1.1" fill="${x.on ? "#ff4a5e" : "#3a2a36"}"/>${x.on ? `<circle cx="${cx}" cy="104" r="5" fill="${x.url("hI")}" ${anim("ir", 2.6, 0)}/>` : ""}`).join("")}
${sled(x, 100, 146, 1.6)}${gl(x, rrp(74, 62, 52, 30, 16), .2)}${edge(rrp(66, 46, 68, 114, 22))}`;
      return scene(x, "stone", F);
    } }),

     body({ id: "indoorsiren", name: "Indoor siren", colors: sw("#eceef1"), parts: [ALM], render(o) {
      const x = ctx(o);
      let grille = "";
      [19, 25, 31, 37].forEach((r) => { grille += `<circle cx="100" cy="106" r="${r}" fill="none" stroke="#000" stroke-opacity=".38" stroke-width="2.2" stroke-dasharray="${f(r * .5)} 2.6"/><circle cx="100" cy="107" r="${r}" fill="none" stroke="#fff" stroke-opacity=".18" stroke-width=".7" stroke-dasharray="${f(r * .5)} 2.6"/>`; });
      const ring = x.strobe ? `<circle cx="100" cy="106" r="30" fill="${x.url("hR")}" opacity="${x.op(.7)}" ${anim("pulse", x.sp, 0)}/><circle cx="100" cy="106" r="11" fill="none" stroke="${RED}" stroke-width="4"/><circle cx="100" cy="106" r="11" fill="none" stroke="#ffd0d0" stroke-width="1.4" opacity="${x.op(1)}"/>`
        : `<circle cx="100" cy="106" r="11" fill="none" stroke="#3a2226" stroke-width="4"/>`;
      const F = drop(x, `<circle cx="100" cy="106" r="48"/>`, 4, 7, .55) +
        `<circle cx="100" cy="106" r="48" fill="${x.url("bv")}"/><circle cx="100" cy="106" r="48" fill="${x.url("bh")}" opacity=".3"/>
<circle cx="100" cy="106" r="42" fill="${x.url("br")}"/><circle cx="100" cy="106" r="42" fill="none" stroke="#000" stroke-opacity=".2"/>${grille}
<circle cx="100" cy="106" r="13.5" fill="${x.url("bv")}"/>${ring}<circle cx="100" cy="106" r="7" fill="${x.url("br")}"/>
<ellipse cx="82" cy="78" rx="14" ry="6" fill="#fff" fill-opacity=".3" transform="rotate(-30 82 78)"/>${sled(x, 100, 146, 1.6, RED, true)}
<circle cx="100" cy="106" r="48" fill="none" stroke="#000" stroke-opacity=".3" stroke-width=".8"/>${waves(xo(x, x.siren), 100, 106, 56)}`;
      return scene(x, "ceiling", F);
    } }),

     body({ id: "outsiren", name: "Strobe siren", colors: sw("#eceef1"), parts: [ALM], render(o) {
      const x = ctx(o), Hs = "M74 50H126L146 70V152L126 172H74L54 152V70Z", In = "M78 58H122L138 74V148L122 164H78L62 148V74Z";
      let lv = ""; for (let y = 112; y <= 150; y += 6.5) lv += `<path d="${rrp(74, y, 52, 3.4, 1.7)}" fill="#000" fill-opacity=".5"/><path d="M76 ${f(y + 4.2)}H124" stroke="#fff" stroke-opacity=".2" stroke-width=".7"/>`;
      const F = drop(x, `<path d="${Hs}"/>`, 4, 7, .55) +
        `<path d="${Hs}" fill="${x.url("bv")}"/><path d="${Hs}" fill="${x.url("bh")}" opacity=".35"/><path d="${In}" fill="${x.url("br")}"/>${edge(In, .25)}${lv}
${strobe(xo(x, x.strobe), rrp(70, 64, 60, 32, 9), 100, 80, BLUE, "hB", 72)}
${hl("M76 51H124", .55, 1.2)}${edge(Hs)}${sled(x, 100, 158, 1.5, RED, true)}
${waves(xo(x, x.siren), 100, 130, 54, "#ff6b6b")}`;
      return scene(x, "brick", F);
    } }),

     body({ id: "keypad", name: "Alarm keypad", colors: sw("#eceef1"), parts: [ARM], render(o) {
      const x = ctx(o);
      let keys = "";
      for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) {
        const cx = 78 + c * 17, cy = 98 + r * 14.5;
        keys += `<path d="${rrp(cx - 7, cy - 5, 14, 10, 3)}" fill="#000" fill-opacity=".35" transform="translate(0 1.2)"/><path d="${rrp(cx - 7, cy - 5, 14, 10, 3)}" fill="${x.url("rub")}"/>${hl(`M${cx - 4} ${cy - 3.6}H${cx + 4}`, .7, .8)}
<path d="M${cx - 2} ${cy}H${cx + 2}" stroke="${x.on ? "#c4364a" : "#5c5966"}" stroke-width="1.2" stroke-linecap="round"/>`;
      }
      const lcd = x.on ? `<path d="${rrp(70, 50, 50, 22, 4)}" fill="#5a1418"/><path d="${rrp(70, 50, 50, 22, 4)}" fill="${RED}" opacity="${x.op(.45)}"/>${modeG(x, 84, 59, .9, "#ffd6d6", () => lockG(84, 58, 1, "#ffd6d6", false))}<path d="M96 57H112M96 63H108" stroke="#ffd6d6" stroke-width="2.4" stroke-linecap="round"/>`
        : `<path d="${rrp(70, 50, 50, 22, 4)}" fill="#163626"/><path d="${rrp(70, 50, 50, 22, 4)}" fill="${GREEN}" opacity=".2"/>${lockG(84, 58, 1, "#bff0d8", true)}<path d="M96 57H112M96 63H108" stroke="#bff0d8" stroke-opacity=".8" stroke-width="2.4" stroke-linecap="round"/>`;
      const F = alarmFx(x) + drop(x, `<path d="${rrp(58, 36, 74, 136, 12)}"/>`, 4, 7, .55) +
        `<path d="${rrp(58, 36, 74, 136, 12)}" fill="${x.url("bh")}"/><path d="${rrp(62, 40, 66, 128, 9)}" fill="${x.url("bv")}"/>${hl("M66 41H124", .6, 1)}
${lcd}<path d="${rrp(70, 50, 50, 22, 4)}" fill="${x.url("gloss")}" opacity=".3"/><path d="${rrp(70, 50, 50, 22, 4)}" fill="none" stroke="#000" stroke-opacity=".5"/>
${sled(x, 78, 81, 1.8)}${x.on ? `<circle cx="91" cy="81" r="1.8" fill="#1b1e28"/>` : sled(x, 91, 81, 1.8, RED, true)}${homeish(x) ? sled(x, 104, 81, 1.8, BLUE) : `<circle cx="104" cy="81" r="1.8" fill="#1b1e28"/>`}
${keys}
${[[80, "#d84a4a"], [95, "#4a7fd8"], [110, "#8d939b"]].map(([cx, col]) => `<circle cx="${cx}" cy="157" r="4.2" fill="${col}"/><circle cx="${cx - 1.2}" cy="155.8" r="1.4" fill="#fff" fill-opacity=".45"/>`).join("")}
${edge(rrp(58, 36, 74, 136, 12))}${x.on ? `<ellipse cx="95" cy="61" rx="44" ry="26" fill="${x.url("hR")}" opacity="${x.op(.35)}"/>` : ""}`;
      return scene(x, "casing", F);
    } }),

     body({ id: "touch", name: "Touch panel", colors: sw("#eceef1"), parts: [ARM], render(o) {
      const x = ctx(o), col = x.on ? "#e5484d" : "#30a46c";
      const F = alarmFx(x) + drop(x, `<path d="${rrp(34, 50, 132, 98, 12)}"/>`, 4, 7, .55) +
        (x.on ? `<ellipse cx="100" cy="99" rx="86" ry="62" fill="${x.url("hR")}" opacity="${x.op(.28)}"/>` : "") +
        `<path d="${rrp(34, 50, 132, 98, 12)}" fill="${x.url("bh")}"/><path d="${rrp(34, 50, 132, 98, 12)}" fill="${x.url("bv")}" opacity=".45"/>${hl("M44 51.5H156", .55, 1)}
<path d="${rrp(42, 58, 116, 80, 5)}" fill="#0b0e16"/><path d="${rrp(42, 58, 116, 80, 5)}" fill="${col}" opacity=".08"/>
<path d="M47 58H153Q158 58 158 63V70H42V63Q42 58 47 58Z" fill="${col}" opacity="${x.on ? .85 : .6}"/>
<path d="M50 64H70M140 64H150" stroke="#fff" stroke-opacity=".7" stroke-width="2" stroke-linecap="round"/>
<g ${x.on ? anim("pulse", 2.2, 0) : ""}><path d="${shield(80, 102, 1.05)}" fill="${col}" opacity=".25"/><path d="${shield(80, 102, 1.05)}" fill="none" stroke="${col}" stroke-width="2.4"/></g>${modeG(x, 80, 102, 1.1, "#ffd6d6", () => lockG(80, 100, 1.15, x.on ? "#ffd6d6" : "#c8f5de", !x.on))}
${[[114, 78], [114, 104]].map(([tx, ty], i) => `<path d="${rrp(tx, ty, 38, 22, 3)}" fill="#fff" fill-opacity=".07"/><circle cx="${tx + 8}" cy="${ty + 11}" r="3.4" fill="${i ? "#7aa7ff" : "#ffcf6b"}" opacity=".75"/><path d="M${tx + 15} ${ty + 9}H${tx + 32}M${tx + 15} ${ty + 14}H${tx + 27}" stroke="#fff" stroke-opacity=".4" stroke-width="1.6" stroke-linecap="round"/>`).join("")}
<path d="M42 130H158" stroke="#fff" stroke-opacity=".08"/>${[60, 80, 100, 120, 140].map((cx) => `<circle cx="${cx}" cy="134" r="1.4" fill="#fff" fill-opacity=".3"/>`).join("")}
<path d="M42 58L96 58L60 138H42Z" fill="#fff" opacity=".05"/><circle cx="100" cy="54" r="1.4" fill="#151824"/>${sled(x, 152, 143, 1.3, RED, true)}${edge(rrp(34, 50, 132, 98, 12))}`;
      return scene(x, "navy", F);
    } }),

     body({ id: "hub", name: "Hub station", colors: sw("#eceef1"), parts: [ARM], render(o) {
      const x = ctx(o), Bd = "M54 146L64 106Q66 96 76 96H124Q134 96 136 106L146 146Z";
      const bar = x.on ? `<path d="${rrp(72, 128, 56, 6, 3)}" fill="${RED}"/><path d="${rrp(72, 128, 56, 6, 3)}" fill="#ffd0d0" opacity="${x.op(.8)}" ${anim("pulse", x.sp * 1.4, 0)}/><ellipse cx="100" cy="131" rx="50" ry="16" fill="${x.url("hR")}" opacity="${x.op(.6)}" ${anim("pulse", x.sp * 1.4, 0)}/>`
        : `<path d="${rrp(72, 128, 56, 6, 3)}" fill="#1c3a2c"/><path d="${rrp(84, 129.5, 32, 3, 1.5)}" fill="${GREEN}" opacity=".55"/>`;
      const F = contact(x, 100, 147, 56, 6) + `<path d="${rrp(124, 60, 6, 42, 3)}" fill="${x.url("blk")}"/><circle cx="127" cy="60" r="3.4" fill="${x.url("blkv")}"/>
${drop(x, `<path d="${Bd}"/>`, 3, 4, .5)}<path d="${Bd}" fill="${x.url("bh")}"/><path d="M64 108Q66 96 76 96H124Q134 96 136 108Z" fill="${x.url("bv")}"/>${hl("M76 97.5H124", .6, 1.2)}
<path d="M64 108H136" stroke="#000" stroke-opacity=".2" stroke-width="1"/>
${[82, 88, 94, 100, 106, 112, 118].map((cx) => `<path d="M${cx} 101V105" stroke="#000" stroke-opacity=".45" stroke-width="1.6" stroke-linecap="round"/>`).join("")}
${alarmFx(x, 100, 120, 70)}${bar}${modeG(x, 100, 117, .8, "#c4364a", () => lockG(100, 116, .8, x.on ? "#c4364a" : H.shade(x.c, -.4), !x.on))}${edge(Bd)}<path d="M56 146H144" stroke="#000" stroke-opacity=".4" stroke-width="1.6"/>`;
      return scene(x, "cream", F, { shelf: 147 });
    } }),

     body({ id: "panic", name: "Panic button", colors: sw("#eceef1"), render(o) {
      const x = ctx(o);
      const F = drop(x, `<path d="${rrp(58, 52, 84, 84, 14)}"/>`, 4, 7, .55) +
        `<path d="${rrp(58, 52, 84, 84, 14)}" fill="${x.url("bv")}"/><path d="${rrp(58, 52, 84, 84, 14)}" fill="${x.url("bh")}" opacity=".3"/><path d="${rrp(63, 57, 74, 74, 11)}" fill="none" stroke="#fff" stroke-opacity=".3"/>
${screw(x, 68, 62, 1.8)}${screw(x, 132, 62, 1.8)}${screw(x, 68, 126, 1.8)}${screw(x, 132, 126, 1.8)}
${x.on ? `<circle cx="100" cy="92" r="46" fill="${x.url("hR")}" opacity="${x.op(.7)}" ${anim("pulse", x.sp, 0)}/>` : ""}
<circle cx="100" cy="92" r="31" fill="${x.url("bvd")}"/><circle cx="100" cy="92" r="31" fill="none" stroke="#000" stroke-opacity=".35"/>
<circle cx="100" cy="92" r="28" fill="none" stroke="${x.on ? RED : "#3a3f48"}" stroke-width="3"/>${x.on ? `<circle cx="100" cy="92" r="28" fill="none" stroke="#ffd0d0" stroke-width="1.2" opacity="${x.op(1)}" ${anim("blink", 1.2, 0)}/>` : ""}
<circle cx="100" cy="94" r="25" fill="#000" fill-opacity=".45"/><circle cx="100" cy="92" r="24" fill="${x.url("redb")}"/>
<path d="M88 92A12 12 0 0 1 100 80" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="2" stroke-linecap="round"/><ellipse cx="91" cy="82" rx="8" ry="4.5" fill="#fff" fill-opacity=".4" transform="rotate(-30 91 82)"/>
<path d="M100 84V96" stroke="#fff" stroke-opacity=".75" stroke-width="3.6" stroke-linecap="round"/><circle cx="100" cy="102" r="2.2" fill="#fff" fill-opacity=".75"/>
<path d="M68 92A32 32 0 0 1 132 92" fill="none" stroke="#e8f2ff" stroke-opacity=".22" stroke-width="2"/>
${sled(x, 100, 128, 1.7, RED, true)}${edge(rrp(58, 52, 84, 84, 14))}`;
      return scene(x, "sage", F, { shelf: 168, mat: "dark" });
    } }),

     body({ id: "fob", name: "Key fob", colors: sw("#2a2c31"), render(o) {
      const x = ctx(o), gc = H.shade(x.c, x.c === "#eceef1" || x.c === "#cbbd9f" ? -.45 : .55);
      const btn = (cy, glyph, red) => `<circle cx="100" cy="${cy}" r="8.5" fill="#000" fill-opacity=".35"/><circle cx="100" cy="${cy - .8}" r="8" fill="${red ? x.url("redb") : x.url("bv")}"/><circle cx="100" cy="${cy - .8}" r="8" fill="none" stroke="#000" stroke-opacity=".3" stroke-width=".7"/>${glyph}`;
      const house = (cy) => `<path d="M95 ${cy + 3}V${cy - 1}L100 ${cy - 5}L105 ${cy - 1}V${cy + 3}Z" fill="${gc}"/>`;
      const F = `<path d="${rrp(20, 26, 160, 26, 5)}" fill="#000" fill-opacity=".35" transform="translate(2 5)"/><path d="${rrp(20, 26, 160, 26, 5)}" fill="${x.url("wood")}"/><path d="M24 33C70 31 130 35 176 32M24 44C80 46 120 42 176 45" stroke="#3a2414" stroke-opacity=".35" stroke-width=".7" fill="none"/>${hl("M24 27.5H176", .3, 1)}
${[56, 100, 144].map((hx) => `<path d="M${hx} 44V54Q${hx} 60 ${hx + 6} 58" fill="none" stroke="${x.url("brs")}" stroke-width="3.4" stroke-linecap="round"/><circle cx="${hx}" cy="42" r="3" fill="${x.url("brs")}"/>`).join("")}
<circle cx="146" cy="62" r="7" fill="none" stroke="${x.url("sil")}" stroke-width="2.4"/><g transform="rotate(-6 146 70)"><path d="M136 70H156A4 4 0 0 1 160 74V86A4 4 0 0 1 156 90H136A4 4 0 0 1 132 86V74A4 4 0 0 1 136 70Z" fill="${x.url("brs")}"/><circle cx="146" cy="75" r="2.4" fill="#2a2420"/>
<path d="M142 90H150V100L153 102L150 105V108L153 110L150 113V124L146 128L142 124Z" fill="${x.url("brs")}"/><path d="M145 92V124" stroke="#4d3210" stroke-opacity=".5" stroke-width="1"/>${hl("M136 72H155", .45, 1)}</g>
<circle cx="100" cy="64" r="9" fill="none" stroke="${x.url("sil")}" stroke-width="2.8"/>
${drop(x, `<path d="${rrp(78, 74, 44, 92, 20)}"/>`, 4, 6, .55)}
<g transform="rotate(4 100 74)"><path d="${rrp(96, 70, 8, 10, 3)}" fill="${x.url("bvd")}"/>
<path d="${rrp(78, 76, 44, 92, 20)}" fill="${x.url("bh")}"/><path d="${rrp(78, 76, 44, 92, 20)}" fill="${x.url("bv")}" opacity=".3"/>${hl("M86 82V158", .2, 1.6)}
${sled(x, 100, 87, 1.7)}
${btn(103, lockG(100, 102, .62, gc, false))}${btn(122, lockG(100, 121, .62, gc, true))}${btn(141, house(140))}${btn(158, `<path d="M100 153V158" stroke="#fff" stroke-width="2" stroke-linecap="round"/><circle cx="100" cy="161" r="1" fill="#fff"/>`, true)}
${edge(rrp(78, 76, 44, 92, 20))}</g>`;
      return scene(x, "slate", F);
    } }),

     body({ id: "garagesiren", name: "Garage siren", colors: sw("#eceef1"), parts: [ALM], render(o) {
      const x = ctx(o), Dm = "M70 112H130V118A30 24 0 0 1 70 118Z";
      let grille = ""; [10, 16, 22].forEach((r) => { grille += `<circle cx="100" cy="76" r="${r}" fill="none" stroke="#000" stroke-opacity=".4" stroke-width="2" stroke-dasharray="${f(r * .55)} 2.4"/>`; });
      const F = `<rect x="98" y="30" width="4" height="16" fill="#8f949c"/><rect x="96" y="30" width="8" height="4" fill="#6f747c"/>
${drop(x, `<path d="${rrp(64, 44, 72, 70, 12)}"/><path d="${Dm}"/>`, 4, 7, .55)}
<path d="${rrp(64, 44, 72, 70, 12)}" fill="${x.url("bh")}"/><path d="${rrp(64, 44, 72, 70, 12)}" fill="${x.url("bv")}" opacity=".4"/>${hl("M72 45.5H128", .55, 1.2)}
<circle cx="100" cy="76" r="25" fill="${x.url("bvd")}"/><circle cx="100" cy="76" r="25" fill="none" stroke="#000" stroke-opacity=".3"/>${grille}<circle cx="100" cy="76" r="5" fill="${x.url("br")}"/>
<path d="M64 108H136V114H64Z" fill="${x.url("bvd")}"/>
${strobe(xo(x, x.strobe), Dm, 100, 124, RED, "hR", 72)}<path d="M80 118A20 16 0 0 0 92 136" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="2.4" stroke-linecap="round"/>
${sled(x, 124, 52, 1.5, RED, true)}${edge(rrp(64, 44, 72, 70, 12))}${waves(xo(x, x.siren), 100, 80, 46)}`;
      return scene(x, "garage", F);
    } }),
  ];

  (window.HDA = window.HDA || []).push({
    id: "security",
    tab: "Cameras & alarms",
    group: "Security",
    kind: "device",
    intro: "Twenty cameras and alarm parts, each on its own eave, wall, shelf or soffit. Cameras: Active means recording (status LED blinks, IR ring glows, view cone shows, pan-tilt heads pan). Alarms: Active means armed (red LEDs, strobes flash, sirens sound, panels turn red). The slider sets how strong the glow, light and sound look.",
    
    levelLabel: "Intensity",
    onWord: "Active", offWord: "Off",
    css: `.hda-security-blink,.hda-security-strobe,.hda-security-ir,.hda-security-wave,.hda-security-pulse,.hda-security-pan,.hda-security-sweep,.hda-security-float{animation-iteration-count:infinite}
.hda-security-pan,.hda-security-sweep,.hda-security-float{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-security-blink{animation-name:hda-security-blink;animation-timing-function:steps(1,end)}
.hda-anim .hda-security-strobe{animation-name:hda-security-strobe;animation-timing-function:linear}
.hda-anim .hda-security-ir{animation-name:hda-security-ir;animation-timing-function:ease-in-out}
.hda-anim .hda-security-pulse{animation-name:hda-security-pulse;animation-timing-function:ease-in-out}
.hda-anim .hda-security-wave{animation-name:hda-security-wave;animation-timing-function:ease-out}
.hda-anim .hda-security-pan{animation-name:hda-security-pan;animation-timing-function:ease-in-out}
.hda-anim .hda-security-sweep{animation-name:hda-security-sweep;animation-timing-function:ease-in-out}
.hda-anim .hda-security-float{animation-name:hda-security-float;animation-timing-function:linear}
@keyframes hda-security-blink{0%{opacity:1}50%{opacity:.1}}
@keyframes hda-security-strobe{0%{opacity:1}7%{opacity:.05}14%{opacity:1}21%{opacity:.05}100%{opacity:.05}}
@keyframes hda-security-ir{0%,100%{opacity:1}50%{opacity:.5}}
@keyframes hda-security-pulse{0%,100%{opacity:1}50%{opacity:.4}}
@keyframes hda-security-wave{0%{opacity:0}25%{opacity:1}100%{opacity:0}}
@keyframes hda-security-pan{0%,100%{transform:translate(-9px,0) scale(.8,1)}25%,75%{transform:translate(0,0) scale(1,1)}50%{transform:translate(9px,0) scale(.8,1)}}
@keyframes hda-security-sweep{0%,100%{transform:rotate(-32deg)}50%{transform:rotate(32deg)}}
@keyframes hda-security-float{0%{transform:translate(0,6px);opacity:0}25%{opacity:1}100%{transform:translate(4px,-14px);opacity:0}}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-security-blink,.hda-anim .hda-security-strobe,.hda-anim .hda-security-ir,.hda-anim .hda-security-pulse,.hda-anim .hda-security-wave,.hda-anim .hda-security-pan,.hda-anim .hda-security-sweep,.hda-anim .hda-security-float{animation:none}}`,
    icons,
  });
})();
