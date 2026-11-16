(function () {
  const P = "hda-garagecfg-";
  const N = () => window.HDAH;
  const f = (n) => (+n).toFixed(1);
  const rnd = (seed) => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
  const stops = (a) => a.map(([o, c, op]) => `<stop offset="${o}" stop-color="${c}"${op == null ? "" : ` stop-opacity="${op}"`}/>`).join("");
  const lg = (id, a, x1, y1, x2, y2) => `<linearGradient id="${id}" x1="${x1 || 0}" y1="${y1 || 0}" x2="${x2 == null ? 1 : x2}" y2="${y2 || 0}">${stops(a)}</linearGradient>`;
  const rg = (id, a, cx, cy, r) => `<radialGradient id="${id}" cx="${cx == null ? .5 : cx}" cy="${cy == null ? .5 : cy}" r="${r || .5}">${stops(a)}</radialGradient>`;
  const rr = (x, y, w, h, r) => `M${f(x + r)} ${f(y)}H${f(x + w - r)}A${r} ${r} 0 0 1 ${f(x + w)} ${f(y + r)}V${f(y + h - r)}A${r} ${r} 0 0 1 ${f(x + w - r)} ${f(y + h)}H${f(x + r)}A${r} ${r} 0 0 1 ${f(x)} ${f(y + h - r)}V${f(y + r)}A${r} ${r} 0 0 1 ${f(x + r)} ${f(y)}Z`;
  const BGW = (t) => `<g class="hda-bg">${t}</g>`;
  const WARM = "#ffd89c", AMB = "#ffb02e";

  const WHT = "#eceeec", ALM = "#e0d4ba", SND = "#c3a983", BRZ = "#4d3c2f", BLK = "#27292d", CDR = "#a86f3e", WAL = "#6b4529", GRY = "#7c8187";
  const DOORC = [WHT, ALM, SND, BRZ, BLK, CDR, WAL, GRY];
  const TRIMC = ["#f2f1ec", "#e8dfcc", "#2a2b2f", "#5a4636", "#9aa0a6"];
  const STYLES = [["raised", "Raised short panel"], ["long", "Raised long panel"], ["flush", "Flush"], ["carriage", "Carriage house"], ["glass", "Full-view glass"], ["plank", "Wood plank"], ["ribbed", "Ribbed steel"], ["rollup", "Roll-up"], ["tilt", "One-piece tilt-up"], ["louver", "Louvered"]];
  const WINS = [["none", "None"], ["top", "Top row"], ["arched", "Arched"], ["square", "Square"], ["frosted", "Frosted full-view"]];
  const WINSTYLES = ["raised", "long", "flush", "carriage", "plank", "louver", "tilt"];
  const STATES = [["closed", "Closed"], ["opening", "Opening"], ["open", "Open"], ["closing", "Closing"], ["partly", "Partly open"], ["notclosed", "Not closed"]];
  const WIDTH = [["single", "Single"], ["double", "Double"]];
  const first = (all, d) => { const i = Math.max(0, all.findIndex((a) => a[0] === d)); return [all[i]].concat(all.filter((_, k) => k !== i)); };

  function ctx(o) {
    const h = N(), c = o.color || WHT, t = o.color2 || TRIMC[0];
    return { o, u: o.uid, c, t, p: { l: h.shade(c, .38), m: c, d: h.shade(c, -.28), k: h.shade(c, -.55) }, opt: o.opt || {}, anim: o.anim,
      id: (s) => `${o.uid}-${s}`, url: (s) => `url(#${o.uid}-${s})`, n: 0 };
  }
  function defs(x) {
    const p = x.p, id = x.id;
    return `<defs>
${lg(id("fin"), [[0, p.l], [.5, p.m], [1, p.d]], 0, 0, 0, 1)}
${lg(id("sec"), [[0, p.l], [.2, p.m], [.82, p.d], [1, p.k]], 0, 0, 0, 1)}
${lg(id("sh"), [[0, "#fff", .18], [.3, "#fff", 0], [.68, "#000", 0], [1, "#000", .26]])}
${lg(id("dn"), [[0, "#000", .55], [1, "#000", 0]], 0, 0, 0, 1)}
${lg(id("in"), [[0, "#1b1815"], [1, "#0a0908"]], 0, 0, 0, 1)}
${lg(id("bw"), [[0, "#5a5046"], [1, "#2e2822"]], 0, 0, 0, 1)}
${lg(id("gls"), [[0, "#41566a"], [.5, "#1a232d"], [1, "#0c1117"]], 0, 0, 0, 1)}
${lg(id("fr"), [[0, "#e6ecef", .94], [1, "#a9b6bf", .94]], 0, 0, 0, 1)}
${lg(id("drv"), [[0, "#56585a"], [1, "#8b8c8a"]], 0, 0, 0, 1)}
${lg(id("chr"), [[0, "#5f666d"], [.45, "#eef1f3"], [.6, "#b6bcc2"], [1, "#4e545b"]])}
${lg(id("spill"), [[0, WARM, .55], [1, WARM, 0]], 0, 0, 0, 1)}
${rg(id("lp"), [[0, WARM, .95], [.35, WARM, .42], [1, WARM, 0]])}
${rg(id("vig"), [[0, "#000", 0], [.66, "#000", .06], [1, "#000", .48]], .5, .45, .75)}
<clipPath id="${id("wc")}"><rect x="8" y="8" width="184" height="184" rx="16"/></clipPath></defs>`;
  }
  const svg = (x, body) => `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs(x)}<g clip-path="${x.url("wc")}">${body}<g class="hda-bg"><rect x="8" y="8" width="184" height="184" fill="${x.url("vig")}"/></g></g><rect class="hda-bg" x="8.5" y="8.5" width="183" height="183" rx="15.5" fill="none" stroke="#fff" stroke-opacity=".08"/></svg>`;

  function wall_(x, kind, c, y0, y1, seed) {
    y0 = y0 || 8; y1 = y1 || 192; const h = N(), g = x.id("wl" + x.n++), r = rnd(seed || 11);
    let s = `${lg(g, [[0, h.shade(c, .1)], [1, h.shade(c, -.2)]], 0, 0, 0, 1)}<rect x="8" y="${y0}" width="184" height="${y1 - y0}" fill="url(#${g})"/>`;
    let d = "", e = "", t = "";
    if (kind === "siding") {
      for (let y = y0 + 7; y < y1; y += 7.5) { d += `M8 ${f(y)}H192`; e += `M8 ${f(y + 1.3)}H192`; }
      s += `<path d="${d}" stroke="#000" stroke-opacity=".3" stroke-width="1.4"/><path d="${e}" stroke="#fff" stroke-opacity=".12"/>`;
    } else if (kind === "brick") {
      for (let y = y0, i = 0; y < y1; y += 6, i++) {
        d += `M8 ${f(y)}H192`;
        for (let xx = 8 - (i % 2 ? 0 : 7); xx < 192; xx += 14) {
          e += `M${f(xx)} ${f(y)}v6`;
          if (r() > .55) t += `<rect x="${f(xx + .7)}" y="${f(y + .7)}" width="12.6" height="4.6" fill="${r() > .5 ? "#000" : "#fff"}" fill-opacity="${(.04 + r() * .12).toFixed(2)}"/>`;
        }
      }
      s += t + `<path d="${d}${e}" stroke="#d9d2c6" stroke-opacity=".38"/>`;
    } else if (kind === "stone") {
      for (let y = y0; y < y1; y += 9) {
        for (let xx = 8 - r() * 10; xx < 192;) {
          const w = 10 + r() * 14, hh = 7 + r() * 3;
          t += `<path d="${rr(xx + .8, y + .8, w - 1.6, hh - 1, 2.5)}" fill="${h.shade(c, r() * .36 - .2)}" stroke="#000" stroke-opacity=".38"/>`;
          t += `<path d="M${f(xx + 2.5)} ${f(y + 1.6)}H${f(xx + w - 3)}" stroke="#fff" stroke-opacity=".16"/>`;
          xx += w;
        }
      }
      s += `<rect x="8" y="${y0}" width="184" height="${y1 - y0}" fill="#2b2824"/>` + t;
    } else if (kind === "stucco") {
      for (let i = 0; i < 160; i++) t += `<circle cx="${f(8 + r() * 184)}" cy="${f(y0 + r() * (y1 - y0))}" r="${f(.3 + r() * .7)}" fill="${r() > .5 ? "#000" : "#fff"}" fill-opacity="${(.05 + r() * .08).toFixed(2)}"/>`;
      s += t;
    } else if (kind === "batten") {
      for (let xx = 12; xx < 192; xx += 15) { d += `M${xx} ${y0}V${y1}`; e += `M${xx + 2.6} ${y0}V${y1}`; }
      s += `<path d="${d}" stroke="#fff" stroke-opacity=".22" stroke-width="2.2"/><path d="${e}" stroke="#000" stroke-opacity=".28" stroke-width="1.2"/>`;
    } else if (kind === "metal") {
      for (let xx = 9; xx < 192; xx += 7) { d += `M${xx} ${y0}V${y1}`; e += `M${xx + 2.2} ${y0}V${y1}`; }
      s += `<path d="${d}" stroke="#fff" stroke-opacity=".2" stroke-width="1.6"/><path d="${e}" stroke="#000" stroke-opacity=".3" stroke-width="1.6"/>`;
    } else if (kind === "panel") {
      for (let xx = 8 + 46; xx < 192; xx += 46) d += `M${xx} ${y0}V${y1}`;
      for (let y = y0 + 44; y < y1; y += 44) d += `M8 ${y}H192`;
      s += `<path d="${d}" stroke="#000" stroke-opacity=".45" stroke-width="1.2"/>`;
      for (let i = 0; i < 70; i++) t += `<circle cx="${f(8 + r() * 184)}" cy="${f(y0 + r() * (y1 - y0))}" r=".5" fill="#fff" fill-opacity=".06"/>`;
      s += t;
    }
    return s;
  }

  function secBase(x, W, H, n) {
    let s = ""; const h = H / n;
    for (let i = 0; i < n; i++) s += `<rect x="0" y="${f(i * h)}" width="${f(W)}" height="${f(h)}" fill="${x.url("sec")}"/>`;
    for (let i = 1; i < n; i++) s += `<path d="M0 ${f(i * h)}H${f(W)}" stroke="#000" stroke-opacity=".45" stroke-width="${f(Math.max(.5, H * .012))}"/><path d="M0 ${f(i * h + Math.max(.6, H * .012))}H${f(W)}" stroke="#fff" stroke-opacity=".28" stroke-width=".6"/>`;
    return s;
  }
  function rp(px, py, pw, ph) {
    const d = Math.max(.8, Math.min(pw, ph) * .14);
    return `<path d="M${f(px)} ${f(py + ph)}V${f(py)}H${f(px + pw)}" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width=".7"/><path d="M${f(px + pw)} ${f(py)}V${f(py + ph)}H${f(px)}" fill="none" stroke="#000" stroke-opacity=".4" stroke-width=".7"/><rect x="${f(px + d)}" y="${f(py + d)}" width="${f(pw - 2 * d)}" height="${f(ph - 2 * d)}" fill="#fff" fill-opacity=".07"/>`;
  }
  const pane = (x, px, py, pw, ph, frost) => `<rect x="${f(px)}" y="${f(py)}" width="${f(pw)}" height="${f(ph)}" fill="${x.url(frost ? "fr" : "gls")}"/><path d="M${f(px)} ${f(py + ph * .9)}L${f(px + pw * .55)} ${f(py)}H${f(px + pw * .8)}L${f(px)} ${f(py + ph)}Z" fill="#fff" opacity=".14"/><rect x="${f(px)}" y="${f(py)}" width="${f(pw)}" height="${f(ph)}" fill="none" stroke="#000" stroke-opacity=".35" stroke-width=".5"/>`;
  function grainV(seed, W, H) { const r = rnd(seed); let d = ""; for (let xx = 1; xx < W; xx += 1.5 + r() * 2) { const a = r() * 1.2 - .6; d += `M${f(xx)} 0C${f(xx + a)} ${f(H * .3)} ${f(xx - a)} ${f(H * .6)} ${f(xx)} ${f(H)}`; } return `<path d="${d}" fill="none" stroke="#2a1606" stroke-opacity=".2" stroke-width=".5"/>`; }
  function grainH(seed, W, H) { const r = rnd(seed); let d = ""; for (let y = 1; y < H; y += 1.2 + r() * 1.6) { const a = r() * 1.2 - .6; d += `M0 ${f(y)}C${f(W * .3)} ${f(y + a)} ${f(W * .6)} ${f(y - a)} ${f(W)} ${f(y)}`; } return `<path d="${d}" fill="none" stroke="#2a1606" stroke-opacity=".2" stroke-width=".5"/>`; }
  function doorFace(x, W, H, style, win) {
    const dbl = W / H > 1.6, cols = dbl ? 8 : 4, sh = H / 4;
    let s = "";
    if (style === "glass") {
      s = `<rect width="${f(W)}" height="${f(H)}" fill="${x.url("fin")}"/>`; const fw = Math.max(1.2, W * .026), c2 = dbl ? 6 : 3;
      const pw = (W - fw * (c2 + 1)) / c2, ph = sh - fw * 2;
      for (let r = 0; r < 4; r++) for (let c = 0; c < c2; c++) s += pane(x, fw + c * (pw + fw), r * sh + fw, pw, ph, false) + `<rect x="${f(fw + c * (pw + fw))}" y="${f(r * sh + fw)}" width="${f(pw)}" height="${f(ph)}" fill="#8fa4b4" opacity=".18"/>`;
      for (let r = 1; r < 4; r++) s += `<path d="M0 ${f(r * sh)}H${f(W)}" stroke="#000" stroke-opacity=".5" stroke-width=".6"/>`;
    } else if (style === "rollup") {
      s = `<rect width="${f(W)}" height="${f(H)}" fill="${x.url("fin")}"/>`; let d = "", e = "";
      for (let y = 1.5; y < H - 3; y += Math.max(2, H / 22)) { d += `M0 ${f(y)}H${f(W)}`; e += `M0 ${f(y + .8)}H${f(W)}`; }
      s += `<path d="${e}" stroke="#fff" stroke-opacity=".3" stroke-width=".8"/><path d="${d}" stroke="#000" stroke-opacity=".35" stroke-width=".7"/><rect y="${f(H - H * .07)}" width="${f(W)}" height="${f(H * .07)}" fill="${x.p.d}"/><rect x="${f(W / 2 - W * .08)}" y="${f(H - H * .055)}" width="${f(W * .16)}" height="${f(H * .03)}" rx="1" fill="${x.url("chr")}"/>`;
    } else if (style === "tilt") {
      s = `<rect width="${f(W)}" height="${f(H)}" fill="${x.url("fin")}"/>`; let d = "";
      for (let xx = W / (dbl ? 26 : 14); xx < W - .5; xx += W / (dbl ? 26 : 14)) d += `M${f(xx)} 0V${f(H)}`;
      s += `<path d="${d}" stroke="#000" stroke-opacity=".3" stroke-width=".7"/><path d="${d}" stroke="#fff" stroke-opacity=".18" stroke-width=".5" transform="translate(.8 0)"/>`;
    } else if (style === "plank") {
      const h = N(), n = 14, ph = H / n, r = rnd(23);
      for (let i = 0; i < n; i++) s += `<rect x="0" y="${f(i * ph)}" width="${f(W)}" height="${f(ph)}" fill="${h.shade(x.c, r() * .22 - .11)}"/><path d="M0 ${f(i * ph + ph - .3)}H${f(W)}" stroke="#000" stroke-opacity=".5" stroke-width=".6"/>`;
      s += grainH(5, W, H);
    } else if (style === "louver") {
      s = `<rect width="${f(W)}" height="${f(H)}" fill="#141516"/>`; const n = 12, ph = H / n;
      for (let i = 0; i < n; i++) s += `<rect x="${f(W * .02)}" y="${f(i * ph + ph * .12)}" width="${f(W * .96)}" height="${f(ph * .72)}" fill="${x.url("fin")}"/><path d="M${f(W * .02)} ${f(i * ph + ph * .14)}H${f(W * .98)}" stroke="#fff" stroke-opacity=".35" stroke-width=".5"/>`;
      s += `<rect width="${f(W * .02)}" height="${f(H)}" fill="${x.p.k}"/><rect x="${f(W * .98)}" width="${f(W * .02)}" height="${f(H)}" fill="${x.p.k}"/>`;
    } else if (style === "ribbed") {
      s = secBase(x, W, H, 4); let d = "", e = "";
      for (let r = 0; r < 4; r++) for (let k = 1; k < 4; k++) { const y = r * sh + k * sh / 4; d += `M0 ${f(y)}H${f(W)}`; e += `M0 ${f(y + .7)}H${f(W)}`; }
      s += `<path d="${d}" stroke="#000" stroke-opacity=".28" stroke-width=".6"/><path d="${e}" stroke="#fff" stroke-opacity=".22" stroke-width=".5"/>`;
    } else {
      s = secBase(x, W, H, 4);
      if (style === "raised") { const m = W * .05, gx = W * .022, pw = (W - 2 * m - (cols - 1) * gx) / cols; for (let r = 0; r < 4; r++) for (let c = 0; c < cols; c++) s += rp(m + c * (pw + gx), r * sh + sh * .2, pw, sh * .6); }
      else if (style === "long") { const c2 = dbl ? 4 : 2, m = W * .05, gx = W * .03, pw = (W - 2 * m - (c2 - 1) * gx) / c2; for (let r = 0; r < 4; r++) for (let c = 0; c < c2; c++) s += rp(m + c * (pw + gx), r * sh + sh * .2, pw, sh * .6); }
      else if (style === "flush") { let d = ""; for (let r = 0; r < 4; r++) for (let k = 1; k < 5; k++) d += `M0 ${f(r * sh + k * sh / 5)}H${f(W)}`; s += `<path d="${d}" stroke="#000" stroke-opacity=".08" stroke-width=".5"/>`; }
      else if (style === "carriage") {
        const leaves = dbl ? 4 : 2, lw = W / leaves; let g = "";
        for (let xx = W / (dbl ? 28 : 14); xx < W - .5; xx += W / (dbl ? 28 : 14)) g += `M${f(xx)} ${f(sh)}V${f(H)}`;
        s += `<path d="${g}" stroke="#000" stroke-opacity=".28" stroke-width=".6"/>`;
        if (x.c === CDR || x.c === WAL || x.c === SND) s += grainV(7, W, H);
        for (let i = 1; i < leaves; i++) s += `<path d="M${f(i * lw)} 0V${f(H)}" stroke="#000" stroke-opacity=".55" stroke-width="${f(Math.max(.7, W * .008))}"/>`;
        for (let i = 0; i < leaves; i++) s += `<rect x="${f(i * lw + lw * .04)}" y="${f(H * .03)}" width="${f(lw * .92)}" height="${f(H * .92)}" fill="none" stroke="#000" stroke-opacity=".28" stroke-width="${f(Math.max(.8, W * .012))}"/>`;
        const sw = Math.max(.9, H * .03), strap = (y) => `<path d="M${f(W * .02)} ${f(y - sw)}H${f(W * .14)}L${f(W * .16)} ${f(y)}L${f(W * .14)} ${f(y + sw)}H${f(W * .02)}Z" fill="#1c1c1e"/><path d="M${f(W * .98)} ${f(y - sw)}H${f(W * .86)}L${f(W * .84)} ${f(y)}L${f(W * .86)} ${f(y + sw)}H${f(W * .98)}Z" fill="#1c1c1e"/>`;
        s += strap(sh * 1.5) + strap(sh * 3.4);
        for (let i = 1; i < leaves; i += 2) s += `<rect x="${f(i * lw - W * .04)}" y="${f(sh * 2.2)}" width="${f(Math.max(.8, W * .012))}" height="${f(sh * .8)}" fill="#1c1c1e"/><rect x="${f(i * lw + W * .028)}" y="${f(sh * 2.2)}" width="${f(Math.max(.8, W * .012))}" height="${f(sh * .8)}" fill="#1c1c1e"/>`;
      }
    }
    if (WINSTYLES.indexOf(style) >= 0 && win !== "none") {
      if (win === "frosted") {
        const c2 = dbl ? 8 : 4, fw = Math.max(1, W * .02), pw = (W - fw * (c2 + 1)) / c2;
        for (let r = 0; r < 4; r++) for (let c = 0; c < c2; c++) s += pane(x, fw + c * (pw + fw), r * sh + fw, pw, sh - 2 * fw, true);
      } else {
        const c2 = style === "long" ? (dbl ? 8 : 4) : cols, m = W * .06, gx = W * .025, pw = (W - 2 * m - (c2 - 1) * gx) / c2, py = sh * .18, ph = sh * .62;
        for (let c = 0; c < c2; c++) {
          const px = m + c * (pw + gx);
          if (win === "arched") { const d = `M${f(px)} ${f(py + ph)}V${f(py + ph * .45)}Q${f(px + pw / 2)} ${f(py - ph * .2)} ${f(px + pw)} ${f(py + ph * .45)}V${f(py + ph)}Z`; s += `<path d="${d}" fill="${x.url("gls")}"/><path d="M${f(px + pw / 2)} ${f(py + ph * .1)}V${f(py + ph)}" stroke="${x.p.l}" stroke-width=".6"/><path d="${d}" fill="none" stroke="${x.p.l}" stroke-width=".7"/>`; }
          else if (win === "square") { const q = Math.min(pw, ph); s += pane(x, px + (pw - q) / 2, py + (ph - q) / 2, q, q) + `<path d="M${f(px + pw / 2)} ${f(py + (ph - q) / 2)}v${f(q)}M${f(px + (pw - q) / 2)} ${f(py + ph / 2)}h${f(q)}" stroke="${x.p.l}" stroke-width=".5"/>`; }
          else s += pane(x, px, py, pw, ph);
        }
      }
    }
    return s + `<rect width="${f(W)}" height="${f(H)}" fill="${x.url("sh")}"/><rect y="${f(H - Math.max(1, H * .025))}" width="${f(W)}" height="${f(Math.max(1, H * .025))}" fill="#131313"/>`;
  }

  function bay(x, X, Y, W, H, style, win, state, i) {
    const k = x.id("bc" + i), trim = x.t, lift = { closed: 0, open: 1, partly: .32, notclosed: .12, opening: .5, closing: .5 }[state] || 0, cas = Math.max(2, W * .045);
    let s = `<rect x="${f(X - cas)}" y="${f(Y - cas)}" width="${f(W + 2 * cas)}" height="${f(H + cas)}" fill="${trim}"/><path d="M${f(X - cas)} ${f(Y + H)}V${f(Y - cas)}H${f(X + W + cas)}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width=".6"/><rect x="${f(X - .8)}" y="${f(Y - .8)}" width="${f(W + 1.6)}" height="${f(H + .8)}" fill="#000" fill-opacity=".5"/>`;
    s += `<clipPath id="${k}"><rect x="${f(X)}" y="${f(Y)}" width="${f(W)}" height="${f(H)}"/></clipPath><g clip-path="url(#${k})">`;
    if (lift > 0) {
      const cx = X + W / 2;
      s += `<rect x="${f(X)}" y="${f(Y)}" width="${f(W)}" height="${f(H)}" fill="${x.url("in")}"/><rect x="${f(X + W * .12)}" y="${f(Y + H * .1)}" width="${f(W * .76)}" height="${f(H * .5)}" fill="${x.url("bw")}"/><path d="M${f(X)} ${f(Y + H)}L${f(X + W * .12)} ${f(Y + H * .6)}H${f(X + W * .88)}L${f(X + W)} ${f(Y + H)}Z" fill="#2e2924"/>` +
        `<ellipse cx="${f(cx)}" cy="${f(Y + H * .2)}" rx="${f(W * .6)}" ry="${f(H * .6)}" fill="${x.url("lp")}" opacity=".7"/>`;
      const nc = W / H > 1.6 ? 2 : 1;
      for (let c = 0; c < nc; c++) { const ccx = X + W * (nc === 1 ? .5 : .27 + c * .46), cw = W * (nc === 1 ? .6 : .36), cy = Y + H; s += `<g transform="translate(${f(ccx)} ${f(cy)}) scale(${(cw / 100).toFixed(3)})"><ellipse cy="-1" rx="54" ry="5" fill="#000" opacity=".55"/><path d="M-49 -9Q-51 -28 -44 -32L-36 -34H36L44 -32Q51 -28 49 -9Z" fill="${["#6a7c8e", "#8a2a2a"][c]}"/><path d="M-35 -34L-27 -52Q-25 -55 -19 -55H19Q25 -55 27 -52L35 -34Z" fill="#3a3f46"/><path d="M-30 -35.5L-23.5 -50H23.5L30 -35.5Z" fill="#0d1318"/><rect x="-46" y="-28" width="17" height="5" rx="2" fill="#b3262a"/><rect x="29" y="-28" width="17" height="5" rx="2" fill="#b3262a"/><rect x="-50" y="-13" width="100" height="5" rx="2" fill="#151719"/><rect x="-46" y="-13" width="15" height="13" rx="3" fill="#0b0b0c"/><rect x="31" y="-13" width="15" height="13" rx="3" fill="#0b0b0c"/></g>`; }
    }
    const face = doorFace(x, W, H, style, win), cls = state === "opening" ? `${P}up` : state === "closing" ? `${P}dn` : "";
    if (style === "tilt") {
      const sy = 1 - lift * .86;
      s += `<g transform="translate(${f(X)} ${f(Y)}) scale(1 ${sy.toFixed(3)})"><g class="${cls ? cls + "t" : ""}">${face}<rect width="${f(W)}" height="${f(H)}" fill="#000" opacity="${f(lift * .5)}"/></g></g>`;
    } else s += `<g transform="translate(${f(X)} ${f(Y - lift * H)})"><g class="${cls}">${face}</g></g>`;
    if (lift > 0) s += `<rect x="${f(X)}" y="${f(Y + H - lift * H)}" width="${f(W)}" height="${f(Math.min(6, H * .08))}" fill="${x.url("dn")}" opacity=".7"/>`;
    s += `</g>`;
    if (style === "rollup") s += `<rect x="${f(X - cas * 1.4)}" y="${f(Y - cas - H * .14)}" width="${f(W + cas * 2.8)}" height="${f(H * .14)}" rx="${f(H * .06)}" fill="${x.url("fin")}"/><rect x="${f(X - cas * 1.4)}" y="${f(Y - cas - H * .14)}" width="${f(W + cas * 2.8)}" height="${f(H * .14)}" rx="${f(H * .06)}" fill="${x.url("sh")}"/>`;
    if (lift > 0) s += `<path d="M${f(X)} ${f(Y + H)}H${f(X + W)}L${f(X + W + W * .18)} 192H${f(X - W * .18)}Z" fill="${x.url("spill")}" opacity="${f(.25 + .5 * lift)}"/>`;
    const m = Math.max(5, Math.min(10, W * .12)), mx = X + W - m * .9, my = Y + m * .9;
    if (state === "notclosed") s += `<g class="${P}blink"><path d="M${f(mx)} ${f(my - m)}L${f(mx + m)} ${f(my + m * .75)}H${f(mx - m)}Z" fill="${AMB}" stroke="#3a2a00" stroke-width=".6"/><path d="M${f(mx)} ${f(my - m * .35)}v${f(m * .55)}" stroke="#2a1a00" stroke-width="${f(m * .18)}" stroke-linecap="round"/><circle cx="${f(mx)}" cy="${f(my + m * .45)}" r="${f(m * .1)}" fill="#2a1a00"/></g>`;
    if (state === "opening" || state === "closing") { const up = state === "opening"; s += `<g class="${P}blink"><circle cx="${f(mx)}" cy="${f(my)}" r="${f(m * .9)}" fill="#000" opacity=".55"/><path d="M${f(mx - m * .5)} ${f(my + (up ? m * .25 : -m * .25))}L${f(mx)} ${f(my + (up ? -m * .35 : m * .35))}L${f(mx + m * .5)} ${f(my + (up ? m * .25 : -m * .25))}" fill="none" stroke="#fff" stroke-width="${f(m * .2)}" stroke-linecap="round" stroke-linejoin="round"/></g>`; }
    s += `<rect x="${f(X - cas * .7)}" y="${f(Y + H - Math.max(3, H * .06))}" width="${f(cas * .5)}" height="${f(Math.max(1.6, H * .04))}" fill="#26272a"/><rect x="${f(X + W + cas * .2)}" y="${f(Y + H - Math.max(3, H * .06))}" width="${f(cas * .5)}" height="${f(Math.max(1.6, H * .04))}" fill="#26272a"/>`;
    return s;
  }

  const HOUSES = {
    siding: { wall: "siding", c: "#7c8a96", eave: "#e9e7e1", roof: "#3a3532" },
    brick: { wall: "brick", c: "#83483a", eave: "#efece4", roof: "#2f2b2a" },
    stucco: { wall: "stucco", c: "#c8b79a", eave: "#5a3b26", roof: "#3d3330" },
    stone: { wall: "stone", c: "#8b8070", eave: "#f0eee8", roof: "#3d3a36" },
    batten: { wall: "batten", c: "#e3e2dd", eave: "#1f2023", roof: "#26272a" },
    modern: { wall: "panel", c: "#3b3f45", eave: "#2c2e33", roof: false },
  };
  function building(x, house) {
    const o = x.opt, n = Math.max(1, Math.min(4, +o.doors || 1)), hs = HOUSES[house], h = N();
    const ws = []; for (let i = 1; i <= n; i++) ws.push(o["w" + i] === "double" ? 1.8 : 1);
    const pier = .26, total = ws.reduce((a, b) => a + b, 0) + pier * (n + 1);
    const unit = Math.min(178 / total, 98), dH = unit * .8, base = Math.min(164, 112 + dH * .62), top = base - dH;
    const eaveY = Math.max(40, Math.min(top - Math.max(8, dH * .38), 150));
    let s = BGW(wall_(x, hs.wall, hs.c, 8, base, 11 + n) + eaveBand(x, eaveY, hs) +
      `<rect x="8" y="${f(base)}" width="184" height="${f(192 - base)}" fill="${x.url("drv")}"/><rect x="8" y="${f(base)}" width="184" height="4" fill="${x.url("dn")}" opacity=".7"/>` + (() => { let d = ""; for (let y = base + 9, k = 1; y < 192; y += 6 + k * 4, k++) d += `M8 ${f(y)}H192`; for (let i = -4; i <= 4; i++) d += `M${f(100 + i * 22)} ${f(base)}L${f(100 + i * 22 * (1 + (192 - base) / 40))} 192`; return `<path d="${d}" stroke="#000" stroke-opacity=".18"/>`; })());
    let cx = 100 - (total * unit) / 2 + pier * unit;
    const style = o.style || "raised", win = o.win || "none";
    for (let i = 0; i < n; i++) { const W = ws[i] * unit; s += bay(x, cx, top, W, dH, style, win, o["s" + (i + 1)] || "closed", i); cx += W + pier * unit; }
    if (unit > 30) s += BGW(`<circle cx="${f(100 - (total * unit) / 2 + pier * unit * .5)}" cy="${f(top + dH * .3)}" r="2" fill="#ffd89c" opacity=".7"/>`);
    return s;
  }
  function eaveBand(x, y, hs) {
    if (y < 18) return "";
    const h = N(), c = hs.eave, roofH = hs.roof ? Math.min(26, y - 22) : 0, skyB = y - 14 - roofH;
    let s = skyB > 8 ? `${lg(x.id("sky"), [[0, "#7fa7c9"], [1, "#d3e2ec"]], 0, 0, 0, 1)}<rect x="8" y="8" width="184" height="${f(skyB - 8)}" fill="${x.url("sky")}"/><path d="M8 ${f(skyB)}Q60 ${f(skyB - 8)} 110 ${f(skyB - 3)}T192 ${f(skyB - 6)}V${f(skyB)}Z" fill="#5f7d5a" opacity=".6"/>` : "";
    if (hs.roof) { let d = ""; for (let yy = skyB + 4; yy < y - 14; yy += 4.5) d += `M8 ${f(yy)}H192`; s += `<path d="M2 ${f(y - 14)}L14 ${f(skyB)}H186L198 ${f(y - 14)}Z" fill="${hs.roof}"/><path d="${d}" stroke="#000" stroke-opacity=".45"/>`; }
    return s + `<rect x="8" y="${f(y - 14)}" width="184" height="8" fill="${h.shade(c, -.05)}"/><path d="M8 ${f(y - 13.5)}H192" stroke="#fff" stroke-opacity=".45"/><rect x="8" y="${f(y - 6)}" width="184" height="6" fill="${h.shade(c, -.35)}"/><rect x="8" y="${f(y)}" width="184" height="12" fill="${x.url("dn")}" opacity=".55"/>`;
  }

  const icons = [];
  const sizes = (n) => ({ is: ["1", "2", "3", "4"].slice(n - 1) });
  function card(id, name, house, d) {
    const options = [{ id: "doors", name: "Doors", values: first([["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"]], d.doors) }];
    for (let i = 1; i <= 4; i++) options.push(Object.assign({ id: "w" + i, name: `Door ${i} width`, values: first(WIDTH, (d.w || [])[i - 1] || "single") }, i > 1 ? { when: { opt: "doors", is: sizes(i).is } } : {}));
    options.push({ id: "style", name: "Door style", values: first(STYLES, d.style) });
    options.push({ id: "win", name: "Windows", values: first(WINS, d.win || "none"), when: { opt: "style", is: WINSTYLES } });
    for (let i = 1; i <= 4; i++) options.push(Object.assign({ id: "s" + i, name: `Door ${i} state`, values: STATES }, i > 1 ? { when: { opt: "doors", is: sizes(i).is } } : {}));
    icons.push({ id, name, colors: first(DOORC.map((c) => [c]), d.c).map((a) => a[0]), picker: true, colorLabel: "Door", colors2: first(TRIMC.map((c) => [c]), d.t || TRIMC[0]).map((a) => a[0]), picker2: true, colorLabel2: "Trim", options,
      render(o) { const x = ctx(o); return svg(x, building(x, house)); } });
  }
  card("siding", "Siding house", "siding", { doors: "1", style: "raised", c: WHT });
  card("brick", "Brick house", "brick", { doors: "2", w: ["double", "single"], style: "carriage", win: "arched", c: CDR });
  card("stucco", "Stucco house", "stucco", { doors: "2", style: "long", win: "top", c: ALM });
  card("stone", "Stone house", "stone", { doors: "3", w: ["single", "double", "single"], style: "plank", c: WAL, t: "#e8dfcc" });
  card("batten", "Board-and-batten", "batten", { doors: "1", w: ["double"], style: "carriage", win: "square", c: BLK, t: "#2a2b2f" });
  card("modern", "Modern", "modern", { doors: "2", w: ["double", "single"], style: "glass", c: BLK, t: "#2a2b2f" });

  const css = `
.hda-garagecfg-up,.hda-garagecfg-dn,.hda-garagecfg-upt,.hda-garagecfg-dnt{transform-box:fill-box}
.hda-garagecfg-upt,.hda-garagecfg-dnt{transform-origin:50% 0}
.hda-anim .hda-garagecfg-up{animation:hda-garagecfg-up 3.2s ease-in-out infinite}
@keyframes hda-garagecfg-up{0%{transform:translateY(50%)}85%,100%{transform:translateY(-40%)}}
.hda-anim .hda-garagecfg-dn{animation:hda-garagecfg-dn 3.2s ease-in-out infinite}
@keyframes hda-garagecfg-dn{0%{transform:translateY(-40%)}85%,100%{transform:translateY(50%)}}
.hda-anim .hda-garagecfg-upt{animation:hda-garagecfg-upt 3.2s ease-in-out infinite}
@keyframes hda-garagecfg-upt{0%{transform:scaleY(1.7)}85%,100%{transform:scaleY(.4)}}
.hda-anim .hda-garagecfg-dnt{animation:hda-garagecfg-dnt 3.2s ease-in-out infinite}
@keyframes hda-garagecfg-dnt{0%{transform:scaleY(.4)}85%,100%{transform:scaleY(1.7)}}
.hda-anim .hda-garagecfg-blink{animation:hda-garagecfg-blink 1.1s ease-in-out infinite}
@keyframes hda-garagecfg-blink{0%,100%{opacity:1}50%{opacity:.3}}
@media (prefers-reduced-motion:reduce){.hda-anim [class*="hda-garagecfg-"]{animation:none!important}}`;

  (window.HDA = window.HDA || []).push({
    id: "garagecfg",
    tab: "Garage door builder",
    group: "Outdoor",
    kind: "device",
    onWord: "Open",
    offWord: "Closed",
    intro: "Build any garage front: 1 to 4 doors, each Single or Double, in any mix, on six house looks. Pick the door style (raised short or long panel, flush, carriage house, full-view glass, wood plank, ribbed steel, roll-up, one-piece tilt-up, louvered), the windows, and each door's state: Closed, Opening, Open, Closing, Partly open or Not closed. Door color and trim color are separate.",
    css,
    icons,
    building: (o, house) => { const x = ctx(o); return svg(x, building(x, house || "siding")); },
  });
})();
