(function () {
  const P = "hda-range-";
  const H = () => window.HDAH;
  const SS = "#c4c9ce", BSS = "#4e5156", WH = "#eef0f1", BK = "#232529", SL = "#6f716c", AL = "#e6dcc3", CR = "#eee2c2", MI = "#a6d9c4",
    RD = "#b3302b", NV = "#25365e", BU = "#6b1f2d", GN = "#2f4c3c", BB = "#8fbfdc", YL = "#efcf6a", FB = "#6f8396";
  const STD = [SS, BSS, WH, BK, SL];
  const sw = (first, list) => [first].concat((list || STD).filter((c) => c !== first));
  const n1 = (v) => (+v).toFixed(1);
  const Lv = (o) => (o.on ? .35 + .65 * o.level : 0);
  const g2 = (o, k) => (Lv(o) * (k == null ? 1 : k)).toFixed(2);
  const dur = (o, a, b) => (a - b * o.level).toFixed(2);
  const tmp = (o) => Math.round((200 + 300 * o.level) / 25) * 25;
  let K = .34;
  let PT = null;
  const sub = (o, v) => Object.assign({}, o, { on: !!v });
  function mkPT(o) {
    const p = o.parts || {}, has = (k) => p[k] != null, g = (k, d) => sub(o, has(k) ? p[k] : d == null ? o.on : d);
    const t = { oven: g("oven"), grid: g("grid"), mw: g("mw") };
    t.oven2 = has("oven2") ? g("oven2") : t.oven;
    t.cook = has("cook") ? g("cook") : (has("front") || has("back")) ? sub(o, p.front || p.back) : sub(o, o.on);
    t.front = has("front") ? g("front") : t.cook; t.back = has("back") ? g("back") : t.cook;
    t.bs = [1, 2, 3, 4, 5, 6, 7].map((i) => has("b" + i) ? g("b" + i) : sub(o, o.on));
    return t;
  }
  const metal = (o) => { const c = String(o.color || "").toLowerCase(); return c === SS ? 1 : c === BSS ? 2 : 0; };
  function pal(c) { const h = H(); return { l: h.shade(c, .42), m: c, d: h.shade(c, -.24), k: h.shade(c, -.48), e: h.shade(c, -.42) }; }
  const halo = (id, c) => `<radialGradient id="${id}"><stop offset="0" stop-color="${c}" stop-opacity=".8"/><stop offset=".45" stop-color="${c}" stop-opacity=".26"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`;

  function defs(o, extra) {
    const u = o.uid, p = pal(o.color), m = metal(o);
    const vl = m ? H().shade(o.color, .6) : p.l;
    return `<defs>
<linearGradient id="${u}-v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${vl}"/><stop offset=".18" stop-color="${p.m}"/><stop offset=".75" stop-color="${p.m}"/><stop offset="1" stop-color="${p.d}"/></linearGradient>
<linearGradient id="${u}-c" x1="0" x2="1"><stop offset="0" stop-color="${p.d}"/><stop offset=".28" stop-color="${p.l}"/><stop offset=".62" stop-color="${p.m}"/><stop offset="1" stop-color="${p.k}"/></linearGradient>
<linearGradient id="${u}-tp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.d}"/><stop offset=".6" stop-color="${p.m}"/><stop offset="1" stop-color="${p.l}"/></linearGradient>
<linearGradient id="${u}-fx" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".2"/><stop offset=".12" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity="${m ? ".14" : ".05"}"/><stop offset=".86" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".26"/></linearGradient>
<linearGradient id="${u}-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></linearGradient>
<pattern id="${u}-br" width="37" height="2.2" patternUnits="userSpaceOnUse"><path d="M0 .5H14M18 .5H37" stroke="#fff" stroke-opacity="${m === 2 ? ".07" : ".18"}" stroke-width=".35"/><path d="M5 1.6H27M30 1.6H35" stroke="#000" stroke-opacity=".1" stroke-width=".35"/></pattern>
<linearGradient id="${u}-st" x1="0" x2="1"><stop offset="0" stop-color="#6f767e"/><stop offset=".45" stop-color="#e8ecef"/><stop offset=".7" stop-color="#aab1b8"/><stop offset="1" stop-color="#5a6067"/></linearGradient>
<linearGradient id="${u}-stv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f2f5f7"/><stop offset=".45" stop-color="#a9b0b7"/><stop offset="1" stop-color="#5a6067"/></linearGradient>
<linearGradient id="${u}-sst" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8d949b"/><stop offset=".6" stop-color="#c4c9ce"/><stop offset="1" stop-color="#e3e7ea"/></linearGradient>
<linearGradient id="${u}-cr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fdfeff"/><stop offset=".35" stop-color="#8f969e"/><stop offset=".55" stop-color="#e9ecef"/><stop offset="1" stop-color="#5d636b"/></linearGradient>
<linearGradient id="${u}-bz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff0b8"/><stop offset=".35" stop-color="#d4a94a"/><stop offset=".6" stop-color="#f0d27a"/><stop offset="1" stop-color="#8a6420"/></linearGradient>
<linearGradient id="${u}-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2c3037"/><stop offset="1" stop-color="#0b0c0f"/></linearGradient>
<linearGradient id="${u}-bgt" x1="0" x2="1"><stop offset="0" stop-color="#121317"/><stop offset=".4" stop-color="#2e3238"/><stop offset=".55" stop-color="#1b1d21"/><stop offset="1" stop-color="#0e0f12"/></linearGradient>
<linearGradient id="${u}-gl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".3"/><stop offset=".4" stop-color="#fff" stop-opacity=".03"/><stop offset=".7" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".1"/></linearGradient>
<radialGradient id="${u}-ov" cx=".5" cy=".42" r=".75"><stop offset="0" stop-color="#ffe6a8"/><stop offset=".32" stop-color="#ffae4a"/><stop offset=".72" stop-color="#e3601a"/><stop offset="1" stop-color="#6a1f06"/></radialGradient>
<radialGradient id="${u}-sv" cx=".5" cy=".4" r=".75"><stop offset="0" stop-color="#ffffff"/><stop offset=".4" stop-color="#dfeef6"/><stop offset=".8" stop-color="#8fb3c8"/><stop offset="1" stop-color="#3c5566"/></radialGradient>
<radialGradient id="${u}-mw" cx=".5" cy=".4" r=".75"><stop offset="0" stop-color="#fff6d6"/><stop offset=".45" stop-color="#f3d58e"/><stop offset="1" stop-color="#7a5a26"/></radialGradient>
<linearGradient id="${u}-od" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#16181c"/><stop offset="1" stop-color="#050607"/></linearGradient>
<radialGradient id="${u}-kn" cx=".38" cy=".32" r=".7"><stop offset="0" stop-color="#f6f8fa"/><stop offset=".55" stop-color="#a1a8b0"/><stop offset="1" stop-color="#4a5058"/></radialGradient>
<radialGradient id="${u}-kb" cx=".38" cy=".32" r=".7"><stop offset="0" stop-color="#5a5f68"/><stop offset=".6" stop-color="#1f2227"/><stop offset="1" stop-color="#0a0b0d"/></radialGradient>
<radialGradient id="${u}-kr" cx=".38" cy=".32" r=".7"><stop offset="0" stop-color="#ff8f84"/><stop offset=".55" stop-color="#c8231b"/><stop offset="1" stop-color="#5e0b07"/></radialGradient>
<radialGradient id="${u}-kz" cx=".38" cy=".32" r=".7"><stop offset="0" stop-color="#fff2c4"/><stop offset=".55" stop-color="#cf9f3e"/><stop offset="1" stop-color="#6e4c14"/></radialGradient>
<radialGradient id="${u}-kw" cx=".38" cy=".32" r=".7"><stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#e3dccb"/><stop offset="1" stop-color="#8f8670"/></radialGradient>
<linearGradient id="${u}-ci" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a4b4f"/><stop offset="1" stop-color="#141517"/></linearGradient>
<radialGradient id="${u}-sh"><stop offset="0" stop-color="#000" stop-opacity=".6"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<linearGradient id="${u}-fb" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#2a55ff" stop-opacity=".95"/><stop offset=".55" stop-color="#4f9dff" stop-opacity=".85"/><stop offset="1" stop-color="#a8dcff" stop-opacity="0"/></linearGradient>
<linearGradient id="${u}-fbc" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#e6f4ff"/><stop offset="1" stop-color="#bfe3ff" stop-opacity="0"/></linearGradient>
<linearGradient id="${u}-fo" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ff5a1a" stop-opacity=".95"/><stop offset=".55" stop-color="#ff8a2a" stop-opacity=".8"/><stop offset="1" stop-color="#ff8a2a" stop-opacity="0"/></linearGradient>
<linearGradient id="${u}-fm" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ffc24a"/><stop offset=".6" stop-color="#ffb03a" stop-opacity=".8"/><stop offset="1" stop-color="#ffb03a" stop-opacity="0"/></linearGradient>
<linearGradient id="${u}-fc" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#fff4cc"/><stop offset=".7" stop-color="#fff0c0" stop-opacity=".7"/><stop offset="1" stop-color="#fff0c0" stop-opacity="0"/></linearGradient>
${halo(u + "-hb", "#4f9dff")}${halo(u + "-ho", "#ff8a3d")}${halo(u + "-hw", "#fff1d6")}
<radialGradient id="${u}-rz"><stop offset="0" stop-color="#ffcf7a"/><stop offset=".35" stop-color="#ff6a2a"/><stop offset=".75" stop-color="#c8240c" stop-opacity=".85"/><stop offset="1" stop-color="#7a1006" stop-opacity="0"/></radialGradient>
<radialGradient id="${u}-stm"><stop offset="0" stop-color="#fff" stop-opacity=".7"/><stop offset=".5" stop-color="#eef4f8" stop-opacity=".3"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
<radialGradient id="${u}-smk"><stop offset="0" stop-color="#b9bcc2" stop-opacity=".55"/><stop offset="1" stop-color="#9a9da3" stop-opacity="0"/></radialGradient>
<linearGradient id="${u}-ct" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b9b5ad"/><stop offset="1" stop-color="#e4e1da"/></linearGradient>
<linearGradient id="${u}-cte" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f2efe9"/><stop offset="1" stop-color="#8f8b84"/></linearGradient>
<linearGradient id="${u}-cab" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#454b53"/><stop offset="1" stop-color="#2a2e34"/></linearGradient>
<linearGradient id="${u}-wd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a6446"/><stop offset="1" stop-color="#4f3522"/></linearGradient>
<linearGradient id="${u}-flr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3029"/><stop offset="1" stop-color="#211b17"/></linearGradient>
<pattern id="${u}-tile" width="16" height="8" patternUnits="userSpaceOnUse"><rect width="16" height="8" fill="#fff" fill-opacity=".05"/><path d="M0 .4H16M0 4.4H16M.4 .4V4.4M8.4 4.4V8.4" stroke="#000" stroke-opacity=".28" stroke-width=".8"/><path d="M1 1.2H7.5M9 5.2H15.5" stroke="#fff" stroke-opacity=".08" stroke-width=".6"/></pattern>
<pattern id="${u}-grn" width="40" height="6" patternUnits="userSpaceOnUse"><path d="M0 2C10 1 20 3 40 2M0 4.6C14 5.4 26 3.8 40 4.8" fill="none" stroke="#2a180c" stroke-opacity=".35" stroke-width=".6"/></pattern>
<pattern id="${u}-perf" width="3" height="3" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r=".55" fill="#000" fill-opacity=".55"/></pattern>
${extra || ""}</defs>`;
  }
  const svg = (o, body, extra) => `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs(o, extra)}${body}</svg>`;
  const sh = (o, cx, cy, rx, ry) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry || 5}" fill="url(#${o.uid}-sh)"/>`;
  const rr = (x, y, w, h, r) => `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`;
  const hl = (x1, y1, x2, y2, w, op) => `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="#fff" stroke-opacity="${op || .35}" stroke-width="${w || 2}" stroke-linecap="round"/>`;
  const trap = (x1, x2, yb, yf, ins) => `M${x1 + ins} ${yb}H${x2 - ins}L${x2} ${yf}H${x1}Z`;

  function pnt(o, d, g) {
    const u = o.uid, m = metal(o);
    return `<path d="${d}" fill="url(#${u}-${g || "v"})"/>` + (m ? `<path d="${d}" fill="url(#${u}-br)"/>` : "") +
      `<path d="${d}" fill="url(#${u}-fx)"/><path d="${d}" fill="none" stroke="${pal(o.color).e}" stroke-opacity=".6" stroke-width=".8"/>`;
  }
  const gloss = (o, x, y, w, h) => metal(o) ? "" : `<path d="M${x} ${y + h}L${n1(x + w * .22)} ${y}H${n1(x + w * .3)}L${n1(x + w * .08)} ${y + h}Z" fill="#fff" fill-opacity=".07"/>`;
  const steel = (o, d) => `<path d="${d}" fill="url(#${o.uid}-sst)"/><path d="${d}" fill="url(#${o.uid}-br)"/><path d="${d}" fill="none" stroke="#5a6067" stroke-width=".7"/>`;

  const kit = (o, x1, x2, yb, yf, ins, opt) => `<g class="hda-bg">${kit0(o, x1, x2, yb, yf, ins, opt)}</g>`;
  function kit0(o, x1, x2, yb, yf, ins, opt) {
    const u = o.uid; opt = opt || {}; const fy = opt.floor || 178;
    let s = `<rect x="4" y="4" width="192" height="${fy - 4}" rx="6" fill="#fff" fill-opacity=".03"/><rect x="4" y="${Math.max(4, yb - 44)}" width="192" height="${yb - Math.max(4, yb - 44)}" fill="url(#${u}-tile)"/>` +
      `<rect x="4" y="${fy}" width="192" height="${196 - fy}" rx="4" fill="url(#${u}-flr)"/><path d="M4 ${fy + 6}H196M4 ${fy + 13}H196M40 ${fy}V${fy + 6}M110 ${fy + 6}V${fy + 13}M160 ${fy}V${fy + 6}M70 ${fy + 13}V196" stroke="#000" stroke-opacity=".3" stroke-width=".7"/>`;
    const side = (a, b, inner, left) => {
      if (b - a < 6) return "";
      const td = left ? `M${a} ${yb}H${inner + ins}L${inner} ${yf}H${a}Z` : `M${inner - ins} ${yb}H${b}V${yf}H${inner}Z`;
      const w = b - a, hx = left ? b - 7 : a + 5;
      return `<path d="${td}" fill="url(#${u}-ct)"/><rect x="${a}" y="${yf}" width="${w}" height="4" fill="url(#${u}-cte)"/>` +
        `<rect x="${a}" y="${yf + 4}" width="${w}" height="${fy - 6 - yf - 4}" fill="url(#${u}-cab)"/><rect x="${a}" y="${fy - 6}" width="${w}" height="6" fill="#0d0e10"/>` +
        `<path d="M${a} ${yf + 18}H${b}" stroke="#000" stroke-opacity=".45"/><path d="M${a} ${yf + 19}H${b}" stroke="#fff" stroke-opacity=".08"/>` +
        (w > 14 ? `<path d="${rr(a + 3, yf + 23, w - 6, fy - yf - 34, 1.5)}" fill="none" stroke="#000" stroke-opacity=".35"/><path d="M${a + 3.5} ${yf + 23.5}H${b - 3.5}" stroke="#fff" stroke-opacity=".08"/>` : "") +
        `<rect x="${hx}" y="${yf + 26}" width="2" height="14" rx="1" fill="url(#${u}-st)"/><rect x="${left ? hx - 6 : hx}" y="${yf + 10}" width="${Math.min(10, w - 4)}" height="2" rx="1" fill="url(#${u}-st)"/>`;
    };
    if (!opt.noCab) s += side(4, x1 - 1, x1 - 1, true) + side(x2 + 1, 196, x2 + 1, false);
    return s;
  }
  const kick = (o, x1, x2, y, fy) => `<rect x="${x1 + 3}" y="${y}" width="${x2 - x1 - 6}" height="${(fy || 178) - y}" fill="#0b0c0e"/>`;

  const SEG = { 0: "abcdef", 1: "bc", 2: "abged", 3: "abgcd", 4: "fgbc", 5: "afgcd", 6: "afgedc", 7: "abc", 8: "abcdefg", 9: "abcdfg", "-": "g" };
  function dig(x, y, h, ch) {
    const w = h * .56, t = Math.max(.6, h * .15), hh = h / 2;
    const R = { a: [x + t * .6, y, w - t * 1.2, t], b: [x + w - t, y + t * .6, t, hh - t * .9], c: [x + w - t, y + hh + t * .3, t, hh - t * .9],
      d: [x + t * .6, y + h - t, w - t * 1.2, t], e: [x, y + hh + t * .3, t, hh - t * .9], f: [x, y + t * .6, t, hh - t * .9], g: [x + t * .6, y + hh - t / 2, w - t * 1.2, t] };
    return (SEG[ch] || "").split("").map((k) => { const r = R[k]; return `<rect x="${n1(r[0])}" y="${n1(r[1])}" width="${n1(r[2])}" height="${n1(r[3])}" rx="${n1(t * .35)}"/>`; }).join("");
  }
  function lcd(o, cx, cy, h, col, val) {
    col = col || "#ff9a4a"; const v = String(val == null ? tmp(o) : val), w = h * .56, g = h * .22, clk = v.indexOf(":") >= 0;
    const cw = (ch) => (ch === ":" ? h * .22 : w);
    let tw = -g; for (const ch of v) tw += cw(ch) + g; if (!clk) tw += h * .42;
    const x0 = cx - tw / 2, y = cy - h / 2; let ghost = "", lit = "", x = x0;
    for (const ch of v) { if (ch === ":") lit += `<rect x="${n1(x)}" y="${n1(y + h * .22)}" width="${n1(h * .14)}" height="${n1(h * .14)}"/><rect x="${n1(x)}" y="${n1(y + h * .64)}" width="${n1(h * .14)}" height="${n1(h * .14)}"/>`;
      else { ghost += dig(x, y, h, 8); lit += dig(x, y, h, ch); } x += cw(ch) + g; }
    const dx = x - g + h * .22, deg = (c) => clk ? "" : `<circle cx="${n1(dx)}" cy="${n1(y + h * .16)}" r="${n1(h * .12)}" fill="none" stroke="${c}" stroke-width="${n1(h * .09)}"/>`;
    let s = `<g fill="#fff" fill-opacity=".06">${ghost}</g>` + deg("rgba(255,255,255,.06)");
    if (!o.on) return s;
    return s + `<ellipse class="${P}pulse" cx="${n1(cx)}" cy="${n1(cy)}" rx="${n1(tw * .75)}" ry="${n1(h * .95)}" fill="${col}" fill-opacity=".16"/><g fill="${col}">${lit}</g>` + deg(col);
  }
  const dot = (o, x, y, r, lit, c) => lit && o.on ? `<circle class="${P}pulse" cx="${x}" cy="${y}" r="${r + 3.5}" fill="url(#${o.uid}-ho)"/><circle cx="${x}" cy="${y}" r="${r}" fill="${c || "#ffb36a"}"/>` : `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" fill-opacity=".14"/>`;

  function knob(o, x, y, r, kind, ring) {
    const u = o.uid, g = { ss: "kn", bk: "kb", rd: "kr", bz: "kz", wh: "kw" }[kind || "ss"] || "kn";
    const a = (o.on && ring !== false ? -30 - 120 * o.level : 0) * Math.PI / 180, mk = kind === "ss" || kind === "wh" ? "#2a2e35" : kind === "bz" ? "#5a3e10" : "#f2f4f6";
    return (ring && o.on ? `<circle class="${P}pulse" cx="${x}" cy="${y}" r="${n1(r + 4)}" fill="url(#${u}-ho)"/><circle cx="${x}" cy="${y}" r="${n1(r + 1.3)}" fill="none" stroke="#ff9a4a" stroke-width="1"/>` : "") +
      `<circle cx="${x}" cy="${n1(y + r * .25)}" r="${n1(r + .9)}" fill="#000" fill-opacity=".4"/>` +
      (kind === "rd" || kind === "bk" ? `<circle cx="${x}" cy="${y}" r="${n1(r + .8)}" fill="url(#${u}-cr)"/>` : "") +
      `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#${u}-${g})"/><circle cx="${x}" cy="${y}" r="${n1(r * .62)}" fill="none" stroke="#000" stroke-opacity=".2" stroke-width=".6"/>` +
      `<path d="M${n1(x + Math.sin(a) * r * .25)} ${n1(y - Math.cos(a) * r * .25)}L${n1(x + Math.sin(a) * r * .85)} ${n1(y - Math.cos(a) * r * .85)}" stroke="${mk}" stroke-width="${n1(Math.max(.8, r * .22))}" stroke-linecap="round"/>`;
  }
  function bar(o, x1, x2, y, t, kind) {
    const u = o.uid, g = kind === "bz" ? "bz" : "stv", pc = kind === "bz" ? "#8a6420" : "#4a5058"; t = t || 3.2;
    return `<rect x="${x1 + 2}" y="${n1(y - 1)}" width="3" height="${n1(t + 4)}" rx="1" fill="${pc}"/><rect x="${x2 - 5}" y="${n1(y - 1)}" width="3" height="${n1(t + 4)}" rx="1" fill="${pc}"/>` +
      `<rect x="${x1}" y="${n1(y + t * .6 + 2)}" width="${x2 - x1}" height="${t}" rx="${n1(t / 2)}" fill="#000" fill-opacity=".3"/><rect x="${x1}" y="${y}" width="${x2 - x1}" height="${t}" rx="${n1(t / 2)}" fill="url(#${u}-${g})"/>` +
      `<path d="M${x1 + 2} ${n1(y + t * .3)}H${x2 - 2}" stroke="#fff" stroke-opacity=".7" stroke-width="${n1(t * .22)}" stroke-linecap="round"/>`;
  }

  function el(o, d, w) {
    let s = `<path d="${d}" fill="none" stroke="#3a2a26" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
    if (!o.on) return s + `<path d="${d}" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="${n1(w * .3)}" stroke-linecap="round"/>`;
    return s + `<g opacity="${g2(o)}"><g class="${P}pulse" style="animation-duration:${dur(o, 3.4, 1.6)}s"><path d="${d}" fill="none" stroke="#ff4a12" stroke-opacity=".3" stroke-width="${n1(w * 2.8)}" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<path d="${d}" fill="none" stroke="#ff6a1a" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#ffd29a" stroke-width="${n1(w * .35)}" stroke-linecap="round" stroke-linejoin="round"/></g></g>`;
  }
  function shimmer(o, x, y, w, h, n) {
    if (!o.on) return ""; n = n || 4; const d = +dur(o, 3.6, 1.6), q = h / 4;
    let s = `<g opacity="${(.35 + .5 * o.level).toFixed(2)}">`;
    for (let i = 0; i < n; i++) {
      const xi = x - w / 2 + w * (i + .5) / n, sg = i % 2 ? 1 : -1, del = ((i * .41 * d) % d).toFixed(2);
      const pd = `d="M${n1(xi)} ${y}c${2.2 * sg} ${n1(-q * .5)} ${-2.2 * sg} ${n1(-q * .5)} 0 ${n1(-q)}s${-2.2 * sg} ${n1(-q * .5)} 0 ${n1(-q)}s${2.2 * sg} ${n1(-q * .5)} 0 ${n1(-q)}s${-2.2 * sg} ${n1(-q * .5)} 0 ${n1(-q)}" fill="none" stroke-linecap="round"`;
      s += `<g class="${P}shim" style="animation-duration:${d}s;animation-delay:-${del}s"><path ${pd} stroke="#ffcfa0" stroke-opacity=".1" stroke-width="3.5"/><path ${pd} stroke="#fff0dc" stroke-opacity=".45" stroke-width=".9" stroke-dasharray="${n1(h * .45)} ${n1(h * .3)}"/></g>`;
    }
    return s + `</g>`;
  }
  function steam(o, x, y, w, n, big) {
    if (!o.on) return ""; n = n || 3; big = big || 1; const d = +dur(o, 4, 1.8); let s = `<g opacity="${(.5 + .5 * o.level).toFixed(2)}">`;
    for (let i = 0; i < n; i++) { const xi = x - w / 2 + w * (i + .5) / n, r = (4.5 + (i % 2) * 2) * big;
      s += `<g class="${P}stm" style="animation-duration:${n1(d + (i % 3) * .5)}s;animation-delay:-${n1(i * d / n)}s"><circle cx="${n1(xi)}" cy="${n1(y - r)}" r="${n1(r)}" fill="url(#${o.uid}-stm)"/><circle cx="${n1(xi + r * .6)}" cy="${n1(y - r * 1.9)}" r="${n1(r * .8)}" fill="url(#${o.uid}-stm)"/></g>`; }
    return s + `</g>`;
  }

  const tongue = (x, y, w, h, ln) => `M${n1(x - w / 2)} ${n1(y)}C${n1(x - w / 2)} ${n1(y - h * .5)} ${n1(x + ln * .4 - w * .12)} ${n1(y - h * .72)} ${n1(x + ln)} ${n1(y - h)}C${n1(x + ln * .4 + w * .12)} ${n1(y - h * .72)} ${n1(x + w / 2)} ${n1(y - h * .5)} ${n1(x + w / 2)} ${n1(y)}Z`;
  function gb(o, cx, cy, s, lit, opt) {
    const u = o.uid; opt = opt || {}; const ry = s * K, on = o.on && lit, Lf = .45 + .55 * o.level;
    let back = "", front = "";
    if (on) { const n = opt.n || 12, rr2 = opt.ring || .62;
      for (let i = 0; i < n; i++) { const t = i / n * Math.PI * 2, px = cx + Math.cos(t) * s * rr2, py = cy + Math.sin(t) * ry * rr2, hh = s * (.32 + .3 * Lf) * (opt.big || 1), ww = s * .2, ln = Math.cos(t) * ww * .9;
        const d = (.7 + (i % 4) * .12).toFixed(2), del = (i * .17 % .9).toFixed(2);
        const f = `<path class="${P}flk" d="${tongue(px, py, ww, hh, ln)}" fill="url(#${u}-fb)" style="animation-duration:${d}s;animation-delay:-${del}s"/><path class="${P}flk" d="${tongue(px, py, ww * .45, hh * .45, ln * .5)}" fill="url(#${u}-fbc)" style="animation-duration:${d}s;animation-delay:-${del}s"/>`;
        if (Math.sin(t) < 0) back += f; else front += f; }
    }
    return (on ? `<g opacity="${g2(o, .9)}"><ellipse class="${P}pulse" cx="${cx}" cy="${n1(cy - 1)}" rx="${n1(s * 1.25)}" ry="${n1(ry * 1.6)}" fill="url(#${u}-hb)"/></g>` : "") +
      `<ellipse cx="${cx}" cy="${cy}" rx="${n1(s * .8)}" ry="${n1(ry * .8)}" fill="#0c0d0f"/><ellipse cx="${cx}" cy="${n1(cy - .5)}" rx="${n1(s * .72)}" ry="${n1(ry * .7)}" fill="url(#${u}-ci)"/>` + back +
      `<ellipse cx="${cx}" cy="${n1(cy - 1.2)}" rx="${n1(s * .5)}" ry="${n1(ry * .5)}" fill="#08090a"/><ellipse cx="${cx}" cy="${n1(cy - 1.8)}" rx="${n1(s * .46)}" ry="${n1(ry * .44)}" fill="url(#${u}-kb)"/><ellipse cx="${n1(cx - s * .12)}" cy="${n1(cy - 2.2)}" rx="${n1(s * .18)}" ry="${n1(ry * .14)}" fill="#fff" fill-opacity=".3"/>` + front;
  }
  function grate(o, cx, cy, s, frame) {
    const ry = s * K, hw = s * 1.15, hb = s * 1.08, yt = cy - ry * 1.5, yb = cy + ry * 1.5;
    let d = "";
    if (frame !== false) d += `M${n1(cx - hb)} ${n1(yt)}H${n1(cx + hb)}L${n1(cx + hw)} ${n1(yb)}H${n1(cx - hw)}Z`;
    d += `M${n1(cx - hw * .98)} ${n1(cy)}H${n1(cx - s * .55)}M${n1(cx + s * .55)} ${n1(cy)}H${n1(cx + hw * .98)}M${cx} ${n1(yt)}V${n1(cy - ry * .55)}M${cx} ${n1(cy + ry * .55)}V${n1(yb)}`;
    return `<path d="${d}" fill="none" stroke="#08090a" stroke-width="2.6" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#4d5056" stroke-width=".8" stroke-linejoin="round" transform="translate(0 -.8)"/>`;
  }
  function coil(o, cx, cy, s, lit) {
    const ry = s * K, on = o.on && lit; let d = "";
    [.86, .62, .38].forEach((k) => { d += `M${n1(cx - s * k)} ${n1(cy)}A${n1(s * k)} ${n1(ry * k)} 0 1 0 ${n1(cx + s * k)} ${n1(cy)}A${n1(s * k)} ${n1(ry * k)} 0 1 0 ${n1(cx - s * k)} ${n1(cy)}`; });
    return `<ellipse cx="${cx}" cy="${n1(cy + .6)}" rx="${n1(s * 1.08)}" ry="${n1(ry * 1.12)}" fill="url(#${o.uid}-cr)"/><ellipse cx="${cx}" cy="${n1(cy + .6)}" rx="${n1(s * .95)}" ry="${n1(ry * .95)}" fill="#3b3f45"/>` +
      (on ? `<g opacity="${g2(o)}"><ellipse class="${P}pulse" cx="${cx}" cy="${cy}" rx="${n1(s * 1.2)}" ry="${n1(ry * 1.5)}" fill="url(#${o.uid}-ho)"/></g>` : "") +
      el(on ? o : { on: false }, d, 1.7) + `<path d="M${n1(cx - s * .9)} ${cy}H${n1(cx + s * .9)}" stroke="#2a2c30" stroke-width="1"/>`;
  }
  function rz(o, cx, cy, s, lit) {
    const ry = s * K, on = o.on && lit; let rings = "";
    if (on) for (let k = .25; k < 1; k += .18) rings += `<ellipse cx="${cx}" cy="${cy}" rx="${n1(s * k)}" ry="${n1(ry * k)}" fill="none" stroke="#7a1406" stroke-opacity=".55" stroke-width=".7"/>`;
    return (on ? `<g opacity="${g2(o)}"><ellipse class="${P}pulse" cx="${cx}" cy="${cy}" rx="${n1(s * 1.02)}" ry="${n1(ry * 1.02)}" fill="url(#${o.uid}-rz)" style="animation-duration:${dur(o, 3, 1.2)}s"/>${rings}</g>` : "") +
      `<ellipse cx="${cx}" cy="${cy}" rx="${s}" ry="${n1(ry)}" fill="none" stroke="#fff" stroke-opacity="${on ? ".18" : ".3"}" stroke-width=".7"/><ellipse cx="${cx}" cy="${cy}" rx="${n1(s * .55)}" ry="${n1(ry * .55)}" fill="none" stroke="#fff" stroke-opacity=".14" stroke-width=".5"/>`;
  }
  function iz(o, cx, cy, s, lit, num) {
    const ry = s * K, on = o.on && lit;
    return `<ellipse cx="${cx}" cy="${cy}" rx="${s}" ry="${n1(ry)}" fill="none" stroke="#fff" stroke-opacity=".28" stroke-width=".7"/>` +
      `<path d="M${n1(cx - s * .15)} ${n1(cy - ry)}H${n1(cx + s * .15)}M${n1(cx - s * .15)} ${n1(cy + ry)}H${n1(cx + s * .15)}" stroke="#fff" stroke-opacity=".3" stroke-width="1"/>` +
      (on ? `<g opacity="${g2(o)}"><ellipse class="${P}pulse" cx="${cx}" cy="${cy}" rx="${n1(s * 1.08)}" ry="${n1(ry * 1.15)}" fill="none" stroke="#ff4a1a" stroke-opacity=".35" stroke-width="4"/><ellipse cx="${cx}" cy="${cy}" rx="${s}" ry="${n1(ry)}" fill="none" stroke="#ff7a3a" stroke-width="1.2"/></g>` : "") +
      (num ? `<g fill="${on ? "#ff6a3a" : "#fff"}" fill-opacity="${on ? 1 : .06}">${dig(cx + s * .9, cy + ry * .9, 5, on ? Math.max(1, Math.round(9 * o.level)) : 8)}</g>` : "");
  }

  function pot(o, cx, by, w, h, opt) {
    opt = opt || {}; const u = o.uid, rx = w / 2, ry = rx * K, yt = by - h;
    const body = `M${n1(cx - rx)} ${n1(yt)}V${n1(by)}A${n1(rx)} ${n1(ry)} 0 0 0 ${n1(cx + rx)} ${n1(by)}V${n1(yt)}Z`;
    let s = `<path d="M${n1(cx - rx - 4)} ${n1(yt + 3)}h4M${n1(cx + rx)} ${n1(yt + 3)}h4" stroke="#3a3f45" stroke-width="2.4" stroke-linecap="round"/>` +
      `<path d="${body}" fill="url(#${u}-${opt.g || "st"})"/><path d="${body}" fill="url(#${u}-br)"/><path d="M${n1(cx - rx + 2)} ${n1(yt + 2)}V${n1(by - 1)}" stroke="#fff" stroke-opacity=".5" stroke-width="1.2"/>`;
    if (opt.lid) s += `<ellipse cx="${cx}" cy="${n1(yt)}" rx="${n1(rx + .6)}" ry="${n1(ry)}" fill="url(#${u}-cr)"/><path d="M${n1(cx - rx * .8)} ${n1(yt - .6)}Q${cx} ${n1(yt - ry * 1.9)} ${n1(cx + rx * .8)} ${n1(yt - .6)}" fill="url(#${u}-stv)" fill-opacity=".9"/><ellipse cx="${cx}" cy="${n1(yt - ry * 1.3)}" rx="2.6" ry="1.4" fill="#1d1f23"/>`;
    else s += `<ellipse cx="${cx}" cy="${n1(yt)}" rx="${n1(rx)}" ry="${n1(ry)}" fill="url(#${u}-cr)"/><ellipse cx="${cx}" cy="${n1(yt + .3)}" rx="${n1(rx - 1.2)}" ry="${n1(ry - .6)}" fill="${opt.soup || "#b4652c"}"/><ellipse cx="${n1(cx - rx * .3)}" cy="${n1(yt)}" rx="${n1(rx * .3)}" ry="${n1(ry * .25)}" fill="#fff" fill-opacity=".25"/>`;
    return s + steam(o, cx, yt - (opt.lid ? ry * 1.6 : 1), w * .7, 3, w / 22);
  }
  function pan(o, cx, cy, w, food) {
    const u = o.uid, rx = w / 2, ry = rx * K;
    let f = "";
    if (food === "egg") f = `<ellipse cx="${n1(cx - rx * .3)}" cy="${n1(cy)}" rx="${n1(rx * .3)}" ry="${n1(ry * .4)}" fill="#f6f2ea"/><ellipse cx="${n1(cx - rx * .3)}" cy="${n1(cy - .5)}" rx="${n1(rx * .1)}" ry="${n1(ry * .17)}" fill="#ffb62e"/><ellipse cx="${n1(cx + rx * .3)}" cy="${n1(cy + .4)}" rx="${n1(rx * .28)}" ry="${n1(ry * .38)}" fill="#f6f2ea"/><ellipse cx="${n1(cx + rx * .32)}" cy="${n1(cy)}" rx="${n1(rx * .1)}" ry="${n1(ry * .17)}" fill="#ffb62e"/>`;
    else if (food === "veg") f = [[-.4, .1, "#3f9a4a"], [-.1, -.2, "#e8662a"], [.2, .2, "#f2c84a"], [.45, -.1, "#3f9a4a"], [0, .35, "#c8392f"]].map((p) => `<ellipse cx="${n1(cx + rx * p[0])}" cy="${n1(cy + ry * p[1])}" rx="${n1(rx * .13)}" ry="${n1(ry * .2)}" fill="${p[2]}"/>`).join("");
    return `<path d="M${n1(cx + rx * .9)} ${n1(cy + ry * .5)}L${n1(cx + rx * 1.8)} ${n1(cy + ry * 1.8)}" stroke="#15171a" stroke-width="3.4" stroke-linecap="round"/><path d="M${n1(cx + rx * 1.1)} ${n1(cy + ry * .8)}L${n1(cx + rx * 1.75)} ${n1(cy + ry * 1.7)}" stroke="#fff" stroke-opacity=".18" stroke-width="1"/>` +
      `<path d="M${n1(cx - rx)} ${n1(cy)}V${n1(cy + 2.5)}A${n1(rx)} ${n1(ry)} 0 0 0 ${n1(cx + rx)} ${n1(cy + 2.5)}V${n1(cy)}Z" fill="#1d1f23"/><ellipse cx="${cx}" cy="${cy}" rx="${n1(rx)}" ry="${n1(ry)}" fill="#3a3d42"/><ellipse cx="${cx}" cy="${n1(cy + .3)}" rx="${n1(rx - 1.4)}" ry="${n1(ry - .6)}" fill="#141518"/>` + f +
      (o.on ? shimmer(o, cx, cy - 2, w * .7, 14, 3) : "");
  }
  function wok(o, cx, cy, w) {
    const rx = w / 2, ry = rx * K;
    return `<path d="M${n1(cx - rx)} ${n1(cy - 3)}Q${cx} ${n1(cy + ry * 3)} ${n1(cx + rx)} ${n1(cy - 3)}Z" fill="#202226"/><ellipse cx="${cx}" cy="${n1(cy - 3)}" rx="${n1(rx)}" ry="${n1(ry)}" fill="#4a4d52"/><ellipse cx="${cx}" cy="${n1(cy - 2.6)}" rx="${n1(rx - 1.2)}" ry="${n1(ry - .5)}" fill="#18191c"/>` +
      [[-.3, "#3f9a4a"], [-.05, "#e8662a"], [.2, "#f2c84a"], [.35, "#c8392f"], [.05, "#3f9a4a"]].map((p, i) => `<ellipse cx="${n1(cx + rx * p[0])}" cy="${n1(cy - 2.4 + (i % 2) * 1.2)}" rx="2" ry="1.1" fill="${p[1]}"/>`).join("") +
      `<path d="M${n1(cx + rx - 1)} ${n1(cy - 3)}h9" stroke="#3a2a1a" stroke-width="3" stroke-linecap="round"/>` + steam(o, cx, cy - 5, w * .6, 3, 1.1);
  }

  function dish(kind, cx, y, w) {
    const s = w / 60;
    if (kind === "roast") return `<path d="M${n1(cx - 15 * s)} ${n1(y - 3)}H${n1(cx + 15 * s)}L${n1(cx + 13 * s)} ${n1(y)}H${n1(cx - 13 * s)}Z" fill="#3a3f45"/><ellipse cx="${cx}" cy="${n1(y - 6 * s)}" rx="${n1(11 * s)}" ry="${n1(6.5 * s)}" fill="#b5622a"/><ellipse cx="${n1(cx - 2 * s)}" cy="${n1(y - 8 * s)}" rx="${n1(6 * s)}" ry="${n1(3 * s)}" fill="#e09a52"/><ellipse cx="${n1(cx + 10 * s)}" cy="${n1(y - 4 * s)}" rx="${n1(4 * s)}" ry="${n1(2.6 * s)}" fill="#9a4a1c"/><ellipse cx="${n1(cx - 10 * s)}" cy="${n1(y - 4 * s)}" rx="${n1(4 * s)}" ry="${n1(2.6 * s)}" fill="#9a4a1c"/>`;
    if (kind === "cass") return `<path d="${rr(cx - 14 * s, y - 7 * s, 28 * s, 7 * s, 1.5)}" fill="#f2efe9"/><path d="M${n1(cx - 15.5 * s)} ${n1(y - 6.5 * s)}H${n1(cx + 15.5 * s)}" stroke="#d8d2c4" stroke-width="1.6" stroke-linecap="round"/><ellipse cx="${cx}" cy="${n1(y - 7 * s)}" rx="${n1(13 * s)}" ry="${n1(2.2 * s)}" fill="#e0a043"/>` + [-8, -2, 5, 10].map((d) => `<circle cx="${n1(cx + d * s)}" cy="${n1(y - 7.4 * s)}" r="${n1(1.3 * s)}" fill="#a85a1c"/>`).join("");
    if (kind === "pizza") return `<ellipse cx="${cx}" cy="${n1(y - 1.5)}" rx="${n1(16 * s)}" ry="${n1(3 * s)}" fill="#d9a35a"/><ellipse cx="${cx}" cy="${n1(y - 1.9)}" rx="${n1(13 * s)}" ry="${n1(2.3 * s)}" fill="#c43a22"/>` + [-8, -3, 3, 8, 0].map((d, i) => `<ellipse cx="${n1(cx + d * s)}" cy="${n1(y - 2 - (i % 2) * s)}" rx="${n1(2 * s)}" ry="${n1(.8 * s)}" fill="#f6e2a0"/>`).join("");
    if (kind === "cookie") return `<path d="M${n1(cx - 18 * s)} ${n1(y - 1.5)}H${n1(cx + 18 * s)}V${n1(y)}H${n1(cx - 18 * s)}Z" fill="#8f969e"/>` + [-13, -6.5, 0, 6.5, 13].map((d) => `<ellipse cx="${n1(cx + d * s)}" cy="${n1(y - 2.4)}" rx="${n1(2.6 * s)}" ry="${n1(1.3 * s)}" fill="#c98a3e"/><circle cx="${n1(cx + d * s)}" cy="${n1(y - 2.8)}" r=".5" fill="#4a2a12"/>`).join("");
    if (kind === "bread") return `<path d="${rr(cx - 13 * s, y - 2, 26 * s, 2, .5)}" fill="#3a3f45"/><path d="M${n1(cx - 12 * s)} ${n1(y - 2)}C${n1(cx - 12 * s)} ${n1(y - 12 * s)} ${n1(cx + 12 * s)} ${n1(y - 12 * s)} ${n1(cx + 12 * s)} ${n1(y - 2)}Z" fill="#c07a34"/><path d="M${n1(cx - 6 * s)} ${n1(y - 8 * s)}l3 -2M${n1(cx - 1 * s)} ${n1(y - 9 * s)}l3 -2M${n1(cx + 4 * s)} ${n1(y - 8 * s)}l3 -2" stroke="#f0c886" stroke-width="1.2" stroke-linecap="round"/>`;
    if (kind === "pie") return `<path d="M${n1(cx - 13 * s)} ${n1(y - 4 * s)}L${n1(cx - 11 * s)} ${n1(y)}H${n1(cx + 11 * s)}L${n1(cx + 13 * s)} ${n1(y - 4 * s)}Z" fill="#c9883e"/><ellipse cx="${cx}" cy="${n1(y - 4 * s)}" rx="${n1(13 * s)}" ry="${n1(2.6 * s)}" fill="#e6b065"/><path d="M${n1(cx - 8 * s)} ${n1(y - 5.8 * s)}L${n1(cx - 3 * s)} ${n1(y - 2.4 * s)}M${n1(cx)} ${n1(y - 6.4 * s)}L${n1(cx + 5 * s)} ${n1(y - 2.2 * s)}M${n1(cx + 7 * s)} ${n1(y - 5.8 * s)}L${n1(cx + 2 * s)} ${n1(y - 2.2 * s)}" stroke="#a8642a" stroke-width="1"/>`;
    if (kind === "veg") return `<path d="${rr(cx - 17 * s, y - 3, 34 * s, 3, .6)}" fill="#c9ced4"/><path d="${rr(cx - 17 * s, y - 3, 34 * s, 3, .6)}" fill="url(#PERF)"/>` + [[-12, "#3f9a4a"], [-7, "#e8662a"], [-2, "#3f9a4a"], [3, "#f2c84a"], [8, "#e8662a"], [12, "#3f9a4a"]].map((p, i) => `<ellipse cx="${n1(cx + p[0] * s)}" cy="${n1(y - 4.2 - (i % 2))}" rx="${n1(2.6 * s)}" ry="${n1(1.6 * s)}" fill="${p[1]}"/>`).join("");
    return "";
  }
  function ovwin(o, k, x, y, w, h, r, kind, opt) {
    opt = opt || {}; const u = o.uid, id = `${u}-w${k}`, d = rr(x, y, w, h, r), cx = x + w / 2, on = o.on;
    const r1 = y + h * .48, r2 = y + h * .82, dy = opt.top ? r1 : r2, cool = opt.cool;
    let s = `<path d="${rr(x - 1.5, y - 1.5, w + 3, h + 3, r + 1)}" fill="#060708"/><clipPath id="${id}"><path d="${d}"/></clipPath><path d="${d}" fill="url(#${u}-od)"/><g clip-path="url(#${id})">`;
    if (on) s += `<g opacity="${g2(o)}"><path class="${P}glow" d="${d}" fill="url(#${u}-${cool ? "sv" : "ov"})" style="animation-duration:${dur(o, 3.6, 1.4)}s"/></g>` +
      `<path d="M${x} ${n1(y + h)}L${n1(x + w * .14)} ${n1(y + h * .7)}H${n1(x + w * .86)}L${x + w} ${n1(y + h)}Z" fill="#000" fill-opacity=".18"/>`;
    if (!cool) s += el(o, `M${x + 3} ${n1(y + 3.5)}` + Array.from({ length: 7 }, (_, i) => `L${n1(x + 3 + (w - 6) * (i + .5) / 7)} ${n1(y + (i % 2 ? 3.5 : 6))}`).join("") + `L${x + w - 3} ${n1(y + 3.5)}`, 1.4);
    if (opt.fan) s += `<circle cx="${cx}" cy="${n1(y + h * .36)}" r="${n1(h * .2)}" fill="#000" fill-opacity=".25"/><g class="${on ? P + "spin" : ""}" style="animation-duration:${dur(o, 1.4, .9)}s"><g fill="#000" fill-opacity=".3">${[0, 60, 120, 180, 240, 300].map((a) => `<path d="M${cx} ${n1(y + h * .36)}l${n1(h * .05)} ${n1(-h * .17)}l${n1(-h * .07)} 0Z" transform="rotate(${a} ${cx} ${n1(y + h * .36)})"/>`).join("")}</g></g>` +
      [0, 1, 2, 3].map((i) => `<circle cx="${cx}" cy="${n1(y + h * .36)}" r="${n1(h * (.08 + i * .045))}" fill="none" stroke="#000" stroke-opacity=".22" stroke-width=".6"/>`).join("");
    s += `<path d="M${x} ${n1(r1)}H${x + w}M${x} ${n1(r2)}H${x + w}" stroke="#2a2e34" stroke-width="1.4"/><path d="M${x} ${n1(r1 - .7)}H${x + w}M${x} ${n1(r2 - .7)}H${x + w}" stroke="#fff" stroke-opacity="${on ? ".55" : ".1"}" stroke-width=".6"/>`;
    if (kind) s += dish(kind, cx, dy - .6, w).replace(/PERF/g, `${u}-perf`);
    if (on && cool) s += steam(o, cx, y + h * .9, w * .8, 4, .9);
    if (!on) s += `<path d="${d}" fill="#020304" opacity=".88"/>`;
    else s += `<path d="${d}" fill="#000" opacity="${(.45 - .45 * o.level).toFixed(2)}"/>`;
    s += `</g><path d="${d}" fill="url(#${u}-gl)" opacity="${on ? ".35" : ".75"}"/><path d="M${n1(x + w * .62)} ${y}L${n1(x + w * .46)} ${y + h}H${n1(x + w * .52)}L${n1(x + w * .68)} ${y}Z" fill="#fff" fill-opacity="${on ? ".04" : ".07"}"/>` +
      `<path d="${d}" fill="none" stroke="#000" stroke-opacity=".6"/>`;
    return s;
  }
  function door(o, k, x, y, w, h, kind, opt) {
    opt = opt || {}; const d = rr(x, y, w, h, opt.r || 2.5), wp = opt.pad || 8, hp = opt.hp || 14;
    let s = opt.glass ? `<path d="${d}" fill="url(#${o.uid}-bg)"/><path d="${d}" fill="none" stroke="#000" stroke-opacity=".6"/>` : pnt(o, d) + gloss(o, x, y, w, h);
    s += `<path d="M${x + 1} ${y + .8}H${x + w - 1}" stroke="#fff" stroke-opacity=".35" stroke-width=".8"/>`;
    s += ovwin(o, k, x + wp, y + hp, w - wp * 2, h - hp - (opt.bp || 7), 2.5, kind, opt);
    if (opt.handle !== false) s += bar(o, x + 6, x + w - 6, y + 4.5, opt.ht || 3, opt.hk);
    return s;
  }
  function panel(o, x, y, w, h, opt) {
    opt = opt || {}; const u = o.uid, d = rr(x, y, w, h, opt.r || 2), cy = y + h / 2;
    let s = `<path d="${d}" fill="url(#${u}-bg)"/>` + lcd(o, x + w / 2, cy, Math.min(8, h * .52), opt.col);
    const n = opt.keys == null ? 3 : opt.keys;
    for (let i = 0; i < n; i++) { s += dot(o, n1(x + 7 + i * 6), n1(cy), 1.3, i === 0) + dot(o, n1(x + w - 7 - i * 6), n1(cy), 1.3, i === 1); }
    return s + `<path d="M${x + 2} ${y + .8}H${x + w - 2}" stroke="#fff" stroke-opacity=".22" stroke-width=".7"/><path d="M${n1(x + w * .2)} ${y + h}L${n1(x + w * .26)} ${y}H${n1(x + w * .3)}L${n1(x + w * .24)} ${y + h}Z" fill="#fff" fill-opacity=".06"/>`;
  }

  const bp = (x1, x2, yb, yf, ins, u, v) => [n1(x1 + ins * (1 - v) + (x2 - x1 - 2 * ins * (1 - v)) * u), n1(yb + (yf - yb) * v), .85 + .15 * v];
  function burners(o0, c, list) {
    let s = "";
    list.slice().sort((a, b) => a[1] - b[1]).forEach((b) => {
      const o = !PT ? o0 : b[1] >= .5 ? PT.front : PT.back;
      const p = bp(c.x1, c.x2, c.yb, c.yf, c.ins, b[0], b[1]), x = +p[0], y = +p[1], sz = b[2] * p[2], t = b[3], lit = b[4];
      if (t === "gas") s += gb(o, x, y, sz, lit, { big: b[6] }) + (c.grate === "each" ? grate(o, x, y, sz) : c.grate === "cont" ? grate(o, x, y, sz, false) : "");
      else if (t === "coil") s += coil(o, x, y, sz, lit);
      else if (t === "rad") s += rz(o, x, y, sz, lit);
      else if (t === "ind") s += iz(o, x, y, sz, lit, true);
      const cw = b[5];
      if (cw === "pot") s += pot(o, x, y - 1, sz * 1.5, sz * .95);
      if (cw === "lid") s += pot(o, x, y - 1, sz * 1.5, sz * .85, { lid: true });
      if (cw === "pan" || cw === "egg" || cw === "veg") s += pan(o, x, y - 2, sz * 1.7, cw === "pan" ? "" : cw);
      if (cw === "wok") s += wok(o, x, y - 1, sz * 2);
      if (cw === "kettle") s += kettle(o, x, y - 1, sz * 1.4);
    });
    return s;
  }
  function kettle(o, cx, by, w) {
    const u = o.uid, rx = w / 2, h = w * .7;
    return `<path d="M${n1(cx + rx * .6)} ${n1(by - h * .45)}Q${n1(cx + rx * 1.4)} ${n1(by - h * .55)} ${n1(cx + rx * 1.55)} ${n1(by - h * .95)}" stroke="url(#${u}-st)" stroke-width="3" fill="none" stroke-linecap="round"/>` +
      `<path d="M${n1(cx - rx)} ${n1(by)}C${n1(cx - rx)} ${n1(by - h * .9)} ${n1(cx - rx * .4)} ${n1(by - h)} ${cx} ${n1(by - h)}C${n1(cx + rx * .4)} ${n1(by - h)} ${n1(cx + rx)} ${n1(by - h * .9)} ${n1(cx + rx)} ${n1(by)}Z" fill="url(#${u}-${o.kettle || "st"})"/>` +
      `<path d="M${n1(cx - rx * .6)} ${n1(by - h * .95)}Q${cx} ${n1(by - h * 1.6)} ${n1(cx + rx * .6)} ${n1(by - h * .95)}" fill="none" stroke="#1d1f23" stroke-width="2"/><ellipse cx="${cx}" cy="${n1(by - h)}" rx="2.4" ry="1.2" fill="#1d1f23"/><path d="M${n1(cx - rx * .7)} ${n1(by - h * .7)}Q${n1(cx - rx * .75)} ${n1(by - h * .3)} ${n1(cx - rx * .6)} ${n1(by - 1)}" stroke="#fff" stroke-opacity=".5" stroke-width="1.2" fill="none"/>` +
      steam(o, cx + rx * 1.6, by - h * .95, 6, 2, .8);
  }

  function range(o, c) {
    const u = o.uid; c = Object.assign({ yb: 74, yf: 94, ins: 5, bot: 172 }, c);
    const { x1, x2, yb, yf, ins, bot } = c, w = x2 - x1;
    let s = kit(o, x1, x2, yb, yf, ins, c) + sh(o, (x1 + x2) / 2, 178, w / 2 + 8, 4);
    if (c.back) { const b = c.back, bx1 = x1 + ins - 1, bw = w - 2 * ins + 2;
      if (b.kind === "glass") s += `<path d="${rr(bx1, b.y, bw, yb - b.y + 1, 2)}" fill="url(#${u}-bg)"/>`;
      else if (b.kind === "steel") s += steel(o, rr(bx1, b.y, bw, yb - b.y + 1, 1.5));
      else s += pnt(o, rr(bx1, b.y, bw, yb - b.y + 1, b.r || 2.5), "v") + `<path d="M${bx1 + 2} ${b.y + 1}H${bx1 + bw - 2}" stroke="#fff" stroke-opacity=".45"/>`;
      if (b.panel) s += panel(PT ? PT.oven : o, b.panel[0], b.panel[1], b.panel[2], b.panel[3], { keys: b.keys });
      if (b.knobs) b.knobs.forEach((x, i) => { s += knob(PT ? PT.cook : o, x, (b.y + yb) / 2, b.kr || 4.6, b.kt || "ss", i % 2 === 0 ? undefined : false); });
    }
    const td = trap(x1, x2, yb, yf, ins);
    if (c.top === "glass") s += `<path d="${td}" fill="url(#${u}-bgt)"/><path d="M${x1 + ins + 10} ${yb}L${x1 + 22} ${yf}H${x1 + 34}L${x1 + ins + 20} ${yb}Z" fill="#fff" fill-opacity=".05"/>`;
    else if (c.top === "steel") s += steel(o, td);
    else if (c.top === "iron") s += `<path d="${td}" fill="#17181b"/><path d="${td}" fill="none" stroke="#000"/>`;
    else s += pnt(o, td, "tp");
    if (c.grate === "cont") s += `<path d="${trap(x1 + 2, x2 - 2, yb + 1.5, yf - 1.5, ins)}" fill="#0e0f11" fill-opacity=".5"/>`;
    s += burners(o, c, c.burners);
    if (c.grate === "cont") s += `<path d="${trap(x1 + 3, x2 - 3, yb + 1.2, yf - 1.2, ins)}" fill="none" stroke="#08090a" stroke-width="2.6"/>` +
      (c.cols || []).map((uu) => { const a = bp(x1, x2, yb, yf, ins, uu, 0), b = bp(x1, x2, yb, yf, ins, uu, 1); return `<path d="M${a[0]} ${+a[1] + 1}L${b[0]} ${+b[1] - 1}" stroke="#08090a" stroke-width="2.6"/>`; }).join("") +
      `<path d="M${x1 + 3} ${yf - 2}H${x2 - 3}" stroke="#55585e" stroke-width=".7"/>`;
    s += `<path d="M${x1} ${yf}H${x2}" stroke="#fff" stroke-opacity=".5" stroke-width=".8"/>`;
    s += pnt(o, `M${x1} ${yf}H${x2}V${bot}H${x1}Z`) + kick(o, x1, x2, bot);
    if (c.front) { const f = c.front; s += `<path d="M${x1} ${f.y + f.h}H${x2}" stroke="#000" stroke-opacity=".35"/>`;
      if (f.panel) s += panel(PT ? PT.oven : o, f.panel[0], f.panel[1], f.panel[2], f.panel[3], { keys: f.keys });
      (f.knobs || []).forEach((x, i) => { s += knob(PT ? PT.cook : o, x, f.y + f.h / 2, f.kr || 4.4, f.kt || "ss", f.ring ? (i < (f.lit || 2)) : undefined); }); }
    (c.doors || []).forEach((dd, i) => { s += door(!PT ? o : i === 0 ? PT.oven : PT.oven2, i, dd.x || x1 + 3, dd.y, dd.w || w - 6, dd.h, dd.dish, dd); });
    if (c.drawer) s += pnt(o, rr(x1 + 3, c.drawer[0], w - 6, c.drawer[1], 1.5)) + `<path d="M${x1 + 30} ${c.drawer[0] + 3}H${x2 - 30}" stroke="#000" stroke-opacity=".35" stroke-width="1.6" stroke-linecap="round"/>`;
    s += hl(x1 + 1.5, yf + 2, x1 + 1.5, bot - 2, 1.2, .3);
    return s;
  }

  const css = `
.hda-range-flk{transform-box:fill-box;transform-origin:50% 100%}
.hda-anim .hda-range-flk{animation:hda-range-flk .9s ease-in-out infinite}
@keyframes hda-range-flk{0%,100%{transform:scale(1,1)}30%{transform:scale(.9,1.2)}60%{transform:scale(1.06,.84)}80%{transform:scale(.96,1.08)}}
.hda-anim .hda-range-glow{animation:hda-range-glow 3.2s ease-in-out infinite}
@keyframes hda-range-glow{0%,100%{opacity:1}50%{opacity:.8}}
.hda-anim .hda-range-pulse{animation:hda-range-pulse 2.6s ease-in-out infinite}
@keyframes hda-range-pulse{0%,100%{opacity:1}50%{opacity:.62}}
.hda-range-shim{opacity:.5}
.hda-anim .hda-range-shim{animation:hda-range-shim 2.6s linear infinite}
@keyframes hda-range-shim{0%{transform:translateY(6px);opacity:0}30%{opacity:.9}100%{transform:translateY(-12px);opacity:0}}
.hda-range-stm{opacity:.45;transform-box:fill-box;transform-origin:50% 100%}
.hda-anim .hda-range-stm{animation:hda-range-stm 3.4s ease-out infinite}
@keyframes hda-range-stm{0%{transform:translate(0,4px) scale(.45);opacity:0}25%{opacity:.85}100%{transform:translate(4px,-24px) scale(1.5);opacity:0}}
.hda-range-smk{opacity:.4;transform-box:fill-box;transform-origin:50% 100%}
.hda-anim .hda-range-smk{animation:hda-range-smk 5s ease-out infinite}
@keyframes hda-range-smk{0%{transform:translate(0,4px) scale(.5);opacity:0}20%{opacity:.7}100%{transform:translate(10px,-34px) scale(1.8);opacity:0}}
.hda-range-spin{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-range-spin{animation:hda-range-spin 1s linear infinite}
@keyframes hda-range-spin{to{transform:rotate(360deg)}}
.hda-anim .hda-range-turn{animation:hda-range-turn 5s ease-in-out infinite alternate}
@keyframes hda-range-turn{0%{transform:translateX(-7px)}100%{transform:translateX(7px)}}
.hda-anim .hda-range-emb{animation:hda-range-emb 2.2s ease-in-out infinite}
@keyframes hda-range-emb{0%,100%{opacity:.35}50%{opacity:1}}
.hda-range-spark{opacity:0}
.hda-anim .hda-range-spark{animation:hda-range-spark 2.4s ease-out infinite}
@keyframes hda-range-spark{0%{transform:translateY(0);opacity:0}15%{opacity:1}100%{transform:translateY(-24px);opacity:0}}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-range-flk,.hda-anim .hda-range-glow,.hda-anim .hda-range-pulse,.hda-anim .hda-range-shim,.hda-anim .hda-range-stm,.hda-anim .hda-range-smk,.hda-anim .hda-range-spin,.hda-anim .hda-range-turn,.hda-anim .hda-range-emb,.hda-anim .hda-range-spark{animation:none!important}}
`;

  const flameD = (cx, by, w, h, ln) => `M${n1(cx - w / 2)} ${by}C${n1(cx - w / 2)} ${n1(by - h * .38)} ${n1(cx - w * .14 + ln * .3)} ${n1(by - h * .55)} ${n1(cx + ln)} ${n1(by - h)}C${n1(cx + w * .12 + ln * .4)} ${n1(by - h * .62)} ${n1(cx + w / 2)} ${n1(by - h * .42)} ${n1(cx + w / 2)} ${by}Q${cx} ${n1(by + w * .14)} ${n1(cx - w / 2)} ${by}Z`;
  function fire(o, x1, x2, by, hm, n, lean) {
    if (!o.on) return ""; const u = o.uid, L = .5 + .5 * o.level, step = (x2 - x1) / n, w0 = step * 1.6; lean = lean || 0;
    let s = `<g opacity="${g2(o)}"><ellipse class="${P}pulse" cx="${(x1 + x2) / 2}" cy="${by - hm * .3}" rx="${n1((x2 - x1) / 2 + 10)}" ry="${n1(hm * .7)}" fill="url(#${u}-ho)"/></g>`;
    [["fo", 1, 1, 1.2], ["fm", .64, .72, .95], ["fc", .34, .42, .7]].forEach(([gid, wk, hk, tb], li) => {
      for (let i = 0; i < n; i++) { const cx = x1 + step * (i + .5), sv = Math.sin(i * 2.3 + 1), hv = hm * L * (.6 + .4 * sv * sv) * hk, ln = ((((i * 37) % 9) - 4) * .9 + lean) * (1 - li * .3);
        s += `<path class="${P}flk" d="${flameD(+cx.toFixed(1), by, w0 * wk, hv, ln)}" fill="url(#${u}-${gid})" style="animation-duration:${(tb + (i % 3) * .21).toFixed(2)}s;animation-delay:-${((i * .29 + li * .17) % 1.2).toFixed(2)}s"/>`; }
    });
    return s;
  }
  function logs(o, x1, x2, y) {
    const lg = (a, b, c, d, r) => `<path d="M${a} ${b}L${c} ${d}" stroke="#24150b" stroke-width="${2 * r + 1.4}" stroke-linecap="round"/><path d="M${a} ${b}L${c} ${d}" stroke="#6e4628" stroke-width="${2 * r}" stroke-linecap="round"/><circle cx="${c}" cy="${d}" r="${r}" fill="#c89a62"/><circle cx="${c}" cy="${d}" r="${n1(r * .55)}" fill="none" stroke="#8a5a32" stroke-width=".6"/>` +
      (o.on ? `<g opacity="${g2(o)}"><path class="${P}emb" d="M${a} ${b + r * .5}L${c} ${d + r * .5}" stroke="#ff7a2a" stroke-width="${n1(r * .7)}" stroke-dasharray="2 4 1 5" stroke-linecap="round"/></g>` : "");
    return lg(x1, y, x2 - 6, y - 3, 3.4) + lg(x1 + 6, y - 2, x2, y - 7, 3) + (o.on ? `<g opacity="${g2(o, .8)}"><ellipse class="${P}emb" cx="${(x1 + x2) / 2}" cy="${y + 2}" rx="${n1((x2 - x1) / 2 + 2)}" ry="2.4" fill="#ff5a1a"/></g>` : `<ellipse cx="${(x1 + x2) / 2}" cy="${y + 2}" rx="${n1((x2 - x1) / 2 + 2)}" ry="2.4" fill="#3a3530"/>`);
  }
  const sparks = (o, pts) => o.on ? pts.map((p, i) => `<circle class="${P}spark" cx="${p[0]}" cy="${p[1]}" r="${p[2] || .9}" fill="#ffd27a" style="animation-duration:${(2 + (i % 3) * .5).toFixed(1)}s;animation-delay:-${(i * .7).toFixed(1)}s"/>`).join("") : "";
  function smoke(o, x, y, n) {
    if (!o.on) return ""; let s = `<g opacity="${(.4 + .5 * o.level).toFixed(2)}">`;
    for (let i = 0; i < (n || 3); i++) s += `<circle class="${P}smk" cx="${x + (i % 2) * 3}" cy="${y - 6}" r="${6 + i}" fill="url(#${o.uid}-smk)" style="animation-delay:-${n1(i * 1.6)}s;animation-duration:${dur(o, 6, 2)}s"/>`;
    return s + `</g>`;
  }

  const tall = (o, x1, x2, ovTop, ovBot) => `<g class="hda-bg">${tall0(o, x1, x2, ovTop, ovBot)}</g>`;
  function tall0(o, x1, x2, ovTop, ovBot) {
    const u = o.uid;
    let s = `<rect x="4" y="4" width="192" height="174" rx="6" fill="#fff" fill-opacity=".03"/><rect x="4" y="178" width="192" height="18" rx="4" fill="url(#${u}-flr)"/><path d="M4 184H196M4 191H196M60 178V184M130 184V191" stroke="#000" stroke-opacity=".3" stroke-width=".7"/>` +
      `<rect x="${x1 - 14}" y="4" width="${x2 - x1 + 28}" height="168" fill="url(#${u}-wd)"/><rect x="${x1 - 14}" y="4" width="${x2 - x1 + 28}" height="168" fill="url(#${u}-grn)"/><rect x="${x1 - 14}" y="172" width="${x2 - x1 + 28}" height="6" fill="#0d0e10"/>` +
      `<path d="M${x1 - 14} 4V172M${x2 + 14} 4V172" stroke="#000" stroke-opacity=".45"/><path d="M${x1 - 13} 4V172" stroke="#fff" stroke-opacity=".12"/>` +
      `<rect x="${x1 - 3}" y="${ovTop - 3}" width="${x2 - x1 + 6}" height="${ovBot - ovTop + 6}" fill="#0a0b0c"/>`;
    if (ovTop > 30) s += `<path d="${rr(x1 - 8, 8, x2 - x1 + 16, ovTop - 18, 1.5)}" fill="none" stroke="#000" stroke-opacity=".35"/><path d="${rr(x1 - 2, 14, x2 - x1 + 4, ovTop - 30, 1)}" fill="none" stroke="#000" stroke-opacity=".22"/><rect x="${(x1 + x2) / 2 - 10}" y="${ovTop - 16}" width="20" height="2.4" rx="1.2" fill="url(#${u}-st)"/>`;
    if (ovBot < 160) s += `<path d="${rr(x1 - 8, ovBot + 8, x2 - x1 + 16, 164 - ovBot - 8, 1.5)}" fill="none" stroke="#000" stroke-opacity=".35"/><rect x="${(x1 + x2) / 2 - 12}" y="${ovBot + 14}" width="24" height="2.4" rx="1.2" fill="url(#${u}-st)"/>`;
    s += `<path d="M${x1 - 30} 98H${x1 - 14}V178H${x1 - 30}" fill="url(#${u}-cab)"/><path d="M4 94H${x1 - 14}V98H4Z" fill="url(#${u}-cte)"/><rect x="4" y="98" width="${x1 - 18}" height="74" fill="url(#${u}-cab)"/><rect x="4" y="172" width="${x1 - 18}" height="6" fill="#0d0e10"/>` +
      `<path d="M${x2 + 14} 94H196V98H${x2 + 14}Z" fill="url(#${u}-cte)"/><rect x="${x2 + 14}" y="98" width="${182 - x2}" height="74" fill="url(#${u}-cab)"/><rect x="${x2 + 14}" y="172" width="${182 - x2}" height="6" fill="#0d0e10"/>` +
      `<rect x="4" y="50" width="${x1 - 18}" height="44" fill="url(#${u}-tile)"/><rect x="${x2 + 14}" y="50" width="${182 - x2}" height="44" fill="url(#${u}-tile)"/>`;
    return s;
  }
  function unit(o, k, x1, x2, y, h, dish, opt) {
    opt = opt || {}; const w = x2 - x1, ch = opt.ch == null ? 12 : opt.ch;
    let s = pnt(o, rr(x1, y, w, h, 1.5));
    if (ch) s += panel(o, x1 + 4, y + 2, w - 8, ch - 3, { keys: 3 });
    s += door(o, k, x1 + 2, y + ch + 1, w - 4, h - ch - 3, dish, Object.assign({ pad: 9, hp: 13, bp: 8 }, opt));
    return s;
  }

  const counter = (o, cx1, cx2, yb, yf, ins) => `<g class="hda-bg">${counter0(o, cx1, cx2, yb, yf, ins)}</g>`;
  function counter0(o, cx1, cx2, yb, yf, ins) {
    const u = o.uid;
    return `<rect x="4" y="4" width="192" height="40" rx="6" fill="url(#${u}-tile)"/><rect x="4" y="4" width="192" height="40" rx="6" fill="#fff" fill-opacity=".03"/>` +
      `<path d="M4 44H196V138H4Z" fill="url(#${u}-ct)"/><path d="M4 44H196" stroke="#000" stroke-opacity=".3"/>` +
      `<path d="M14 60C40 58 60 66 90 64M110 120C140 118 160 126 190 122" stroke="#fff" stroke-opacity=".18" fill="none"/><path d="M4 138H196V144H4Z" fill="url(#${u}-cte)"/>` +
      `<rect x="4" y="144" width="192" height="30" fill="url(#${u}-cab)"/><path d="M4 152H196" stroke="#000" stroke-opacity=".0"/><path d="M68 144V174M132 144V174" stroke="#000" stroke-opacity=".5"/><path d="M69 144V174M133 144V174" stroke="#fff" stroke-opacity=".07"/>` +
      [36, 100, 164].map((x) => `<rect x="${x - 12}" y="150" width="24" height="2.6" rx="1.3" fill="url(#${u}-st)"/>`).join("") +
      `<rect x="4" y="174" width="192" height="4" fill="#0d0e10"/><rect x="4" y="178" width="192" height="18" rx="4" fill="url(#${u}-flr)"/>`;
  }

  const ic = (id, name, first, render, list) => ({ id, name, colors: sw(first, list), picker: true, colorLabel: "Finish", render });
  const RETRO = [MI, CR, RD, BB, YL, BK];
  const PRO = [SS, BK, WH, NV, GN, BU];
  const EUR = [NV, BU, GN, CR, BK, FB];

  const icons = [
    ic("electric", "Electric range", WH, (o) => { const c = { x1: 52, x2: 148, top: "glass", back: { y: 54, kind: "paint", panel: [64, 59, 72, 11] },
      burners: [[.25, .28, 12, "rad", true, "pot"], [.75, .25, 10, "rad", false], [.27, .8, 10, "rad", false], [.74, .8, 13, "rad", true]],
      doors: [{ y: 98, h: 60, dish: "roast" }], drawer: [160, 11] };
      return svg(o, range(o, c) + shimmer(o, 125, 82, 30, 22, 3)); }, [WH, SS, BK, BSS, SL]),

    ic("coil", "Coil range", AL, (o) => { const c = { x1: 52, x2: 148, top: "paint", back: { y: 52, kind: "paint", knobs: [64, 75, 125, 136], kr: 4.2, kt: "wh", panel: [88, 58, 24, 11], keys: 0 },
      burners: [[.25, .25, 10, "coil", true, "kettle"], [.75, .25, 10, "coil", false], [.25, .78, 13, "coil", false], [.75, .78, 13, "coil", true]],
      doors: [{ y: 98, h: 60, dish: "cass", pad: 14, hp: 16, bp: 12 }], drawer: [160, 11] };
      return svg(o, range(o, c) + shimmer(o, 125, 84, 30, 22, 3)); }, [AL, WH, BK, SS, SL]),

    ic("gas", "Gas range", SS, (o) => { const c = { x1: 50, x2: 150, top: "iron", grate: "cont", cols: [.36, .64], back: { y: 62, kind: "paint", panel: [84, 64, 32, 8], keys: 0 },
      burners: [[.18, .26, 10, "gas", true, "pot"], [.18, .8, 12, "gas", false], [.5, .53, 13, "gas", true], [.82, .26, 10, "gas", false], [.82, .8, 12, "gas", true]],
      front: { y: 94, h: 11, knobs: [60, 72, 128, 140, 100], kr: 3.8 }, doors: [{ y: 107, h: 54, dish: "pizza" }], drawer: [163, 8] };
      return svg(o, range(o, c)); }),

    ic("slidein", "Slide-in range", BSS, (o) => { const c = { x1: 50, x2: 150, yb: 72, top: "paint", grate: "cont", cols: [.5],
      burners: [[.25, .27, 11, "gas", true, "egg"], [.75, .27, 11, "gas", false], [.25, .79, 12, "gas", false], [.75, .79, 13, "gas", true, "lid"]],
      front: { y: 94, h: 12, knobs: [59, 70, 81, 119, 130, 141], kr: 3.5, panel: [88, 96, 24, 8], keys: 0 }, doors: [{ y: 108, h: 62, dish: "bread", glass: true, pad: 6, hp: 12 }] };
      return svg(o, range(o, c)); }),

    ic("pro36", "Pro range 36\"", SS, (o) => { const c = { x1: 38, x2: 162, yb: 72, top: "steel", grate: "cont", cols: [.35, .67], back: { y: 62, kind: "steel" },
      burners: [[.17, .27, 10, "gas", true, "pot"], [.5, .27, 10, "gas", false], [.83, .27, 10, "gas", true], [.17, .79, 12, "gas", false], [.5, .79, 12, "gas", true, "pan"], [.83, .79, 12, "gas", false]],
      front: { y: 94, h: 13, knobs: [48, 62, 76, 124, 138, 152, 100], kr: 4.4, kt: "rd" }, doors: [{ y: 110, h: 54, dish: "roast", pad: 10, ht: 4.4, hp: 16 }] };
      return svg(o, range(o, c) + `<g opacity=".8">${[60, 80, 100, 120, 140].map((x) => `<rect x="${x - 6}" y="166" width="12" height="2" rx="1" fill="#000" fill-opacity=".45"/>`).join("")}</g>`); }, PRO),

    ic("pro48", "Pro range 48\"", SS, (o) => { const u = o.uid, slide = (o.opt || {}).type === "slide", c = { x1: 16, x2: 184, yb: 74, top: "steel", grate: "cont", cols: [.24, .44, .64], back: slide ? undefined : { y: 56, kind: "paint" },
      burners: [[.12, .27, 9, "gas", true, "lid"], [.34, .27, 9, "gas", false], [.54, .27, 9, "gas", true], [.12, .8, 11, "gas", false], [.34, .8, 11, "gas", true, "wok"], [.54, .8, 11, "gas", false]],
      front: { y: 94, h: 12, knobs: [26, 37, 48, 59, 70, 81, 104, 115, 130, 142, 160, 172], kr: 3.4, kt: "bk", ring: true, lit: 4 },
      doors: [{ x: 19, y: 108, w: 98, h: 58, dish: "roast", pad: 10, ht: 3.6 }, { x: 120, y: 108, w: 61, h: 58, dish: "pie", pad: 8, ht: 3.6 }] };
      const g = trap(118, 180, 76, 92, 2);
      const og = PT.grid, cakes = og.on ? [[134, 82], [150, 86], [164, 81]].map((p) => `<ellipse cx="${p[0]}" cy="${p[1] + 1}" rx="7.5" ry="2.8" fill="#8a5420"/><ellipse cx="${p[0]}" cy="${p[1]}" rx="7" ry="2.5" fill="#e0b46a"/><ellipse cx="${p[0] - 1.5}" cy="${p[1] - .4}" rx="3" ry="1" fill="#f4d9a0"/>`).join("") + shimmer(og, 150, 80, 50, 16, 4) : "";
      return svg(o, range(o, c) + `<path d="${g}" fill="#2a2c30"/><path d="${trap(121, 177, 77.5, 90.5, 2)}" fill="url(#${u}-ci)"/>` +
        (og.on ? `<g opacity="${g2(og, .5)}"><path class="${P}pulse" d="${trap(121, 177, 77.5, 90.5, 2)}" fill="url(#${u}-ho)"/></g>` : "") + `<path d="M121 90H177" stroke="#000" stroke-width="1.4"/>` + cakes +
        (slide ? "" : pnt(o, rr(18, 50, 164, 6, 1.5)) + `<path d="M20 51H180" stroke="#fff" stroke-opacity=".6"/>` + `<rect x="18" y="56" width="164" height="3" fill="#000" fill-opacity=".35"/>`)); }, PRO),

    ic("double", "Double-oven range", SL, (o) => { const c = { x1: 52, x2: 148, top: "glass", back: { y: 56, kind: "glass", panel: [60, 58, 80, 14], keys: 3 },
      burners: [[.25, .27, 11, "rad", false], [.75, .27, 10, "rad", true, "pot"], [.25, .79, 13, "rad", true, "veg"], [.75, .79, 11, "rad", false]],
      doors: [{ y: 97, h: 30, dish: "cookie", pad: 9, hp: 10, bp: 4, top: true }, { y: 129, h: 41, dish: "cass", hp: 11, bp: 5 }] };
      return svg(o, range(o, c)); }, [SL, BSS, SS, WH, BK]),

    ic("induction", "Induction range", BK, (o) => { const u = o.uid, c = { x1: 50, x2: 150, yb: 72, top: "glass",
      burners: [[.25, .27, 11, "ind", true, "pot"], [.75, .27, 10, "ind", false], [.25, .79, 12, "ind", false], [.74, .79, 13, "ind", true, "egg"]],
      doors: [{ y: 104, h: 66, dish: "pie", glass: true, pad: 6, hp: 12 }] };
      let keys = ""; for (let i = 0; i < 9; i++) { const x = 68 + i * 8, on = o.on && i < Math.round(9 * o.level); keys += `<rect x="${x - 2.4}" y="98" width="4.8" height="1.6" rx=".8" fill="${on ? "#ff7a3a" : "#fff"}" fill-opacity="${on ? 1 : .18}"/>`; }
      return svg(o, range(o, c) + `<path d="M50 94H150V103H50Z" fill="url(#${u}-bg)"/>` + keys + dot(o, 58, 98.8, 1.6, true) + dot(o, 142, 98.8, 1.6, false) +
        `<path d="M50 94.6H150" stroke="#fff" stroke-opacity=".35" stroke-width=".7"/>`); }, [BK, WH, SS, BSS, SL]),

    ic("retro", "Retro range", MI, (o) => { const u = o.uid, c = { x1: 34, x2: 166, yb: 76, yf: 96, top: "paint", bot: 166, grate: "each",
      burners: [[.14, .3, 9, "gas", true, "lid"], [.38, .3, 9, "gas", false], [.14, .78, 10, "gas", false], [.38, .78, 10, "gas", true]],
      doors: [{ x: 38, y: 112, w: 72, h: 50, dish: "pie", r: 6, pad: 10, hp: 14, bp: 9 }] };
      const ang = (a) => [n1(100 + Math.sin(a) * 8), n1(54 - Math.cos(a) * 8)];
      const hh = ang(-.9), mm = ang(2.2);
      return svg(o, range(o, c) +
        pnt(o, `M42 76V48Q42 34 56 34H144Q158 34 158 48V76Z`) + gloss(o, 42, 34, 116, 42) + `<path d="M44 76V48Q44 36 56 36H144Q156 36 156 48V76" fill="none" stroke="url(#${u}-cr)" stroke-width="1.6"/>` +
        `<circle cx="100" cy="54" r="13" fill="url(#${u}-cr)"/><circle cx="100" cy="54" r="10.6" fill="#f8f4ea"/>` + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => { const a = i * Math.PI / 6; return `<circle cx="${n1(100 + Math.sin(a) * 9)}" cy="${n1(54 - Math.cos(a) * 9)}" r=".55" fill="#3a3a3a"/>`; }).join("") +
        `<path d="M100 54L${hh[0]} ${hh[1]}M100 54L${mm[0]} ${mm[1]}" stroke="#222" stroke-width="1.2" stroke-linecap="round" transform="scale(1)"/><circle cx="100" cy="54" r="1" fill="#b3302b"/><path d="M92 47Q98 43 106 46" stroke="#fff" stroke-opacity=".7" fill="none"/>` +
        knob(o, 62, 56, 4, "wh", false) + knob(o, 138, 56, 4, "wh", false) + dot(o, 76, 56, 1.6, true) + `<rect x="114" y="52" width="14" height="7" rx="1" fill="#1a1b1e"/>` + lcd(o, 121, 55.5, 4.4, "#ff9a4a") +
        `<path d="${trap(98, 162, 78, 94, 3)}" fill="url(#${u}-cr)"/><path d="M104 86H156" stroke="#fff" stroke-opacity=".6"/><path d="M98 93H162" stroke="#000" stroke-opacity=".3"/><rect x="126" y="80" width="8" height="2.4" rx="1.2" fill="#1a1b1e"/>` +
        `<rect x="34" y="97" width="132" height="12" fill="url(#${u}-cr)"/>` + [48, 62, 76, 124, 138, 152].map((x, i) => knob(o, x, 103, 3.6, "wh", i === 0 || i === 3 ? undefined : false)).join("") +
        `<path d="${rr(116, 112, 46, 22, 5)}" fill="none" stroke="url(#${u}-cr)" stroke-width="1.6"/><path d="${rr(116, 138, 46, 24, 5)}" fill="none" stroke="url(#${u}-cr)" stroke-width="1.6"/><rect x="128" y="116" width="22" height="2.6" rx="1.3" fill="url(#${u}-stv)"/><rect x="128" y="142" width="22" height="2.6" rx="1.3" fill="url(#${u}-stv)"/>` +
        `<path d="M34 164H166" stroke="url(#${u}-cr)" stroke-width="2"/>` + [42, 158].map((x) => `<rect x="${x - 4}" y="166" width="8" height="10" rx="2" fill="url(#${u}-st)"/>`).join("") +
        `<path d="M36 96Q34 96 34 100" stroke="#fff" stroke-opacity=".4" fill="none"/>`); }, RETRO),

    ic("french", "French range", NV, (o) => { const u = o.uid, c = { x1: 22, x2: 178, yb: 74, top: "iron", grate: "each", back: { y: 64, kind: "steel" },
      burners: [[.11, .3, 9, "gas", true], [.11, .78, 10, "gas", false, "pan"], [.5, .55, 14, "gas", true, "pot", 1.3], [.89, .3, 9, "gas", false], [.89, .78, 10, "gas", true]],
      front: { y: 94, h: 13, knobs: [36, 52, 68, 132, 148, 164, 100], kr: 4.4, kt: "bz" },
      doors: [{ x: 26, y: 118, w: 96, h: 50, dish: "bread", hk: "bz", hp: 12, handle: false }, { x: 126, y: 118, w: 48, h: 50, dish: "cass", hk: "bz", hp: 12, handle: false }] };
      return svg(o, range(o, c) + `<path d="M22 74H178" stroke="url(#${u}-bz)" stroke-width="1.6"/>` + bar(o, 26, 174, 110, 3.4, "bz") +
        [26, 126].map((x, i) => `<path d="${rr(x + 5, 128, i ? 38 : 86, 33, 3)}" fill="none" stroke="url(#${u}-bz)" stroke-width="1.4"/><rect x="${x + 10}" y="121" width="${i ? 28 : 76}" height="3" rx="1.5" fill="url(#${u}-bz)"/>`).join("") +
        `<rect x="22" y="168" width="156" height="4" fill="url(#${u}-bz)"/>` + [28, 172].map((x) => `<rect x="${x - 4}" y="172" width="8" height="6" fill="url(#${u}-bz)"/>`).join("")); }, EUR),

    ic("wall", "Wall oven", SS, (o) => svg(o, tall(o, 42, 158, 54, 152) + unit(o, 0, 42, 158, 54, 98, "roast", { fan: true, ch: 13 }) + shimmer(o, 100, 52, 60, 16, 4))),

    ic("wall2", "Double wall oven", BSS, (o) => svg(o, tall(o, 44, 156, 18, 166) + unit(PT.oven, 0, 44, 156, 18, 74, "cookie", { ch: 12, top: true }) + unit(PT.oven2, 1, 44, 156, 93, 73, "cass", { ch: 0, fan: true }))),

    ic("combo", "Oven combo", BK, (o0) => { const o = PT.mw, u = o.uid, d = rr(50, 28, 76, 38, 2);
      let mw = pnt(o, rr(46, 24, 108, 46, 1.5)) + `<path d="${rr(48, 26, 104, 42, 1.5)}" fill="url(#${u}-bg)"/><clipPath id="${u}-mwc"><path d="${d}"/></clipPath><path d="${d}" fill="#07080a"/><g clip-path="url(#${u}-mwc)">` +
        (o.on ? `<g opacity="${g2(o)}"><path class="${P}glow" d="${d}" fill="url(#${u}-mw)"/></g>` : "") +
        `<ellipse cx="88" cy="60" rx="26" ry="4" fill="#d8dde2" fill-opacity="${o.on ? ".8" : ".12"}"/><g class="${o.on ? P + "turn" : ""}"><path d="M80 59Q88 64 96 59L95 52H81Z" fill="#c8402e"/><ellipse cx="88" cy="52" rx="7.4" ry="1.6" fill="#e86a3e"/></g>` +
        (o.on ? steam(o, 88, 50, 10, 2, .6) : `<path d="${d}" fill="#000" opacity=".65"/>`) + `</g><path d="${d}" fill="url(#${u}-gl)" opacity=".6"/><path d="${d}" fill="url(#${u}-perf)" opacity=".5"/>` +
        `<path d="${rr(130, 30, 18, 34, 1.5)}" fill="#0b0c0f"/>` + lcd(o, 139, 35, 4.2, "#7dd3fc", o.on ? Math.round(1 + 4 * o.level) + ":" + String(10 + Math.round(45 * o.level)) : "0:00") +
        [0, 1, 2, 3].map((r) => [0, 1, 2].map((c) => `<circle cx="${133 + c * 6}" cy="${43 + r * 5}" r="1.3" fill="#fff" fill-opacity=".2"/>`).join("")).join("") + `<rect x="126" y="28" width="2" height="38" rx="1" fill="url(#${u}-st)"/>`;
      return svg(o, tall(o, 46, 154, 24, 164) + mw + unit(PT.oven, 0, 46, 154, 72, 92, "pizza", { ch: 12, fan: true })); }, [BK, SS, BSS, WH, SL]),

    ic("steam", "Steam oven", WH, (o) => { const u = o.uid, wd = rr(46, 130, 108, 22, 1.5);
      return svg(o, tall(o, 44, 156, 50, 152) + pnt(o, rr(44, 50, 112, 76, 1.5)) + `<path d="${rr(46, 52, 108, 72, 1.5)}" fill="url(#${u}-bg)"/>` +
        lcd(o, 100, 58, 5, "#9ad7ff", o.on ? Math.round(120 + 92 * o.level) : null) + dot(o, 60, 58, 1.4, true, "#9ad7ff") + dot(o, 140, 58, 1.4, false) +
        ovwin(o, 0, 54, 64, 92, 52, 2.5, "veg", { cool: true }) +
        pnt(o, rr(44, 128, 112, 26, 1.5)) + `<path d="${wd}" fill="url(#${u}-bg)"/>` + (o.on ? `<g opacity="${g2(o, .35)}"><path class="${P}pulse" d="${rr(56, 138, 88, 10, 2)}" fill="url(#${u}-ho)"/></g>` : "") +
        `<rect x="76" y="133" width="48" height="2.2" rx="1.1" fill="url(#${u}-st)"/><path d="M48 131H152" stroke="#fff" stroke-opacity=".15"/>` +
        `<path d="${rr(134, 116, 16, 5, 1)}" fill="#7dd3fc" fill-opacity="${o.on ? ".55" : ".15"}"/><path d="M135 117.5H149" stroke="#fff" stroke-opacity=".4"/>` + shimmer(o, 100, 50, 50, 14, 3)); }, [WH, SS, BK, BSS, SL]),

    ic("gastop", "Cooktop", SS, (o) => { K = .58; try { const u = o.uid, op = o.opt || {}, fuel = op.fuel || "gas", nb = op.burners || "5", td = trap(34, 166, 56, 126, 12);
      const LAY = { "4": [[1, .22, .24, 16, ""], [2, .78, .24, 15, ""], [4, .22, .78, 17, "egg"], [5, .78, .78, 18, "pot"]],
        "5": [[1, .18, .22, 15, ""], [2, .82, .22, 15, ""], [3, .5, .5, 19, "wok"], [4, .18, .8, 17, "egg"], [5, .82, .8, 17, "pot"]],
        "6": [[1, .16, .24, 14, ""], [7, .5, .24, 14, ""], [2, .84, .24, 14, ""], [4, .16, .78, 16, "egg"], [6, .5, .78, 17, "wok"], [5, .84, .78, 16, "pot"]] }[nb] || [];
      const L = LAY.map((b) => { const q = bp(34, 166, 56, 126, 12, b[1], b[2]); return { z: PT.bs[b[0] - 1], x: +q[0], y: +q[1], s: b[3] * q[2], cw: fuel !== "gas" && b[4] === "wok" ? "pot" : b[4] }; });
      const cw = (b) => b.cw === "pot" ? pot(b.z, b.x, b.y - 2, b.s * 1.5, b.s * .8) : b.cw === "wok" ? wok(b.z, b.x, b.y - 2, b.s * 2.1) : b.cw === "egg" ? pan(b.z, b.x, b.y - 2, b.s * 1.7, "egg") : "";
      let s = counter(o) + `<path d="${trap(30, 170, 53, 130, 12)}" fill="#000" fill-opacity=".3"/>`;
      if (fuel === "gas") { const cols = nb === "4" ? [.5] : nb === "6" ? [.33, .67] : [.36, .64];
        s += pnt(o, td, "tp") + `<path d="${trap(38, 162, 59, 122, 11)}" fill="#0e0f11" fill-opacity=".55"/>` + L.map((b) => gb(b.z, b.x, b.y, b.s, true, { n: 14 })).join("") +
          `<path d="${trap(39, 161, 60, 121, 11)}" fill="none" stroke="#08090a" stroke-width="3"/><path d="M39 90H161" stroke="#08090a" stroke-width="2.6"/>` +
          cols.map((c) => { const p0 = bp(38, 162, 59, 122, 11, c, 0), p1 = bp(38, 162, 59, 122, 11, c, 1); return `<path d="M${p0[0]} ${p0[1]}L${p1[0]} ${p1[1]}" stroke="#08090a" stroke-width="2.6"/><path d="M${p0[0]} ${+p0[1] - .8}L${p1[0]} ${+p1[1] - .8}" stroke="#4d5056" stroke-width=".7"/>`; }).join("") +
          L.map((b) => `<path d="M${n1(b.x - b.s * .9)} ${b.y}H${n1(b.x + b.s * .9)}M${b.x} ${n1(b.y - b.s * .5)}V${n1(b.y + b.s * .5)}" stroke="#08090a" stroke-width="2.2"/>`).join(""); }
      else s += pnt(o, trap(31, 169, 54, 129, 12)) + `<path d="${trap(35, 165, 57, 125, 11)}" fill="url(#${u}-bgt)"/><path d="M60 57L52 125H70L74 57Z" fill="#fff" fill-opacity=".06"/>` +
        L.map((b) => fuel === "electric" ? rz(b.z, b.x, b.y, b.s, true) : iz(b.z, b.x, b.y, b.s, true, true)).join("");
      return svg(o, s + L.map(cw).join("") + `<path d="${trap(30, 170, 53, 130, 12)}" fill="none" stroke="#fff" stroke-opacity=".25"/>`); } finally { K = .34; } }),

    ic("indtop", "Induction cooktop", BK, (o) => { K = .58; try { const u = o.uid, p = pal(o.color), td = trap(36, 164, 56, 126, 12);
      const Z = (uu, v, s, i, cw) => { const z = PT.bs[i], q = bp(36, 164, 56, 126, 12, uu, v), x = +q[0], y = +q[1], sz = s * q[2]; let r = iz(z, x, y, sz, true, true);
        if (cw === "pot") r += pot(z, x, y - 2, sz * 1.5, sz * 1.0); if (cw === "pan") r += pan(z, x, y - 2, sz * 1.7, "veg"); return r; };
      let slider = ""; for (let i = 0; i < 10; i++) { const on = o.on && i < Math.round(10 * o.level); slider += `<rect x="${78 + i * 4.6}" y="119" width="3.4" height="1.6" rx=".8" fill="${on ? "#ff7a3a" : "#fff"}" fill-opacity="${on ? 1 : .2}"/>`; }
      return svg(o, counter(o) + `<path d="${trap(33, 167, 54, 128, 12)}" fill="#000" fill-opacity=".3"/>` +
        `<linearGradient id="${u}-ig" x1="0" x2="1"><stop offset="0" stop-color="${H().shade(o.color, -.35)}"/><stop offset=".45" stop-color="${H().shade(o.color, .12)}"/><stop offset=".6" stop-color="${p.d}"/><stop offset="1" stop-color="${p.k}"/></linearGradient>` +
        `<path d="${td}" fill="url(#${u}-ig)"/><path d="M60 56L52 126H70L74 56Z" fill="#fff" fill-opacity=".06"/>` +
        Z(.22, .24, 15, 0, "pot") + Z(.78, .24, 13, 1) + Z(.24, .74, 17, 2) + Z(.76, .74, 19, 3, "pan") +
        `<path d="M100 66V112" stroke="#fff" stroke-opacity=".1" stroke-dasharray="2 2"/>` + slider + dot(o, 66, 119.8, 1.6, true) + dot(o, 134, 119.8, 1.6, false) +
        `<path d="${td}" fill="none" stroke="#fff" stroke-opacity=".3"/>`); } finally { K = .34; } }, [BK, WH, "#6e7178", BSS, "#3a3f4a"]),

    ic("rangetop", "Rangetop", BK, (o) => { const og = PT.grid, u = o.uid, c = { x1: 28, x2: 172, yb: 74, yf: 96, ins: 5, grate: "cont", cols: [.3] };
      let s = kit(o, 28, 172, 74, 96, 5) + steel(o, trap(28, 172, 74, 96, 5)) + `<path d="${trap(30, 108, 75.5, 94.5, 5)}" fill="#0e0f11" fill-opacity=".5"/>` +
        burners(o, Object.assign({}, c, { x1: 28, x2: 112 }), [[.27, .28, 10, "gas", true, "pot"], [.75, .28, 10, "gas", false], [.27, .8, 12, "gas", false], [.75, .8, 12, "gas", true, "pan"]]) +
        `<path d="${trap(31, 109, 75.2, 94.8, 5)}" fill="none" stroke="#08090a" stroke-width="2.6"/><path d="M70 76V94" stroke="#08090a" stroke-width="2.4"/>`;
      const gd = trap(114, 168, 76, 94, 3);
      s += `<path d="${gd}" fill="#0b0b0c"/>` + (og.on ? `<g opacity="${g2(og)}"><path class="${P}pulse" d="${gd}" fill="url(#${u}-ho)"/></g>` + fire(og, 118, 164, 93, 9, 7) : "") +
        Array.from({ length: 9 }, (_, i) => `<path d="M${117 + i * 6} 77L${115 + i * 6.4} 93" stroke="#1a1b1e" stroke-width="2.2"/><path d="M${117 + i * 6} 76.6L${115 + i * 6.4} 92.6" stroke="#5a5d63" stroke-width=".6"/>`).join("") +
        (og.on ? `<path d="M128 83c0 -4 14 -4 14 0s-14 4 -14 0Z" fill="#8a3a1c"/><path d="M131 81l3 4M135 80l3 4M139 80.5l2 3" stroke="#3a160a" stroke-width="1"/><path d="M148 88c0 -3.6 12 -3.6 12 0s-12 3.6 -12 0Z" fill="#9a4a24"/><path d="M151 86l3 3.4M155 85.5l3 3.4" stroke="#3a160a" stroke-width="1"/>` + smoke(og, 145, 76, 3) : "");
      s += `<path d="M28 96H172" stroke="#fff" stroke-opacity=".5"/>` + pnt(o, "M28 96H172V114H28Z") + [40, 54, 68, 82, 96, 118, 140, 160].map((x, i) => knob(o, x, 105, 4.2, "rd", i === 0 || i === 3 || i >= 5 ? true : false)).join("") +
        `<g class="hda-bg"><rect x="28" y="114" width="144" height="58" fill="url(#${u}-cab)"/><path d="M28 140H172M100 114V172" stroke="#000" stroke-opacity=".5"/><path d="M28 141H172" stroke="#fff" stroke-opacity=".07"/>` +
        [[64, 125], [136, 125], [64, 154], [136, 154]].map((p) => `<rect x="${p[0] - 12}" y="${p[1]}" width="24" height="2.6" rx="1.3" fill="url(#${u}-st)"/>`).join("") + kick(o, 25, 175, 172) + `</g>`;
      return svg(o, s); }, PRO),

    ic("pizza", "Outdoor pizza oven", BK, (o) => { const u = o.uid, p = pal(o.color), mouth = "M50 140V122Q50 108 66 108H122Q134 108 134 120V140Z", cl = `${u}-pm`;
      return svg(o, `<g class="hda-bg"><rect x="4" y="4" width="192" height="146" rx="6" fill="#fff" fill-opacity=".025"/><path d="M4 120C40 112 70 118 100 114S170 110 196 116V150H4Z" fill="#2f4a32" fill-opacity=".35"/>` +
        `<rect x="10" y="150" width="180" height="9" rx="2" fill="url(#${u}-wd)"/><rect x="10" y="150" width="180" height="9" fill="url(#${u}-grn)"/><path d="M10 150.6H190" stroke="#fff" stroke-opacity=".25"/><path d="M24 159V194M176 159V194" stroke="#3a2818" stroke-width="5"/><rect x="10" y="159" width="180" height="3" fill="#000" fill-opacity=".35"/></g>` +
        sh(o, 100, 151, 74, 4) + `<path d="M44 146L40 151M146 146L150 151" stroke="#1a1b1e" stroke-width="3" stroke-linecap="round"/>` +
        `<rect x="146" y="40" width="10" height="44" fill="url(#${u}-st)"/><rect x="143" y="36" width="16" height="5" rx="1" fill="#2a2c30"/>` + smoke(o, 151, 34, 3) +
        `<path d="M40 146V100Q40 70 76 66H140Q164 66 164 92V146Z" fill="url(#${u}-c)"/><path d="M40 146V100Q40 70 76 66H140Q164 66 164 92V146Z" fill="url(#${u}-fx)"/>` + (metal(o) ? `<path d="M40 146V100Q40 70 76 66H140Q164 66 164 92V146Z" fill="url(#${u}-br)"/>` : "") +
        `<path d="M46 98Q48 74 78 71H138" stroke="#fff" stroke-opacity=".4" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M40 146H164" stroke="${p.k}" stroke-width="2"/>` +
        `<path d="M44 144V122Q44 102 64 102H124Q140 102 140 118V144Z" fill="${p.k}"/><clipPath id="${cl}"><path d="${mouth}"/></clipPath><path d="${mouth}" fill="#0a0807"/><g clip-path="url(#${cl})">` +
        (o.on ? `<g opacity="${g2(o)}"><path class="${P}glow" d="${mouth}" fill="url(#${u}-ov)"/></g>` + fire(o, 50, 70, 136, 34, 3, 7) + `<path class="${P}flk" d="M50 118C62 104 86 106 110 109C96 112 78 112 66 122Z" fill="url(#${u}-fm)" opacity="${g2(o, .85)}"/><path class="${P}flk" d="M52 114C66 106 90 108 118 112C100 113 80 114 62 120Z" fill="url(#${u}-fc)" opacity="${g2(o, .6)}" style="animation-delay:-.4s"/>` : "") +
        `<rect x="50" y="134" width="84" height="6" fill="#6a4a3a"/><rect x="50" y="134" width="84" height="1" fill="#fff" fill-opacity=".15"/>` +
        `<ellipse cx="94" cy="134" rx="22" ry="3.4" fill="#d9a35a"/><ellipse cx="94" cy="133.6" rx="18" ry="2.6" fill="#c43a22"/>` + [-10, -3, 4, 11].map((d, i) => `<ellipse cx="${94 + d}" cy="${133.4 - (i % 2) * .6}" rx="2.6" ry="1" fill="#f6e2a0"/>`).join("") + `<ellipse cx="88" cy="132.6" rx="1.6" ry=".8" fill="#3f8a3a"/><ellipse cx="102" cy="133.6" rx="1.6" ry=".8" fill="#3f8a3a"/>` +
        (o.on ? "" : `<path d="${mouth}" fill="#000" opacity=".7"/>`) + `</g><path d="${mouth}" fill="none" stroke="#000" stroke-opacity=".6" stroke-width="1.4"/>` +
        `<circle cx="152" cy="118" r="7" fill="url(#${u}-cr)"/><circle cx="152" cy="118" r="5.4" fill="#f4f2ec"/><path d="M152 118L${n1(152 + Math.sin((-110 + 220 * (o.on ? o.level : 0)) * Math.PI / 180) * 4.4)} ${n1(118 - Math.cos((-110 + 220 * (o.on ? o.level : 0)) * Math.PI / 180) * 4.4)}" stroke="#c8231b" stroke-width="1" stroke-linecap="round"/>` +
        knob(o, 152, 136, 4.4, "bk") + shimmer(o, 92, 64, 60, 22, 4)); }, [BK, SS, "#c75b2a", CR, "#3f6b56", "#7f8790"]),

    { id: "dome", name: "Dome pizza oven", colors: ["#b9673f", "#e2d6bf", "#8a8f96", "#2f3135", "#a33c2f", "#6f8a6a"], picker: true, colorLabel: "Dome", render(o) {
      const u = o.uid, p = pal(o.color), arch = "M76 134V112A24 22 0 0 1 124 112V134Z", cl = `${u}-da`;
      let stones = ""; for (let r = 0; r < 4; r++) for (let x = 30 + (r % 2) * 9; x < 168; x += 18) stones += `<path d="${rr(x, 138 + r * 10, 16, 8.4, 2.2)}" fill="${["#8a8379", "#9b948a", "#7a746b", "#a59e93"][(x + r) % 4]}"/>`;
      let vous = ""; for (let i = 0; i <= 8; i++) { const a = Math.PI + i * Math.PI / 8, x1 = 100 + Math.cos(a) * 24, y1 = 112 + Math.sin(a) * 22, x2 = 100 + Math.cos(a) * 31, y2 = 112 + Math.sin(a) * 28;
        vous += `<path d="M${n1(x1)} ${n1(y1)}L${n1(x2)} ${n1(y2)}" stroke="#3a2418" stroke-width=".9"/>`; }
      return svg(o, `<g class="hda-bg"><rect x="4" y="4" width="192" height="186" rx="6" fill="#fff" fill-opacity=".025"/><rect x="4" y="178" width="192" height="18" rx="4" fill="#3a3530"/><path d="M4 184H196M40 178V184M100 184V196M150 178V184" stroke="#000" stroke-opacity=".35"/>` +
        `<path d="M10 178C14 150 22 132 30 120C26 140 28 160 30 178Z" fill="#2f5a34"/><path d="M14 178C20 156 26 146 36 138C30 154 30 166 30 178Z" fill="#3f7a44"/></g>` +
        sh(o, 100, 178, 80, 4) + `<rect x="26" y="134" width="148" height="44" fill="#5a544c"/>` + stones + `<rect x="22" y="128" width="156" height="8" rx="1.5" fill="url(#${u}-ct)"/><path d="M22 128.6H178" stroke="#fff" stroke-opacity=".4"/>` +
        `<rect x="93" y="22" width="14" height="44" fill="url(#${u}-st)"/><path d="M88 22H112L106 16H94Z" fill="#2a2c30"/>` + smoke(o, 100, 16, 4) +
        `<path d="M36 130C36 76 66 50 100 50S164 76 164 130Z" fill="url(#${u}-c)"/><path d="M36 130C36 76 66 50 100 50S164 76 164 130Z" fill="url(#${u}-fx)"/>` +
        `<path d="M50 104C54 78 74 60 100 57" stroke="#fff" stroke-opacity=".35" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M36 130H164" stroke="${p.k}" stroke-width="1.6"/>` +
        `<path d="M66 134V112A34 32 0 0 1 134 112V134Z" fill="#a8552f"/><path d="M66 134V112A34 32 0 0 1 134 112V134Z" fill="url(#${u}-fx)"/>` + vous +
        `<clipPath id="${cl}"><path d="${arch}"/></clipPath><path d="${arch}" fill="#0a0706"/><g clip-path="url(#${cl})">` +
        (o.on ? `<g opacity="${g2(o)}"><path class="${P}glow" d="${arch}" fill="url(#${u}-ov)"/></g>` : "") + logs(o, 80, 100, 128) + fire(o, 78, 104, 126, 30, 5, 2) +
        `<rect x="76" y="129" width="48" height="5" fill="#5a3a2a"/><ellipse cx="112" cy="129" rx="10" ry="2.2" fill="#d9a35a"/><ellipse cx="112" cy="128.7" rx="8" ry="1.6" fill="#c43a22"/><ellipse cx="110" cy="128.4" rx="1.6" ry=".6" fill="#f6e2a0"/><ellipse cx="115" cy="128.8" rx="1.6" ry=".6" fill="#f6e2a0"/>` +
        (o.on ? "" : `<path d="${arch}" fill="#000" opacity=".68"/>`) + `</g>` + sparks(o, [[92, 108], [86, 102, .7], [98, 112]])); } },

    { id: "woodstove", name: "Wood cook stove", colors: ["#2a2b2e", CR, "#355a45", RD, "#3d5b80", "#e9e5dc"], picker: true, colorLabel: "Enamel", render(o) {
      const u = o.uid, fb = rr(40, 104, 34, 26, 3), cl = `${u}-fb`;
      const ang = (-110 + 220 * (o.on ? o.level : 0)) * Math.PI / 180;
      return svg(o, `<g class="hda-bg"><rect x="4" y="4" width="192" height="172" rx="6" fill="#fff" fill-opacity=".03"/><rect x="4" y="80" width="192" height="96" fill="url(#${u}-tile)" opacity=".6"/>` +
        `<rect x="4" y="176" width="192" height="20" rx="4" fill="#5a2e22"/><path d="M4 182H196M4 189H196M30 176V182M70 182V189M110 176V182M150 182V189M190 176V182" stroke="#2a140c" stroke-width=".9"/></g>` +
        `<rect x="146" y="4" width="13" height="36" fill="url(#${u}-ci)"/><rect x="144" y="20" width="17" height="3" fill="#0d0e10"/>` + shimmer(o, 152, 34, 14, 26, 2) +
        `<path d="M40 50V84M156 50V84" stroke="url(#${u}-cr)" stroke-width="2.4"/>` + pnt(o, rr(38, 36, 120, 18, 2)) + `<path d="M38 54H158" stroke="url(#${u}-cr)" stroke-width="2"/><path d="M38 36H158" stroke="url(#${u}-cr)" stroke-width="1.6"/>` +
        `<path d="${rr(56, 40, 84, 10, 1.5)}" fill="none" stroke="url(#${u}-cr)"/><rect x="88" y="43.5" width="20" height="2.4" rx="1.2" fill="url(#${u}-stv)"/>` +
        sh(o, 98, 178, 74, 4) + `<path d="M36 156Q34 170 28 176M160 156Q162 170 168 176" stroke="#16171a" stroke-width="5" stroke-linecap="round" fill="none"/>` +
        `<path d="M30 84H166V92H30Z" fill="url(#${u}-ci)"/><path d="M30 84.6H166" stroke="#7a7d82" stroke-width=".8"/>` +
        (o.on ? `<g opacity="${g2(o, .7)}"><ellipse class="${P}pulse" cx="58" cy="88" rx="24" ry="5" fill="url(#${u}-ho)"/></g>` : "") +
        [52, 84, 116].map((x) => `<ellipse cx="${x}" cy="88" rx="11" ry="2.6" fill="none" stroke="#000" stroke-width="1.2"/><path d="M${x - 3} 88H${x + 3}" stroke="#000" stroke-width="1.4"/>`).join("") +
        pnt(o, "M34 92H162V156H34Z") + `<path d="M34 92H162" stroke="url(#${u}-cr)" stroke-width="1.8"/><path d="M34 156H162" stroke="url(#${u}-cr)" stroke-width="2.4"/>` +
        `<path d="${rr(37, 101, 40, 32, 3)}" fill="url(#${u}-ci)"/><clipPath id="${cl}"><path d="${fb}"/></clipPath><path d="${fb}" fill="#0a0706"/><g clip-path="url(#${cl})">` +
        (o.on ? `<g opacity="${g2(o)}"><path class="${P}glow" d="${fb}" fill="url(#${u}-ov)"/></g>` : "") + logs(o, 44, 70, 126) + fire(o, 42, 72, 124, 22, 4) + (o.on ? "" : `<path d="${fb}" fill="#000" opacity=".6"/>`) + `</g>` +
        `<path d="${fb}" fill="url(#${u}-gl)" opacity=".5"/><path d="${fb}" fill="none" stroke="url(#${u}-cr)" stroke-width="1.4"/>` +
        `<path d="${rr(40, 138, 34, 14, 2)}" fill="url(#${u}-ci)"/><circle cx="57" cy="145" r="4.6" fill="url(#${u}-cr)"/>` + [0, 1, 2, 3, 4, 5].map((i) => `<path d="M57 145L${n1(57 + Math.cos(i * 1.047) * 4)} ${n1(145 + Math.sin(i * 1.047) * 4)}" stroke="#3a3d42" stroke-width=".7"/>`).join("") +
        pnt(o, rr(82, 100, 74, 52, 3)) + gloss(o, 82, 100, 74, 52) + `<path d="${rr(82, 100, 74, 52, 3)}" fill="none" stroke="url(#${u}-cr)" stroke-width="1.6"/><path d="${rr(88, 106, 62, 40, 2)}" fill="none" stroke="#000" stroke-opacity=".25"/>` +
        `<circle cx="119" cy="122" r="10" fill="url(#${u}-cr)"/><circle cx="119" cy="122" r="8" fill="#f4f0e4"/>` + [-110, -55, 0, 55, 110].map((d) => { const a = d * Math.PI / 180; return `<path d="M${n1(119 + Math.sin(a) * 6)} ${n1(122 - Math.cos(a) * 6)}L${n1(119 + Math.sin(a) * 7.4)} ${n1(122 - Math.cos(a) * 7.4)}" stroke="#333" stroke-width=".7"/>`; }).join("") +
        `<path d="M119 122L${n1(119 + Math.sin(ang) * 6.4)} ${n1(122 - Math.cos(ang) * 6.4)}" stroke="#c8231b" stroke-width="1.1" stroke-linecap="round"/><circle cx="119" cy="122" r="1.1" fill="#222"/><path d="M113 116Q117 114 122 115" stroke="#fff" stroke-opacity=".8" fill="none" stroke-width=".7"/>` +
        `<rect x="88" y="138" width="62" height="3.4" rx="1.7" fill="url(#${u}-stv)"/>` + hl(36, 96, 36, 152, 1.2, .3) +
        kettleW(o, 116, 84, 22) + sparks(o, [[58, 100], [52, 96, .7], [64, 98]])); } },
  ];
  const PARTS = {
    fb: [["back", "Back burners"], ["front", "Front burners"], ["oven", "Oven"]],
    co: [["cook", "Cooktop"], ["oven", "Oven"]],
    dbl: [["back", "Back burners"], ["front", "Front burners"], ["oven", "Upper oven"], ["oven2", "Lower oven"]],
    pro48: [["back", "Back burners"], ["front", "Front burners"], ["grid", "Griddle"], ["oven", "Ovens"]],
    wall2: [["oven", "Upper oven"], ["oven2", "Lower oven"]],
    combo: [["mw", "Microwave"], ["oven", "Oven"]],
    gastop: [["b1", "Left back"], ["b2", "Right back"], ["b4", "Left front"], ["b5", "Right front"], ["b3", "Center", { opt: "burners", is: "5" }], ["b6", "Center front", { opt: "burners", is: "6" }], ["b7", "Center back", { opt: "burners", is: "6" }]],
    indtop: [["b1", "Left back"], ["b2", "Right back"], ["b3", "Left front"], ["b4", "Right front"]],
    rangetop: [["cook", "Burners"], ["grid", "Charbroiler"]],
  };
  const KIND = { electric: "fb", coil: "fb", gas: "fb", slidein: "fb", pro36: "fb", pro48: "pro48", double: "dbl", induction: "fb", retro: "co", french: "co",
    wall2: "wall2", combo: "combo", gastop: "gastop", indtop: "indtop", rangetop: "rangetop" };
  icons.forEach((ic) => { const k = KIND[ic.id]; if (!k) return;
    ic.parts = PARTS[k].map((q) => Object.assign({ id: q[0], name: q[1] }, q[2] ? { when: q[2] } : {}));
    const R = ic.render; ic.render = (o) => { const prev = PT; PT = mkPT(o); try { return R(o); } finally { PT = prev; } }; });
  const OPTS = {
    pro48: [{ id: "type", name: "Type", values: [["free", "Freestanding"], ["slide", "Slide-in"]] }],
    gastop: [{ id: "fuel", name: "Fuel", values: [["gas", "Gas"], ["electric", "Electric"], ["induction", "Induction"]] }, { id: "burners", name: "Burners", values: [["5", "5"], ["4", "4"], ["6", "6"]] }],
  };
  icons.forEach((ic) => { if (OPTS[ic.id]) ic.options = OPTS[ic.id]; });
  function kettleW(o, cx, by, w) { return kettle(Object.assign({}, o, { kettle: "cr" }), cx, by, w); }

  (window.HDA = window.HDA || []).push({
    id: "range", tab: "Ranges & ovens", group: "Appliances", kind: "device",
    intro: "Twenty ranges, wall ovens, cooktops and pizza ovens. When running, gas burners flicker blue, electric and induction rings glow, pots steam, the oven window lights up warm with a dish on the rack, and the segment display shows the oven temperature (the slider sets the heat).",
    
    css, icons,
  });
})();
