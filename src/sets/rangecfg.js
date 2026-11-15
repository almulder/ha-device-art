(function () {
  const P = "hda-rangecfg-";
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
  // (parts) o.mf = a Multi-Function Image: o.parts holds only the ticked parts, a part left out is off (a Device Image: o.on, as today)
  function mkPT(o) {
    const p = o.parts || {}, has = (k) => p[k] != null, on0 = o.mf ? false : o.on, g = (k, d) => sub(o, has(k) ? p[k] : d == null ? on0 : d);
    const t = { oven: g("oven"), grid: g("grid"), mw: g("mw") };
    t.oven2 = has("oven2") ? g("oven2") : t.oven;
    t.cook = has("cook") ? g("cook") : (has("front") || has("back")) ? sub(o, p.front || p.back) : sub(o, on0);
    t.front = has("front") ? g("front") : t.cook; t.back = has("back") ? g("back") : t.cook;
    t.bs = [1, 2, 3, 4, 5].map((i) => has("b" + i) ? g("b" + i) : sub(o, on0));
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
    if (c.tc) { const tl = String(c.tc).toLowerCase(); s += tl === SS ? steel(o, td) : `<path d="${td}" fill="${c.tc}"/><path d="${td}" fill="url(#${u}-fx)"/><path d="M${x1 + ins + 10} ${yb}L${x1 + 22} ${yf}H${x1 + 34}L${x1 + ins + 20} ${yb}Z" fill="#fff" fill-opacity=".08"/>`; }
    else if (c.top === "glass") s += `<path d="${td}" fill="url(#${u}-bgt)"/><path d="M${x1 + ins + 10} ${yb}L${x1 + 22} ${yf}H${x1 + 34}L${x1 + ins + 20} ${yb}Z" fill="#fff" fill-opacity=".05"/>`;
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
.hda-rangecfg-flk{transform-box:fill-box;transform-origin:50% 100%}
.hda-anim .hda-rangecfg-flk{animation:hda-rangecfg-flk .9s ease-in-out infinite}
@keyframes hda-rangecfg-flk{0%,100%{transform:scale(1,1)}30%{transform:scale(.9,1.2)}60%{transform:scale(1.06,.84)}80%{transform:scale(.96,1.08)}}
.hda-anim .hda-rangecfg-glow{animation:hda-rangecfg-glow 3.2s ease-in-out infinite}
@keyframes hda-rangecfg-glow{0%,100%{opacity:1}50%{opacity:.8}}
.hda-anim .hda-rangecfg-pulse{animation:hda-rangecfg-pulse 2.6s ease-in-out infinite}
@keyframes hda-rangecfg-pulse{0%,100%{opacity:1}50%{opacity:.62}}
.hda-rangecfg-shim{opacity:.5}
.hda-anim .hda-rangecfg-shim{animation:hda-rangecfg-shim 2.6s linear infinite}
@keyframes hda-rangecfg-shim{0%{transform:translateY(6px);opacity:0}30%{opacity:.9}100%{transform:translateY(-12px);opacity:0}}
.hda-rangecfg-stm{opacity:.45;transform-box:fill-box;transform-origin:50% 100%}
.hda-anim .hda-rangecfg-stm{animation:hda-rangecfg-stm 3.4s ease-out infinite}
@keyframes hda-rangecfg-stm{0%{transform:translate(0,4px) scale(.45);opacity:0}25%{opacity:.85}100%{transform:translate(4px,-24px) scale(1.5);opacity:0}}
.hda-rangecfg-smk{opacity:.4;transform-box:fill-box;transform-origin:50% 100%}
.hda-anim .hda-rangecfg-smk{animation:hda-rangecfg-smk 5s ease-out infinite}
@keyframes hda-rangecfg-smk{0%{transform:translate(0,4px) scale(.5);opacity:0}20%{opacity:.7}100%{transform:translate(10px,-34px) scale(1.8);opacity:0}}
.hda-rangecfg-spin{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-rangecfg-spin{animation:hda-rangecfg-spin 1s linear infinite}
@keyframes hda-rangecfg-spin{to{transform:rotate(360deg)}}
.hda-anim .hda-rangecfg-turn{animation:hda-rangecfg-turn 5s ease-in-out infinite alternate}
@keyframes hda-rangecfg-turn{0%{transform:translateX(-7px)}100%{transform:translateX(7px)}}
.hda-anim .hda-rangecfg-emb{animation:hda-rangecfg-emb 2.2s ease-in-out infinite}
@keyframes hda-rangecfg-emb{0%,100%{opacity:.35}50%{opacity:1}}
.hda-rangecfg-spark{opacity:0}
.hda-anim .hda-rangecfg-spark{animation:hda-rangecfg-spark 2.4s ease-out infinite}
@keyframes hda-rangecfg-spark{0%{transform:translateY(0);opacity:0}15%{opacity:1}100%{transform:translateY(-24px);opacity:0}}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-rangecfg-flk,.hda-anim .hda-rangecfg-glow,.hda-anim .hda-rangecfg-pulse,.hda-anim .hda-rangecfg-shim,.hda-anim .hda-rangecfg-stm,.hda-anim .hda-rangecfg-smk,.hda-anim .hda-rangecfg-spin,.hda-anim .hda-rangecfg-turn,.hda-anim .hda-rangecfg-emb,.hda-anim .hda-rangecfg-spark{animation:none!important}}
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

  const css2 = css + `
.hda-rangecfg-up{opacity:.5}
.hda-anim .hda-rangecfg-up{animation:hda-rangecfg-up 2.2s ease-in infinite}
@keyframes hda-rangecfg-up{0%{transform:translate(0,10px);opacity:0}30%{opacity:.85}100%{transform:translate(0,-14px);opacity:0}}
.hda-rangecfg-outl{opacity:.5}
.hda-anim .hda-rangecfg-outl{animation:hda-rangecfg-outl 1.8s ease-out infinite}
@keyframes hda-rangecfg-outl{0%{transform:translate(0,0);opacity:0}25%{opacity:.85}100%{transform:translate(-14px,6px);opacity:0}}
.hda-anim .hda-rangecfg-outr{animation:hda-rangecfg-outr 1.8s ease-out infinite}
@keyframes hda-rangecfg-outr{0%{transform:translate(0,0);opacity:0}25%{opacity:.85}100%{transform:translate(14px,6px);opacity:0}}
`;
  const BG = (s) => `<g class="hda-bg">${s}</g>`;
  const FUEL = [["gas", "Gas"], ["coil", "Electric coil"], ["glass", "Glass smooth-top"], ["ind", "Induction"]];
  const first = (list, v) => list.filter((x) => x[0] === v).concat(list.filter((x) => x[0] !== v));
  const rangeOpts = (fuel) => [
    { id: "fuel", name: "Fuel", values: first(FUEL, fuel) },
    { id: "type", name: "Type", values: [["free", "Freestanding with backguard"], ["slide", "Slide-in"]] },
    { id: "burners", name: "Burners", values: [["4", "4"], ["5", "5"], ["6", "6 (36-inch pro)"]] },
    { id: "oven", name: "Oven", values: [["single", "Single"], ["double", "Double"]] }];
  const RPARTS = [{ id: "front", name: "Front burners" }, { id: "back", name: "Back burners" }, { id: "oven", name: "Oven" }, { id: "oven2", name: "Lower oven", when: { opt: "oven", is: "double" } }];

  function cfgRange(o, look) {
    const op = o.opt || {}, fuel = op.fuel || look.fuel, slide = op.type === "slide", nb = +(op.burners || 4), dbl = op.oven === "double";
    const wide = nb === 6, x1 = wide ? 36 : 50, x2 = wide ? 164 : 150, w = x2 - x1, bt = { gas: "gas", coil: "coil", glass: "rad", ind: "ind" }[fuel] || "gas";
    const BB = nb === 6 ? [[.17, .27, 10], [.5, .27, 10], [.83, .27, 10], [.17, .79, 12], [.5, .79, 12], [.83, .79, 12]]
      : nb === 5 ? [[.2, .26, 10], [.8, .26, 10], [.5, .53, fuel === "gas" ? 13 : 9], [.2, .8, 12], [.8, .8, 12]]
        : [[.25, .27, 10], [.75, .27, 11], [.25, .79, 13], [.75, .79, 12]];
    const burnersL = BB.map((b, i) => [b[0], b[1], b[2], bt, true, i === 0 ? "pot" : i === BB.length - 1 ? "pan" : undefined]);
    const c = { tc: look.tc ? o.color2 : null, x1, x2, yb: slide ? 72 : 74, top: fuel === "gas" ? (look.steelTop ? "steel" : "iron") : fuel === "coil" ? "paint" : "glass", burners: burnersL };
    if (fuel === "gas") { c.grate = "cont"; c.cols = nb === 4 ? [.5] : nb === 5 ? [.36, .64] : [.35, .67]; }
    const touch = fuel === "ind" || fuel === "glass";
    if (!slide) {
      if (look.back === "steel") c.back = { y: 62, kind: "steel" };
      else if (look.back === "paint") c.back = { y: 52, kind: "paint", knobs: [x1 + 12, x1 + 23, x2 - 23, x2 - 12], kr: 4, kt: look.kt || "wh", panel: [(x1 + x2) / 2 - 14, 58, 28, 11], keys: 0 };
      else c.back = { y: 54, kind: "glass", panel: [x1 + 10, 57, w - 20, 14], keys: 3 };
    }
    const fk = look.knobs || (slide && !touch), clk = look.clock && slide && fk, cx = (x1 + x2) / 2;
    if (fk) { const n = nb + 1, ks = [];
      if (clk) { const L = Math.ceil(n / 2), R = n - L; for (let i = 0; i < L; i++) ks.push(x1 + 11 + (cx - 18 - x1 - 11) * (L > 1 ? i / (L - 1) : 0)); for (let i = 0; i < R; i++) ks.push(cx + 18 + (x2 - 11 - cx - 18) * (R > 1 ? i / (R - 1) : 0)); }
      else for (let i = 0; i < n; i++) ks.push(x1 + 12 + (w - 24) * i / (n - 1));
      c.front = { y: 94, h: 12, knobs: ks.map((v) => +n1(v)), kr: wide ? 4 : 3.6, kt: look.kt || "ss" }; }
    else if (slide) c.front = { y: 94, h: 10, panel: [x1 + 28, 95.5, w - 56, 7], keys: 3, knobs: [] };
    const ds = c.front ? 108 : 98;
    if (dbl) { const h1 = Math.round((166 - ds) * .4); c.doors = [{ y: ds, h: h1, dish: "cookie", top: true, pad: 9, hp: 9, bp: 4, glass: look.glassDoor }, { y: ds + h1 + 2, h: 166 - ds - h1 - 2, dish: "cass", hp: 10, bp: 5, glass: look.glassDoor }]; }
    else { c.doors = [{ y: ds, h: 158 - ds, dish: "roast", glass: look.glassDoor, pad: 8, hp: 12 }]; c.drawer = [161, 9]; }
    const clock = clk ? `<path d="${rr(cx - 13, 96, 26, 8, 1.5)}" fill="url(#${o.uid}-bg)"/>` + lcd(o, cx, 100, 4.6, "#7dd3fc", Math.round(1 + 10 * o.level) + ":" + String(Math.round(59 * o.level)).padStart(2, "0")) : "";
    return range(o, c) + clock + (wide ? `<g opacity=".8">${[64, 82, 100, 118, 136].map((x) => `<rect x="${x - 6}" y="168" width="12" height="2" rx="1" fill="#000" fill-opacity=".45"/>`).join("")}</g>` : "");
  }
  const withPT = (render) => (o) => { const prev = PT; PT = mkPT(o); try { return render(o); } finally { PT = prev; } };

  function otrScene(o, kind) {
    const u = o.uid, off = sub(o, false);
    let s = `<rect x="4" y="4" width="192" height="192" rx="6" fill="#fff" fill-opacity=".03"/><rect x="4" y="100" width="192" height="44" fill="url(#${u}-tile)"/>` +
      `<rect x="4" y="4" width="192" height="26" fill="url(#${u}-cab)"/><path d="${rr(34, 7, 62, 20, 1.5)}${rr(104, 7, 62, 20, 1.5)}" fill="none" stroke="#000" stroke-opacity=".35"/>` +
      [[4, 22], [174, 22]].map((q) => `<rect x="${q[0]}" y="4" width="${q[1]}" height="100" fill="url(#${u}-cab)"/><path d="${rr(q[0] + 3, 8, q[1] - 6, 92, 1.5)}" fill="none" stroke="#000" stroke-opacity=".35"/>`).join("") +
      `<rect x="4" y="176" width="192" height="20" rx="4" fill="url(#${u}-flr)"/>`;
    if (kind === "none") s += `<path d="M4 140H196V148H4Z" fill="url(#${u}-ct)"/><rect x="4" y="148" width="192" height="28" fill="url(#${u}-cab)"/><path d="M68 148V176M132 148V176" stroke="#000" stroke-opacity=".45"/>`;
    else { const c = { x1: 40, x2: 160, yb: 140, yf: 154, ins: 6 }, td = trap(40, 160, 140, 154, 6);
      s += `<path d="M4 154H40V140H4Z" fill="url(#${u}-ct)"/><path d="M160 140H196V154H160Z" fill="url(#${u}-ct)"/>` +
        (kind === "gas" ? `<path d="${td}" fill="#17181b"/>` : `<path d="${td}" fill="url(#${u}-bgt)"/>`) +
        burners(off, c, [[.25, .3, 9, kind === "gas" ? "gas" : "rad", false, "pot"], [.75, .3, 9, kind === "gas" ? "gas" : "rad", false], [.25, .78, 10, kind === "gas" ? "gas" : "rad", false], [.75, .78, 10, kind === "gas" ? "gas" : "rad", false, "pan"]]) +
        (kind === "gas" ? `<path d="${trap(42, 158, 141, 153, 6)}" fill="none" stroke="#08090a" stroke-width="2.2"/><path d="M100 141V153" stroke="#08090a" stroke-width="2"/>` : "") +
        `<path d="M4 154H196V176H4Z" fill="url(#${u}-cab)"/>` + pnt(o, "M40 154H160V176H40Z") + [56, 70, 130, 144].map((x) => knob(off, x, 160, 2.6, "ss", false)).join(""); }
    return BG(s);
  }
  function otr(o, look) {
    const u = o.uid, op = o.opt || {}, ck = look.below || op.below || "gas", duct = op.vent !== "recirc";
    const d0 = o.mf ? false : o.on, om = sub(o, o.parts && o.parts.mw != null ? o.parts.mw : d0), ol = sub(o, o.parts && o.parts.light != null ? o.parts.light : d0), of = sub(o, o.parts && o.parts.fan != null ? o.parts.fan : d0);
    const x1 = 28, x2 = 172, y1 = 34, y2 = 100, Lv = (q) => n1(q.on ? .35 + .65 * q.level : 0);
    let s = otrScene(o, ck);
    if (ol.on) s += [60, 140].map((x) => `<path d="M${x - 6} ${y2 + 3}L${x - 30} ${ck === "none" ? 140 : 146}H${x + 30}L${x + 6} ${y2 + 3}Z" fill="#fff1d0" opacity="${n1(.22 * Lv(ol) / 1)}"/>`).join("") +
      `<ellipse cx="100" cy="${ck === "none" ? 142 : 147}" rx="78" ry="9" fill="#fff1d0" opacity="${n1(.3 * Lv(ol))}"/>`;
    if (of.on) s += [0, 1, 2, 3].map((i) => `<path class="${P}up" style="animation-delay:-${n1(i * .55)}s;animation-duration:${n1(2.6 - 1.4 * of.level)}s" d="M${64 + i * 5} ${ck === "none" ? 136 : 128}C${60 + i * 7} 118 ${84 + i * 6} 112 ${88 + i * 6} ${y2 + 6}" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="2.4" stroke-linecap="round"/>`).join("");
    else if (ck !== "none") s += steam(sub(o, true), 62, 128, 10, 2, .7);
    s += sh(o, 100, y2 + 5, 76, 3) + pnt(o, rr(x1, y1, x2 - x1, y2 - y1, 2)) + gloss(o, x1, y1, x2 - x1, y2 - y1);
    s += `<rect x="${x1 + 4}" y="${y1 + 3}" width="${x2 - x1 - 8}" height="7" fill="#0a0b0d" opacity=".55"/><rect x="${x1 + 6}" y="${y1 + 4}" width="${x2 - x1 - 12}" height="5" fill="url(#${u}-perf)"/>`;
    if (of.on) s += duct
      ? [52, 82, 118, 148].map((x, i) => `<path class="${P}up" style="animation-delay:-${n1(i * .45)}s" d="M${x - 5} ${y1 - 2}l5 -5l5 5M${x - 5} ${y1 - 9}l5 -5l5 5" fill="none" stroke="#dfe8ef" stroke-width="1.3" stroke-linecap="round"/>`).join("") + BG(`<rect x="70" y="20" width="60" height="10" fill="#0d0e10" opacity=".5"/>`)
      : [[48, "outl"], [74, "outl"], [126, "outr"], [152, "outr"]].map((q, i) => `<path class="${P}${q[1]}" style="animation-delay:-${n1(i * .4)}s" d="M${q[0] - 8} ${y1 + 7}h16" stroke="#dfe8ef" stroke-width="1.4" stroke-linecap="round"/>`).join("");
    const pw = 36, px = x2 - pw - 4, dx1 = x1 + 4, dy = y1 + 13, dh = y2 - dy - 4, wd = rr(dx1 + 8, dy + (look.glass ? 9 : 5), px - dx1 - 18, dh - (look.glass ? 14 : 10), 2);
    s += look.glass ? `<path d="${rr(dx1, dy, x2 - 4 - dx1, dh, 1.5)}" fill="url(#${u}-bg)"/>` : pnt(o, rr(dx1, dy, px - 3 - dx1, dh, 1.5)) + `<path d="${rr(dx1, dy, px - 3 - dx1, dh, 1.5)}" fill="none" stroke="#000" stroke-opacity=".35"/>`;
    s += `<clipPath id="${u}-ow"><path d="${wd}"/></clipPath><path d="${wd}" fill="#07080a"/><g clip-path="url(#${u}-ow)">` +
      (om.on ? `<g opacity="${Lv(om)}"><path class="${P}glow" d="${wd}" fill="url(#${u}-mw)"/></g>` : "") +
      `<ellipse cx="${n1((dx1 + px) / 2 - 2)}" cy="${y2 - 14}" rx="26" ry="3.6" fill="#d8dde2" fill-opacity="${om.on ? .8 : .12}"/><g class="${om.on ? P + "turn" : ""}"><path d="M${n1((dx1 + px) / 2 - 10)} ${y2 - 15}Q${n1((dx1 + px) / 2 - 2)} ${y2 - 10} ${n1((dx1 + px) / 2 + 6)} ${y2 - 15}L${n1((dx1 + px) / 2 + 5)} ${y2 - 22}H${n1((dx1 + px) / 2 - 9)}Z" fill="#c8402e"/></g>` +
      (om.on ? steam(om, (dx1 + px) / 2 - 2, y2 - 24, 10, 2, .5) : `<path d="${wd}" fill="#000" opacity=".6"/>`) + `</g><path d="${wd}" fill="url(#${u}-gl)" opacity=".6"/><path d="${wd}" fill="url(#${u}-perf)" opacity=".45"/>`;
    s += look.glass ? bar(o, dx1 + 10, x2 - 14, dy + 4.5, 3) : `<rect x="${px - 10}" y="${dy + 5}" width="3.4" height="${dh - 10}" rx="1.7" fill="url(#${u}-stv)"/>`;
    s += (look.glass ? "" : `<path d="${rr(px, dy, pw, dh, 1.5)}" fill="url(#${u}-bg)"/>`) + lcd(om, px + pw / 2, dy + 8, 5, "#7dd3fc", om.on ? Math.round(1 + 4 * om.level) + ":" + String(10 + Math.round(45 * om.level)) : "0:00") +
      [0, 1, 2, 3].map((r) => [0, 1, 2].map((cc) => `<circle cx="${px + 9 + cc * 9}" cy="${dy + 20 + r * 6}" r="1.4" fill="#fff" fill-opacity=".22"/>`).join("")).join("") +
      dot(ol, px + 9, y2 - 9, 1.3, true, "#ffd27a") + dot(of, px + 18, y2 - 9, 1.3, true, "#7dd3fc");
    s += `<rect x="${x1}" y="${y2}" width="${x2 - x1}" height="3.6" fill="#1a1c20"/>` + [80, 104].map((x) => `<rect x="${x}" y="${y2 + .6}" width="16" height="2.4" fill="url(#${u}-perf)"/>`).join("") +
      [60, 140].map((x) => `<rect x="${x - 6}" y="${y2 + .7}" width="12" height="2.4" rx="1" fill="${ol.on ? "#fff6dc" : "#555a60"}"/>`).join("");
    return s;
  }
  const OTRO = [{ id: "vent", name: "Vent", values: [["duct", "Ducted outside"], ["recirc", "Recirculating"]] }, { id: "below", name: "Cooktop below", values: [["gas", "Gas"], ["electric", "Electric"], ["none", "None"]] }];
  const OTRP = [{ id: "mw", name: "Microwave" }, { id: "light", name: "Light" }, { id: "fan", name: "Fan" }];

  const mk = (id, name, colors, render, options, parts) => ({ id, name, colors, picker: true, colorLabel: "Finish", render, options, parts });
  const icons = [
    Object.assign(mk("cfg-classic", "Classic white range", [WH, AL, BK, SS], withPT((o) => svg(o, cfgRange(o, { fuel: "coil", back: "paint", kt: "wh", clock: true, tc: true }))), rangeOpts("coil"), RPARTS),
      { colors2: ["#1b1d21", "#e8eaec", SS, "#6f747a"], picker2: true, colorLabel2: "Cooktop" }),
    mk("cfg-otrglass", "Black glass OTR", [BSS, SS, BK, WH], (o) => svg(o, otr(o, { glass: true, below: "electric" })), [OTRO[0]], OTRP),
  ];

  (window.HDA = window.HDA || []).push({
    id: "rangecfg", tab: "Range & OTR builder", group: "Appliances", kind: "device",
    intro: "Build a classic range: pick the fuel (gas, electric coil, glass smooth-top, induction), freestanding or slide-in (with a clock on the front), 4, 5 or 6 burners and a single or double oven, plus a cooktop color. Front burners, back burners and each oven switch on their own. The over-the-range microwave has Microwave, Light and Fan chips: the fan pulls the steam from the electric cooktop up and blows it out the top (ducted) or the front grille (recirculating), and the light shines on the cooktop.",
    
    css: css2, icons,
  });
})();
