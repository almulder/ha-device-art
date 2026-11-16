(function () {
  const H = window.HDAH, P = "hda-avr-";
  const f = (n) => (+n).toFixed(1);
  const R = Math.PI / 180;
  const rnd = (seed) => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };

  // (multi-function) parts: Power (switch), Mute (switch), Volume (value, %) and, where the drawing has a display,
  // Input (stage). o.parts holds only the parts the user ticked; as a Device Image (no o.mf) the drawing is exactly as
  // today (on = playing, the slider = the volume). As a Multi-Function Image (o.mf): on = the Power part (left out =
  // on), the volume = o.pval.volume (left out = "--" on the display), Mute = a muted-speaker sign on the display and
  // the meters at rest, Input = the source's short name on the display.
  const MF = {
    has: (o, k) => !!(o.parts && o.parts[k] != null),
    val: (o, k) => (o.pval && o.pval[k] != null && o.pval[k] !== "" && isFinite(+o.pval[k]) ? +o.pval[k] : null),
    st: (o, k) => (o.pval && o.pval[k] != null && o.pval[k] !== "" ? String(o.pval[k]) : null),
  };
  function ctx(o) {
    if (o.mf) {
      const c = o.color || "#232428", on = MF.has(o, "power") ? !!o.parts.power : true, v = MF.val(o, "volume"), lv = v == null ? 0 : Math.max(0, Math.min(1, v / 100));
      return { c, on, lv, L: on ? .55 + .45 * lv : 0, id: (s) => `${o.uid}-${s}`, url: (s) => `url(#${o.uid}-${s})`, n: 0,
        mf: true, nov: v == null, mute: MF.has(o, "mute") && !!o.parts.mute, inp: MF.st(o, "input") };
    }
    const c = o.color || "#232428", on = !!o.on, lv = o.level == null ? .6 : Math.max(0, Math.min(1, o.level));
    return { c, on, lv, L: on ? .55 + .45 * lv : 0, id: (s) => `${o.uid}-${s}`, url: (s) => `url(#${o.uid}-${s})`, n: 0 };
  }
  const stops = (a) => a.map(([o, c, op]) => `<stop offset="${o}" stop-color="${c}"${op == null ? "" : ` stop-opacity="${op}"`}/>`).join("");
  const lg = (id, a, x1, y1, x2, y2) => `<linearGradient id="${id}" x1="${x1 || 0}" y1="${y1 || 0}" x2="${x2 == null ? 1 : x2}" y2="${y2 || 0}">${stops(a)}</linearGradient>`;
  const rg = (id, a, cx, cy, r) => `<radialGradient id="${id}" cx="${cx == null ? .5 : cx}" cy="${cy == null ? .5 : cy}" r="${r || .5}">${stops(a)}</radialGradient>`;
  const rrp = (x, y, w, h, r) => `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`;
  const hl = (d, a, w) => `<path d="${d}" fill="none" stroke="#fff" stroke-opacity="${a}" stroke-width="${w}" stroke-linecap="round"/>`;
  const dk = (d, a, w) => `<path d="${d}" fill="none" stroke="#000" stroke-opacity="${a}" stroke-width="${w || 1}"/>`;
  const anim = (cls, dur, delay) => `class="${P}${cls}" style="animation-duration:${f(dur)}s;animation-delay:${(delay || 0).toFixed(2)}s"`;
  const dB = (lv) => (Math.round((-80 + 80 * lv) * 2) / 2).toFixed(1);
  const num = (lv, max) => String(Math.round(lv * (max || 100)));
  // the volume as shown: a Multi-Function Image without a Volume reading shows dashes
  const vd = (x) => (x.nov ? "--" : dB(+x.lv)), vn = (x, max) => (x.nov ? "--" : num(x.lv, max));

  const WHITE = "#d8ecff", CYAN = "#8fe6ff", AMBER = "#ffb347", BLUE = "#59b4ff", WARM = "#ffcf7a";

  function defs(x, wall, extra) {
    const { c, id } = x;
    return `<defs>
${lg(id("wallg"), [[0, wall[0]], [1, wall[1]]], 0, 0, 0, 1)}
<clipPath id="${id("wc")}"><rect x="8" y="8" width="184" height="184" rx="16"/></clipPath>
${rg(id("vig"), [[0, "#000", 0], [.62, "#000", .06], [1, "#000", .55]], .5, .45, .74)}
${rg(id("sh"), [[0, "#000", .65], [.6, "#000", .25], [1, "#000", 0]])}
${lg(id("face"), [[0, H.shade(c, .38)], [.07, H.shade(c, .08)], [.5, c], [.9, H.shade(c, -.22)], [1, H.shade(c, -.5)]], 0, 0, 0, 1)}
${lg(id("faceh"), [[0, "#000", .35], [.06, "#000", 0], [.94, "#000", 0], [1, "#000", .35]])}
${lg(id("top"), [[0, H.shade(c, -.55)], [1, H.shade(c, -.3)]], 0, 0, 0, 1)}
${lg(id("blkface"), [[0, "#4a4d55"], [.07, "#24262c"], [.5, "#17181c"], [1, "#08090b"]], 0, 0, 0, 1)}
${lg(id("glass"), [[0, "#14161d"], [.5, "#07080c"], [1, "#030305"]], 0, 0, 0, 1)}
${lg(id("gloss"), [[0, "#fff", .22], [.45, "#fff", .03], [1, "#fff", 0]], 0, 0, 0, 1)}
${rg(id("kcap"), [[0, "#ffffff"], [.35, "#d6d9de"], [.75, "#8e939b"], [1, "#4e535b"]], .38, .3, .8)}
${rg(id("kcapd"), [[0, "#6b6f78"], [.4, "#33363d"], [1, "#0d0e11"]], .38, .3, .8)}
${rg(id("kcapc"), [[0, H.shade(c, .6)], [.4, H.shade(c, .15)], [1, H.shade(c, -.45)]], .38, .3, .8)}
${lg(id("chrome"), [[0, "#5c6068"], [.25, "#f4f6f9"], [.5, "#a6abb3"], [.75, "#e8ebef"], [1, "#4d5158"]])}
${lg(id("wood"), [[0, "#b5875c"], [.5, "#93683f"], [1, "#5d3d22"]], 0, 0, 0, 1)}
${lg(id("woodt"), [[0, "#6e4a2c"], [1, "#a77a50"]], 0, 0, 0, 1)}
${lg(id("rack"), [[0, "#2b2d33"], [1, "#16171b"]], 0, 0, 0, 1)}
${lg(id("rackt"), [[0, "#1d1e22"], [1, "#3a3c43"]], 0, 0, 0, 1)}
${lg(id("case"), [[0, H.shade(c, .3)], [.5, c], [1, H.shade(c, -.4)]], 0, 0, 0, 1)}
<pattern id="${id("brush")}" width="200" height="3" patternUnits="userSpaceOnUse"><path d="M0 .6H200" stroke="#fff" stroke-opacity=".07" stroke-width=".5"/><path d="M0 2.1H200" stroke="#000" stroke-opacity=".06" stroke-width=".5"/></pattern>
<pattern id="${id("vent")}" width="5" height="4" patternUnits="userSpaceOnUse"><rect width="3.2" height="1.6" rx=".8" fill="#000" fill-opacity=".55"/></pattern>
${rg(id("hW"), [[0, WHITE, .7], [.45, WHITE, .2], [1, WHITE, 0]])}
${rg(id("hR"), [[0, "#ff3b3b", .8], [.45, "#ff3b3b", .25], [1, "#ff3b3b", 0]])}
${rg(id("hA"), [[0, WARM, .8], [.45, WARM, .25], [1, WARM, 0]])}
<filter id="${id("bl")}" x="-25%" y="-25%" width="150%" height="150%"><feGaussianBlur stdDeviation="2.4"/></filter>
${extra || ""}</defs>`;
  }

  const WALLS = { living: ["#463f4c", "#2c2732"], navy: ["#2f3850", "#1c2233"], sage: ["#3f4a43", "#272f2a"], warm: ["#55463a", "#352b23"], slate: ["#3c4350", "#242932"] };
  function console_(x, y, kind) {
    if (kind === "rack") return `<rect x="8" y="${y - 8}" width="184" height="12" fill="${x.url("rackt")}"/><rect x="8" y="${y + 4}" width="184" height="12" fill="${x.url("rack")}"/>${hl(`M8 ${y + 4.5}H192`, .18, 1)}<rect x="8" y="${y + 16}" width="184" height="40" fill="#000" fill-opacity=".45"/>`;
    return `<rect x="8" y="${y - 8}" width="184" height="12" fill="${x.url("woodt")}"/><rect x="8" y="${y + 4}" width="184" height="14" fill="${x.url("wood")}"/>${hl(`M8 ${y + 4.5}H192`, .3, 1)}${dk(`M8 ${y + 18}H192`, .5, 1.4)}
<path d="M8 ${y + 9}C60 ${y + 7} 120 ${y + 11} 192 ${y + 8}M8 ${y + 14}C70 ${y + 15} 130 ${y + 12} 192 ${y + 14}M8 ${y - 3}C70 ${y - 4} 130 ${y - 1} 192 ${y - 3}" stroke="#3a2414" stroke-opacity=".35" stroke-width=".7" fill="none"/>
<rect x="8" y="${y + 18}" width="184" height="40" fill="#120d0a" fill-opacity=".85"/><path d="M100 ${y + 18}V200" stroke="#000" stroke-opacity=".6" stroke-width="1.4"/><rect x="88" y="${y + 24}" width="6" height="2" rx="1" fill="#b48a5a"/><rect x="106" y="${y + 24}" width="6" height="2" rx="1" fill="#b48a5a"/>`;
  }
  function scene(x, o2) {
    const wall = WALLS[o2.wall || "living"], r = rnd(7 + (o2.wall || "x").length * 13);
    let tex = ""; for (let i = 0; i < 40; i++) tex += `<circle cx="${f(10 + r() * 180)}" cy="${f(10 + r() * 140)}" r="${f(.3 + r() * .6)}" fill="${r() > .5 ? "#000" : "#fff"}" fill-opacity=".04"/>`;
    const rack = o2.shelfKind === "rack" ? `<rect x="10" y="8" width="9" height="184" fill="${x.url("rack")}"/><rect x="181" y="8" width="9" height="184" fill="${x.url("rack")}"/>${[30, 60, 90, 120].map((y) => `<circle cx="14.5" cy="${y}" r="1.4" fill="#000"/><circle cx="185.5" cy="${y}" r="1.4" fill="#000"/>`).join("")}` : "";
    const glow = x.on && o2.glow ? `<ellipse cx="${o2.glow[0]}" cy="${o2.glow[1]}" rx="80" ry="50" fill="${x.url(o2.glow[2] || "hW")}" opacity="${(x.L * .25).toFixed(2)}"/>` : "";
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs(x, wall, o2.extra)}
<g class="hda-bg"><rect x="8" y="8" width="184" height="184" rx="16" fill="${x.url("wallg")}"/></g>
<g clip-path="${x.url("wc")}"><g class="hda-bg">${tex}${rack}${glow}${console_(x, o2.shelf || 150, o2.shelfKind)}<rect x="8" y="8" width="184" height="184" fill="${x.url("vig")}"/></g>
${o2.body}</g>
<g class="hda-bg"><rect x="8.5" y="8.5" width="183" height="183" rx="15.5" fill="none" stroke="#fff" stroke-opacity=".07"/></g></svg>`;
  }

  function chassis(x, X, Y, W, Hh, o2) {
    o2 = o2 || {};
    const r = o2.r == null ? 3 : o2.r, d = o2.depth == null ? 7 : o2.depth, face = o2.face || "face", feet = o2.feet !== false;
    return `<ellipse cx="${X + W / 2}" cy="${Y + Hh + 4}" rx="${W / 2 + 6}" ry="5" fill="${x.url("sh")}"/>
${feet ? `<rect x="${X + 10}" y="${Y + Hh - 1}" width="14" height="5" rx="1.5" fill="#0c0d10"/><rect x="${X + W - 24}" y="${Y + Hh - 1}" width="14" height="5" rx="1.5" fill="#0c0d10"/>` : ""}
<path d="M${X + 4} ${Y - d}H${X + W - 4}L${X + W} ${Y + 1}H${X}Z" fill="${o2.topFill || x.url("top")}"/><path d="M${X + 4} ${Y - d}H${X + W - 4}" stroke="#fff" stroke-opacity=".12"/>
${o2.vents ? `<path d="M${X + 14} ${Y - d + 1.6}H${X + W - 14}L${X + W - 12} ${Y - 1}H${X + 12}Z" fill="${x.url("vent")}" opacity=".7"/>` : ""}
<path d="${rrp(X, Y, W, Hh, r)}" fill="${x.url(face)}"/><path d="${rrp(X, Y, W, Hh, r)}" fill="${x.url("brush")}"/><path d="${rrp(X, Y, W, Hh, r)}" fill="${x.url("faceh")}"/>
${hl(`M${X + r} ${Y + .7}H${X + W - r}`, .45, 1)}${dk(`M${X + r} ${Y + Hh - .5}H${X + W - r}`, .5, 1)}`;
  }
  function knob(x, cx, cy, r, lv, mat) {
    const cap = mat === "dark" ? "kcapd" : mat === "finish" ? "kcapc" : "kcap", ang = lv == null ? -20 : -135 + 270 * lv;
    let rings = ""; for (let k = .25; k < .8; k += .14) rings += `<circle cx="${cx}" cy="${cy}" r="${f(r * k)}" fill="none" stroke="${mat === "dark" ? "#fff" : "#000"}" stroke-opacity=".06" stroke-width=".6"/>`;
    return `<circle cx="${f(cx + 1.5)}" cy="${f(cy + 2.5)}" r="${r}" fill="#000" opacity=".55" filter="${x.url("bl")}"/>
<circle cx="${cx}" cy="${cy}" r="${f(r + 1.4)}" fill="#000" fill-opacity=".5"/>
<circle cx="${cx}" cy="${cy}" r="${r}" fill="${x.url(mat === "dark" ? "kcapd" : "chrome")}"/>
<circle cx="${cx}" cy="${cy}" r="${f(r - .9)}" fill="none" stroke="#000" stroke-opacity=".45" stroke-width="1.6" stroke-dasharray="1 1.3"/>
<circle cx="${cx}" cy="${cy}" r="${f(r * .8)}" fill="${x.url(cap)}"/>${rings}
<circle cx="${cx}" cy="${cy}" r="${f(r * .8)}" fill="none" stroke="#000" stroke-opacity=".3" stroke-width=".7"/>
<g transform="rotate(${f(ang)} ${cx} ${cy})"><circle cx="${cx}" cy="${f(cy - r * .58)}" r="${f(Math.max(1, r * .09))}" fill="${mat === "dark" ? "#e8eaee" : "#1a1b1f"}"/></g>
<ellipse cx="${f(cx - r * .3)}" cy="${f(cy - r * .38)}" rx="${f(r * .32)}" ry="${f(r * .16)}" fill="#fff" fill-opacity="${mat === "dark" ? .18 : .55}" transform="rotate(-30 ${f(cx - r * .3)} ${f(cy - r * .38)})"/>`;
  }
  const SEG = { 0: "abcdef", 1: "bc", 2: "abged", 3: "abgcd", 4: "fgbc", 5: "afgcd", 6: "afgedc", 7: "abc", 8: "abcdefg", 9: "abcdfg", "-": "g", " ": "" };
  function segW(str, h) { let w = 0; for (const ch of str) w += ch === "." ? h * .22 : h * .55 + h * .18; return w - h * .18; }
  function seg7(str, x0, y, h, col, ghost) {
    const w = h * .55, t = Math.max(.8, h * .13), hf = h / 2; let s = "", cx = x0;
    for (const ch of str) {
      if (ch === ".") { s += `<rect x="${f(cx - h * .06)}" y="${f(y + h - t)}" width="${f(t)}" height="${f(t)}" fill="${col}"/>`; cx += h * .22; continue; }
      const g = { a: [cx + t * .6, y, w - t * 1.2, t], d: [cx + t * .6, y + h - t, w - t * 1.2, t], g: [cx + t * .6, y + hf - t / 2, w - t * 1.2, t],
        b: [cx + w - t, y + t * .5, t, hf - t * .6], c: [cx + w - t, y + hf + t * .1, t, hf - t * .6], f: [cx, y + t * .5, t, hf - t * .6], e: [cx, y + hf + t * .1, t, hf - t * .6] };
      const on1 = SEG[ch] || "";
      for (const k in g) { const q = g[k], lit = on1.indexOf(k) >= 0;
        if (lit || ghost) s += `<rect x="${f(q[0])}" y="${f(q[1])}" width="${f(q[2])}" height="${f(q[3])}" rx="${f(t * .4)}" fill="${col}" opacity="${lit ? 1 : ghost}"/>`; }
      cx += w + h * .18;
    }
    return s;
  }
  function disp(x, X, Y, W, Hh, col, str, h, o2) {
    o2 = o2 || {};
    let s = `<path d="${rrp(X - 1.2, Y - 1.2, W + 2.4, Hh + 2.4, 2.4)}" fill="#000" fill-opacity=".6"/><path d="${rrp(X, Y, W, Hh, 1.6)}" fill="${x.url("glass")}"/>`;
    if (x.on) {
      const sx = o2.sx != null ? o2.sx : X + (W - segW(str, h)) / 2 + (o2.dx || 0), sy = o2.sy != null ? o2.sy : Y + (Hh - h) / 2;
      s += `<path d="${rrp(X, Y, W, Hh, 1.6)}" fill="${col}" opacity=".07"/>
<g opacity="${(.7 + .3 * x.L).toFixed(2)}">${seg7(str, sx, sy, h, col, .07)}</g>
${o2.unit ? seg7(o2.unit, sx + segW(str, h) + h * .3, sy + h * .45, h * .5, col, 0) : ""}
${o2.marks !== false ? `<rect x="${X + 3}" y="${Y + 2.5}" width="${f(W * .12)}" height="1.4" rx=".7" fill="${col}" opacity=".7"/><rect x="${X + W - 3 - W * .1}" y="${Y + 2.5}" width="${f(W * .1)}" height="1.4" rx=".7" fill="${col}" opacity=".5"/>` : ""}
${o2.bars ? (() => { let b = ""; for (let i = 0; i < 10; i++) b += `<rect x="${f(X + 3 + i * 2.6)}" y="${Y + Hh - 3.8}" width="1.8" height="1.6" fill="${col}" opacity="${i < Math.round(x.lv * 10) ? .85 : .1}"/>`; return b; })() : ""}`;
    }
    return s + `<path d="${rrp(X, Y, W, Hh * .45, 1.6)}" fill="${x.url("gloss")}"/>`;
  }
  const sled = (x, cx, cy, onCol) => x.on
    ? `<circle cx="${cx}" cy="${cy}" r="1.3" fill="${onCol || "#bfe3ff"}" opacity=".85"/>`
    : `<circle cx="${cx}" cy="${cy}" r="5" fill="${x.url("hR")}" opacity=".7"/><circle cx="${cx}" cy="${cy}" r="1.4" fill="#ff3b3b"/><circle cx="${f(cx - .4)}" cy="${f(cy - .4)}" r=".5" fill="#fff" fill-opacity=".8"/>`;
  const btn = (x, cx, cy, r, dark) => `<circle cx="${cx}" cy="${f(cy + .6)}" r="${r}" fill="#000" fill-opacity=".45"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="${x.url(dark ? "kcapd" : "kcap")}"/>`;
  const pill = (x, X, Y, w, h, dark) => `<path d="${rrp(X, Y + .6, w, h, h / 2)}" fill="#000" fill-opacity=".45"/><path d="${rrp(X, Y, w, h, h / 2)}" fill="${x.url(dark ? "kcapd" : "chrome")}"/>`;
  const glowAt = (x, cx, cy, rx, ry, g, k) => x.on ? `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${x.url(g || "hW")}" opacity="${(x.L * (k || .5)).toFixed(2)}"/>` : "";
  function meter(x, X, Y, W, Hh, col, delay, o2) {
    o2 = o2 || {};
    const cid = x.id("m" + (x.n++)), px = X + W / 2, py = Y + Hh * 1.05, len = Hh * .9;
    const lit = x.on, face = lit ? col : "#2b3038";
    let ticks = "";
    for (let i = 0; i <= 10; i++) { const a = (-50 + i * 10) * R, r1 = len * .78, r2 = len * (i % 5 ? .86 : .9);
      ticks += `<path d="M${f(px + r1 * Math.sin(a))} ${f(py - r1 * Math.cos(a))}L${f(px + r2 * Math.sin(a))} ${f(py - r2 * Math.cos(a))}" stroke="${i > 7 ? "#ff5a5a" : (lit ? "#0b1830" : "#6b7280")}" stroke-width="${i % 5 ? .8 : 1.2}"/>`; }
    const arc = `M${f(px - len * .82 * Math.sin(50 * R))} ${f(py - len * .82 * Math.cos(50 * R))}A${f(len * .82)} ${f(len * .82)} 0 0 1 ${f(px + len * .82 * Math.sin(50 * R))} ${f(py - len * .82 * Math.cos(50 * R))}`;
    const base = lit && !x.mute ? -45 + 70 * x.lv : -50;
    const needle = `<path d="M${f(px)} ${f(py)}L${f(px)} ${f(py - len * .92)}" stroke="${o2.needle || "#101216"}" stroke-width="1" stroke-linecap="round"/><path d="M${f(px)} ${f(py)}L${f(px)} ${f(py + len * .92)}" stroke="none"/>`;
    return `<clipPath id="${cid}"><path d="${rrp(X, Y, W, Hh, 2)}"/></clipPath>
<path d="${rrp(X - 1.5, Y - 1.5, W + 3, Hh + 3, 3)}" fill="#000" fill-opacity=".7"/>
<g clip-path="url(#${cid})"><rect x="${X}" y="${Y}" width="${W}" height="${Hh}" fill="${face}"/>
${lit ? `<ellipse cx="${px}" cy="${Y + Hh * .55}" rx="${W * .55}" ry="${Hh * .6}" fill="#fff" opacity=".35"/>` : ""}
<path d="${arc}" fill="none" stroke="${lit ? "#0b1830" : "#6b7280"}" stroke-width=".8"/>${ticks}
<g transform="rotate(${f(base)} ${f(px)} ${f(py)})"><g ${lit && !x.mute ? anim("swing", .9 + delay * .3, -delay) : ""}>${needle}</g></g>
<rect x="${X}" y="${Y}" width="${W}" height="${Hh * .4}" fill="${x.url("gloss")}"/></g>`;
  }
  const name = (d) => Object.assign({ picker: true, colorLabel: "Finish" }, d);
  // (parts) where each drawing shows the input (x, y, anchor, size, color; null = no display for it) and the mute sign
  const INPUTS = [["tv", "TV", "TV"], ["bluray", "Blu-ray", "BD"], ["game", "Game", "GAME"], ["stream", "Streaming", "NET"], ["cd", "CD", "CD"], ["phono", "Phono", "PHONO"], ["tuner", "Tuner", "TUNER"], ["aux", "Aux", "AUX"]];
  const OV = {
    "black-receiver-wide-display": { inp: [56, 96, "start", 4.2, WHITE], mute: [141, 93.5, 1] },
    "porthole-display-receiver": { inp: [100, 113.6, "middle", 3.2, "#bfe4ff"], mute: [100, 98.6, .7] },
    "big-dial-receiver": { inp: [104, 97.4, "start", 2.6, WHITE], mute: [147, 98, .7] },
    "two-knob-receiver": { inp: [40, 98.5, "start", 4.2, "#a8ecff"], mute: [118, 95.5, 1] },
    "gloss-black-receiver": { inp: [60, 99, "start", 4, AMBER], mute: [133, 97, 1] },
    "slim-silver-receiver": { inp: [69, 106.6, "start", 3.6, "#f2f6ff"], mute: [127, 104.5, .6] },
    "minimal-black-amp": { inp: [89, 115, "start", 3.4, "#ffffff"], mute: [135, 103.5, .7] },
    compact: { inp: [67, 121.6, "start", 3.6, WHITE], mute: [108, 119, .7] },
    bluemeter: { inp: null, mute: [100, 119.5, .8] },
    vintage: { inp: null, mute: [141, 137, .7] },
    streamer: { inp: [74, 132, "start", 3.4, "#e8f6ff"], mute: [91, 110.5, .6] },
    separates: { inp: [61.5, 80.2, "start", 2.6, WHITE], mute: [106, 77, .7] },
  };
  const muteSign = (cx, cy, s, col) => `<g transform="translate(${cx} ${cy}) scale(${s})"><path d="M-4.6 -1.6H-2.6L0 -4V4L-2.6 1.6H-4.6Z" fill="${col}"/><path d="M1.6 -2L5 2M5 -2L1.6 2" stroke="${col}" stroke-width="1.1" stroke-linecap="round"/></g>`;
  function over(x, id) {
    const c = OV[id]; if (!x.mf || !x.on || !c) return "";
    let s = "";
    const inp = c.inp && x.inp ? INPUTS.find((v) => v[0] === x.inp) : null;
    if (inp) s += `<text x="${c.inp[0]}" y="${c.inp[1]}" text-anchor="${c.inp[2]}" font-family="Arial,Helvetica,sans-serif" font-size="${c.inp[3]}" font-weight="700" letter-spacing="${c.inp[3] < 3 ? 0 : .3}" fill="${c.inp[4]}" opacity=".9">${inp[2]}</text>`;
    if (x.mute) s += muteSign(c.mute[0], c.mute[1], c.mute[2], "#ff6a5a");
    return s;
  }
  const BLK = "#232428", SIL = "#c9ccd0", CHA = "#d6c49e", GPH = "#55585e", GLD = "#b89a5e";

  const icons = [
     name({ id: "black-receiver-wide-display", name: "Black receiver, wide display", colors: [BLK, SIL, GPH], render(o) {
      const x = ctx(o), dm = x.c === BLK || x.c === GPH ? "dark" : "metal";
      const B = chassis(x, 14, 74, 172, 70, { vents: true }) +
        `${glowAt(x, 100, 96, 50, 16)}${disp(x, 52, 86, 96, 20, WHITE, vd(x), 9, { bars: true, sy: 89 })}
${x.on ? `<rect x="62" y="101" width="30" height="1.6" rx=".8" fill="${WHITE}" opacity=".55"/><rect x="108" y="101" width="22" height="1.6" rx=".8" fill="${WHITE}" opacity=".4"/>` : ""}
${[62, 72, 82, 92, 102, 112, 122, 132].map((cx) => pill(x, cx, 113, 6, 2.8, dm === "dark")).join("")}
${knob(x, 34, 102, 14, null, dm)}${knob(x, 166, 102, 15, x.lv, dm)}
${btn(x, 26, 134, 3, dm === "dark")}${sled(x, 35, 134)}<circle cx="48" cy="134" r="2.6" fill="#0b0b0d"/><circle cx="58" cy="134" r="2" fill="#0b0b0d"/>
<rect x="150" y="132" width="16" height="1.6" rx=".8" fill="#000" fill-opacity=".4"/>`;
      return scene(x, { body: B + over(x, "black-receiver-wide-display"), wall: "living", glow: [100, 96] });
    } }),

     name({ id: "porthole-display-receiver", name: "Porthole-display receiver", colors: [BLK, CHA, SIL], render(o) {
      const x = ctx(o), lit = x.on, col = "#bfe4ff", km = x.c === BLK ? "dark" : "finish";
      let ribs = ""; for (let i = 0; i < 9; i++) ribs += `<path d="M${f(17 + i * 2.2)} 80V142M${f(183 - i * 2.2)} 80V142" stroke="#000" stroke-opacity=".35" stroke-width=".9"/><path d="M${f(17.8 + i * 2.2)} 80V142M${f(183.8 - i * 2.2)} 80V142" stroke="#fff" stroke-opacity=".1" stroke-width=".5"/>`;
      const B = chassis(x, 14, 78, 172, 66, { r: 6 }) +
        `<path d="${rrp(14, 78, 24, 66, 6)}" fill="#000" fill-opacity=".28"/><path d="${rrp(162, 78, 24, 66, 6)}" fill="#000" fill-opacity=".28"/>${ribs}
${dk("M38 80V142M162 80V142", .45, 1.2)}${hl("M39 80V142M161 80V142", .14, .8)}
${lit ? `<circle cx="100" cy="106" r="30" fill="url(#${x.id("port")})" opacity="${(x.L * .85).toFixed(2)}"/>` : ""}
<circle cx="100" cy="106" r="15" fill="#000" fill-opacity=".6"/><circle cx="100" cy="106" r="14" fill="${x.url("glass")}"/>
<circle cx="100" cy="106" r="14" fill="none" stroke="${lit ? col : "#3a3f48"}" stroke-width="1.8" opacity="${lit ? .95 : .7}"/>
${lit ? `<circle cx="100" cy="106" r="12" fill="${col}" opacity=".08"/>${seg7(vd(x), 100 - segW(vd(x), 5.5) / 2, 103.5, 5.5, col, .06)}` : ""}
<circle cx="100" cy="106" r="14" fill="url(#${x.id("pgl")})"/>
${knob(x, 58, 108, 12, null, km)}${knob(x, 142, 108, 12, x.lv, km)}${sled(x, 100, 134, col)}`;
      return scene(x, { body: B + over(x, "porthole-display-receiver"), wall: "warm", glow: [100, 106], extra: rg(x.id("port"), [[0, col, .7], [.5, col, .2], [1, col, 0]]) + rg(x.id("pgl"), [[0, "#fff", 0], [.7, "#fff", 0], [.85, "#fff", .14], [1, "#fff", 0]], .4, .35, .7) });
    } }),

     name({ id: "big-dial-receiver", name: "Big-dial receiver", colors: [BLK, "#3d3f44", SIL], render(o) {
      const x = ctx(o), dm = x.c === SIL ? "metal" : "dark";
      const B = chassis(x, 14, 76, 172, 70, { r: 2, vents: true, face: x.c === BLK ? "blkface" : "face" }) +
        `<path d="${rrp(16, 78, 168, 40, 2)}" fill="${x.url("gloss")}" opacity=".5"/>
${glowAt(x, 126, 98, 34, 14)}${disp(x, 102, 90, 50, 16, WHITE, vd(x), 8, { marks: false })}
${[106, 116, 126, 136].map((cx) => pill(x, cx, 114, 7, 2.6, dm === "dark")).join("")}
${knob(x, 72, 102, 21, x.lv, dm)}${knob(x, 168, 104, 8, null, dm)}
${btn(x, 26, 134, 3.2, dm === "dark")}${sled(x, 36, 134)}<rect x="48" y="132" width="9" height="4" rx="1" fill="#0b0b0d"/><circle cx="66" cy="134" r="2.6" fill="#0b0b0d"/>
<path d="M16 126H184" stroke="#fff" stroke-opacity=".06"/>`;
      return scene(x, { body: B + over(x, "big-dial-receiver"), wall: "slate", glow: [126, 98] });
    } }),

     name({ id: "two-knob-receiver", name: "Two-knob receiver", colors: [BLK, SIL, GPH], render(o) {
      const x = ctx(o), col = "#a8ecff";
      let grid = ""; for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) grid += pill(x, 136 + c * 8.6, 86 + r * 6.4, 6, 3, true);
      const B = chassis(x, 14, 74, 172, 70, { vents: true }) +
        `${glowAt(x, 82, 96, 50, 14)}${disp(x, 36, 86, 92, 19, col, vn(x, 80), 10, { bars: true })}
${[46, 58, 70, 82, 94, 106].map((cx) => pill(x, cx, 112, 8, 3, true)).join("")}${grid}
${btn(x, 24, 88, 2.8, true)}${sled(x, 24, 96)}
${knob(x, 160, 124, 14, x.lv, "dark")}${knob(x, 30, 128, 5.5, null, "dark")}${knob(x, 46, 128, 5.5, null, "dark")}<circle cx="62" cy="130" r="2.4" fill="#0b0b0d"/>`;
      return scene(x, { body: B + over(x, "two-knob-receiver"), wall: "navy", glow: [82, 96] });
    } }),

     name({ id: "gloss-black-receiver", name: "Gloss-black receiver", colors: [BLK, SIL, GPH], render(o) {
      const x = ctx(o), dm = x.c === SIL ? "metal" : "dark";
      const ring = (cx) => `<circle cx="${cx}" cy="104" r="17.4" fill="none" stroke="${x.url("chrome")}" stroke-width="1.6"/>`;
      const B = chassis(x, 14, 78, 172, 66, { r: 4, vents: true }) +
        `${glowAt(x, 100, 97, 46, 14, "hA")}${disp(x, 56, 88, 88, 18, AMBER, vd(x), 9.5, { bars: true })}
${[60, 71, 82, 93, 104, 115, 126, 137].map((cx) => pill(x, cx, 113, 6, 2.6, dm === "dark")).join("")}
${ring(34)}${ring(166)}${knob(x, 34, 104, 15, null, dm)}${knob(x, 166, 104, 15, x.lv, dm)}
${btn(x, 24, 86, 2.4, dm === "dark")}${sled(x, 32, 86)}<circle cx="28" cy="134" r="2.6" fill="#0b0b0d"/><circle cx="40" cy="134" r="2" fill="#0b0b0d"/>
<rect x="92" y="126" width="16" height="1.6" rx=".8" fill="#000" fill-opacity=".45"/>`;
      return scene(x, { body: B + over(x, "gloss-black-receiver"), wall: "living", glow: [100, 97] });
    } }),

     name({ id: "slim-silver-receiver", name: "Slim silver receiver", colors: [BLK, SIL, GPH], render(o) {
      const x = ctx(o), dm = x.c === SIL ? "metal" : "dark";
      const B = chassis(x, 14, 94, 172, 50, { r: 2, vents: true, depth: 8 }) +
        `${glowAt(x, 100, 104, 40, 8)}${disp(x, 66, 100, 68, 9, "#f2f6ff", vn(x, 74), 5, { marks: false })}
<path d="M16 118H184" stroke="#000" stroke-opacity=".35"/><path d="M16 119H184" stroke="#fff" stroke-opacity=".08"/>
${btn(x, 26, 131, 2.8, dm === "dark")}${sled(x, 35, 131)}<circle cx="48" cy="131" r="2.6" fill="#0b0b0d"/><rect x="58" y="129" width="9" height="4" rx="1" fill="#0b0b0d"/>
${knob(x, 140, 131, 7.5, null, dm)}${knob(x, 163, 130, 10.5, x.lv, dm)}`;
      return scene(x, { body: B + over(x, "slim-silver-receiver"), wall: "sage", glow: [100, 104] });
    } }),

     name({ id: "minimal-black-amp", name: "Minimal black amp", colors: ["#4a4c52", BLK, SIL], render(o) {
      const x = ctx(o), lit = x.on;
      const B = chassis(x, 14, 72, 172, 74, { r: 5, depth: 9, vents: true }) +
        `<path d="${rrp(18, 76, 164, 66, 4)}" fill="none" stroke="#fff" stroke-opacity=".08" stroke-width="1.2"/>
${glowAt(x, 112, 100, 44, 22)}<path d="${rrp(84, 85, 58, 32, 2.4)}" fill="#000" fill-opacity=".7"/><path d="${rrp(85, 86, 56, 30, 2)}" fill="#04050a"/>
${lit ? `<rect x="89" y="90" width="16" height="16" rx="1" fill="url(#${x.id("art")})"/><rect x="108" y="91" width="28" height="2" rx="1" fill="#fff" opacity=".8"/><rect x="108" y="95.5" width="20" height="1.6" rx=".8" fill="#fff" opacity=".45"/>
${seg7(vd(x), 108, 100, 7, "#ffffff", 0)}<rect x="89" y="110" width="48" height="1.4" rx=".7" fill="#fff" opacity=".15"/><rect x="89" y="110" width="${f(48 * x.lv)}" height="1.4" rx=".7" fill="#8fd2ff"/>` : ""}
<path d="${rrp(85, 86, 56, 13, 2)}" fill="${x.url("gloss")}"/>
${knob(x, 58, 102, 18, x.lv, "metal")}${knob(x, 160, 102, 6.5, null, "metal")}
${[66, 75, 84, 93, 102, 111, 120, 129].map((cx) => pill(x, cx, 125, 6.5, 2.6, true)).join("")}
${sled(x, 26, 102)}`;
      return scene(x, { body: B + over(x, "minimal-black-amp"), wall: "slate", glow: [112, 100], extra: lg(x.id("art"), [[0, "#ffb05a"], [.5, "#d2507a"], [1, "#3b4bb3"]], 0, 0, 1, 1) });
    } }),


     name({ id: "compact", name: "Slim receiver", colors: [BLK, SIL, CHA, GPH], render(o) {
      const x = ctx(o);
      const B = chassis(x, 36, 106, 128, 38, { r: 3, depth: 6, vents: true }) +
        `${glowAt(x, 92, 118, 32, 10)}${disp(x, 64, 113, 50, 12, WHITE, vn(x), 7, { marks: false })}
${knob(x, 142, 125, 11, x.lv, x.c === BLK ? "dark" : "metal")}${btn(x, 46, 120, 2.6, x.c === BLK)}${sled(x, 46, 132)}
${[64, 74, 84].map((cx) => pill(x, cx, 131, 7, 2.8, x.c === BLK)).join("")}<circle cx="104" cy="133" r="2" fill="#0b0b0d"/>`;
      return scene(x, { body: B + over(x, "compact"), wall: "warm", glow: [92, 118] });
    } }),

     name({ id: "bluemeter", name: "Blue-meter amp", colors: [SIL, BLK, GPH], render(o) {
      const x = ctx(o), MB = "#8fdcff";
      const handle = (hx) => `<path d="${rrp(hx, 74, 7, 64, 3.5)}" fill="#000" fill-opacity=".4" transform="translate(2 3)"/><path d="${rrp(hx, 74, 7, 64, 3.5)}" fill="${x.url("chrome")}"/>${hl(`M${hx + 2} 78V134`, .6, 1)}`;
      const B = chassis(x, 18, 68, 164, 78, { r: 2, depth: 8, vents: true }) +
        `<path d="${rrp(42, 78, 116, 40, 2)}" fill="#05070c"/>${hl("M43 78.7H157", .15, .8)}
${glowAt(x, 100, 98, 66, 24, "hW", .6)}
${meter(x, 48, 83, 48, 30, MB, 0)}${meter(x, 104, 83, 48, 30, MB, .37)}
<path d="M44 124H156" stroke="#000" stroke-opacity=".35" stroke-width=".8"/><path d="M60 128H140" stroke="#000" stroke-opacity=".25" stroke-width=".6"/>
${[58, 78, 122, 142].map((cx) => knob(x, cx, 136, 4.6, null, "dark")).join("")}${knob(x, 100, 136, 6, x.lv, "dark")}
${sled(x, 156, 136, MB)}${handle(24)}${handle(169)}`;
      return scene(x, { body: B + over(x, "bluemeter"), wall: "navy", glow: [100, 98], shelfKind: "rack" });
    } }),

     name({ id: "vintage", name: "Vintage receiver", colors: ["#6e4326", "#8a5a32", "#4a2b19", "#a8774a", "#2b2522"], render(o) {
      const x = ctx(o), lit = x.on, ink = lit ? "#4a2a08" : "#7a7f88";
      let ticks = ""; for (let i = 0; i <= 24; i++) ticks += `<path d="M${f(60 + i * 3.6)} ${i % 4 ? 96 : 94.5}V98" stroke="${ink}" stroke-width=".6"/>`;
      let ticks2 = ""; for (let i = 0; i <= 16; i++) ticks2 += `<path d="M${f(62 + i * 5.2)} 103V${i % 4 ? 104.6 : 105.6}" stroke="${ink}" stroke-width=".5"/>`;
      const ptr = 62 + 82 * (.25 + .5 * x.lv);
      const B = `<ellipse cx="100" cy="148" rx="94" ry="5" fill="${x.url("sh")}"/>
<path d="${rrp(12, 72, 176, 76, 5)}" fill="${x.url("case")}"/><path d="M14 78C60 76 120 80 186 77M14 118C70 120 130 116 186 119M14 140C70 138 130 142 186 139" stroke="#000" stroke-opacity=".22" stroke-width=".8" fill="none"/>
${hl("M16 73H184", .25, 1)}
<path d="${rrp(20, 80, 160, 62, 2)}" fill="url(#${x.id("alu")})"/><path d="${rrp(20, 80, 160, 62, 2)}" fill="${x.url("brush")}"/>${hl("M21 80.7H179", .6, 1)}${dk("M20 141.5H180", .5, 1)}
<path d="${rrp(25, 85, 150, 28, 1.5)}" fill="#000" fill-opacity=".75"/><path d="${rrp(26, 86, 148, 26, 1)}" fill="${lit ? `url(#${x.id("dial")})` : "#1b1e24"}"/>
${lit ? `<rect x="26" y="86" width="148" height="26" fill="${WARM}" opacity="${(x.L * .2).toFixed(2)}"/>` : ""}
${ticks}${ticks2}<path d="M58 100.5H148" stroke="${ink}" stroke-width=".5"/>
<rect x="${f(ptr - .8)}" y="87" width="1.6" height="24" fill="${lit ? "#ff3b1f" : "#8a2a20"}"/>
${meter(x, 30, 90, 24, 18, "#fff2d0", .2, { needle: "#222" })}
<circle cx="161" cy="99" r="13" fill="#000" fill-opacity=".35"/>${knob(x, 161, 99, 11, null, "metal")}
<path d="${rrp(26, 86, 148, 11, 1)}" fill="${x.url("gloss")}"/>
${[36, 56, 76, 96, 116].map((cx) => knob(x, cx, 128, 6, null, "metal")).join("")}${knob(x, 154, 128, 8, x.lv, "metal")}
${[128, 134].map((cx) => `<rect x="${cx}" y="124" width="3" height="7" rx="1" fill="${x.url("chrome")}"/>`).join("")}
<circle cx="26" cy="136" r="2.2" fill="#0b0b0d"/>
${lit ? `<circle cx="172" cy="137" r="1.5" fill="#ff6a3a"/><circle cx="172" cy="137" r="4" fill="${x.url("hA")}"/>` : `<circle cx="172" cy="137" r="1.4" fill="#3a2a22"/>`}`;
      return scene(x, { body: B + over(x, "vintage"), wall: "warm", glow: [100, 100, "hA"], extra: lg(x.id("alu"), [[0, "#f2f3f5"], [.1, "#d4d7dc"], [.6, "#bfc3c9"], [1, "#868b93"]], 0, 0, 0, 1) + lg(x.id("dial"), [[0, "#fff0cc"], [.5, "#ffd890"], [1, "#e6a54a"]], 0, 0, 0, 1) });
    } }),

     name({ id: "streamer", name: "Network receiver", colors: [BLK, SIL, CHA, GPH], render(o) {
      const x = ctx(o), lit = x.on;
      let bars = ""; for (let i = 0; i < 8; i++) { const hgt = 3 + ((i * 37) % 7); bars += x.mute ? `<rect x="${64 + i * 3}" y="117" width="2" height="1" fill="#9fe0ff"/>` : `<rect x="${64 + i * 3}" y="${118 - hgt}" width="2" height="${hgt}" fill="#9fe0ff" ${anim("eq", .5 + (i % 3) * .17, -i * .11)}/>`; }
      const B = chassis(x, 20, 98, 160, 46, { r: 3, vents: true }) +
        `<path d="${rrp(32, 105, 64, 32, 2)}" fill="#000" fill-opacity=".7"/><path d="${rrp(33, 106, 62, 30, 1.5)}" fill="#05060a"/>
${lit ? `<rect x="36" y="109" width="22" height="22" rx="1" fill="url(#${x.id("art")})"/><circle cx="47" cy="120" r="5" fill="#000" fill-opacity=".25"/>
<g opacity="${(.6 + .4 * x.L).toFixed(2)}">${bars}</g><rect x="62" y="124" width="30" height="1.4" rx=".7" fill="#fff" opacity=".2"/><rect x="62" y="124" width="${f(30 * x.lv)}" height="1.4" rx=".7" fill="#9fe0ff"/>
${seg7(vn(x), 62, 127.5, 5, "#e8f6ff", 0)}<ellipse cx="64" cy="121" rx="40" ry="20" fill="${x.url("hW")}" opacity="${(x.L * .25).toFixed(2)}"/>` : ""}
<path d="${rrp(33, 106, 62, 13, 1.5)}" fill="${x.url("gloss")}"/>
${knob(x, 152, 121, 13, x.lv, x.c === BLK ? "dark" : "metal")}${[110, 120].map((cx) => btn(x, cx, 114, 2.4, x.c === BLK)).join("")}
${sled(x, 110, 130)}<circle cx="122" cy="130" r="2" fill="#0b0b0d"/>`;
      return scene(x, { body: B + over(x, "streamer"), wall: "sage", glow: [64, 121], extra: lg(x.id("art"), [[0, "#ff7a59"], [.5, "#c2418c"], [1, "#3b3bb3"]], 0, 0, 1, 1) });
    } }),

     name({ id: "separates", name: "Separates stack", colors: [SIL, BLK, CHA, GPH], render(o) {
      const x = ctx(o), dark = x.c === BLK ? "dark" : "metal";
      const B = chassis(x, 24, 62, 152, 32, { r: 2, depth: 6, feet: true }) +
        `${glowAt(x, 88, 77, 30, 10)}${disp(x, 60, 70, 54, 14, WHITE, vd(x), 8, { marks: false })}
${knob(x, 150, 78, 11, x.lv, dark)}${knob(x, 40, 78, 7, null, dark)}${sled(x, 126, 84)}${btn(x, 126, 74, 2.2, dark === "dark")}` +
        `<rect x="8" y="98" width="184" height="3.5" fill="${x.url("rackt")}"/><rect x="8" y="101.5" width="184" height="3" fill="#000" fill-opacity=".5"/>` +
        chassis(x, 24, 112, 152, 34, { r: 2, depth: 6 }) +
        `<path d="${rrp(54, 115, 92, 25, 2)}" fill="#05070c"/>${meter(x, 58, 117.5, 40, 20, "#ffd28a", .1)}${meter(x, 102, 117.5, 40, 20, "#ffd28a", .45)}
${glowAt(x, 100, 126, 56, 16, "hA", .5)}${btn(x, 36, 127, 3.2, dark === "dark")}${sled(x, 164, 127, "#ffd28a")}
<path d="${rrp(26, 115, 4, 28, 2)}" fill="${x.url("chrome")}"/><path d="${rrp(170, 115, 4, 28, 2)}" fill="${x.url("chrome")}"/>`;
      return scene(x, { body: B + over(x, "separates"), wall: "slate", shelfKind: "rack", glow: [100, 110] });
    } }),
  ];

  (window.HDA = window.HDA || []).push({
    id: "avr",
    tab: "AV receivers",
    group: "Home",
    kind: "device",
    intro: "Twelve AV receivers and amps drawn after the real front panels (no logos), each on a media console or rack. Playing lights the display in its real color with the volume in segment digits, turns the volume knob, swings the meters and warms the vintage dial. Standby is a dark display with a small red LED. The slider is the volume.",
    
    levelLabel: "Volume",
    onWord: "Playing", offWord: "Standby",
    css: `.hda-avr-swing,.hda-avr-eq{animation-iteration-count:infinite;transform-box:fill-box}
.hda-avr-swing{transform-origin:center}
.hda-avr-eq{transform-origin:50% 100%}
.hda-anim .hda-avr-swing{animation-name:hda-avr-swing;animation-timing-function:ease-in-out}
.hda-anim .hda-avr-eq{animation-name:hda-avr-eq;animation-timing-function:ease-in-out}
@keyframes hda-avr-swing{0%,100%{transform:rotate(-6deg)}20%{transform:rotate(9deg)}35%{transform:rotate(2deg)}55%{transform:rotate(12deg)}75%{transform:rotate(-2deg)}}
@keyframes hda-avr-eq{0%,100%{transform:scale(1,1)}50%{transform:scale(1,.35)}}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-avr-swing,.hda-anim .hda-avr-eq{animation:none}}`,
    icons,
  });
  icons.forEach((ic) => { const c = OV[ic.id]; if (!c) return;
    ic.parts = [{ id: "power", name: "Power" }, { id: "mute", name: "Mute" }, { id: "volume", name: "Volume", type: "value", unit: "%", min: 0, max: 100, def: 40 }]
      .concat(c.inp ? [{ id: "input", name: "Input", type: "stage", values: INPUTS.map((v) => [v[0], v[1]]), def: "tv" }] : []); });
})();
