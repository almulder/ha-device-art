(function () {
  const H = window.HDAH, P = "hda-safety-";
  const f = (n) => (+n).toFixed(1);
  const R = Math.PI / 180;
  const rnd = (seed) => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
  const RED = "#ff3b3b", GREEN = "#34d399", BLUE = "#59b4ff", AMB = "#ffb547";

  function ctx(o) {
    const c = o.color || "#f2f1ee", on = !!o.on, lv = o.level == null ? 1 : o.level;
    return { c, on, lv, L: on ? .45 + .55 * lv : 0, id: (s) => `${o.uid}-${s}`, url: (s) => `url(#${o.uid}-${s})`, sp: 1.6 - .8 * lv };
  }
  const stops = (a) => a.map(([o, c, op]) => `<stop offset="${o}" stop-color="${c}"${op == null ? "" : ` stop-opacity="${op}"`}/>`).join("");
  const lg = (id, a, x1, y1, x2, y2) => `<linearGradient id="${id}" x1="${x1 || 0}" y1="${y1 || 0}" x2="${x2 == null ? 1 : x2}" y2="${y2 || 0}">${stops(a)}</linearGradient>`;
  const rg = (id, a, cx, cy, r) => `<radialGradient id="${id}" cx="${cx == null ? .5 : cx}" cy="${cy == null ? .5 : cy}" r="${r || .5}">${stops(a)}</radialGradient>`;
  const rrp = (x, y, w, h, r) => `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`;
  const sq = (cx, cy, s, k) => { const h = s / 2, c = h * (k || .62); return `M${cx} ${cy - h}C${cx + c} ${cy - h} ${cx + h} ${cy - c} ${cx + h} ${cy}C${cx + h} ${cy + c} ${cx + c} ${cy + h} ${cx} ${cy + h}C${cx - c} ${cy + h} ${cx - h} ${cy + c} ${cx - h} ${cy}C${cx - h} ${cy - c} ${cx - c} ${cy - h} ${cx} ${cy - h}Z`; };

  const WALL = { wall: ["#55505e", "#3b3744"], sage: ["#48544c", "#313a34"], blush: ["#5c4954", "#41333c"], navy: ["#323b54", "#20273a"],
    slate: ["#4a5361", "#323945"], cream: ["#655d4f", "#463f34"], ceiling: ["#6b6774", "#4c4855"], ply: ["#7a5c3c", "#57402a"], casing: ["#4f4a57", "#36323d"] };

  function bpal(c) { return { l: H.shade(c, .5), m: c, d: H.shade(c, -.28), k: H.shade(c, -.55) }; }
  function defs(x, kind, extra) {
    const { c, id } = x, w = WALL[kind] || WALL.wall, p = bpal(c);
    return `<defs>
${lg(id("wallg"), [[0, w[0]], [1, w[1]]], 0, 0, 0, 1)}
<clipPath id="${id("wc")}"><rect x="8" y="8" width="184" height="184" rx="16"/></clipPath>
${rg(id("vig"), [[0, "#000", 0], [.62, "#000", .05], [1, "#000", .5]], .5, .48, .74)}
${rg(id("sh"), [[0, "#000", .6], [.6, "#000", .22], [1, "#000", 0]])}
${lg(id("bh"), [[0, p.k], [.12, p.d], [.36, p.l], [.56, p.m], [.86, p.d], [1, p.k]])}
${lg(id("bv"), [[0, p.l], [.45, p.m], [1, p.d]], 0, 0, 0, 1)}
${lg(id("bvd"), [[0, p.d], [1, p.k]], 0, 0, 0, 1)}
${rg(id("br"), [[0, H.shade(c, .7)], [.4, p.l], [.78, p.m], [1, p.d]], .38, .3, .8)}
${rg(id("brd"), [[0, p.m], [.7, p.d], [1, p.k]], .45, .4, .7)}
${lg(id("blk"), [[0, "#3a3e4a"], [.45, "#15171d"], [1, "#07080b"]], 0, 0, 0, 1)}
${lg(id("glass"), [[0, "#1c2030"], [.5, "#0b0d15"], [1, "#05060a"]], 0, 0, 1, 1)}
${lg(id("gloss"), [[0, "#fff", .5], [.5, "#fff", .06], [1, "#fff", 0]], 0, 0, 1, 1)}
${rg(id("lens"), [[0, "#5c6fb0"], [.25, "#28335e"], [.6, "#0e1226"], [1, "#03040a"]], .4, .36, .6)}
${rg(id("key"), [[0, "#ffffff"], [.6, "#e9e8ec"], [1, "#b7b5be"]], .4, .3, .8)}
${lg(id("rub"), [[0, "#f1efe8"], [.6, "#d4d0c6"], [1, "#9d998e"]], 0, 0, 0, 1)}
${lg(id("fab"), [[0, "#c9cbd0"], [1, "#8d9097"]], 0, 0, 0, 1)}
${lg(id("pcb"), [[0, "#1f3f78"], [1, "#122752"]], 0, 0, 0, 1)}
${lg(id("term"), [[0, "#3fae5c"], [1, "#1d6a33"]], 0, 0, 0, 1)}
${lg(id("chrome"), [[0, "#5c6068"], [.3, "#f4f6f9"], [.55, "#a6abb3"], [1, "#4d5158"]])}
${lg(id("brs"), [[0, "#7a5118"], [.4, "#f1cf7a"], [1, "#6e4a16"]])}
${rg(id("hR"), [[0, RED, .85], [.42, RED, .3], [1, RED, 0]])}
${rg(id("hG"), [[0, GREEN, .8], [.42, GREEN, .25], [1, GREEN, 0]])}
${rg(id("hB"), [[0, BLUE, .8], [.42, BLUE, .25], [1, BLUE, 0]])}
${rg(id("hW"), [[0, "#fff4dc", .85], [.45, "#fff4dc", .25], [1, "#fff4dc", 0]])}
<pattern id="${id("holes")}" width="4.4" height="4.4" patternUnits="userSpaceOnUse"><circle cx="2.2" cy="2.2" r=".95" fill="#000" fill-opacity=".38"/><circle cx="2.4" cy="2.5" r=".95" fill="#fff" fill-opacity=".14"/></pattern>
<pattern id="${id("weave")}" width="2.4" height="2.4" patternUnits="userSpaceOnUse"><rect width="2.4" height="2.4" fill="#000" fill-opacity=".05"/><circle cx="1.2" cy="1.2" r=".55" fill="#000" fill-opacity=".22"/></pattern>
<filter id="${id("bl")}" x="-25%" y="-25%" width="150%" height="150%"><feGaussianBlur stdDeviation="2.6"/></filter>
${extra || ""}</defs>`;
  }
  function texture(kind, x) {
    const r = rnd(kind.length * 911 + kind.charCodeAt(0) * 17); let s = "";
    const noise = (n, big, a) => { let t = ""; for (let i = 0; i < n; i++) t += `<circle cx="${f(10 + r() * 180)}" cy="${f(10 + r() * 180)}" r="${f(.3 + r() * big)}" fill="${r() > .5 ? "#000" : "#fff"}" fill-opacity="${(a + r() * .06).toFixed(2)}"/>`; return t; };
    if (kind === "ceiling") s += noise(220, 1, .04) + `<path d="M8 168H192" stroke="#000" stroke-opacity=".25" stroke-width="2"/><rect x="8" y="169" width="184" height="10" fill="#d9d5e0" fill-opacity=".22"/><rect x="8" y="179" width="184" height="13" fill="#000" fill-opacity=".18"/>`;
    else if (kind === "ply") {
      for (let i = 0; i < 28; i++) { const y = 10 + r() * 180, a = r() * 6; s += `<path d="M8 ${f(y)}C60 ${f(y - a)} 120 ${f(y + a)} 192 ${f(y - a * .5)}" fill="none" stroke="#3a2414" stroke-opacity="${(.1 + r() * .15).toFixed(2)}" stroke-width="${f(.5 + r())}"/>`; }
      s += `<path d="M8 100H192" stroke="#2a1a0c" stroke-opacity=".4" stroke-width="1.4"/>` + `<path d="M150 8V192" stroke="#e8d8b0" stroke-opacity=".5" stroke-width="5"/><path d="M150 8V192" stroke="#8a8f99" stroke-width="2.4"/>`;
    } else if (kind === "casing") {
      s += noise(40, .5, .03) + `<rect x="152" y="8" width="40" height="184" fill="#d8d3cb"/><rect x="152" y="8" width="40" height="184" fill="#000" fill-opacity=".36"/><path d="M158 8V192M164 8V192" stroke="#000" stroke-opacity=".25" stroke-width="1.2"/><path d="M153 8V192" stroke="#fff" stroke-opacity=".3" stroke-width="1.2"/><rect x="146" y="8" width="6" height="184" fill="#000" fill-opacity=".2"/><rect x="176" y="8" width="16" height="184" fill="#2a2420" fill-opacity=".85"/>`;
    } else s += noise(50, .6, .035);
    return s;
  }
  function shelf(x, y) {
    return `<rect x="8" y="${y + 16}" width="184" height="14" fill="#000" fill-opacity=".3"/><rect x="8" y="${y - 8}" width="184" height="12" fill="url(#${x.id("wt")})"/><rect x="8" y="${y + 4}" width="184" height="13" fill="url(#${x.id("wf")})"/><path d="M8 ${y + 4.5}H192" stroke="#fff" stroke-opacity=".3"/>
<path d="M8 ${y + 9}C60 ${y + 7} 120 ${y + 11} 192 ${y + 8}M8 ${y - 3}C70 ${y - 4} 130 ${y - 1} 192 ${y - 3}" stroke="#3a2414" stroke-opacity=".3" stroke-width=".7" fill="none"/>`;
  }
  function scene(x, kind, body, o2) {
    o2 = o2 || {};
    const ex = (o2.extra || "") + (o2.shelf ? lg(x.id("wt"), [[0, "#8a5f3c"], [1, "#b4845a"]], 0, 0, 0, 1) + lg(x.id("wf"), [[0, "#c8996a"], [1, "#6a4528"]], 0, 0, 0, 1) : "");
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs(x, kind, ex)}
<g class="hda-bg"><rect x="8" y="8" width="184" height="184" rx="16" fill="${x.url("wallg")}"/>
<g clip-path="${x.url("wc")}">${texture(kind, x)}${o2.shelf ? shelf(x, o2.shelf) : ""}<rect x="8" y="8" width="184" height="184" fill="${x.url("vig")}"/></g>
<rect x="8.5" y="8.5" width="183" height="183" rx="15.5" fill="none" stroke="#fff" stroke-opacity=".07"/></g>
${body}</svg>`;
  }

  const drop = (x, shape, dx, dy, a) => `<g transform="translate(${dx == null ? 3 : dx} ${dy == null ? 5 : dy})" fill="#000" stroke="none" opacity="${a || .5}" filter="${x.url("bl")}">${shape}</g>`;
  const hl = (d, a, w) => `<path d="${d}" fill="none" stroke="#fff" stroke-opacity="${a}" stroke-width="${w}" stroke-linecap="round"/>`;
  const edge = (d, a) => `<path d="${d}" fill="none" stroke="#000" stroke-opacity="${a || .3}" stroke-width=".8"/>`;
  const anim = (cls, dur, delay) => `class="${P}${cls}" style="animation-duration:${f(dur)}s;animation-delay:${(delay || 0).toFixed(2)}s"`;
  const gl = (x, d, a) => `<path d="${d}" fill="${x.url("gloss")}" opacity="${a || .35}"/>`;

  const GL = { A: "M0 6V2L2 0L4 2V6M0 3.6H4", R: "M0 6V0H3L4 1V2.4L3 3.4H0M2.2 3.4L4 6", M: "M0 6V0L2 3L4 0V6", E: "M4 0H0V6H4M0 3H3", D: "M0 0V6H2.4L4 4.4V1.6L2.4 0Z",
    W: "M0 0L1 6L2 3.4L3 6L4 0", Y: "M0 0L2 3L4 0M2 3V6", I: "M1 0H3M2 0V6M1 6H3", S: "M4 0H1L0 1V2.4L1 3H3L4 3.6V5L3 6H0", O: "M1 0H3L4 1V5L3 6H1L0 5V1Z",
    H: "M0 0V6M4 0V6M0 3H4", T: "M0 0H4M2 0V6", P: "M0 6V0H3L4 1V2.4L3 3.4H0", F: "M4 0H0V6M0 3H3", N: "M0 6V0L4 6V0", L: "M0 0V6H4", C: "M4 0H1L0 1V5L1 6H4",
    K: "M0 0V6M4 0L0 3.4M1.4 2.6L4 6", X: "M0 0L4 6M4 0L0 6", V: "M0 0L2 6L4 0", B: "M0 0V6H3L4 5V4L3 3H0M0 0H3L4 1V2L3 3", U: "M0 0V5L1 6H3L4 5V0", G: "M4 1L3 0H1L0 1V5L1 6H4V3.4H2.4", "0": "M1 0H3L4 1V5L3 6H1L0 5V1ZM4 1L0 5",
    "1": "M1 1L2 0V6M1 6H3", "2": "M0 1L1 0H3L4 1V2.4L0 6H4", "3": "M0 0H4L2 2.6H3L4 3.6V5L3 6H0", "4": "M3 6V0L0 4H4", "5": "M4 0H0V2.6H3L4 3.6V5L3 6H0",
    "6": "M4 0H1L0 1V5L1 6H3L4 5V3.6L3 2.6H0", "7": "M0 0H4L1.6 6", "8": "M1 0H3L4 1V2L3 3H1L0 4V5L1 6H3L4 5V4L3 3M1 3L0 2V1L1 0", "9": "M4 3H1L0 2V1L1 0H3L4 1V5L3 6H0", ":": "M2 1.6V2M2 4.4V4.8" };
  const txtW = (str, h) => { const s = h / 6; let w = 0; for (const ch of str) w += ch === " " ? 3 * s : 5.4 * s; return w - 1.4 * s; };
  function txt(str, x0, y, h, col, sw, op) {
    const s = h / 6; let cx = x0, out = "";
    for (const ch of str) { if (ch === " ") { cx += 3 * s; continue; } const d = GL[ch]; if (d) out += `<path d="${d}" transform="translate(${f(cx)} ${f(y)}) scale(${s.toFixed(3)})"/>`; cx += 5.4 * s; }
    return `<g fill="none" stroke="${col}" stroke-width="${f((sw || 1) / s)}" stroke-linecap="round" stroke-linejoin="round"${op != null ? ` opacity="${op}"` : ""}>${out}</g>`;
  }
  const txtC = (str, cx, y, h, col, sw, op) => txt(str, cx - txtW(str, h) / 2, y, h, col, sw, op);
  const SEG = { 0: "abcdef", 1: "bc", 2: "abged", 3: "abgcd", 4: "fgbc", 5: "afgcd", 6: "afgedc", 7: "abc", 8: "abcdefg", 9: "abcdfg", "-": "g", " ": "" };
  function seg7(str, x0, y, h, col, ghost) {
    const w = h * .55, t = Math.max(.8, h * .13), hf = h / 2; let s = "", cx = x0;
    for (const ch of str) {
      const g = { a: [cx + t * .6, y, w - t * 1.2, t], d: [cx + t * .6, y + h - t, w - t * 1.2, t], g: [cx + t * .6, y + hf - t / 2, w - t * 1.2, t],
        b: [cx + w - t, y + t * .5, t, hf - t * .6], c: [cx + w - t, y + hf + t * .1, t, hf - t * .6], f: [cx, y + t * .5, t, hf - t * .6], e: [cx, y + hf + t * .1, t, hf - t * .6] };
      const on1 = SEG[ch] || "";
      for (const k in g) { const q = g[k], lit = on1.indexOf(k) >= 0; if (lit || ghost) s += `<rect x="${f(q[0])}" y="${f(q[1])}" width="${f(q[2])}" height="${f(q[3])}" rx="${f(t * .4)}" fill="${col}" opacity="${lit ? 1 : ghost}"/>`; }
      cx += w + h * .18;
    }
    return s;
  }
  function led(x, cx, cy, r, col, lit, blink) {
    const h = col === RED ? "hR" : col === GREEN ? "hG" : col === BLUE ? "hB" : "hW";
    if (!lit) return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#1b1e28"/><circle cx="${cx}" cy="${cy}" r="${f(r * .5)}" fill="${H.shade(col, -.5)}" opacity=".6"/>`;
    return `<g ${blink ? anim("blink", 1.1, 0) : ""}><circle cx="${cx}" cy="${cy}" r="${f(r * 4)}" fill="${x.url(h)}"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="${col}"/><circle cx="${f(cx - r * .3)}" cy="${f(cy - r * .3)}" r="${f(r * .4)}" fill="#fff" fill-opacity=".8"/></g>`;
  }
  const armLed = (x, cx, cy, r) => x.on ? led(x, cx, cy, r || 1.8, RED, true, true) : led(x, cx, cy, r || 1.8, GREEN, true, false);
  function alarm(x, cx, cy, R0, lx, ly) {
    if (!x.on) return led(x, lx, ly, 1.5, GREEN, true, false);
    const arc = (r, a1, a2) => { const p = (a) => [cx + r * Math.cos(a * R), cy + r * Math.sin(a * R)]; const A = p(a1), B = p(a2); return `M${f(A[0])} ${f(A[1])}A${r} ${r} 0 0 1 ${f(B[0])} ${f(B[1])}`; };
    let w = ""; const d = x.sp * 1.2;
    [0, 180].forEach((a) => { for (let i = 0; i < 3; i++) { const rr = R0 + 8 + i * 9, sp = 34 - i * 4;
      w += `<path d="${arc(rr, a - sp, a + sp)}" fill="none" stroke="#ff6b6b" stroke-width="${f(3.2 - i * .7)}" stroke-linecap="round" opacity="${(.9 - i * .22).toFixed(2)}" ${anim("wave", d, i * d * .22)}/>`; } });
    return `<g ${anim("strobe", 1, 0)}><circle cx="${cx}" cy="${cy}" r="${f(R0 + 22)}" fill="${x.url("hR")}" opacity="${(x.L * .7).toFixed(2)}"/><circle cx="${cx}" cy="${cy}" r="${f(R0 + 3)}" fill="none" stroke="${RED}" stroke-width="2.4" opacity="${(x.L).toFixed(2)}"/></g>
<g opacity="${(.5 + .5 * x.L).toFixed(2)}">${w}</g>${led(x, lx, ly, 1.8, RED, true, true)}`;
  }
  function rkey(x, cx, cy, r, lit, glyph, ring) {
    return `<circle cx="${cx}" cy="${f(cy + .8)}" r="${r}" fill="#000" fill-opacity=".25"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="${x.url("key")}"/>
<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${ring || (lit ? "#fff4dc" : "#a9a7b1")}" stroke-width="${lit ? 1.1 : .7}" opacity="${lit ? .95 : .8}"/>${glyph || ""}`;
  }
  const dot = (cx, cy, col) => `<circle cx="${cx}" cy="${cy}" r="1" fill="${col || "#7b7884"}"/>`;
  const lcd = (x, X, Y, W, Hh, lines, col, bg) => {
    const lit = x.on ? (bg || "#c9e6a0") : "#9fb08a";
    let s = `<path d="${rrp(X - 1.4, Y - 1.4, W + 2.8, Hh + 2.8, 2)}" fill="#000" fill-opacity=".55"/><path d="${rrp(X, Y, W, Hh, 1.4)}" fill="${lit}"/>`;
    if (x.on) s += `<path d="${rrp(X, Y, W, Hh, 1.4)}" fill="#fff" opacity=".18"/>`;
    lines.forEach((ln, i) => { s += txt(ln, X + 3, Y + 2.6 + i * (Hh / lines.length), Math.min(5.2, Hh / lines.length - 3.2), col || "#1d2a12", .9, .9); });
    return s + `<path d="${rrp(X, Y, W, Hh * .45, 1.4)}" fill="${x.url("gloss")}" opacity=".5"/>`;
  };
  const glyphLock = (cx, cy, col) => `<path d="M${cx - 2} ${cy}V${cy - 1.6}A2 2 0 0 1 ${cx + 2} ${cy - 1.6}V${cy}" fill="none" stroke="${col}" stroke-width="1"/><rect x="${cx - 2.8}" y="${cy}" width="5.6" height="4" rx=".8" fill="${col}"/>`;
  const glyphHome = (cx, cy, col) => `<path d="M${cx - 3} ${cy + 2.6}V${cy - .4}L${cx} ${cy - 3}L${cx + 3} ${cy - .4}V${cy + 2.6}Z" fill="none" stroke="${col}" stroke-width="1"/>`;
  const glyphShield = (cx, cy, s, col, fill) => `<path d="M${cx} ${f(cy - 10 * s)}L${f(cx + 8 * s)} ${f(cy - 7 * s)}V${cy}Q${f(cx + 8 * s)} ${f(cy + 7 * s)} ${cx} ${f(cy + 11 * s)}Q${f(cx - 8 * s)} ${f(cy + 7 * s)} ${f(cx - 8 * s)} ${cy}V${f(cy - 7 * s)}Z" fill="${fill || "none"}" stroke="${col}" stroke-width="${f(1.4 * s)}"/>`;
  const vents = (cx, cy, r1, r2, n, w, col) => { let s = ""; for (let i = 0; i < n; i++) { const a = i / n * 2 * Math.PI; s += `<path d="M${f(cx + r1 * Math.cos(a))} ${f(cy + r1 * Math.sin(a))}L${f(cx + r2 * Math.cos(a))} ${f(cy + r2 * Math.sin(a))}" stroke="${col || "#000"}" stroke-opacity=".35" stroke-width="${w}" stroke-linecap="round"/>`; } return s; };

  function disc(x, cx, cy, r, inner) {
    return drop(x, `<circle cx="${cx}" cy="${cy}" r="${r}"/>`, 3, 5, .45) + `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${x.url("bv")}"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="${x.url("bh")}" opacity=".25"/>
<circle cx="${cx}" cy="${cy}" r="${f(r - 1)}" fill="none" stroke="#fff" stroke-opacity=".35"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#000" stroke-opacity=".3" stroke-width=".8"/>
${inner ? `<circle cx="${cx}" cy="${cy}" r="${inner}" fill="${x.url("br")}"/><circle cx="${cx}" cy="${cy}" r="${inner}" fill="none" stroke="#000" stroke-opacity=".18"/>` : ""}`;
  }

  const WH = "#f2f1ee", AL = "#e6dcc6", BK = "#2a2b2f", GY = "#c9cbcf", SV = "#b9bec6";
  const fin = (d) => Object.assign({ picker: true, colorLabel: "Finish" }, d);
  const ARMED = "ARMED AWAY", DIS = "DISARMED";

  const icons = [
     fin({ id: "slim-white-keypad", name: "Slim white keypad", colors: [WH, GY, BK], render(o) {
      const x = ctx(o), B = rrp(52, 50, 96, 104, 16), lit = x.on;
      let k = ""; for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) { const cx = 92 + c * 18, cy = 70 + r * 22; k += rkey(x, cx, cy, 7.2, lit, r === 3 && c !== 1 ? (c === 0 ? `<path d="M${cx - 2} ${cy}H${cx + 2}" stroke="#7b7884" stroke-width="1"/>` : `<path d="M${cx - 2} ${cy - 2}L${cx + 2} ${cy + 2}M${cx + 2} ${cy - 2}L${cx - 2} ${cy + 2}" stroke="#7b7884" stroke-width="1"/>`) : dot(cx, cy)); }
      const modes = [[70, glyphShield(66, 70, .38, "#7b7884"), !lit], [92, glyphHome(66, 92, "#7b7884"), false], [114, glyphLock(66, 113, "#7b7884"), lit]];
      let m = ""; modes.forEach(([cy, g, sel]) => { m += rkey(x, 66, cy, 7.2, lit, g, sel ? (lit ? RED : GREEN) : null) + (sel ? `<circle cx="66" cy="${cy}" r="10" fill="${x.url(lit ? "hR" : "hG")}" opacity=".6"/>` : ""); });
      m += `<circle cx="66" cy="136" r="7.2" fill="#000" fill-opacity=".25" transform="translate(0 .8)"/><circle cx="66" cy="136" r="7.2" fill="#e9e8ec"/><path d="M66 132.6V136.4M66 138.4V138.8" stroke="${RED}" stroke-width="1.6" stroke-linecap="round"/>`;
      const F = drop(x, `<path d="${B}"/>`) + (lit ? `<path d="${rrp(46, 44, 108, 116, 20)}" fill="${x.url("hW")}" opacity="${(x.L * .45).toFixed(2)}"/>` : "") +
        `<path d="${B}" fill="${x.url("bv")}"/><path d="${B}" fill="${x.url("bh")}" opacity=".2"/>${hl("M66 51H134", .6, 1)}${edge(B)}${m}${k}
<path d="M78 58V148" stroke="#000" stroke-opacity=".08"/>${armLed(x, 100, 56, 1.4)}`;
      return scene(x, "wall", F);
    } }),

     fin({ id: "round-edge-keypad", name: "Round-edge keypad", colors: [WH, BK], render(o) {
      const x = ctx(o), B = rrp(68, 34, 64, 132, 14), lit = x.on;
      let k = ""; for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) { const cx = 84 + c * 16, cy = 100 + r * 15; k += rkey(x, cx, cy, 6, lit, dot(cx, cy)); }
      const F = drop(x, `<path d="${B}"/>`) + `<path d="${B}" fill="${x.url("bv")}"/><path d="${B}" fill="${x.url("bh")}" opacity=".2"/>
<path d="M68 82V48Q68 34 82 34H118Q132 34 132 48V82Z" fill="${x.url("blk")}"/>${gl(x, "M70 80V48Q70 36 82 36H118Q130 36 130 48V58H70Z", .3)}
${lit ? `<rect x="76" y="44" width="48" height="12" rx="2" fill="${RED}" opacity=".12"/>${txtC("ARMED", 100, 46, 6, "#ffd6d6", 1)}` : `${txtC("OFF", 100, 46, 6, "#c8f5de", 1)}`}
<circle cx="100" cy="69" r="7" fill="none" stroke="${lit ? RED : "#5b606b"}" stroke-width="1.4"/>${lit ? `<g opacity=".6"><circle cx="100" cy="69" r="11" fill="${x.url("hR")}" ${anim("pulse", 1.6, 0)}/></g>` : ""}
${k}<path d="M70 86H130" stroke="#000" stroke-opacity=".08"/>${edge(B)}${armLed(x, 124, 40, 1.3)}`;
      return scene(x, "sage", F);
    } }),

     fin({ id: "classic-alpha-keypad", name: "Classic alpha keypad", colors: [WH, AL, GY], render(o) {
      const x = ctx(o), B = rrp(30, 50, 140, 100, 8), lit = x.on;
      const key = (kx, ky, w) => `<path d="${rrp(kx, ky + 1, w, 9, 2.4)}" fill="#000" fill-opacity=".3"/><path d="${rrp(kx, ky, w, 9, 2.4)}" fill="${x.url("rub")}"/>${lit ? `<path d="${rrp(kx, ky, w, 9, 2.4)}" fill="#e9f5b0" opacity=".14"/>` : ""}<path d="M${kx + w / 2 - 2} ${ky + 4.5}H${kx + w / 2 + 2}" stroke="#5c574b" stroke-width="1" stroke-linecap="round"/>`;
      let k = ""; for (let r = 0; r < 4; r++) { k += key(54, 96 + r * 12, 16); for (let c = 0; c < 3; c++) k += key(84 + c * 24, 96 + r * 12, 20); }
      let sp = ""; for (let i = 0; i < 5; i++) sp += `<path d="${rrp(40, 60 + i * 4.4, 20, 2, 1)}" fill="#000" fill-opacity=".4"/>`;
      const F = drop(x, `<path d="${B}"/>`) + `<path d="${B}" fill="${x.url("bv")}"/><path d="${B}" fill="${x.url("bh")}" opacity=".25"/>${hl("M38 51H162", .6, 1)}${sp}
${lcd(x, 70, 58, 92, 24, lit ? ["ARMED AWAY", "EXIT NOW"] : ["DISARMED", "READY TO ARM"], "#1d2a12", lit ? "#d6f5a6" : "#c4dc96")}
${led(x, 44, 88, 1.8, GREEN, !lit, false)}${armLed(x, 56, 88, 1.8)}${k}${edge(B)}`;
      return scene(x, "casing", F);
    } }),

     fin({ id: "7-inch-touch-panel", name: "7-inch touch panel", colors: [WH, AL, GY], render(o) {
      const x = ctx(o), B = rrp(26, 58, 148, 92, 10), lit = x.on, col = lit ? "#e5484d" : "#30a46c";
      const F = drop(x, `<path d="${B}"/>`) + `<path d="${B}" fill="${x.url("bv")}"/><path d="${B}" fill="${x.url("bh")}" opacity=".2"/>${hl("M36 59H164", .6, 1)}
<path d="${rrp(36, 66, 128, 74, 3)}" fill="#e8ecf2"/><path d="${rrp(36, 66, 128, 74, 3)}" fill="none" stroke="#000" stroke-opacity=".5"/>
<rect x="36" y="66" width="128" height="9" fill="#5f6b7d"/>${txt("12:45", 39, 68.4, 4.2, "#fff", .7)}${txtC(lit ? ARMED : "READY", 100, 68.4, 4.2, "#fff", .7)}
<g ${lit ? anim("pulse", 2, 0) : ""}>${glyphShield(90, 104, 1.6, col, H.mix(col, "#ffffff", .7))}</g>${glyphLock(90, 102, col)}
${[48, 60, 72].map((y) => `<circle cx="46" cy="${y + 34}" r="3" fill="none" stroke="#8a94a6" stroke-width="1"/>`).join("")}
${[80, 94, 108, 122].map((y, i) => `<path d="${rrp(122, y, 34, 10, 2)}" fill="#4b5568"/>${txtC(["AWAY", "STAY", "NIGHT", "MORE"][i], 139, y + 2.6, 4.6, "#fff", .7)}`).join("")}
<path d="M36 66L80 66L50 140H36Z" fill="#fff" opacity=".12"/>${armLed(x, 30, 144, 1.4)}${edge(B)}`;
      return scene(x, "blush", F);
    } }),

     fin({ id: "large-touch-panel", name: "Large touch panel", colors: [WH, GY], render(o) {
      const x = ctx(o), B = rrp(24, 52, 152, 102, 12), lit = x.on, col = lit ? "#e5484d" : "#5cb85c";
      const F = drop(x, `<path d="${B}"/>`) + `<path d="${B}" fill="${x.url("bv")}"/><path d="${B}" fill="${x.url("bh")}" opacity=".18"/>${hl("M36 53H164", .6, 1)}
<circle cx="100" cy="58" r="2" fill="#151824"/><circle cx="99.4" cy="57.4" r=".6" fill="#fff" fill-opacity=".5"/>
<path d="${rrp(34, 63, 132, 72, 3)}" fill="#f7f8fa"/><path d="${rrp(34, 63, 132, 72, 3)}" fill="none" stroke="#000" stroke-opacity=".35"/>
<rect x="34" y="63" width="132" height="8" fill="#e4e7ec"/>${txt("12:45", 37, 65, 4, "#5b6472", .6)}
<path d="${rrp(42, 78, 40, 48, 3)}" fill="${col}"/>${glyphLock(62, 96, "#fff")}${txtC(lit ? "ARMED" : "READY", 62, 112, 4.6, "#fff", .8)}
${lit ? `<g opacity=".18"><path d="${rrp(42, 78, 40, 48, 3)}" fill="#fff" ${anim("pulse", 2, 0)}/></g>` : ""}
${[0, 1, 2, 3].map((i) => `<path d="${rrp(90 + (i % 2) * 36, 78 + Math.floor(i / 2) * 25, 32, 21, 2)}" fill="#eef0f3" stroke="#d3d7dd" stroke-width=".6"/><circle cx="${100 + (i % 2) * 36}" cy="${88 + Math.floor(i / 2) * 25}" r="4" fill="${["#7aa7ff", "#ffcf6b", "#a78bfa", "#5fd3b0"][i]}" opacity=".8"/>`).join("")}
<path d="${rrp(34, 140, 132, 9, 4)}" fill="${x.url("fab")}"/><path d="${rrp(34, 140, 132, 9, 4)}" fill="${x.url("weave")}"/>${armLed(x, 170, 58, 1.3)}${edge(B)}`;
      return scene(x, "slate", F);
    } }),

     fin({ id: "camera-hub-panel", name: "Camera hub panel", colors: [WH, GY], render(o) {
      const x = ctx(o), lit = x.on;
      const F = `<ellipse cx="100" cy="152" rx="34" ry="5" fill="${x.url("sh")}"/>${drop(x, `<path d="${rrp(74, 44, 52, 108, 8)}"/>`, 3, 4)}
<path d="${rrp(74, 96, 52, 56, 6)}" fill="${x.url("fab")}"/><path d="${rrp(74, 96, 52, 56, 6)}" fill="${x.url("weave")}"/><path d="${rrp(74, 96, 52, 56, 6)}" fill="${x.url("bh")}" opacity=".3"/>
<path d="M74 100V52Q74 44 82 44H118Q126 44 126 52V100Z" fill="${x.url("blk")}"/>${gl(x, "M76 98V52Q76 46 82 46H118Q124 46 124 52V64H76Z", .3)}
<circle cx="100" cy="66" r="9" fill="#05060a"/><circle cx="100" cy="66" r="6" fill="${x.url("lens")}"/><circle cx="98" cy="64" r="1.6" fill="#fff" fill-opacity=".6"/>
${lit ? `<circle cx="100" cy="66" r="14" fill="${x.url("hR")}" opacity=".4"/>` : ""}
<rect x="88" y="86" width="24" height="3" rx="1.5" fill="${lit ? RED : GREEN}" opacity="${lit ? .95 : .8}" ${lit ? anim("pulse", 1.6, 0) : ""}/><rect x="84" y="84" width="32" height="7" rx="3.5" fill="${x.url(lit ? "hR" : "hG")}" opacity=".5"/>
<path d="M74 100H126" stroke="#000" stroke-opacity=".4"/>`;
      return scene(x, "cream", F, { shelf: 152 });
    } }),

     fin({ id: "command-touchscreen", name: "Command touchscreen", colors: [WH, GY], render(o) {
      const x = ctx(o), B = rrp(26, 50, 148, 106, 10), lit = x.on, col = lit ? "#ef4444" : "#22c55e";
      const F = drop(x, `<path d="${B}"/>`) + `<path d="${B}" fill="${x.url("bv")}"/><path d="${B}" fill="${x.url("bh")}" opacity=".2"/>${hl("M36 51H164", .6, 1)}
<path d="${rrp(34, 58, 132, 76, 3)}" fill="#2457b8"/><path d="${rrp(34, 58, 132, 76, 3)}" fill="url(#${x.id("scr")})"/>
${txtC(lit ? ARMED : DIS, 100, 62, 4.4, "#fff", .7)}
<circle cx="62" cy="96" r="17" fill="${col}"/><circle cx="62" cy="96" r="17" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="1.4"/>${glyphShield(62, 95, .9, "#fff")}
${lit ? `<g opacity=".5"><circle cx="62" cy="96" r="24" fill="${x.url("hR")}" ${anim("pulse", 2, 0)}/></g>` : ""}
${[100, 124, 148].map((cx, i) => `<circle cx="${cx}" cy="96" r="9" fill="#fff" fill-opacity="${lit && i === 0 ? .95 : .2}"/><circle cx="${cx}" cy="96" r="9" fill="none" stroke="#fff" stroke-opacity=".7"/>${(i === 0 ? glyphLock : glyphHome)(cx, 95, lit && i === 0 ? "#2457b8" : "#fff")}`).join("")}
<path d="M34 58L84 58L52 134H34Z" fill="#fff" opacity=".08"/>
${[60, 80, 100, 120, 140].map((cx) => `<circle cx="${cx}" cy="145" r="1.8" fill="#000" fill-opacity=".25"/>`).join("")}${armLed(x, 160, 145, 1.5)}${edge(B)}`;
      return scene(x, "navy", F, { extra: lg(x.id("scr"), [[0, "#fff", .18], [1, "#000", .2]], 0, 0, 0, 1) });
    } }),

     fin({ id: "smart-alarm-panel", name: "Smart alarm panel", colors: ["#1f3f78", "#1a1c22", "#2c6b3a"], colorLabel: "Board", render(o) {
      const x = ctx(o), lit = x.on;
      let t = ""; for (let i = 0; i < 12; i++) { const tx = 30 + i * 10; t += `<path d="${rrp(tx, 68, 9, 12, 1)}" fill="${x.url("term")}"/><circle cx="${tx + 4.5}" cy="72" r="2" fill="${x.url("chrome")}"/><path d="M${tx + 3} 72H${tx + 6}" stroke="#333" stroke-width=".6"/><rect x="${tx + 1}" y="76" width="7" height="3" fill="#0d3a1a"/>`; }
      let z = ""; for (let i = 0; i < 12; i++) z += led(x, 34 + i * 10, 88, 1.1, lit ? RED : GREEN, lit ? i % 4 === 0 : true, false);
      const F = `${drop(x, `<path d="${rrp(24, 60, 152, 84, 4)}"/>`)}
<path d="${rrp(24, 60, 152, 84, 4)}" fill="${H.shade(x.c, -.1)}"/><path d="${rrp(24, 60, 152, 84, 4)}" fill="url(#${x.id("pcbs")})"/>
<path d="M40 100H90M40 104H70V122M100 96V130M120 100H160M130 104V128" fill="none" stroke="#c9b26a" stroke-opacity=".35" stroke-width=".8"/>
${t}${z}
<path d="${rrp(130, 102, 26, 22, 1.5)}" fill="${x.url("chrome")}"/><path d="${rrp(134, 106, 18, 14, 1)}" fill="#111"/>${led(x, 136, 104, .9, AMB, lit, true)}${led(x, 150, 104, .9, GREEN, true, false)}
<path d="${rrp(56, 104, 30, 22, 1.5)}" fill="#111317"/><path d="M58 106H84" stroke="#fff" stroke-opacity=".12"/><path d="${rrp(96, 108, 16, 14, 1)}" fill="#111317"/>
${[30, 170].map((cx) => [64, 140].map((cy) => `<circle cx="${cx}" cy="${cy}" r="2.4" fill="${x.url("chrome")}"/>`).join("")).join("")}
${armLed(x, 116, 132, 1.8)}<path d="M100 144V192M110 144V192" stroke="#e8e2d0" stroke-width="2.4" opacity=".8"/>`;
      return scene(x, "ply", F, { extra: lg(x.id("pcbs"), [[0, "#fff", .1], [1, "#000", .3]], 0, 0, 0, 1) });
    } }),

     fin({ id: "wireless-keypad", name: "Wireless keypad", colors: [BK, WH], render(o) {
      const x = ctx(o), B = rrp(70, 40, 60, 124, 10), lit = x.on, bl = lit ? "#ffd2c2" : "#bfe3ff";
      let k = ""; for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) { const cx = 85 + c * 15, cy = 82 + r * 15;
        k += `<path d="${rrp(cx - 6, cy - 5, 12, 10, 2.4)}" fill="#000" fill-opacity=".35" transform="translate(0 .8)"/><path d="${rrp(cx - 6, cy - 5, 12, 10, 2.4)}" fill="${x.url("bvd")}"/><path d="M${cx - 1.6} ${cy}H${cx + 1.6}" stroke="${bl}" stroke-width="1.2" stroke-linecap="round" opacity="${lit ? 1 : .55}"/>`; }
      const F = drop(x, `<path d="${B}"/>`) + `<path d="${B}" fill="${x.url("bv")}"/><path d="${B}" fill="${x.url("bh")}" opacity=".3"/>${hl("M78 41H122", .4, 1)}
${[[85, "AWAY"], [100, "HOME"], [115, "OFF"]].map(([cx, l], i) => `<path d="${rrp(cx - 6, 52, 12, 14, 2.4)}" fill="${x.url("bvd")}"/>${((c2) => i === 0 ? glyphLock(cx, 58, c2) : i === 1 ? glyphHome(cx, 59, c2) : glyphShield(cx, 59, .45, c2))((i === 0 && lit) ? RED : (i === 2 && !lit) ? GREEN : bl)}`).join("")}
${k}${lit ? `<path d="${B}" fill="${x.url("hR")}" opacity=".15"/>` : ""}${armLed(x, 100, 148, 1.8)}${edge(B)}`;
      return scene(x, "casing", F);
    } }),

     fin({ id: "classic-lcd-keypad", name: "Classic LCD keypad", colors: [WH, AL, GY], render(o) {
      const x = ctx(o), B = rrp(38, 40, 124, 122, 8), lit = x.on;
      let k = ""; for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) { const kx = 62 + c * 22, ky = 100 + r * 12; k += `<path d="${rrp(kx, ky + 1, 18, 8, 2)}" fill="#000" fill-opacity=".3"/><path d="${rrp(kx, ky, 18, 8, 2)}" fill="${x.url("rub")}"/>${lit ? `<path d="${rrp(kx, ky, 18, 8, 2)}" fill="#e9f5b0" opacity=".14"/>` : ""}`; }
      const F = drop(x, `<path d="${B}"/>`) + `<path d="${B}" fill="${x.url("bv")}"/><path d="${B}" fill="${x.url("bh")}" opacity=".25"/>${hl("M46 41H154", .6, 1)}
${lcd(x, 50, 50, 84, 22, lit ? ["SYSTEM ARMED", "AWAY MODE"] : ["DISARMED", "READY TO ARM"], "#1d2a12", lit ? "#dcf5a0" : "#bcd48c")}
${led(x, 144, 52, 1.6, GREEN, !lit, false)}${armLed(x, 144, 60, 1.6)}${led(x, 144, 68, 1.6, AMB, false, false)}
${[56, 78, 100, 122].map((kx) => `<path d="${rrp(kx, 80, 20, 8, 4)}" fill="${x.url("rub")}"/>`).join("")}${k}
<path d="M42 150H158" stroke="#000" stroke-opacity=".25"/><path d="M42 151H158" stroke="#fff" stroke-opacity=".3"/>${edge(B)}`;
      return scene(x, "wall", F);
    } }),

     fin({ id: "round-smoke-alarm", name: "Round smoke alarm", colors: [WH], render(o) {
      const x = ctx(o), B = sq(100, 100, 120, .7), lit = x.on;
      const ringC = lit ? RED : GREEN;
      const F = drop(x, `<path d="${B}"/>`, 3, 5) + `<path d="${B}" fill="${x.url("bv")}"/><path d="${B}" fill="${x.url("holes")}" opacity=".7"/><path d="${B}" fill="${x.url("bh")}" opacity=".18"/>
<path d="${sq(100, 100, 116, .7)}" fill="none" stroke="#fff" stroke-opacity=".5"/><path d="${B}" fill="none" stroke="#000" stroke-opacity=".25"/>
${lit ? `<g ${anim("strobe", 1, 0)}><circle cx="100" cy="100" r="44" fill="${x.url("hR")}" opacity="${(x.L * .7).toFixed(2)}"/></g>` : ""}
<circle cx="100" cy="100" r="26" fill="${x.url("br")}"/><circle cx="100" cy="100" r="26" fill="none" stroke="#000" stroke-opacity=".15"/>
<circle cx="100" cy="100" r="22" fill="none" stroke="${ringC}" stroke-width="${lit ? 3.4 : 1.6}" opacity="${lit ? .95 : .45}" ${lit ? anim("blink", .8, 0) : ""}/>
<circle cx="100" cy="100" r="18" fill="${x.url("br")}"/>${alarm(x, 100, 100, 58, 100, 100).replace(/<circle cx="100" cy="100" r="1\.[58]"[^>]*>/, "")}`;
      return scene(x, "ceiling", F);
    } }),

     fin({ id: "speaker-smoke-alarm", name: "Speaker smoke alarm", colors: [WH], render(o) {
      const x = ctx(o), B = sq(100, 100, 132, .66), lit = x.on;
      const F = drop(x, `<path d="${B}"/>`, 3, 5) + `<path d="${B}" fill="${x.url("bv")}"/><path d="${sq(100, 100, 124, .66)}" fill="${x.url("fab")}"/><path d="${sq(100, 100, 124, .66)}" fill="${x.url("weave")}"/>
<path d="${sq(100, 100, 74, .64)}" fill="${x.url("bv")}"/><path d="${sq(100, 100, 74, .64)}" fill="none" stroke="#000" stroke-opacity=".2"/>
<path d="${sq(100, 100, 60, .62)}" fill="none" stroke="${lit ? RED : "#e9eef6"}" stroke-width="${lit ? 3.6 : 2}" opacity="${lit ? 1 : .7}" ${lit ? anim("blink", .8, 0) : ""}/>
<path d="${sq(100, 100, 50, .6)}" fill="${x.url("br")}"/>${hl("M76 64Q100 56 124 64", .5, 1.4)}<path d="${B}" fill="none" stroke="#000" stroke-opacity=".25"/>
${alarm(x, 100, 100, 62, 100, 122)}`;
      return scene(x, "ceiling", F);
    } }),

     fin({ id: "combo-smoke-and-co", name: "Combo smoke & CO", colors: [WH, AL], render(o) {
      const x = ctx(o);
      let sl = ""; for (let i = 0; i < 24; i++) { const a = i / 24 * 360; sl += `<path d="${rrp(98.5, 50, 3, 12, 1.5)}" fill="#000" fill-opacity=".22" transform="rotate(${a} 100 100)"/>`; }
      const F = disc(x, 100, 100, 54, 40) + sl + `<path d="${rrp(84, 106, 32, 15, 7.5)}" fill="#000" fill-opacity=".2" transform="translate(0 1)"/><path d="${rrp(84, 106, 32, 15, 7.5)}" fill="${x.url("bv")}"/><path d="${rrp(84, 106, 32, 15, 7.5)}" fill="none" stroke="#000" stroke-opacity=".25"/>
<path d="M92 88H108" stroke="#000" stroke-opacity=".12" stroke-width="3" stroke-linecap="round"/><ellipse cx="90" cy="70" rx="14" ry="6" fill="#fff" fill-opacity=".3" transform="rotate(-25 90 70)"/>
${alarm(x, 100, 100, 54, 122, 122)}`;
      return scene(x, "ceiling", F);
    } }),

     fin({ id: "hardwired-smoke-alarm", name: "Hardwired smoke alarm", colors: [WH, AL], render(o) {
      const x = ctx(o);
      let lv = ""; for (let i = 0; i < 36; i++) { const a = i / 36 * 360; lv += `<path d="M100 60L100 70" stroke="#000" stroke-opacity=".28" stroke-width="2.2" stroke-linecap="round" transform="rotate(${a} 100 100)"/>`; }
      const F = disc(x, 100, 100, 58, 46) + lv + `<circle cx="100" cy="100" r="28" fill="${x.url("br")}"/><circle cx="100" cy="100" r="28" fill="none" stroke="#000" stroke-opacity=".2"/>
${(() => { let h = ""; for (let yy = -8; yy <= 8; yy += 3.2) for (let xx = -8; xx <= 8; xx += 3.2) if (xx * xx + yy * yy < 72) h += `<circle cx="${f(100 + xx)}" cy="${f(92 + yy)}" r=".9" fill="#000" fill-opacity=".4"/>`; return h; })()}
<circle cx="100" cy="114" r="5.5" fill="${x.url("bv")}"/><circle cx="100" cy="114" r="5.5" fill="none" stroke="#000" stroke-opacity=".25"/>
<circle cx="100" cy="100" r="44" fill="none" stroke="#000" stroke-opacity=".12"/><ellipse cx="86" cy="76" rx="12" ry="5" fill="#fff" fill-opacity=".35" transform="rotate(-25 86 76)"/>
${alarm(x, 100, 100, 58, 116, 112)}${x.on ? "" : led(x, 84, 112, 1.3, GREEN, true, false)}`;
      return scene(x, "ceiling", F);
    } }),

     fin({ id: "smart-smoke-co", name: "Smart smoke + CO", colors: [WH], render(o) {
      const x = ctx(o), lit = x.on;
      let sl = ""; for (let i = 0; i < 40; i++) { const a = i / 40 * 360; sl += `<path d="M100 52L100 64" stroke="#000" stroke-opacity=".25" stroke-width="1.4" stroke-linecap="round" transform="rotate(${a} 100 100)"/>`; }
      const F = disc(x, 100, 100, 56, 0) + sl + `<circle cx="100" cy="100" r="34" fill="${x.url("br")}"/>
<circle cx="100" cy="100" r="30" fill="none" stroke="${lit ? RED : "#d7f0dc"}" stroke-width="${lit ? 3 : 1.6}" opacity="${lit ? 1 : .8}" ${lit ? anim("blink", .8, 0) : ""}/>
<circle cx="100" cy="100" r="26" fill="${x.url("br")}"/><circle cx="100" cy="100" r="34" fill="none" stroke="#000" stroke-opacity=".2"/>
${alarm(x, 100, 100, 56, 100, 120)}`;
      return scene(x, "ceiling", F);
    } }),

     fin({ id: "compact-smoke-alarm", name: "Compact smoke alarm", colors: [WH, BK], render(o) {
      const x = ctx(o);
      let gr = ""; for (let r = 17; r < 39; r += 3.6) gr += `<circle cx="100" cy="100" r="${f(r)}" fill="none" stroke="#000" stroke-opacity=".13" stroke-width=".9"/>`;
      const F = disc(x, 100, 100, 52, 0) + `<circle cx="100" cy="100" r="45" fill="none" stroke="#17191e" stroke-width="7"/><circle cx="100" cy="100" r="45" fill="none" stroke="#9aa0aa" stroke-opacity=".35" stroke-width="5" stroke-dasharray="1.2 2.4"/>
<circle cx="100" cy="100" r="41" fill="${x.url("br")}"/>${gr}<circle cx="100" cy="100" r="12" fill="${x.url("bv")}"/><circle cx="100" cy="100" r="12" fill="none" stroke="#000" stroke-opacity=".2"/>
<circle cx="100" cy="100" r="20" fill="none" stroke="#000" stroke-opacity=".08" stroke-width="2"/><ellipse cx="90" cy="72" rx="12" ry="5" fill="#fff" fill-opacity=".3" transform="rotate(-25 90 72)"/>
${alarm(x, 100, 100, 52, 100, 116)}`;
      return scene(x, "ceiling", F);
    } }),

     fin({ id: "alarm-listener-disc", name: "Alarm listener disc", colors: [WH], render(o) {
      const x = ctx(o), lit = x.on, P2 = rrp(116, 82, 44, 44, 10);
      const smoke = `<circle cx="64" cy="104" r="40" fill="#e9e7e2"/><circle cx="64" cy="104" r="40" fill="url(#${x.id("old")})"/><circle cx="64" cy="104" r="24" fill="#f4f2ee" stroke="#000" stroke-opacity=".12"/><circle cx="64" cy="104" r="40" fill="none" stroke="#000" stroke-opacity=".25"/>${vents(64, 104, 28, 36, 30, 1.6)}${lit ? led(x, 80, 120, 1.6, RED, true, true) : led(x, 80, 120, 1.3, GREEN, true, false)}`;
      const F = drop(x, `<circle cx="64" cy="104" r="40"/>`, 3, 4, .4) + smoke + drop(x, `<path d="${P2}"/>`, 2, 4, .45) +
        `<path d="${P2}" fill="${x.url("bv")}"/><path d="${P2}" fill="${x.url("bh")}" opacity=".2"/><path d="${P2}" fill="none" stroke="#000" stroke-opacity=".25"/>
${[[128, 6], [133, 11], [138, 15], [143, 11], [148, 6]].map(([sx, h]) => `<path d="M${sx} ${f(99 - h / 2)}V${f(99 + h / 2)}" stroke="#000" stroke-opacity=".45" stroke-width="1.8" stroke-linecap="round"/>`).join("")}
<path d="${rrp(130, 112, 16, 6, 3)}" fill="${x.url("br")}"/>${hl("M122 84H154", .6, 1)}
${lit ? `<path d="M104 92Q110 98 104 104M98 88Q108 98 98 108" fill="none" stroke="#ff6b6b" stroke-width="1.8" stroke-linecap="round" ${anim("wave", 1, 0)}/>` : ""}
${alarm(x, 64, 104, 40, 152, 88).replace(/<circle cx="64" cy="104" r="62"[^>]*>/, "")}`;
      return scene(x, "ceiling", F, { extra: rg(x.id("old"), [[0, "#fff", .4], [1, "#000", .15]], .4, .35, .8) });
    } }),

     fin({ id: "smoke-listener", name: "Smoke listener", colors: [WH, GY], render(o) {
      const x = ctx(o), lit = x.on;
      const F = drop(x, `<circle cx="70" cy="98" r="42"/>`, 3, 4, .4) + `<circle cx="70" cy="98" r="42" fill="#ece9e3"/><circle cx="70" cy="98" r="42" fill="url(#${x.id("old")})"/>${vents(70, 98, 30, 38, 34, 1.4)}<circle cx="70" cy="98" r="22" fill="#f4f2ee" stroke="#000" stroke-opacity=".12"/><circle cx="70" cy="98" r="42" fill="none" stroke="#000" stroke-opacity=".25"/>
${lit ? led(x, 70, 112, 1.6, RED, true, true) : led(x, 70, 112, 1.2, GREEN, true, false)}
${drop(x, `<circle cx="142" cy="108" r="20"/>`, 2, 4, .45)}<circle cx="142" cy="108" r="20" fill="${x.url("br")}"/><circle cx="142" cy="108" r="20" fill="none" stroke="#000" stroke-opacity=".22"/>
<circle cx="142" cy="108" r="14" fill="none" stroke="#000" stroke-opacity=".08"/><ellipse cx="136" cy="100" rx="6" ry="3" fill="#fff" fill-opacity=".5" transform="rotate(-25 136 100)"/>
${led(x, 142, 116, 1.3, lit ? RED : BLUE, true, lit)}
${lit ? `<path d="M116 96Q122 102 116 108M110 92Q120 102 110 112" fill="none" stroke="#ff6b6b" stroke-width="1.8" stroke-linecap="round" ${anim("wave", 1, 0)}/>` : ""}
${alarm(x, 70, 98, 42, 70, 112).replace(/<circle cx="70" cy="112"[^]*$/, "")}`;
      return scene(x, "ceiling", F, { extra: rg(x.id("old"), [[0, "#fff", .4], [1, "#000", .15]], .4, .35, .8) });
    } }),

     fin({ id: "nighthawk", name: "Plug-in CO Alarm", colors: [WH, AL], render(o) {
      const x = ctx(o), lit = x.on, B = rrp(70, 38, 60, 112, 12), ppm = lit ? String(Math.round(150 + 250 * x.lv)) : "0";
      let sl = ""; for (let i = 0; i < 6; i++) sl += `<path d="${rrp(80, 120 + i * 4.4, 40, 2, 1)}" fill="#000" fill-opacity=".3"/>`;
      const F = `<path d="${rrp(78, 134, 44, 48, 4)}" fill="#ece8df"/><path d="${rrp(78, 134, 44, 48, 4)}" fill="none" stroke="#000" stroke-opacity=".3"/><circle cx="100" cy="174" r="2.4" fill="#d9d4c8" stroke="#000" stroke-opacity=".3"/>
<rect x="90" y="160" width="3" height="8" rx="1" fill="#222"/><rect x="107" y="160" width="3" height="8" rx="1" fill="#222"/>
${drop(x, `<path d="${B}"/>`)}<path d="${B}" fill="${x.url("bv")}"/><path d="${B}" fill="${x.url("bh")}" opacity=".22"/>${hl("M80 39H120", .6, 1)}
<path d="${rrp(78, 50, 44, 22, 3)}" fill="#0b0d12"/>${lit ? `<path d="${rrp(78, 50, 44, 22, 3)}" fill="${RED}" opacity=".12"/>` : ""}
<g>${seg7(ppm.padStart(3, " "), 84, 54, 14, lit ? "#ff5a4f" : "#c8423a", .07)}</g>${gl(x, rrp(78, 50, 44, 9, 3), .3)}
${led(x, 86, 82, 1.6, GREEN, !lit, false)}${led(x, 100, 82, 1.6, RED, lit, true)}
<path d="${rrp(88, 92, 24, 12, 6)}" fill="${x.url("br")}"/><path d="${rrp(88, 92, 24, 12, 6)}" fill="none" stroke="#000" stroke-opacity=".25"/>${sl}${edge(B)}
${lit ? `<g opacity="${(.5 + .5 * x.L).toFixed(2)}">${[0, 1, 2].map((i) => `<path d="M${136 + i * 8} ${70 - i * 4}Q${142 + i * 8} ${84} ${136 + i * 8} ${98 + i * 4}M${64 - i * 8} ${70 - i * 4}Q${58 - i * 8} 84 ${64 - i * 8} ${98 + i * 4}" fill="none" stroke="#ff6b6b" stroke-width="${f(3 - i * .7)}" stroke-linecap="round" ${anim("wave", x.sp * 1.2, i * .25)}/>`).join("")}</g>` : ""}`;
      return scene(x, "sage", F);
    } }),

     fin({ id: "heat", name: "Heat Detector", colors: [WH, AL], render(o) {
      const x = ctx(o);
      let fins = ""; for (let i = 0; i < 8; i++) { const a = i / 8 * 360; fins += `<path d="${rrp(98, 72, 4, 18, 2)}" fill="${x.url("bv")}" stroke="#000" stroke-opacity=".2" stroke-width=".6" transform="rotate(${a} 100 100)"/>`; }
      const F = disc(x, 100, 100, 52, 38) + `<circle cx="100" cy="100" r="30" fill="#000" fill-opacity=".1"/>${fins}
<circle cx="100" cy="100" r="11" fill="${x.url("chrome")}"/><circle cx="100" cy="100" r="11" fill="none" stroke="#000" stroke-opacity=".35"/><circle cx="100" cy="100" r="5" fill="#222"/><circle cx="98.6" cy="98.6" r="1.6" fill="#fff" fill-opacity=".5"/>
<ellipse cx="88" cy="70" rx="12" ry="5" fill="#fff" fill-opacity=".3" transform="rotate(-25 88 70)"/>
${x.on ? `<path d="M80 150Q76 142 82 136Q80 144 86 146Q86 138 92 134Q90 142 96 148" fill="none" stroke="#ff8a3a" stroke-width="1.6" ${anim("pulse", .7, 0)}/>` : ""}
${alarm(x, 100, 100, 52, 124, 126)}`;
      return scene(x, "ceiling", F);
    } }),
  ];

  (window.HDA = window.HDA || []).push({
    id: "safety",
    tab: "Keypads & smoke alarms",
    group: "Security",
    kind: "device",
    intro: "Twenty real keypads, alarm panels and smoke/CO alarms (no logos). Keypads: Armed shows the red armed light, a lit backlight and ARMED AWAY on the display; Disarmed is green. Smoke and CO alarms: Armed means the alarm is sounding (red flashing light, sound waves, strobe ring); Disarmed is normal with a small green pilot light.",
    
    onWord: "Armed", offWord: "Disarmed",
    css: `.hda-safety-blink,.hda-safety-strobe,.hda-safety-wave,.hda-safety-pulse{animation-iteration-count:infinite}
.hda-anim .hda-safety-blink{animation-name:hda-safety-blink;animation-timing-function:steps(1,end)}
.hda-anim .hda-safety-strobe{animation-name:hda-safety-strobe;animation-timing-function:linear}
.hda-anim .hda-safety-wave{animation-name:hda-safety-wave;animation-timing-function:ease-out}
.hda-anim .hda-safety-pulse{animation-name:hda-safety-pulse;animation-timing-function:ease-in-out}
@keyframes hda-safety-blink{0%{opacity:1}50%{opacity:.12}}
@keyframes hda-safety-strobe{0%{opacity:1}8%{opacity:.08}16%{opacity:1}24%{opacity:.08}100%{opacity:.08}}
@keyframes hda-safety-wave{0%{opacity:0}25%{opacity:1}100%{opacity:0}}
@keyframes hda-safety-pulse{0%,100%{opacity:1}50%{opacity:.45}}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-safety-blink,.hda-anim .hda-safety-strobe,.hda-anim .hda-safety-wave,.hda-anim .hda-safety-pulse{animation:none}}`,
    icons,
  });
})();
