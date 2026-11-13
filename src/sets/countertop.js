(function () {
  const P = "hda-countertop-";
  const H = () => window.HDAH;
  const n1 = (v) => (+v).toFixed(1);
  const SS = "#c6cbd1", BK = "#2c2e33", WH = "#f1f1ee", RED = "#b8343a", SEA = "#e9e2d1", TRUF = "#3b3835", DAMS = "#3f4b64", CREAM = "#ece0c2", BLUEG = "#8fa7b8";
  const METAL = [SS, "#8d939a"];
  const isM = (c) => METAL.indexOf(String(c).toLowerCase()) >= 0;
  const GLOW = "#ff8a2a", AMB = "#ffb547", DISP = "#ff5a3c", BLU = "#7dd3fc";

  function pal(c) {
    const h = H(), x = h.hx(c), lt = (x[0] * .3 + x[1] * .59 + x[2] * .11) / 255 > .7;
    return { l: h.shade(c, lt ? .65 : .4), m: c, d: h.shade(c, lt ? -.15 : -.3), k: h.shade(c, lt ? -.32 : -.52) };
  }
  const lg = (id, v, st) => `<linearGradient id="${id}" ${v ? 'x1="0" y1="0" x2="0" y2="1"' : 'x1="0" x2="1"'}>${st.map((s) => `<stop offset="${s[0]}" stop-color="${s[1]}"${s[2] != null ? ` stop-opacity="${s[2]}"` : ""}/>`).join("")}</linearGradient>`;
  const rg = (id, st, a) => `<radialGradient id="${id}" ${a || ""}>${st.map((s) => `<stop offset="${s[0]}" stop-color="${s[1]}"${s[2] != null ? ` stop-opacity="${s[2]}"` : ""}/>`).join("")}</radialGradient>`;

  function defs(o, extra) {
    const u = o.uid, p = pal(o.color);
    return `<defs>
${lg(u + "-v", 1, [[0, p.l], [.5, p.m], [1, p.d]])}${lg(u + "-tp", 0, [[0, p.m], [.5, p.l], [1, p.m]])}${lg(u + "-sd", 0, [[0, p.d], [1, p.k]])}
${lg(u + "-blk", 1, [[0, "#3a3e45"], [.45, "#16181c"], [1, "#0a0b0d"]])}${lg(u + "-st", 0, [[0, "#6f767e"], [.5, "#eef0f2"], [1, "#5a6067"]])}${lg(u + "-stv", 1, [[0, "#f4f6f8"], [.5, "#a2a9b0"], [1, "#5d636a"]])}
${lg(u + "-gl", 0, [[0, "#fff", .22], [.25, "#fff", .03], [.55, "#fff", .1], [.62, "#fff", 0], [1, "#fff", .06]])}
${lg(u + "-edge", 0, [[0, "#000", .32], [.25, "#000", 0], [.75, "#000", 0], [1, "#000", .36]])}
${lg(u + "-ctr", 1, [[0, "#f3f1ec"], [1, "#bfbab1"]])}${lg(u + "-cab", 1, [[0, "#3f4a52"], [1, "#2b333a"]])}
${lg(u + "-cav", 1, [[0, "#15100c"], [.6, "#241a12"], [1, "#0d0a08"]])}
${rg(u + "-hot", [[0, "#ffb85c", .9], [.5, "#ff7a1a", .4], [1, "#ff6a00", 0]])}
${rg(u + "-lamp", [[0, "#ffd88a", .95], [.45, "#ffb347", .35], [1, "#ff9a2a", 0]])}
${lg(u + "-cone", 1, [[0, "#ffc061", .5], [1, "#ffc061", 0]])}
${rg(u + "-sh", [[0, "#000", .55], [1, "#000", 0]])}
${rg(u + "-stm", [[0, "#fff", .6], [.6, "#fff", .18], [1, "#fff", 0]])}
${rg(u + "-dk", [[0, "#000", 0], [.7, "#000", .1], [1, "#000", .45]])}
${lg(u + "-crust", 1, [[0, "#f0c27a"], [1, "#b97a36"]])}${rg(u + "-roast", [[0, "#e7a25a"], [.6, "#b8642a"], [1, "#6e3412"]], 'cx=".38" cy=".3" r=".8"')}
<pattern id="${u}-br" width="40" height="4" patternUnits="userSpaceOnUse"><path d="M0 .5H40" stroke="#fff" stroke-opacity=".18" stroke-width=".5"/><path d="M0 2H40" stroke="#000" stroke-opacity=".08" stroke-width=".6"/><path d="M0 3.3H40" stroke="#fff" stroke-opacity=".08" stroke-width=".4"/></pattern>
<pattern id="${u}-sub" width="24" height="12" patternUnits="userSpaceOnUse"><rect width="24" height="12" fill="#e8e4dc"/><path d="M0 11.5H24M12 0V6M0 6H24M0 6V12M24 6V12" stroke="#c4bdb1" stroke-width=".8"/><rect width="24" height="2" fill="#fff" opacity=".45"/></pattern>
<pattern id="${u}-vent" width="4" height="3" patternUnits="userSpaceOnUse"><rect width="3" height="1.3" rx=".6" fill="#000" fill-opacity=".5"/></pattern>
<pattern id="${u}-mesh" width="3" height="3" patternUnits="userSpaceOnUse"><path d="M0 0L3 3M3 0L0 3" stroke="#9aa1a9" stroke-width=".4"/></pattern>
${extra || ""}</defs>`;
  }
  const svg = (o, body, extra) => `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs(o, `<clipPath id="${o.uid}-all"><rect width="200" height="200" rx="6"/></clipPath>` + (extra || ""))}<g clip-path="url(#${o.uid}-all)">${body}</g></svg>`;
  const rr = (x, y, w, h, r) => `M${n1(x + r)} ${n1(y)}H${n1(x + w - r)}A${n1(r)} ${n1(r)} 0 0 1 ${n1(x + w)} ${n1(y + r)}V${n1(y + h - r)}A${n1(r)} ${n1(r)} 0 0 1 ${n1(x + w - r)} ${n1(y + h)}H${n1(x + r)}A${n1(r)} ${n1(r)} 0 0 1 ${n1(x)} ${n1(y + h - r)}V${n1(y + r)}A${n1(r)} ${n1(r)} 0 0 1 ${n1(x + r)} ${n1(y)}Z`;
  const sh = (o, cx, cy, rx, ry) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry || 5}" fill="url(#${o.uid}-sh)"/>`;
  const hl = (x1, y1, x2, y2, w, op) => `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="#fff" stroke-opacity="${op || .35}" stroke-width="${w || 2}" stroke-linecap="round"/>`;
  const foot = (x, y, w) => `<rect x="${x}" y="${y}" width="${w || 10}" height="3.4" rx="1.4" fill="#16181b"/>`;

  function face(o, d, g) {
    const u = o.uid;
    return `<path d="${d}" fill="url(#${u}-${g || "v"})"/>` + (isM(o.color) ? `<path d="${d}" fill="url(#${u}-br)"/>` : "") + `<path d="${d}" fill="url(#${u}-edge)" opacity=".6"/>`;
  }
  function box3(o, x, y, w, h, dx, dy, r) {
    const u = o.uid; dy = dy == null ? Math.round(dx * .6) : dy;
    return (dx ? `<path d="M${x} ${y}L${x + dx} ${y - dy}H${x + w + dx}L${x + w} ${y}Z" fill="url(#${u}-tp)"/><path d="M${x + w} ${y}L${x + w + dx} ${y - dy}V${y + h - dy}L${x + w} ${y + h}Z" fill="url(#${u}-sd)"/>` : "") +
      face(o, r ? rr(x, y, w, h, r) : `M${x} ${y}H${x + w}V${y + h}H${x}Z`) + `<path d="M${x + 1} ${y + .6}H${x + w - 1}" stroke="#fff" stroke-opacity=".55"/>`;
  }

  function kitchen(o, cy) {
    const u = o.uid;
    return `<g class="hda-bg"><rect width="200" height="${cy}" fill="url(#${u}-sub)"/><rect width="200" height="${cy}" fill="#2a2440" opacity=".42"/>` +
      `<rect y="${cy}" width="200" height="9" fill="url(#${u}-ctr)"/><rect y="${cy}" width="200" height="1.4" fill="#fff" opacity=".7"/><rect y="${cy + 9}" width="200" height="${191 - cy}" fill="url(#${u}-cab)"/><rect y="${cy + 9}" width="200" height="2.5" fill="#000" opacity=".35"/>` +
      `<path d="M66 ${cy + 13}V200M134 ${cy + 13}V200" stroke="#000" stroke-opacity=".4"/><rect x="58" y="${cy + 18}" width="4" height="1.6" rx=".8" fill="#c9ccd0"/><rect x="138" y="${cy + 18}" width="4" height="1.6" rx=".8" fill="#c9ccd0"/></g>`;
  }

  const SEG = { 0: "abcdef", 1: "bc", 2: "abged", 3: "abgcd", 4: "fgbc", 5: "afgcd", 6: "afgedc", 7: "abc", 8: "abcdefg", 9: "abcdfg", F: "aefg", "-": "g" };
  function dig(x, y, h, ch) {
    const w = h * .56, t = Math.max(.5, h * .14), hh = h / 2;
    const R = { a: [x + t * .6, y, w - t * 1.2, t], b: [x + w - t, y + t * .6, t, hh - t * .9], c: [x + w - t, y + hh + t * .3, t, hh - t * .9], d: [x + t * .6, y + h - t, w - t * 1.2, t], e: [x, y + hh + t * .3, t, hh - t * .9], f: [x, y + t * .6, t, hh - t * .9], g: [x + t * .6, y + hh - t / 2, w - t * 1.2, t] };
    return SEG[ch].split("").map((k) => { const r = R[k]; return `<rect x="${n1(r[0])}" y="${n1(r[1])}" width="${n1(r[2])}" height="${n1(r[3])}" rx="${n1(t * .35)}"/>`; }).join("");
  }
  const tempF = (o, lo, hi) => Math.round((lo + (hi - lo) * o.level) / 5) * 5;
  function disp(o, x, y, h, col, val, bg) {
    const s = String(val), w = h * .56, gap = h * .2, tw = s.length * (w + gap) + h * .25 + w;
    let out = bg === false ? "" : `<path d="${rr(x - 2, y - 2, tw + 4, h + 4, 1.4)}" fill="#07080a"/>`;
    out += `<g fill="#fff" fill-opacity=".05">${s.split("").map((c, i) => dig(x + i * (w + gap), y, h, "8")).join("")}${dig(x + s.length * (w + gap) + h * .25, y, h, "8")}</g>`;
    if (!o.on) return out;
    const dx = x + s.length * (w + gap);
    return out + `<g opacity=".18"><ellipse class="${P}pulse" cx="${n1(x + tw / 2)}" cy="${n1(y + h / 2)}" rx="${n1(tw * .7)}" ry="${n1(h)}" fill="${col}"/></g><g fill="${col}">${s.split("").map((c, i) => dig(x + i * (w + gap), y, h, c)).join("")}<circle cx="${n1(dx + h * .1)}" cy="${n1(y + h * .12)}" r="${n1(h * .1)}" fill="none" stroke="${col}" stroke-width="${n1(h * .07)}"/>${dig(dx + h * .25, y, h, "F")}</g>`;
  }
  function knob(o, cx, cy, r, opt) {
    opt = opt || {}; const u = o.uid, a = (o.on ? -135 + 270 * o.level : -135) * Math.PI / 180;
    return `<circle cx="${cx}" cy="${n1(cy + .8)}" r="${n1(r + .7)}" fill="#000" fill-opacity=".35"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${u}-${opt.dark ? "blk" : "stv"})"/><circle cx="${cx}" cy="${cy}" r="${n1(r * .78)}" fill="url(#${u}-${opt.dark ? "blk" : "st"})" opacity=".8"/>` +
      `<path d="M${n1(cx + Math.sin(a) * r * .25)} ${n1(cy - Math.cos(a) * r * .25)}L${n1(cx + Math.sin(a) * r * .75)} ${n1(cy - Math.cos(a) * r * .75)}" stroke="${opt.dark ? (o.on ? AMB : "#aab") : "#2a2e35"}" stroke-width="${n1(Math.max(.8, r * .18))}" stroke-linecap="round"/><circle cx="${n1(cx - r * .3)}" cy="${n1(cy - r * .35)}" r="${n1(r * .25)}" fill="#fff" fill-opacity=".3"/>`;
  }
  function led(o, x, y, c) { return o.on ? `<circle class="${P}pulse" cx="${x}" cy="${y}" r="3.4" fill="${c || DISP}" opacity=".3"/><circle cx="${x}" cy="${y}" r="1.2" fill="${c || DISP}"/>` : `<circle cx="${x}" cy="${y}" r="1.1" fill="#4a4f57"/>`; }

  function toast(x, y, w) { return `<path d="${rr(x, y - w * .9, w, w * .9, w * .2)}" fill="#e3b06a"/><path d="${rr(x + w * .1, y - w * .8, w * .8, w * .7, w * .15)}" fill="#f6dfae"/><path d="${rr(x, y - w * .9, w, w * .9, w * .2)}" fill="none" stroke="#9a5a22" stroke-width=".6"/>`; }
  function pizza(u, cx, cy, rx) {
    const ry = rx * .32; let s = `<ellipse cx="${n1(cx)}" cy="${n1(cy + 1)}" rx="${n1(rx + 1)}" ry="${n1(ry + 1)}" fill="#6a6f76"/><ellipse cx="${n1(cx)}" cy="${n1(cy)}" rx="${n1(rx)}" ry="${n1(ry)}" fill="url(#${u}-crust)"/><ellipse cx="${n1(cx)}" cy="${n1(cy - .3)}" rx="${n1(rx * .84)}" ry="${n1(ry * .78)}" fill="#e8b23c"/>`;
    [[-.5, -.1], [.1, -.35], [.45, .15], [-.15, .3], [.6, -.25], [-.6, .25]].forEach((p) => { s += `<ellipse cx="${n1(cx + p[0] * rx * .8)}" cy="${n1(cy + p[1] * ry * 1.2)}" rx="${n1(rx * .1)}" ry="${n1(ry * .2)}" fill="#b8322a"/>`; });
    return s;
  }
  function croissant(cx, cy, s) {
    const d = `M${n1(cx - 9 * s)} ${n1(cy)}Q${n1(cx - 6 * s)} ${n1(cy - 7 * s)} ${n1(cx)} ${n1(cy - 7 * s)}Q${n1(cx + 6 * s)} ${n1(cy - 7 * s)} ${n1(cx + 9 * s)} ${n1(cy)}Q${n1(cx + 5 * s)} ${n1(cy - 2 * s)} ${n1(cx)} ${n1(cy - 2.5 * s)}Q${n1(cx - 5 * s)} ${n1(cy - 2 * s)} ${n1(cx - 9 * s)} ${n1(cy)}Z`;
    return `<path d="${d}" fill="#d9903a"/><path d="M${n1(cx - 4 * s)} ${n1(cy - 6 * s)}L${n1(cx - 3 * s)} ${n1(cy - 2.5 * s)}M${n1(cx)} ${n1(cy - 7 * s)}V${n1(cy - 2.5 * s)}M${n1(cx + 4 * s)} ${n1(cy - 6 * s)}L${n1(cx + 3 * s)} ${n1(cy - 2.5 * s)}" stroke="#8a4f1c" stroke-width="${n1(.7 * s)}"/><path d="M${n1(cx - 5 * s)} ${n1(cy - 5.5 * s)}Q${n1(cx)} ${n1(cy - 7.5 * s)} ${n1(cx + 5 * s)} ${n1(cy - 5.5 * s)}" stroke="#ffd79a" stroke-width="${n1(.8 * s)}" fill="none"/>`;
  }
  function drum(cx, cy, s, a) {
    return `<g transform="translate(${n1(cx)} ${n1(cy)}) rotate(${a || 0}) scale(${n1(s)})"><path d="M-7 -4Q-9 3 -3 5Q3 6 6 1L10 -1" fill="none" stroke="#f3eadb" stroke-width="2.4" stroke-linecap="round"/><path d="M-8 -3Q-10 -9 -3 -9Q5 -9 6 -2Q6 4 -1 4Q-7 4 -8 -3Z" fill="#c07a2c"/><path d="M-6 -4Q-6 -8 -2 -8" stroke="#f0b866" stroke-width="1.4" fill="none"/><circle cx="10.5" cy="-1.2" r="1.6" fill="#f3eadb"/></g>`;
  }
  function roast(u, cx, cy, s) {
    return `<g transform="translate(${n1(cx)} ${n1(cy)}) scale(${n1(s)})"><path d="M-14 -2Q-16 -12 -4 -13Q10 -14 14 -4Q16 6 4 9Q-10 10 -14 -2Z" fill="url(#${u}-roast)"/><path d="M12 -6Q19 -10 21 -5Q19 -1 14 -2Z" fill="#b8642a"/><path d="M-13 3Q-20 5 -19 10Q-15 11 -11 7Z" fill="#a85a26"/><circle cx="21" cy="-6" r="1.8" fill="#f3eadb"/><path d="M-8 -10Q0 -12 8 -9" stroke="#ffcf8a" stroke-width="1.4" fill="none" opacity=".7"/></g>`;
  }
  function fries(cx, cy, w) { let s = ""; for (let i = 0; i < 9; i++) { const x = cx - w / 2 + i * w / 8, a = (i * 37 % 30) - 15; s += `<rect x="${n1(x)}" y="${n1(cy - 8)}" width="2" height="9" rx=".6" fill="${i % 2 ? "#f0c35a" : "#e3a93c"}" transform="rotate(${a} ${n1(x)} ${n1(cy)})"/>`; } return s; }
  function tray(o, food, cx, cy, w) {
    const u = o.uid; let s = `<path d="M${n1(cx - w / 2)} ${n1(cy)}H${n1(cx + w / 2)}L${n1(cx + w / 2 - 2)} ${n1(cy + 3)}H${n1(cx - w / 2 + 2)}Z" fill="url(#${u}-stv)"/>`;
    if (food === "pizza") s += pizza(u, cx, cy - 2, w * .42);
    else if (food === "pastry") s += croissant(cx - w * .25, cy, w / 50) + croissant(cx + w * .22, cy, w / 54) + croissant(cx, cy - 1, w / 48);
    else if (food === "chicken") s += drum(cx - w * .26, cy - 3, w / 60, -10) + drum(cx + w * .02, cy - 3.4, w / 56, 15) + drum(cx + w * .28, cy - 3, w / 62, -25);
    return s;
  }

  function cavity(o, x, y, w, h, opt) {
    opt = opt || {}; const u = o.uid, on = o.on, k = (.45 + .55 * o.level).toFixed(2), id = `${u}-cv${opt.k || 0}`;
    let s = `<clipPath id="${id}"><path d="${rr(x, y, w, h, opt.r || 2)}"/></clipPath><g clip-path="url(#${id})"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${u}-cav)"/>`;
    s += `<path d="M${x} ${y + h}L${x + w * .12} ${y + h * .78}H${x + w * .88}L${x + w} ${y + h}Z" fill="#3a2c20" opacity=".6"/><path d="M${x} ${y}L${x + w * .12} ${y + h * .14}V${y + h * .78}L${x} ${y + h}Z" fill="#000" opacity=".25"/><path d="M${x + w} ${y}L${x + w * .88} ${y + h * .14}V${y + h * .78}L${x + w} ${y + h}Z" fill="#000" opacity=".25"/>`;
    if (on) s += `<g opacity="${k}"><ellipse class="${P}pulse" cx="${x + w / 2}" cy="${y + h * .5}" rx="${n1(w * .7)}" ry="${n1(h * .8)}" fill="url(#${u}-hot)"/></g>`;
    if (opt.fan) { const fx = x + w / 2, fy = y + h * .34, fr = Math.min(w, h) * .15;
      s += `<circle cx="${n1(fx)}" cy="${n1(fy)}" r="${n1(fr)}" fill="#0c0d10" fill-opacity=".45" stroke="#5a5f66" stroke-width=".7"/><circle cx="${n1(fx)}" cy="${n1(fy)}" r="${n1(fr)}" fill="url(#${u}-vent)" opacity=".7"/>` +
        `<g class="${on ? P + "spin" : ""}" style="animation-duration:${(1.4 - o.level * .9).toFixed(2)}s"><circle cx="${n1(fx)}" cy="${n1(fy)}" r="${n1(fr)}" fill="#000" fill-opacity="0"/>` +
        [0, 120, 240].map((a) => `<path transform="rotate(${a} ${n1(fx)} ${n1(fy)})" d="M${n1(fx)} ${n1(fy)}Q${n1(fx + fr * .9)} ${n1(fy - fr * .2)} ${n1(fx + fr * .6)} ${n1(fy - fr * .8)}" fill="none" stroke="${on ? "#ffb070" : "#7a7f86"}" stroke-opacity="${on ? .8 : .6}" stroke-width="${n1(fr * .16)}" stroke-linecap="round"/>`).join("") + `</g>`;
      if (on) s += [0, 1, 2].map((i) => `<path class="${P}swirl" style="animation-delay:-${(i * .5).toFixed(1)}s" d="M${n1(x + w * .15)} ${n1(y + h * (.3 + i * .18))}Q${n1(x + w * .5)} ${n1(y + h * (.18 + i * .18))} ${n1(x + w * .85)} ${n1(y + h * (.3 + i * .18))}" fill="none" stroke="#ffd2a0" stroke-opacity=".45" stroke-width=".9" stroke-dasharray="4 5"/>`).join(""); }
    const rods = (yy) => { const lit = on ? `<path d="M${x + 3} ${yy}H${x + w - 3}" stroke="${GLOW}" stroke-width="5" stroke-opacity="${(.35 * k).toFixed(2)}" stroke-linecap="round"/>` : "";
      return lit + `<path d="M${x + 3} ${yy}H${x + w - 3}" stroke="${on ? "#ffcf8a" : "#55504b"}" stroke-width="1.6" stroke-linecap="round"/>`; };
    if (opt.top !== false) s += rods(y + 3.5);
    (opt.racks || [y + h * .66]).forEach((ry) => { s += `<path d="M${x + 2} ${n1(ry)}H${x + w - 2}" stroke="#9aa1a9" stroke-width="1"/>` + [.2, .4, .6, .8].map((f) => `<path d="M${n1(x + w * f)} ${n1(ry - 1.5)}V${n1(ry + .5)}" stroke="#7d848c" stroke-width=".5"/>`).join(""); });
    if (opt.food) s += opt.food;
    if (opt.spit) { const sx = x + w / 2, sy = y + h * .48;
      s += `<path d="M${x} ${n1(sy)}H${x + w}" stroke="url(#${u}-st)" stroke-width="1.6"/><g class="${on ? P + "turn" : ""}" style="animation-duration:${(7 - 4 * o.level).toFixed(1)}s">${`<circle cx="${n1(sx)}" cy="${n1(sy)}" r="${n1(h * .3)}" fill="#000" fill-opacity="0"/>`}${roast(u, sx, sy, h / 52)}</g><path d="M${n1(sx - w * .3)} ${n1(sy - h * .26)}V${n1(sy + h * .26)}M${n1(sx + w * .3)} ${n1(sy - h * .26)}V${n1(sy + h * .26)}" stroke="url(#${u}-st)" stroke-width="1.4"/>`; }
    if (opt.bottom !== false) s += rods(y + h - 3);
    if (opt.steam && on) s += [0, 1, 2, 3].map((i) => `<circle class="${P}puff" cx="${n1(x + w * (.25 + i * .17))}" cy="${n1(y + h * .55)}" r="${n1(h * .16)}" fill="url(#${u}-stm)" style="animation-delay:-${(i * .8).toFixed(1)}s"/>`).join("");
    if (on) s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${GLOW}" opacity="${(.1 * k).toFixed(2)}"/>`;
    s += `</g><path d="${rr(x, y, w, h, opt.r || 2)}" fill="#0a0c10" fill-opacity="${on ? .12 : .32}"/><path d="${rr(x, y, w, h, opt.r || 2)}" fill="url(#${u}-gl)"/><path d="${rr(x, y, w, h, opt.r || 2)}" fill="none" stroke="#000" stroke-opacity=".6" stroke-width="1"/>`;
    return s + hl(x + w * .08, y + h * .2, x + w * .2, y + h * .08, 1.6, .25);
  }
  const bar = (o, x, y, w) => `<rect x="${x - 2}" y="${y - 2.4}" width="4" height="5" rx="1" fill="url(#${o.uid}-st)"/><rect x="${x + w - 2}" y="${y - 2.4}" width="4" height="5" rx="1" fill="url(#${o.uid}-st)"/><rect x="${x}" y="${y}" width="${w}" height="3.2" rx="1.6" fill="url(#${o.uid}-stv)"/><rect x="${x}" y="${y + 3.4}" width="${w}" height="1.4" fill="#000" opacity=".25"/>`;
  function steamOut(o, pts) { if (!o.on) return ""; return pts.map((p, i) => `<circle class="${P}puff" cx="${p[0]}" cy="${p[1]}" r="${p[2] || 7}" fill="url(#${o.uid}-stm)" style="animation-delay:-${(i * .9).toFixed(1)}s"/>`).join(""); }

  const css = `
.hda-anim .hda-countertop-pulse{animation:hda-countertop-pulse 2.6s ease-in-out infinite}
@keyframes hda-countertop-pulse{50%{opacity:.6}}
.hda-countertop-spin,.hda-countertop-turn{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-countertop-spin{animation:hda-countertop-spin 1s linear infinite}
@keyframes hda-countertop-spin{to{transform:rotate(360deg)}}
.hda-anim .hda-countertop-turn{animation:hda-countertop-turn 5s linear infinite}
@keyframes hda-countertop-turn{0%{transform:scaleX(1)}25%{transform:scaleX(.55)}50%{transform:scaleX(-1)}75%{transform:scaleX(-.55)}100%{transform:scaleX(1)}}
.hda-anim .hda-countertop-swirl{animation:hda-countertop-swirl 1.4s linear infinite}
@keyframes hda-countertop-swirl{to{stroke-dashoffset:-18}}
.hda-countertop-puff{opacity:.5;transform-box:fill-box;transform-origin:center}
.hda-anim .hda-countertop-puff{opacity:0;animation:hda-countertop-puff 3.2s ease-out infinite}
@keyframes hda-countertop-puff{0%{transform:translateY(6px) scale(.5);opacity:0}30%{opacity:.85}100%{transform:translateY(-22px) scale(1.6);opacity:0}}
.hda-anim .hda-countertop-haze{animation:hda-countertop-haze 2s ease-in-out infinite}
@keyframes hda-countertop-haze{0%,100%{transform:translateY(0);opacity:.15}50%{transform:translateY(-4px);opacity:.5}}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-countertop-pulse,.hda-anim .hda-countertop-spin,.hda-anim .hda-countertop-turn,.hda-anim .hda-countertop-swirl,.hda-anim .hda-countertop-puff,.hda-anim .hda-countertop-haze{animation:none!important}}
`;

  const FOOD = { options: [{ id: "food", name: "Food", values: [["pizza", "Pizza"], ["pastry", "Pastries"], ["chicken", "Fried chicken"], ["empty", "Empty"]] }] };
  const food = (o) => (o.opt && o.opt.food) || "pizza";
  const ic = (id, name, colors, extra, render) => Object.assign({ id, name, colors, picker: true, colorLabel: "Finish", render }, extra || {});
  const sub = (o, on) => Object.assign({}, o, { on });

  const icons = [
    ic("flip-up-air-fry-oven", "Flip-up air fry oven", [SS, BK], { options: [{ id: "pos", name: "Position", values: [["down", "On the counter"], ["up", "Flipped up"]] }] }, (o) => {
      const u = o.uid;
      if (o.opt && o.opt.pos === "up") {
        const q = sub(o, false);
        return svg(o, kitchen(o, 150) + sh(o, 104, 152, 40, 4) + box3(q, 76, 44, 52, 106, 6, 4, 3) +
          `<path d="${rr(82, 52, 40, 72, 3)}" fill="#1b1d21"/><path d="${rr(82, 52, 40, 72, 3)}" fill="url(#${u}-vent)" opacity=".8"/><path d="${rr(84, 128, 36, 12, 2)}" fill="#2a2d32"/>` +
          foot(80, 46, 6) + foot(118, 46, 6) + foot(80, 141, 6) + foot(118, 141, 6) + `<path d="${rr(76, 32, 52, 13, 2.5)}" fill="url(#${u}-blk)"/>` + disp(q, 90, 36, 5, DISP, tempF(o, 250, 450)) + knob(q, 120, 38.5, 3.2, { dark: true }) +
          `<path d="M72 70H76V90H72Z" fill="#1d1f23"/>`);
      }
      return svg(o, kitchen(o, 150) + sh(o, 100, 152, 82, 5) + box3(o, 22, 106, 150, 44, 10, 6, 2) +
        cavity(o, 30, 112, 104, 32, { fan: true, food: toast(46, 136, 14) + toast(64, 136, 14) + `<path d="M84 136H120L118 131H86Z" fill="#7a3f1a"/>` + fries(102, 131, 26), racks: [136], r: 2 }) + bar(o, 40, 108.5, 84) +
        `<path d="${rr(140, 108, 30, 40, 2)}" fill="url(#${u}-blk)"/>` + disp(o, 143, 114, 5, DISP, tempF(o, 250, 450)) + knob(o, 155, 133, 6.5, { dark: true }) + led(o, 147, 144, AMB) +
        `<path d="${rr(16, 118, 7, 18, 2)}" fill="#1d1f23"/>` + foot(30, 149) + foot(150, 149));
    }),

    ic("large-air-fry-oven", "Large air fry oven", [SS, BK], null, (o) => { const u = o.uid;
      return svg(o, kitchen(o, 150) + sh(o, 102, 152, 74, 5) + box3(o, 34, 56, 132, 94, 9, 6, 3) + `<path d="${rr(36, 58, 128, 16, 2)}" fill="url(#${u}-blk)"/>` +
        disp(o, 60, 62.5, 6.5, "#f2f6fa", tempF(o, 250, 450)) + `<g fill="${o.on ? "#f2f6fa" : "#3a3f47"}">${dig(102, 62.5, 6.5, "2")}${dig(108, 62.5, 6.5, "5")}</g>` + [124, 132, 140, 148].map((x) => `<circle cx="${x}" cy="66" r="1.6" fill="#3a3f47" stroke="#666" stroke-width=".3"/>`).join("") + knob(o, 46, 66, 4.6, { dark: true }) +
        cavity(o, 42, 84, 116, 58, { fan: true, racks: [104, 126], food: roast(u, 80, 120, .8) + `<g>${[0, 1, 2, 3].map((i) => `<circle cx="${112 + i * 9}" cy="122" r="4" fill="${["#5aa04a", "#e07a3a", "#c84a3a", "#e9c24a"][i]}"/>`).join("")}</g>` + `<path d="M56 101H144" stroke="#000" stroke-opacity=".2"/>` + croissant(70, 101, .9) + croissant(96, 101, .9) + croissant(124, 101, .9) }) +
        bar(o, 50, 78, 100) + foot(42, 149) + foot(150, 149));
    }),

    ic("stacked-double-oven", "Stacked double oven", [SS, BK], { parts: [{ id: "top", name: "Top oven" }, { id: "bottom", name: "Bottom oven" }] }, (o) => {
      const u = o.uid, t = sub(o, o.on && (!o.parts || o.parts.top !== false)), b = sub(o, o.on && (!o.parts || o.parts.bottom !== false));
      return svg(o, kitchen(o, 150) + sh(o, 100, 152, 70, 5) + box3(o, 36, 42, 128, 108, 9, 6, 3) +
        cavity(t, 42, 48, 92, 38, { k: 1, food: pizza(u, 88, 72, 30), racks: [76], r: 2 }) + bar(o, 50, 87, 76) +
        cavity(b, 42, 94, 92, 50, { k: 2, fan: true, racks: [134], food: roast(u, 70, 128, .62) + fries(108, 133, 26) }) + bar(o, 50, 145, 76) +
        `<path d="${rr(140, 46, 22, 100, 2)}" fill="url(#${u}-blk)"/>` + disp(t, 143, 54, 4.6, DISP, tempF(o, 250, 450)) + disp(b, 143, 100, 4.6, DISP, tempF(o, 200, 400)) + knob(o, 151, 80, 6, { dark: true }) + led(t, 145, 64) + led(b, 145, 110) +
        [120, 128, 136].map((y) => `<circle cx="151" cy="${y}" r="1.4" fill="#3a3f47"/>`).join("") + foot(42, 149) + foot(148, 149));
    }),

    ic("brushed-steel-air-fry-oven", "Brushed steel air fry oven", [SS, SEA, TRUF, DAMS], null, (o) => { const u = o.uid, lcd = o.on ? "#ff9b3d" : "#2b2a28";
      return svg(o, kitchen(o, 150) + sh(o, 100, 152, 80, 5) + box3(o, 24, 66, 150, 84, 9, 6, 4) +
        cavity(o, 32, 76, 108, 66, { fan: true, racks: [126], food: pizza(u, 86, 124, 34), r: 3 }) + bar(o, 40, 70, 92) +
        `<path d="${rr(148, 74, 22, 18, 1.6)}" fill="${lcd}" opacity="${o.on ? .9 : 1}"/><path d="${rr(148, 74, 22, 18, 1.6)}" fill="url(#${u}-gl)"/>` + (o.on ? `<g fill="#3a1a06">${dig(150.5, 78, 6, String(tempF(o, 250, 450))[0])}${dig(155.5, 78, 6, String(tempF(o, 250, 450))[1])}${dig(160.5, 78, 6, String(tempF(o, 250, 450))[2])}</g>` : "") +
        knob(o, 159, 102, 5) + knob(o, 159, 117, 5) + knob(o, 159, 132, 5) + `<path d="${rr(150, 141, 18, 3, 1.5)}" fill="#000" opacity=".25"/>` + foot(32, 149) + foot(156, 149));
    }),

    ic("smart-steel-oven", "Smart steel oven", [TRUF, SS, SEA], null, (o) => { const u = o.uid;
      const scr = `<path d="${rr(148, 74, 22, 26, 2)}" fill="#07080a"/>` + (o.on ? `<path d="${rr(149.5, 75.5, 19, 23, 1.6)}" fill="#1b2a3a"/><circle cx="159" cy="84" r="6" fill="none" stroke="#3a4a5c" stroke-width="1.6"/><path d="M159 78A6 6 0 0 1 ${n1(159 + 6 * Math.sin(o.level * 6))} ${n1(84 - 6 * Math.cos(o.level * 6))}" fill="none" stroke="${AMB}" stroke-width="1.6"/><g fill="#fff">${dig(155, 81.5, 4.2, String(tempF(o, 250, 450))[0])}${dig(158.3, 81.5, 4.2, String(tempF(o, 250, 450))[1])}${dig(161.6, 81.5, 4.2, String(tempF(o, 250, 450))[2])}</g><rect x="151" y="93" width="16" height="2" rx="1" fill="#3a4a5c"/><rect x="151" y="93" width="${n1(16 * o.level)}" height="2" rx="1" fill="${BLU}"/>` : "");
      return svg(o, kitchen(o, 150) + sh(o, 100, 152, 80, 5) + box3(o, 24, 66, 150, 84, 9, 6, 4) +
        cavity(o, 32, 76, 108, 66, { fan: true, racks: [128], food: roast(u, 86, 120, .9), r: 3 }) + bar(o, 40, 70, 92) +
        `<path d="${rr(145, 70, 28, 76, 3)}" fill="url(#${u}-blk)"/>` + scr + knob(o, 159, 113, 5.4, { dark: true }) + knob(o, 159, 131, 5.4, { dark: true }) + foot(32, 149) + foot(156, 149));
    }),

    ic("steel-air-fry-toaster-oven", "Steel air fry toaster oven", [SS, BK, WH], null, (o) => { const u = o.uid;
      return svg(o, kitchen(o, 150) + sh(o, 100, 152, 64, 5) + box3(o, 44, 40, 112, 110, 8, 5, 3) +
        knob(o, 64, 52, 5.6) + knob(o, 87, 52, 5.6) + knob(o, 110, 52, 5.6) + knob(o, 133, 52, 5.6) + led(o, 148, 52) +
        cavity(o, 52, 72, 96, 68, { fan: true, racks: [124], food: `<path d="M64 124H136L132 108H68Z" fill="url(#${u}-mesh)"/><path d="M64 124H136L132 108H68Z" fill="none" stroke="#9aa1a9"/>` + fries(100, 117, 50), r: 2 }) +
        bar(o, 60, 66, 80) + foot(52, 149) + foot(138, 149));
    }),

    ic("budget-4-slice-oven", "Budget 4-slice oven", [BK, SS, WH, RED], null, (o) => { const u = o.uid, q = Object.assign({}, o, { color: SS });
      return svg(o, kitchen(o, 150) + sh(o, 100, 152, 60, 5) + box3(o, 46, 84, 108, 66, 8, 5, 3) + face(q, rr(48, 86, 82, 62, 2)) +
        cavity(o, 54, 94, 70, 48, { racks: [128], food: toast(60, 128, 13) + toast(76, 128, 13) + toast(92, 128, 13) + toast(108, 128, 13), r: 2 }) + bar(o, 58, 88.5, 62) +
        knob(o, 142, 98, 5.4) + knob(o, 142, 116, 5.4) + knob(o, 142, 134, 5.4) + led(o, 142, 145, AMB) + foot(52, 149) + foot(138, 149));
    }),

    ic("steam-combi-oven", "Steam combi oven", [BK, SS], null, (o) => { const u = o.uid, f = .35 + .45 * o.level;
      return svg(o, kitchen(o, 150) + sh(o, 96, 152, 76, 5) + box3(o, 26, 58, 128, 92, 6, 4, 3) + `<path d="${rr(28, 60, 124, 12, 2)}" fill="url(#${u}-blk)"/>` +
        disp(o, 40, 63, 5.4, "#f4f6f8", tempF(o, 200, 450)) + `<g fill="${o.on ? BLU : "#30353c"}">${dig(84, 63, 5.4, String(Math.round(30 + 70 * o.level))[0])}${dig(88, 63, 5.4, String(Math.round(30 + 70 * o.level))[1] || "0")}</g>` + `<path d="${rr(110, 63.5, 30, 5, 2.5)}" fill="#1d2025"/>` +
        cavity(o, 32, 76, 116, 68, { steam: true, fan: true, racks: [126], food: `<path d="M60 126H120L116 118H64Z" fill="#7a8088"/><path d="M68 120Q90 108 112 120Z" fill="#f08a6a"/><path d="M72 118Q90 112 108 118" stroke="#ffd0b8" stroke-width="1" fill="none"/>`, r: 3 }) +
        `<path d="${rr(154, 70, 16, 74, 3)}" fill="#cfe6f2" fill-opacity=".25" stroke="#fff" stroke-opacity=".4"/><rect x="156" y="${n1(72 + 70 * (1 - f))}" width="12" height="${n1(70 * f)}" rx="2" fill="#5aaee6" opacity=".7"/><path d="M157 74V140" stroke="#fff" stroke-opacity=".4"/>` +
        steamOut(o, [[60, 50, 7], [90, 46, 8], [118, 50, 7]]) + foot(34, 149) + foot(136, 149));
    }),

    ic("french-door-oven", "French-door oven", [SS, BK], null, (o) => { const u = o.uid;
      return svg(o, kitchen(o, 150) + sh(o, 100, 152, 80, 5) + box3(o, 26, 50, 148, 100, 8, 5, 4) + `<path d="${rr(30, 54, 140, 18, 2)}" fill="url(#${u}-blk)" opacity=".85"/>` +
        knob(o, 42, 63, 6, { dark: true }) + knob(o, 158, 63, 6, { dark: true }) + `<path d="${rr(70, 57, 60, 12, 1.5)}" fill="${o.on ? "#2f6fb8" : "#1a2230"}"/>` + disp(o, 82, 59.5, 6.5, "#eaf6ff", tempF(o, 200, 450), false) +
        cavity(o, 34, 80, 64, 62, { k: 1, fan: true, racks: [108, 130], top: true, food: roast(u, 66, 126, .62) + croissant(54, 107, .8) + croissant(76, 107, .8), r: 2 }) +
        cavity(o, 102, 80, 64, 62, { k: 2, racks: [108, 130], food: pizza(u, 134, 128, 22) + `<path d="M116 107H152" stroke="#c96a3a" stroke-width="3" stroke-linecap="round"/>`, r: 2 }) +
        `<rect x="92" y="88" width="3.4" height="46" rx="1.7" fill="url(#${u}-st)"/><rect x="105" y="88" width="3.4" height="46" rx="1.7" fill="url(#${u}-st)"/>` + foot(34, 149) + foot(156, 149));
    }),

    ic("black-air-fry-oven", "Black air fry oven", [SS, BK], null, (o) => { const u = o.uid;
      return svg(o, kitchen(o, 150) + sh(o, 100, 152, 46, 5) + box3(o, 62, 36, 76, 114, 6, 4, 6) + `<path d="${rr(62, 36, 76, 26, 6)}" fill="url(#${u}-blk)"/><path d="M62 56H138V62H62Z" fill="url(#${u}-blk)"/>` +
        disp(o, 82, 42, 6, "#f4f6f8", tempF(o, 200, 400)) + [72, 128].map((x) => `<circle cx="${x}" cy="45" r="1.8" fill="#3a3f47"/>`).join("") + `<path d="M74 54H126" stroke="#fff" stroke-opacity=".12"/>` +
        cavity(o, 68, 68, 64, 72, { spit: true, racks: [], r: 3 }) + `<path d="${rr(64, 64, 72, 80, 4)}" fill="none" stroke="#1d1f23" stroke-width="2"/><rect x="88" y="61" width="24" height="3" rx="1.5" fill="url(#${u}-st)"/>` + foot(66, 149, 8) + foot(126, 149, 8));
    }),

    ic("vevor4", "4-tier pizza warmer", [SS, BK], FOOD, (o) => { const u = o.uid, fd = food(o);
      let sh4 = ""; for (let i = 0; i < 4; i++) { const y = 62 + i * 22; sh4 += `<ellipse cx="100" cy="${y}" rx="34" ry="5" fill="none" stroke="#c8ced4" stroke-width="1"/><path d="M68 ${y}H132" stroke="#9aa1a9" stroke-width=".5"/>` + (fd !== "empty" ? tray(o, fd, 100, y, 60) : ""); }
      return svg(o, kitchen(o, 150) + sh(o, 102, 152, 54, 5) + box3(o, 56, 20, 92, 20, 7, 4, 2) + disp(o, 66, 26, 6, DISP, tempF(o, 86, 185)) + knob(o, 134, 30, 5) + led(o, 122, 30, AMB) +
        `<path d="M56 40H148V140H56Z" fill="#0e1218" opacity=".55"/>` + (o.on ? `<g opacity="${(.6 + .4 * o.level).toFixed(2)}"><ellipse class="${P}pulse" cx="100" cy="44" rx="48" ry="40" fill="url(#${u}-lamp)"/><path d="M60 40H140L148 140H52Z" fill="url(#${u}-cone)" opacity=".5"/></g>` : "") +
        `<path d="M98 40V140" stroke="#bfc5cb" stroke-width="2.4"/>` + sh4 + `<path d="M148 40L155 36V136L148 140Z" fill="#9ccbe6" fill-opacity=".18"/>` +
        `<path d="M56 40H148V140H56Z" fill="url(#${u}-gl)"/><path d="M56 40H148V140H56Z" fill="none" stroke="url(#${u}-st)" stroke-width="2.4"/>` +
        (o.on ? `<path class="${P}haze" d="M70 46Q75 42 80 46T90 46M110 46Q115 42 120 46T130 46" stroke="#ffd9a0" stroke-width=".8" fill="none"/>` : "") +
        box3(o, 54, 140, 96, 9, 0, 0, 1) + `<rect x="94" y="99" width="12" height="3" rx="1.5" fill="url(#${u}-st)"/>` + foot(58, 149) + foot(136, 149));
    }),

    ic("warmer2", "2-tier display warmer", [SS, BK], FOOD, (o) => { const u = o.uid, fd = food(o);
      const glass = "M30 80H170V142H30Z";
      let tr2 = ""; [110, 138].forEach((y) => { tr2 += `<path d="M34 ${y}H166" stroke="#c8ced4" stroke-width="1.6"/>`; if (fd !== "empty") [60, 100, 140].forEach((x) => { tr2 += tray(o, fd, x, y - 1, 34); }); });
      return svg(o, kitchen(o, 150) + sh(o, 100, 152, 82, 5) + box3(o, 24, 66, 152, 14, 8, 5, 2) + disp(o, 34, 70, 5, DISP, tempF(o, 86, 185)) + led(o, 158, 73, AMB) + knob(o, 146, 73, 3.6) +
        `<path d="${glass}" fill="#0e1218" opacity=".5"/>` + (o.on ? `<g opacity="${(.6 + .4 * o.level).toFixed(2)}"><ellipse class="${P}pulse" cx="100" cy="84" rx="80" ry="30" fill="url(#${u}-lamp)"/><path d="${glass}" fill="url(#${u}-cone)" opacity=".45"/></g>` : "") + tr2 +
        `<path d="M30 80Q24 112 30 142" fill="none" stroke="#bfe0f2" stroke-opacity=".5" stroke-width="1.2"/><path d="M170 80Q176 112 170 142" fill="none" stroke="#bfe0f2" stroke-opacity=".5" stroke-width="1.2"/>` +
        `<path d="${glass}" fill="url(#${u}-gl)"/><path d="M30 80V142M170 80V142M100 80V142" stroke="url(#${u}-st)" stroke-width="2"/>` + box3(o, 24, 142, 152, 8, 0, 0, 1) + foot(30, 149) + foot(160, 149));
    }),

    ic("buffet", "Buffet server", [SS, BK, RED], FOOD, (o) => { const u = o.uid, fd = food(o);
      let pans = ""; [52, 100, 148].forEach((x, i) => {
        pans += `<path d="M${x - 22} 112H${x + 22}L${x + 19} 124H${x - 19}Z" fill="#9aa1a9"/><path d="M${x - 20} 113H${x + 20}L${x + 18} 121H${x - 18}Z" fill="#5d636a"/>` + (fd !== "empty" ? tray(o, fd, x, 120, 34) : "") +
          `<path d="M${x - 23} 113Q${x} 92 ${x + 23} 113Z" fill="#dff1fb" fill-opacity=".2" stroke="#fff" stroke-opacity=".5" stroke-width=".8"/><path d="M${x - 14} 106Q${x - 6} 99 ${x + 2} 99" stroke="#fff" stroke-opacity=".5" stroke-width="1.2" fill="none"/><rect x="${x - 5}" y="98" width="10" height="3" rx="1.5" fill="#1d1f23"/>`; });
      return svg(o, kitchen(o, 150) + sh(o, 100, 152, 88, 5) + `<path d="M18 124H182L178 148H22Z" fill="url(#${u}-blk)"/>` +
        `<path d="M22 112H178L182 124H18Z" fill="url(#${u}-tp)"/>` + (isM(o.color) ? `<path d="M22 112H178L182 124H18Z" fill="url(#${u}-br)"/>` : "") + pans +
        knob(o, 100, 136, 5.4) + led(o, 116, 136) + steamOut(o, [[52, 92, 7], [100, 88, 8], [148, 92, 7]]) + foot(26, 148) + foot(164, 148));
    }),

    ic("drawer", "Warming drawer", [SS, BK, WH], FOOD, (o) => { const u = o.uid, fd = food(o);
      return svg(o, `<g class="hda-bg"><rect width="200" height="200" fill="url(#${u}-cab)"/><rect x="0" y="0" width="22" height="200" fill="#4a5660"/><rect x="178" y="0" width="22" height="200" fill="#4a5660"/>` +
        box3(o, 26, 8, 148, 82, 0, 0, 1) + cavity(sub(o, false), 38, 22, 124, 52, { r: 2, racks: [60] }) + bar(o, 40, 14, 120) + `</g>` + box3(o, 26, 96, 148, 24, 0, 0, 1) + `<rect x="26" y="120" width="148" height="4" fill="#000" opacity=".45"/>` +
        `<path d="M26 124H174L190 176H10Z" fill="#1a1d22"/><path d="M30 126H170L184 170H16Z" fill="url(#${u}-stv)" opacity=".9"/>` +
        (o.on ? `<g opacity="${(.5 + .5 * o.level).toFixed(2)}"><ellipse class="${P}pulse" cx="100" cy="148" rx="80" ry="22" fill="url(#${u}-hot)" opacity=".6"/></g>` : "") +
        (fd !== "empty" ? tray(o, fd, 70, 152, 54) + tray(o, fd, 130, 152, 54) : "") + steamOut(o, [[70, 136, 6], [130, 136, 6]]) +
        face(o, `M8 172H192V196H8Z`) + bar(o, 40, 180, 120) + led(o, 182, 102, AMB) + `<path d="M8 172H192" stroke="#fff" stroke-opacity=".5"/>` +
        `<path d="${rr(150, 100, 18, 10, 2)}" fill="#0b0c0f"/>` + disp(o, 152, 102, 4, DISP, tempF(o, 140, 210), false));
    }),

    ic("heatlamp", "Heat-lamp pass-through", [SS, BK, RED], FOOD, (o) => { const u = o.uid, fd = food(o), k = (.55 + .45 * o.level).toFixed(2);
      let lamps = "", pool = "";
      [46, 82, 118, 154].forEach((x) => {
        if (o.on) pool += `<path d="M${x - 9} 66L${x - 22} 128H${x + 22}L${x + 9} 66Z" fill="url(#${u}-cone)" opacity="${k}"/>`;
        lamps += `<path d="M${x} 38V50" stroke="url(#${u}-st)" stroke-width="1.6"/><path d="M${x - 11} 66L${x - 5} 50H${x + 5}L${x + 11} 66Z" fill="url(#${u}-tp)"/>` + (isM(o.color) ? `<path d="M${x - 11} 66L${x - 5} 50H${x + 5}L${x + 11} 66Z" fill="url(#${u}-br)"/>` : "") +
          `<ellipse cx="${x}" cy="66" rx="11" ry="2.6" fill="${o.on ? "#ffcf6a" : "#3a3d42"}"/>` + (o.on ? `<ellipse class="${P}pulse" cx="${x}" cy="68" rx="16" ry="8" fill="url(#${u}-lamp)" opacity="${k}"/>` : "");
      });
      return svg(o, kitchen(o, 132) + `<g class="hda-bg"><rect y="128" width="200" height="6" fill="url(#${u}-st)"/></g>` + pool +
        (fd !== "empty" ? tray(o, fd, 46, 128, 32) + tray(o, fd, 82, 128, 32) + tray(o, fd, 118, 128, 32) + tray(o, fd, 154, 128, 32) : `<g fill="#f4f4f2">${[46, 82, 118, 154].map((x) => `<ellipse cx="${x}" cy="127" rx="13" ry="3"/>`).join("")}</g>`) +
        `<path d="M24 128V38H176V128" fill="none" stroke="url(#${u}-st)" stroke-width="3.4"/><rect x="20" y="126" width="12" height="4" rx="1" fill="#6f767e"/><rect x="168" y="126" width="12" height="4" rx="1" fill="#6f767e"/>` + lamps +
        `<rect x="166" y="76" width="10" height="14" rx="1.5" fill="#1d1f23"/>` + led(o, 171, 81, AMB));
    }),
  ];

  (window.HDA = window.HDA || []).push({
    id: "countertop", tab: "Toaster ovens & warmers", group: "Appliances", kind: "device",
    levelLabel: "Temp", onWord: "Cooking", offWord: "Off",
    intro: "Real countertop ovens and food warmers. When cooking, the elements glow orange behind the glass, air-fry fans swirl, the rotisserie turns, steam rises and warmer lamps glow; the display shows the temperature (the slider sets it). Warmers let you pick the food; the stacked double oven runs each oven on its own and the flip-up oven can be flipped up.",
    
    css, icons,
  });
})();
