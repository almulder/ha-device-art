(function () {
  const H = window.HDAH;
  const f = (n) => (+n).toFixed(1);

  function ctx(o) {
    const c = o.color || "#fff1dc", on = !!o.on, lv = o.level == null ? 1 : o.level;
    const L = on ? .25 + .75 * lv : 0;
    const id = (s) => `${o.uid}-${s}`, url = (s) => `url(#${o.uid}-${s})`;
    return { c, on, L, id, url, hot: H.mix(c, "#ffffff", .65), lite: H.mix(c, "#ffffff", .35), op: (k) => (k * L).toFixed(3), c2: o.color2 };
  }
  const stp = (s) => s.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a == null ? "" : ` stop-opacity="${a}"`}/>`).join("");
  const lg = (id, s, x1, y1, x2, y2) => `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stp(s)}</linearGradient>`;
  const rg = (id, s, cx = .5, cy = .5, r = .5) => `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${stp(s)}</radialGradient>`;
  const H3 = (id, s) => lg(id, s, 0, 0, 1, 0), V3 = (id, s) => lg(id, s, 0, 0, 0, 1), D3 = (id, s) => lg(id, s, 0, 0, 1, 1);

  const BRS = [[0, "#6e4a17"], [.22, "#c99a48"], [.4, "#fbe7a6"], [.6, "#b07f33"], [.82, "#7a5118"], [1, "#4d3210"]];
  const CHR = [[0, "#454a57"], [.2, "#e9ecf4"], [.38, "#8e94a6"], [.55, "#f4f6fb"], [.8, "#6c7284"], [1, "#363a46"]];
  const BLK = [[0, "#0e0e13"], [.3, "#474959"], [.5, "#2a2b35"], [.75, "#17171d"], [1, "#09090c"]];
  const WHT = [[0, "#a6a2b8"], [.3, "#f4f2fb"], [.5, "#ffffff"], [.78, "#d6d2e3"], [1, "#8e8aa3"]];
  const WD = [[0, "#4f2e15"], [.25, "#a06e43"], [.45, "#d8a978"], [.7, "#8c5a32"], [1, "#4a2a12"]];

  const M2 = (c) => [[0, H.shade(c, -.55)], [.22, H.shade(c, -.05)], [.4, H.shade(c, .5)], [.6, H.shade(c, -.1)], [.82, H.shade(c, -.4)], [1, H.shade(c, -.6)]];
  const P2 = (c) => [[0, H.shade(c, -.32)], [.3, H.shade(c, .2)], [.5, H.shade(c, .32)], [.78, H.shade(c, -.06)], [1, H.shade(c, -.4)]];
  const fam = (x, k, def) => x.k2 === k ? (k === "wht" ? P2(x.c2v) : M2(x.c2v)) : def;
  function defs(x, extra) {
    const { c, id, hot } = x;
    return `<defs>
${rg(id("halo"), [[0, c, .8], [.45, c, .26], [1, c, 0]])}
${rg(id("pool"), [[0, c, .6], [.5, c, .2], [1, c, 0]])}
${rg(id("fill"), [[0, "#ffffff", .97], [.42, hot, 1], [1, c, .82]], .5, .45, .62)}
${V3(id("dn"), [[0, c, .62], [.55, c, .18], [1, c, 0]])}
${lg(id("up"), [[0, c, .6], [.6, c, .16], [1, c, 0]], 0, 1, 0, 0)}
${D3(id("mir"), [[0, "#8592ab"], [.32, "#4c5772"], [.66, "#2c3349"], [1, "#1a1e2e"]])}
${V3(id("rf"), [[0, "#0b0d18", 0], [.35, "#0b0d18", .2], [1, "#0b0d18", .34]])}
${rg(id("tC"), [[0, c, 0], [.62, c, .05], [1, c, .5]], .5, .5, .72)}
${rg(id("tT"), [[0, c, .7], [.5, c, .18], [1, c, 0]], .5, 0, .95)}
${rg(id("frost"), [[0, "#ffffff"], [.5, "#e9e6f2"], [1, "#a39fb8"]], .38, .32, .72)}
${rg(id("gl"), [[0, "#ffffff", .55], [.35, "#ffffff", .1], [.85, "#ffffff", .03], [1, "#ffffff", .25]], .34, .28, .75)}
${H3(id("brs"), fam(x, "brs", BRS))}${V3(id("brsV"), fam(x, "brs", BRS))}${D3(id("brsD"), fam(x, "brs", BRS))}
${H3(id("chr"), fam(x, "chr", CHR))}${V3(id("chrV"), fam(x, "chr", CHR))}${D3(id("chrD"), fam(x, "chr", CHR))}
${H3(id("blk"), fam(x, "blk", BLK))}${V3(id("blkV"), fam(x, "blk", BLK))}${D3(id("blkD"), fam(x, "blk", BLK))}
${H3(id("wht"), fam(x, "wht", WHT))}${V3(id("whtV"), fam(x, "wht", WHT))}${D3(id("whtD"), fam(x, "wht", WHT))}
${D3(id("wdD"), WD)}${H3(id("wd"), WD)}
${V3(id("stone"), [[0, "#f3f0ea"], [.35, "#d9d4cc"], [1, "#8d877f"]])}
${rg(id("sh"), [[0, "#000", .55], [.6, "#000", .22], [1, "#000", 0]])}
${extra || ""}</defs>`;
  }
  const svg = (x, body, extra) => `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">${defs(x, extra)}${body}</svg>`;

  const rr = (X, Y, w, h, r) => `M${X + r} ${Y}H${X + w - r}A${r} ${r} 0 0 1 ${X + w} ${Y + r}V${Y + h - r}A${r} ${r} 0 0 1 ${X + w - r} ${Y + h}H${X + r}A${r} ${r} 0 0 1 ${X} ${Y + h - r}V${Y + r}A${r} ${r} 0 0 1 ${X + r} ${Y}Z`;
  const el = (cx, cy, rx, ry) => `M${cx - rx} ${cy}A${rx} ${ry} 0 1 0 ${cx + rx} ${cy}A${rx} ${ry} 0 1 0 ${cx - rx} ${cy}Z`;
  const ci = (cx, cy, r) => el(cx, cy, r, r);
  const hl = (d, a, w) => `<path d="${d}" fill="none" stroke="#fff" stroke-opacity="${a}" stroke-width="${w}" stroke-linecap="round"/>`;

  const wsh = (d, dx = 2.5, dy = 4.5, a = .38) => `<path d="${d}" transform="translate(${dx} ${dy})" fill="#000" opacity="${a}"/>`;
  function halo(x, d, k = 1) {
    if (!x.on) return wsh(d);
    const W = [44, 30, 19, 11, 5], A = [.05, .08, .13, .22, .5];
    return W.map((w, i) => `<path d="${d}" fill="${i ? "none" : x.c}" fill-opacity="${x.op(.06 * k)}" stroke="${i > 3 ? x.hot : x.c}" stroke-opacity="${x.op(A[i] * k)}" stroke-width="${w}" stroke-linejoin="round"/>`).join("");
  }
  function glass(x, d, b, n, tint, tk = 1) {
    const [X, Y, w, h] = b, cid = x.id("cl" + n);
    const s1 = `M${f(X - 4)} ${f(Y + h * .62)} L${f(X + w * .62)} ${f(Y - 4)} L${f(X + w * .8)} ${f(Y - 4)} L${f(X - 4)} ${f(Y + h * .8)}Z`;
    const s2 = `M${f(X - 4)} ${f(Y + h * .88)} L${f(X + w * .88)} ${f(Y - 4)} L${f(X + w * .93)} ${f(Y - 4)} L${f(X - 4)} ${f(Y + h * .93)}Z`;
    const s3 = `M${f(X + w * .42)} ${f(Y + h + 4)} L${f(X + w + 4)} ${f(Y + h * .42)} L${f(X + w + 4)} ${f(Y + h * .5)} L${f(X + w * .5)} ${f(Y + h + 4)}Z`;
    const sh = x.on ? `<g class="hda-mirror-shine" style="animation-delay:-${(n * 1.7) % 9}s"><path d="M${f(X)} ${f(Y + h)} L${f(X + w * .25)} ${f(Y)} L${f(X + w * .35)} ${f(Y)} L${f(X + w * .1)} ${f(Y + h)}Z" fill="#fff" opacity=".07"/></g>` : "";
    const t = x.on && tint ? `<rect x="${X}" y="${Y}" width="${w}" height="${h}" fill="${x.url(tint === "T" ? "tT" : "tC")}" opacity="${x.op(tk)}"/>` : "";
    return `<clipPath id="${cid}"><path d="${d}"/></clipPath><path d="${d}" fill="${x.url("mir")}"/>
<g clip-path="url(#${cid})"><rect x="${X}" y="${f(Y + h * .45)}" width="${w}" height="${f(h * .55)}" fill="${x.url("rf")}"/>
<path d="${s1}" fill="#fff" opacity=".07"/><path d="${s2}" fill="#fff" opacity=".1"/><path d="${s3}" fill="#fff" opacity=".05"/>${sh}${t}</g>
<path d="${d}" fill="none" stroke="#fff" stroke-opacity=".32" stroke-width=".8"/>`;
  }
  const frame = (x, dO, dI, mat) => `<path d="${dO} ${dI}" fill-rule="evenodd" fill="${x.url(mat)}"/>
<path d="${dI}" fill="none" stroke="#000" stroke-opacity=".45" stroke-width="1.4"/><path d="${dO}" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width=".8"/>`;
  function wash(x, cx, y, hw, sp, y2, k = 1) {
    if (!x.on) return "";
    return `<path d="M${f(cx - hw - 2)} ${y} L${f(cx - hw - sp * 1.35)} ${y2} L${f(cx + hw + sp * 1.35)} ${y2} L${f(cx + hw + 2)} ${y}Z" fill="${x.url("dn")}" opacity="${x.op(.35 * k)}"/>
<path d="M${f(cx - hw)} ${y} L${f(cx - hw - sp)} ${y2} L${f(cx + hw + sp)} ${y2} L${f(cx + hw)} ${y}Z" fill="${x.url("dn")}" opacity="${x.op(.55 * k)}"/>`;
  }
  function upw(x, cx, y, hw, sp, y2, k = 1) {
    if (!x.on) return "";
    return `<path d="M${f(cx - hw)} ${y} L${f(cx - hw - sp)} ${y2} L${f(cx + hw + sp)} ${y2} L${f(cx + hw)} ${y}Z" fill="${x.url("up")}" opacity="${x.op(.55 * k)}"/>`;
  }
  const pool = (x, cx, cy, rx, ry, k = 1) => x.on ? `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${x.url("pool")}" opacity="${x.op(.8 * k)}"/>` : "";
  const glow = (x, cx, cy, r, k = .6) => x.on ? `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${x.url("halo")}" opacity="${x.op(k)}"/>` : "";
  const shadow = (x, cx, cy, rx, ry = 4.5) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${x.url("sh")}"/>`;
  const counter = (x, y, x0 = 12, x1 = 188, k = 1) => `<g class="hda-bg"><rect x="${x0}" y="${y}" width="${x1 - x0}" height="3.2" rx="1" fill="#f6f3ee" opacity=".92"/>
<rect x="${x0}" y="${y + 3}" width="${x1 - x0}" height="9" fill="${x.url("stone")}"/><rect x="${x0}" y="${y + 3}" width="${x1 - x0}" height="1.6" fill="#000" opacity=".25"/>
<path d="M${x0} ${y + .4} H${x1}" stroke="#fff" stroke-opacity=".7" stroke-width=".7"/></g>` + pool(x, (x0 + x1) / 2, y + 2, (x1 - x0) * .42, 3.6, k);

  function globe(x, cx, cy, r) {
    const id = x.id("gb");
    return `<circle cx="${cx}" cy="${cy}" r="${f(r + 1.6)}" fill="${x.url("chrD")}"/>
<circle cx="${cx}" cy="${cy}" r="${r}" fill="${x.on ? x.url("fill") : x.url("frost")}"/>
${x.on ? `<circle cx="${cx}" cy="${cy}" r="${f(r * .45)}" fill="#fff" opacity="${x.op(.9)}"/>` : `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#000" opacity=".12"/>`}
<ellipse cx="${f(cx - r * .36)}" cy="${f(cy - r * .4)}" rx="${f(r * .32)}" ry="${f(r * .2)}" fill="#fff" opacity="${x.on ? .45 : .8}" transform="rotate(-30 ${f(cx - r * .36)} ${f(cy - r * .4)})"/>
<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width=".6"/>`;
  }
  const PEAR = "M-4 -16 C-4 -10 -10 -8 -10 0 C-10 7 -5.5 11 0 11 C5.5 11 10 7 10 0 C10 -8 4 -10 4 -16 Z";
  const FIL = "M-4.6 -1 C-4.6 5 -2.6 5 -1.6 -.5 C-1 5 1 5 1.6 -.5 C2.6 5 4.6 5 4.6 -1";
  function edison(x, cx, cy, s, tube) {
    const env = tube ? "M-4.5 -16 C-6 -12 -7 -8 -7 0 L-7 13 C-7 19 7 19 7 13 L7 0 C7 -8 6 -12 4.5 -16 Z" : PEAR;
    const fil = tube ? "M-3 -10 L-3.4 13 M0 -10 V14 M3 -10 L3.4 13" : FIL;
    const lit = x.on ? `<path d="${env}" fill="${x.c}" fill-opacity="${x.op(.3)}"/><circle cx="0" cy="${tube ? 3 : 0}" r="${tube ? 15 : 13}" fill="${x.url("halo")}" opacity="${x.op(.9)}"/>
<g class="hda-mirror-fil"><path d="${fil}" fill="none" stroke="${x.c}" stroke-width="2.8" stroke-opacity="${x.op(.55)}" stroke-linecap="round"/><path d="${fil}" fill="none" stroke="${H.mix(x.hot, "#fff", .5)}" stroke-width="1" stroke-linecap="round"/></g>`
      : `<path d="${env}" fill="#ffd9a0" fill-opacity=".06"/><path d="${fil}" fill="none" stroke="#7a5a34" stroke-width=".8" stroke-opacity=".9"/>`;
    return `<g transform="translate(${cx} ${cy}) scale(${s})">${lit}<path d="M-1.6 -15 L-4 -2 M1.6 -15 L4 -2" stroke="#d8d4e6" stroke-opacity=".4" stroke-width=".45"/>
<path d="${env}" fill="${x.url("gl")}" stroke="#fff" stroke-opacity=".42" stroke-width=".6"/><path d="M-6 -6 C-7 -2 -6.5 3 -4 6" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1" stroke-linecap="round"/></g>`;
  }
  function band(x, d, k = 1) {
    if (!x.on) return `<path d="${d}" fill-rule="evenodd" fill="#f2f0fa" opacity=".22"/><path d="${d}" fill-rule="evenodd" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width=".6"/>`;
    return `<path d="${d}" fill-rule="evenodd" fill="none" stroke="${x.c}" stroke-opacity="${x.op(.35 * k)}" stroke-width="7" stroke-linejoin="round"/>
<path d="${d}" fill-rule="evenodd" fill="${x.hot}" opacity="${x.op(.95 * k)}"/><path d="${d}" fill-rule="evenodd" fill="none" stroke="#fff" stroke-opacity="${x.op(.6)}" stroke-width=".6"/>`;
  }
  const touch = (x, cx, cy, r = 3.4) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${x.on ? x.hot : "#fff"}" stroke-opacity="${x.on ? x.op(.9) : ".35"}" stroke-width=".9"/>
<path d="M${cx} ${f(cy - r * .55)} V${f(cy + r * .1)}" stroke="${x.on ? x.hot : "#fff"}" stroke-opacity="${x.on ? x.op(.9) : ".35"}" stroke-width=".9" stroke-linecap="round"/>`;

  const WARM = "#ffd2a0", NEUT = "#fff1dc", DAY = "#eef4ff";
  const COLS = [NEUT, WARM, DAY, "#ffb3cf", "#8fd0ff", "#b9a6ff"];
  const COLW = [WARM, NEUT, DAY, "#ffa94d", "#ffb3cf"];
  const COLRGB = [NEUT, DAY, "#b9a6ff", "#63e6be", "#ff8fc7", "#74c0fc"];
  const base = (o) => Object.assign({ picker: true, colorLabel: "Light", cast: "around", colors: COLS }, o);

  const icons = [
    base({ id: "hollywood", name: "Hollywood vanity", colors: COLW, glow: { x: .5, y: .48, r: 1.25 }, colors2: ["#f4f2fb", "#2a2b33", "#efc4cc", "#d6d9de", "#c99a48"], picker2: true, colorLabel2: "Frame", render(o) {
      const x = ctx(o); x.k2 = "wht"; x.c2v = x.c2 || "#f4f2fb"; const _t = 0, fo = rr(30, 22, 140, 154, 7), fi = rr(46, 38, 108, 124, 3);
      const B = [[50, 30], [75, 30], [100, 30], [125, 30], [150, 30]];
      [62, 90, 118, 146].forEach((y) => { B.push([38, y]); B.push([162, y]); });
      return svg(x, wsh(fo, 3, 3) + frame(x, fo, fi, "whtD") + glass(x, fi, [46, 38, 108, 124], 1, "C", .9) +
        `<path d="M30 168 H170" stroke="#000" stroke-opacity=".12" stroke-width="1"/>` +
        B.map(([a, b]) => glow(x, a, b, 20, .55)).join("") + B.map(([a, b]) => globe(x, a, b, 6.3)).join("") +
        counter(x, 176, 14, 186));
    } }),

    base({ id: "halo", name: "Backlit round", glow: { x: .5, y: .48, r: 1.25 }, render(o) {
      const x = ctx(o), d = ci(100, 96, 62);
      return svg(x, halo(x, d) + `<path d="${ci(100, 96, 63.4)}" fill="#14121c"/>` + glass(x, d, [38, 34, 124, 124], 2, "C", .55) +
        hl("M52 70 C60 52 76 42 94 38", .25, 2) + touch(x, 100, 146, 3));
    } }),

    base({ id: "rect", name: "Backlit rectangle", glow: { x: .5, y: .45, r: 1.3 }, render(o) {
      const x = ctx(o), d = rr(24, 34, 152, 100, 4);
      return svg(x, halo(x, d) + `<path d="${rr(23, 33, 154, 102, 5)}" fill="#14121c"/>` + glass(x, d, [24, 34, 152, 100], 3, "C", .5) +
        counter(x, 170, 12, 188, 1.2) +
        `<g class="hda-bg"><path d="M70 158 C70 176 130 176 130 158 Z" fill="${x.url("whtV")}"/><ellipse cx="100" cy="158" rx="30" ry="4.4" fill="#ffffff"/><ellipse cx="100" cy="158.6" rx="26" ry="3.2" fill="#c9c5d6"/>
<path d="M142 170 V150 C142 144 136 142 128 144" fill="none" stroke="${x.url("chr")}" stroke-width="4" stroke-linecap="round"/><rect x="138.5" y="164" width="7" height="6" rx="1.4" fill="${x.url("chr")}"/>
${x.on ? `<path d="M76 160 C90 157 110 157 124 160" fill="none" stroke="${x.hot}" stroke-opacity="${x.op(.5)}" stroke-width="1"/>` : ""}</g>`);
    } }),

    base({ id: "band", name: "Frosted band", glow: { x: .5, y: .5, r: 1.2 }, render(o) {
      const x = ctx(o), d = rr(48, 14, 104, 172, 12), b = rr(56, 22, 88, 156, 7) + " " + rr(63, 29, 74, 142, 3);
      return svg(x, (x.on ? halo(x, d, .35) : wsh(d)) + glass(x, d, [48, 14, 104, 172], 4, "C", .7) + band(x, b) +
        touch(x, 100, 162, 2.8));
    } }),

    base({ id: "capsule", name: "Backlit capsule", glow: { x: .5, y: .5, r: 1.2 }, colors2: ["#c99a48", "#2a2b33", "#d6d9de", "#ecebf0", "#b8774f"], picker2: true, colorLabel2: "Frame", render(o) {
      const x = ctx(o); x.k2 = "brs"; x.c2v = x.c2 || "#c99a48"; const _t = 0, d = rr(62, 10, 76, 180, 38);
      return svg(x, halo(x, d) + glass(x, d, [62, 10, 76, 180], 5, "C", .55) +
        `<path d="${d}" fill="none" stroke="${x.url("brsD")}" stroke-width="3"/><path d="${rr(63.5, 11.5, 73, 177, 36.5)}" fill="none" stroke="#000" stroke-opacity=".35" stroke-width=".8"/>` +
        hl("M70 50 C72 34 82 22 96 18", .3, 1.8));
    } }),

    base({ id: "arch", name: "Backlit arch", glow: { x: .5, y: .52, r: 1.2 }, colors2: ["#2a2b33", "#c99a48", "#d6d9de", "#ecebf0", "#5a4232"], picker2: true, colorLabel2: "Frame", render(o) {
      const x = ctx(o); x.k2 = "blk"; x.c2v = x.c2 || "#2a2b33"; const _t = 0, d = "M50 188 V86 A50 50 0 0 1 150 86 V188 Z", di = "M55 183 V86 A45 45 0 0 1 145 86 V183 Z";
      return svg(x, halo(x, d) + frame(x, d, di, "blkD") + glass(x, di, [55, 41, 90, 142], 6, "C", .45) +
        hl("M60 78 C64 60 78 46 96 42", .2, 2));
    } }),

    base({ id: "bar3", name: "Three-light bar", cast: "both", glow: { x: .5, y: .16, r: 1.05 }, colors2: ["#d6d9de", "#2a2b33", "#c99a48", "#ecebf0", "#b8774f"], picker2: true, colorLabel2: "Finish", render(o) {
      const x = ctx(o); x.k2 = "chr"; x.c2v = x.c2 || "#d6d9de"; const _t = 0, md = rr(40, 64, 120, 104, 3), X = [52, 100, 148];
      const cup = (cx) => `M${cx - 6} 30 C${cx - 7} 38 ${cx - 14} 42 ${cx - 17} 50 L${cx + 17} 50 C${cx + 14} 42 ${cx + 7} 38 ${cx + 6} 30 Z`;
      return svg(x, X.map((a) => upw(x, a, 20, 10, 16, 0, .8)).join("") + wsh(md) +
        `<path d="${rr(37, 61, 126, 110, 4)}" fill="${x.url("chrD")}"/>` + glass(x, md, [40, 64, 120, 104], 7, "T", .7) +
        X.map((a) => wash(x, a, 50, 15, 10, 172, .8)).join("") +
        `<rect x="24" y="16" width="152" height="6" rx="3" fill="${x.url("chrV")}"/><rect x="88" y="13" width="24" height="12" rx="3" fill="${x.url("chrV")}"/>` +
        X.map((a) => `<path d="M${a} 22 V30" stroke="${x.url("chr")}" stroke-width="5"/><rect x="${a - 5}" y="27" width="10" height="5" rx="1.5" fill="${x.url("chr")}"/>
${glow(x, a, 46, 22, .5)}<path d="${cup(a)}" fill="${x.on ? x.url("fill") : x.url("frost")}" ${x.on ? `opacity="${f(.55 + .45 * x.L)}"` : ""}/>
<path d="${cup(a)}" fill="${x.url("gl")}" stroke="#fff" stroke-opacity=".45" stroke-width=".6"/><ellipse cx="${a}" cy="50" rx="17" ry="2.6" fill="${x.on ? "#fff" : "#a39fb8"}" opacity="${x.on ? x.op(1) : ".8"}"/>
${hl(`M${a - 9} 40 C${a - 12} 43 ${a - 14} 46 ${a - 15} 48`, .5, 1.2)}`).join("") + counter(x, 176, 14, 186, .8));
    } }),

    base({ id: "edison", name: "Edison bar", colors: COLW, cast: "down", glow: { x: .5, y: .25, r: 1.1 }, colors2: ["#2a2b33", "#c99a48", "#d6d9de", "#ecebf0", "#5a4232"], picker2: true, colorLabel2: "Finish", render(o) {
      const x = ctx(o); x.k2 = "blk"; x.c2v = x.c2 || "#2a2b33"; const _t = 0, fo = rr(42, 76, 116, 100, 4), fi = rr(46, 80, 108, 92, 2), X = [44, 81, 119, 156];
      return svg(x, wsh(fo) + frame(x, fo, fi, "blkD") + glass(x, fi, [46, 80, 108, 92], 8, "T", .6) +
        X.map((a) => wash(x, a, 62, 9, 12, 190, .7)).join("") +
        `<rect x="26" y="18" width="148" height="8" rx="2" fill="${x.url("blkV")}"/><rect x="92" y="14" width="16" height="16" rx="3" fill="${x.url("blkV")}"/>
<path d="M27 18.6 H173" stroke="#fff" stroke-opacity=".25" stroke-width=".8"/>` +
        X.map((a) => `<rect x="${a - 4.5}" y="26" width="9" height="13" rx="1.5" fill="${x.url("blk")}"/><path d="M${a - 4.5} 30 h9 M${a - 4.5} 34 h9" stroke="#fff" stroke-opacity=".12" stroke-width=".6"/>
<rect x="${a - 3.5}" y="38" width="7" height="5" rx="1" fill="${x.url("brs")}"/>${edison(x, a, 58, 1, false)}`).join(""));
    } }),

    base({ id: "linear", name: "Linear LED bar", cast: "down", glow: { x: .5, y: .19, r: 1.1 }, colors2: ["#d6d9de", "#2a2b33", "#c99a48", "#ecebf0", "#b8774f"], picker2: true, colorLabel2: "Finish", render(o) {
      const x = ctx(o); x.k2 = "chr"; x.c2v = x.c2 || "#d6d9de"; const _t = 0, md = rr(48, 48, 104, 124, 2);
      return svg(x, wsh(md) + glass(x, md, [48, 48, 104, 124], 9, "T", .9) +
        `<path d="${md}" fill="none" stroke="#c9d0e0" stroke-opacity=".35" stroke-width="2.4"/>` + wash(x, 100, 39, 56, 14, 182, 1) +
        `<rect x="94" y="28" width="12" height="6" rx="1.5" fill="${x.url("chrV")}"/><rect x="38" y="31" width="124" height="8" rx="4" fill="${x.url("chrV")}"/>
<rect x="41" y="37" width="118" height="3" rx="1.5" fill="${x.on ? x.hot : "#d8d4e6"}" opacity="${x.on ? x.op(1) : ".55"}"/>
${x.on ? `<rect x="41" y="36" width="118" height="6" rx="3" fill="${x.c}" opacity="${x.op(.35)}"/>` : ""}${hl("M42 32.6 H158", .5, .8)}` + counter(x, 180, 14, 186, 1));
    } }),

    base({ id: "flank", name: "Flanking sconces", colors: COLW, cast: "both", glow: { x: .5, y: .44, r: 1.4 }, colors2: ["#c99a48", "#2a2b33", "#d6d9de", "#ecebf0", "#b8774f"], picker2: true, colorLabel2: "Frame", render(o) {
      const x = ctx(o); x.k2 = "brs"; x.c2v = x.c2 || "#c99a48"; const _t = 0, fo = ci(100, 100, 52), fi = ci(100, 100, 47);
      const sc = (cx) => `${upw(x, cx, 62, 9, 10, 10, .9)}${wash(x, cx, 114, 9, 10, 192, .8)}
<rect x="${cx - 6}" y="78" width="12" height="34" rx="6" fill="${x.url("brs")}"/><path d="M${cx - 6} 95 h12" stroke="#000" stroke-opacity=".3"/>
<rect x="${cx - 9}" y="110" width="18" height="5" rx="1.5" fill="${x.url("brs")}"/>
${glow(x, cx, 86, 24, .55)}${edison(x, cx, 94, .85, true)}
<rect x="${cx - 10}" y="60" width="20" height="51" rx="2" fill="${x.on ? x.c : "#ffffff"}" fill-opacity="${x.on ? x.op(.12) : ".06"}" stroke="#fff" stroke-opacity=".4" stroke-width=".8"/>
${hl(`M${cx - 7} 64 V106`, .4, 1.4)}<rect x="${cx - 10}" y="58" width="20" height="3" rx="1" fill="${x.url("brs")}"/>`;
      return svg(x, wsh(fo) + frame(x, fo, fi, "brsD") + glass(x, fi, [53, 53, 94, 94], 10, "C", .6) + sc(26) + sc(174));
    } }),

    base({ id: "swing", name: "Swing-arm pair", colors: COLW, cast: "both", glow: { x: .5, y: .43, r: 1.4 }, colors2: ["#c99a48", "#2a2b33", "#d6d9de", "#ecebf0", "#b8774f"], picker2: true, colorLabel2: "Finish", render(o) {
      const x = ctx(o); x.k2 = "brs"; x.c2v = x.c2 || "#c99a48"; const _t = 0, fo = rr(66, 26, 68, 150, 4), fi = rr(73, 33, 54, 136, 2);
      const sh = (s) => {
        const p = s > 0 ? 16 : 184, c = s > 0 ? 42 : 158, sd = `M${c - 10} 70 L${c + 10} 70 L${c + 15} 96 L${c - 15} 96 Z`;
        return `${upw(x, c, 70, 9, 6, 18, .7)}${wash(x, c, 96, 14, 12, 194, .8)}
<ellipse cx="${p}" cy="62" rx="4.5" ry="9" fill="${x.url("brs")}"/><path d="M${p} 62 H${c}" stroke="${x.url("brsV")}" stroke-width="3" stroke-linecap="round"/>
<circle cx="${(p + c) / 2}" cy="62" r="2.6" fill="${x.url("brs")}"/><path d="M${c} 62 V72" stroke="#7a5118" stroke-width="2"/>
<path d="${sd}" fill="${x.on ? x.url("fill") : x.url("frost")}" ${x.on ? `opacity="${f(.6 + .4 * x.L)}"` : 'opacity=".92"'}/>
<path d="${sd}" fill="#000" fill-opacity="${x.on ? .05 : .14}"/><path d="M${c - 12} 78 H${c + 12} M${c - 13} 86 H${c + 13}" stroke="#7a6a50" stroke-opacity=".18" stroke-width=".6"/>
<path d="M${c - 10} 70 L${c + 10} 70" stroke="${x.url("brs")}" stroke-width="1.4"/><path d="M${c - 15} 96 L${c + 15} 96" stroke="${x.url("brs")}" stroke-width="1.6"/>
${hl(`M${c - 9} 73 L${c - 13} 93`, .4, 1.2)}`;
      };
      return svg(x, wsh(fo) + frame(x, fo, fi, "wdD") + glass(x, fi, [73, 33, 54, 136], 11, "C", .5) +
        `<path d="M68 30 V172 M132 30 V172" stroke="#3a1e0a" stroke-opacity=".25" stroke-width=".6"/>` + sh(1) + sh(-1));
    } }),

    base({ id: "trifold", name: "Tri-fold makeup", colors: COLS, glow: { x: .5, y: .5, r: 1.25 }, colors2: ["#f4f2fb", "#2a2b33", "#efc4cc", "#d6d9de", "#c99a48"], picker2: true, colorLabel2: "Frame", render(o) {
      const x = ctx(o); x.k2 = "wht"; x.c2v = x.c2 || "#f4f2fb"; const _t = 0;
      const C = rr(70, 36, 60, 128, 5), Ci = rr(76, 42, 48, 116, 2);
      const Lp = "M28 50 L70 40 L70 160 L28 152 Z", Li = "M33 55 L66 47 L66 153 L33 147 Z";
      const Rp = "M172 50 L130 40 L130 160 L172 152 Z", Ri = "M167 55 L134 47 L134 153 L167 147 Z";
      let dots = [];
      for (let i = 0; i < 9; i++) { dots.push([73, 46 + i * 13.5]); dots.push([127, 46 + i * 13.5]); }
      for (let i = 0; i < 8; i++) { const t = i / 7; dots.push([f(30.5 + 1 * t), f(55 + t * 92)]); dots.push([f(169.5 - 1 * t), f(55 + t * 92)]); }
      const dot = ([a, b]) => x.on ? `<circle cx="${a}" cy="${b}" r="3.6" fill="${x.c}" opacity="${x.op(.35)}"/><circle cx="${a}" cy="${b}" r="1.7" fill="${x.hot}" opacity="${x.op(1)}"/>`
        : `<circle cx="${a}" cy="${b}" r="1.6" fill="#e9e6f2" opacity=".7"/>`;
      return svg(x, shadow(x, 100, 172, 80, 5) +
        `<path d="${Lp}" fill="${x.url("whtV")}"/><path d="${Lp}" fill="#000" opacity=".18"/>` + glass(x, Li, [33, 47, 33, 106], 121, "C", .5) +
        `<path d="${Rp}" fill="${x.url("whtV")}"/><path d="${Rp}" fill="#000" opacity=".28"/>` + glass(x, Ri, [134, 47, 33, 106], 122, "C", .5) +
        `<path d="${C}" fill="${x.url("wht")}"/>` + glass(x, Ci, [76, 42, 48, 116], 12, "C", .6) +
        `<path d="${C}" fill="none" stroke="#000" stroke-opacity=".2" stroke-width=".8"/>` + dots.map(dot).join("") +
        `<path d="M78 164 H122 L128 172 H72 Z" fill="${x.url("whtV")}"/>` + touch(x, 100, 167.6, 2.2) + counter(x, 172, 12, 188, .9));
    } }),

    base({ id: "tabletop", name: "Tabletop ring", colors: COLS, glow: { x: .5, y: .38, r: 1.1 }, colors2: ["#d6d9de", "#2a2b33", "#c99a48", "#ecebf0", "#b8774f"], picker2: true, colorLabel2: "Finish", render(o) {
      const x = ctx(o); x.k2 = "chr"; x.c2v = x.c2 || "#d6d9de"; const _t = 0;
      const ring = ci(100, 76, 55) + " " + ci(100, 76, 47);
      return svg(x, shadow(x, 100, 182, 46, 6) + glow(x, 100, 76, 82, .35) +
        `<path d="M41 76 C41 122 70 136 100 136 C130 136 159 122 159 76" fill="none" stroke="${x.url("chrV")}" stroke-width="5" stroke-linecap="round"/>
<rect x="96" y="134" width="8" height="36" fill="${x.url("chr")}"/><ellipse cx="100" cy="176" rx="40" ry="8" fill="#2a2b35"/><ellipse cx="100" cy="174" rx="40" ry="7.4" fill="${x.url("chr")}"/>
<ellipse cx="100" cy="172.4" rx="34" ry="4.8" fill="#fff" opacity=".18"/>` +
        `<path d="${ci(100, 76, 58)}" fill="${x.url("whtD")}"/>` + glass(x, ci(100, 76, 47), [53, 29, 94, 94], 13, "C", .7) + band(x, ring) +
        `<circle cx="41" cy="76" r="4.4" fill="${x.url("chrD")}"/><circle cx="159" cy="76" r="4.4" fill="${x.url("chrD")}"/>` +
        hl("M66 52 C74 42 86 37 98 36", .3, 1.6) + touch(x, 100, 175, 2.4));
    } }),

    base({ id: "cabinet", name: "Medicine cabinet", cast: "both", glow: { x: .5, y: .5, r: 1.25 }, colors2: ["#d6d9de", "#2a2b33", "#c99a48", "#ecebf0", "#b8774f"], picker2: true, colorLabel2: "Frame", render(o) {
      const x = ctx(o); x.k2 = "chr"; x.c2v = x.c2 || "#d6d9de"; const _t = 0, fo = rr(38, 20, 118, 152, 3), fi = rr(42, 24, 110, 144, 1.5);
      return svg(x, upw(x, 97, 20, 50, 10, 4, .6) + wash(x, 97, 172, 52, 12, 196, .9) + wsh(fo, 4, 4) +
        `<path d="M156 20 L166 27 L166 165 L156 172 Z" fill="${x.url("chrV")}"/><path d="M156 20 L166 27 L166 165 L156 172 Z" fill="#000" opacity=".35"/>
<path d="${fo}" fill="${x.url("chrD")}"/>` + glass(x, fi, [42, 24, 110, 144], 14, "C", .5) +
        band(x, rr(52, 32, 90, 6, 3)) + band(x, rr(52, 154, 90, 6, 3)) +
        `<path d="M97 24 V168" stroke="#0b0d18" stroke-width="1.6"/><path d="M98.2 24 V168" stroke="#fff" stroke-opacity=".2" stroke-width=".6"/>
<rect x="42" y="168" width="110" height="4" fill="${x.on ? x.hot : "#6c7284"}" opacity="${x.on ? x.op(.9) : ".8"}"/>` + touch(x, 140, 145, 2.8));
    } }),

    base({ id: "picture", name: "Picture-lit oval", colors: COLW, cast: "down", glow: { x: .5, y: .15, r: 1 }, colors2: ["#c99a48", "#2a2b33", "#d6d9de", "#ecebf0", "#b8774f"], picker2: true, colorLabel2: "Frame", render(o) {
      const x = ctx(o); x.k2 = "brs"; x.c2v = x.c2 || "#c99a48"; const _t = 0, fo = el(100, 116, 52, 66), fi = el(100, 116, 44, 58);
      let beads = "";
      for (let i = 0; i < 44; i++) { const a = i / 44 * Math.PI * 2; beads += `<circle cx="${f(100 + 48 * Math.cos(a))}" cy="${f(116 + 62 * Math.sin(a))}" r="1.9" fill="${x.url("brsD")}"/>`; }
      return svg(x, wsh(fo) + frame(x, fo, fi, "brsD") + beads + `<path d="${el(100, 116, 45, 59)}" fill="none" stroke="#3a260c" stroke-opacity=".6" stroke-width="1.6"/>` +
        glass(x, fi, [56, 58, 88, 116], 15, "T", .9) +
        `<path d="M86 52 C90 44 96 46 100 50 C104 46 110 44 114 52 C108 50 104 54 100 56 C96 54 92 50 86 52 Z" fill="${x.url("brs")}"/>` +
        wash(x, 100, 32, 34, 18, 150, 1) +
        `<path d="M100 50 V34" stroke="${x.url("brs")}" stroke-width="3"/><circle cx="100" cy="50" r="3" fill="${x.url("brsD")}"/>
<path d="M62 22 H138 C140 22 141 24 141 26 L139 31 H61 L59 26 C59 24 60 22 62 22 Z" fill="${x.url("brsV")}"/>
<rect x="63" y="30" width="74" height="3" rx="1.4" fill="${x.on ? x.hot : "#5a4020"}" opacity="${x.on ? x.op(1) : ".9"}"/>
<circle cx="60" cy="26.5" r="3.6" fill="${x.url("brsD")}"/><circle cx="140" cy="26.5" r="3.6" fill="${x.url("brsD")}"/>${hl("M64 23.6 H136", .55, .9)}`);
    } }),

    base({ id: "ring", name: "Frosted ring", colors: COLRGB, glow: { x: .5, y: .5, r: 1.3 }, render(o) {
      const x = ctx(o), d = ci(100, 100, 76);
      return svg(x, (x.on ? halo(x, d, .3) : wsh(d)) + `<path d="${ci(100, 100, 77.2)}" fill="#14121c"/>` + glass(x, d, [24, 24, 152, 152], 16, "C", .8) +
        band(x, ci(100, 100, 69) + " " + ci(100, 100, 60)) + touch(x, 100, 150, 3.2) + hl("M48 84 C54 62 68 50 86 44", .22, 2));
    } }),

    base({ id: "globebar", name: "Globe bar", colors: COLW, cast: "both", glow: { x: .5, y: .14, r: 1.1 }, colors2: ["#c99a48", "#2a2b33", "#d6d9de", "#ecebf0", "#b8774f"], picker2: true, colorLabel2: "Finish", render(o) {
      const x = ctx(o); x.k2 = "brs"; x.c2v = x.c2 || "#c99a48"; const _t = 0, fo = rr(44, 58, 112, 116, 4), fi = rr(49, 63, 102, 106, 2), X = [32, 66, 100, 134, 168];
      return svg(x, X.map((a) => upw(x, a, 18, 8, 6, 0, .7)).join("") + wsh(fo) + frame(x, fo, fi, "brsD") + glass(x, fi, [49, 63, 102, 106], 17, "T", .7) +
        X.map((a) => wash(x, a, 38, 8, 8, 186, .45)).join("") +
        `<rect x="18" y="24" width="164" height="6" rx="3" fill="${x.url("brsV")}"/><rect x="90" y="20" width="20" height="14" rx="3" fill="${x.url("brsV")}"/>` +
        X.map((a) => glow(x, a, 27, 26, .5)).join("") + X.map((a) => globe(x, a, 27, 11.5)).join(""));
    } }),

    base({ id: "pendants", name: "Twin pendants", colors: COLW, cast: "down", glow: { x: .5, y: .45, r: 1.4 }, colors2: ["#2a2b33", "#c99a48", "#d6d9de", "#ecebf0", "#5a4232"], picker2: true, colorLabel2: "Finish", render(o) {
      const x = ctx(o); x.k2 = "blk"; x.c2v = x.c2 || "#2a2b33"; const _t = 0, fo = rr(62, 40, 76, 140, 3), fi = rr(70, 48, 60, 124, 1.5);
      const pd = (cx) => `${wash(x, cx, 88, 13, 16, 196, .9)}<rect x="${cx - 7}" y="0" width="14" height="3" rx="1" fill="${x.url("blkV")}"/>
<path d="M${cx} 3 V62" stroke="#141219" stroke-width="1.6"/><rect x="${cx - 3.5}" y="60" width="7" height="8" rx="1.4" fill="${x.url("brs")}"/>
${glow(x, cx, 88, 26, .5)}<path d="M${cx - 5} 66 C${cx - 8} 74 ${cx - 15} 80 ${cx - 16} 88 L${cx + 16} 88 C${cx + 15} 80 ${cx + 8} 74 ${cx + 5} 66 Z" fill="${x.url("blk")}"/>
${hl(`M${cx - 8} 72 C${cx - 11} 77 ${cx - 13} 81 ${cx - 14} 85`, .25, 1.4)}<ellipse cx="${cx}" cy="88" rx="16" ry="3" fill="#6e4a17"/>
<ellipse cx="${cx}" cy="88.3" rx="14" ry="2.3" fill="${x.on ? x.url("fill") : "#b08442"}" ${x.on ? `opacity="${x.op(1)}"` : 'opacity=".7"'}/>`;
      return svg(x, wsh(fo) + frame(x, fo, fi, "wdD") + glass(x, fi, [70, 48, 60, 124], 18, "C", .5) +
        `<path d="M64 46 L136 46 M64 176 H136" stroke="#3a1e0a" stroke-opacity=".3" stroke-width=".6"/>` + pd(30) + pd(170));
    } }),

    base({ id: "antifog", name: "Anti-fog LED", glow: { x: .5, y: .5, r: 1.25 }, render(o) {
      const x = ctx(o), d = rr(26, 32, 148, 136, 14);
      const fog = rg(x.id("fog"), x.on ? [[0, "#e9eef8", 0], [.55, "#e9eef8", 0], [.8, "#e9eef8", .12], [1, "#e9eef8", .22]] : [[0, "#e9eef8", .2], [1, "#e9eef8", .26]], .5, .5, .62);
      return svg(x, (x.on ? halo(x, d, .3) : wsh(d)) + glass(x, d, [26, 32, 148, 136], 19, "C", .6) +
        `<path d="${d}" fill="url(#${x.id("fog")})"/>` +
        band(x, rr(36, 46, 9, 108, 4.5)) + band(x, rr(155, 46, 9, 108, 4.5)) +
        touch(x, 92, 154, 3.2) +
        `<circle cx="108" cy="154" r="3.2" fill="none" stroke="${x.on ? x.hot : "#fff"}" stroke-opacity="${x.on ? x.op(.9) : ".35"}" stroke-width=".9"/>
<path d="M106 155.6 C106.6 153.6 107.4 153.6 108 155.6 C108.6 153.6 109.4 153.6 110 155.6" fill="none" stroke="${x.on ? x.hot : "#fff"}" stroke-opacity="${x.on ? x.op(.9) : ".35"}" stroke-width=".7"/>
<path d="M104 151.8 V151 M108 151.8 V150.6 M112 151.8 V151" stroke="${x.on ? x.hot : "#fff"}" stroke-opacity="${x.on ? x.op(.9) : ".3"}" stroke-width=".6" stroke-linecap="round"/>`, fog);
    } }),

    base({ id: "floor", name: "Full-length LED", colors: COLRGB, glow: { x: .5, y: .48, r: 1.3 }, colors2: ["#2a2b33", "#c99a48", "#d6d9de", "#ecebf0", "#5a4232"], picker2: true, colorLabel2: "Frame", render(o) {
      const x = ctx(o); x.k2 = "blk"; x.c2v = x.c2 || "#2a2b33"; const _t = 0, fo = rr(64, 8, 72, 176, 3), fi = rr(67, 11, 66, 170, 1.5), led = rr(68.5, 12.5, 63, 167, 1.2);
      return svg(x, `<rect x="10" y="184" width="180" height="10" fill="#000" opacity=".18"/><path d="M10 184 H190" stroke="#fff" stroke-opacity=".12" stroke-width=".7"/>` +
        (x.on ? halo(x, fo, .6) : wsh(fo, 4, 0, .3)) + shadow(x, 100, 185, 48, 4) + pool(x, 100, 188, 80, 6, 1.1) +
        frame(x, fo, fi, "blkD") + glass(x, fi, [67, 11, 66, 170], 20, "C", .7) +
        `<rect x="67" y="128" width="66" height="53" fill="#2a2120" opacity=".18"/>` +
        (x.on ? `<path d="${led}" fill="none" stroke="${x.c}" stroke-opacity="${x.op(.45)}" stroke-width="4"/><path d="${led}" fill="none" stroke="${x.hot}" stroke-opacity="${x.op(1)}" stroke-width="1.4"/>`
          : `<path d="${led}" fill="none" stroke="#e9e6f2" stroke-opacity=".25" stroke-width="1.2"/>`) +
        hl("M72 40 C73 28 76 18 82 14", .3, 1.4));
    } }),
  ];

  (window.HDA = window.HDA || []).push({
    id: "mirror",
    tab: "Mirror lights",
    group: "Lights",
    kind: "light",
    intro: "Twenty bathroom and dressing mirrors: backlit LED mirrors that halo the wall, vanity bars and sconces that wash light down, and makeup mirrors with bulbs or rings. The glass always shows a soft reflection.",
    
    css: `.hda-mirror-shine{transform-box:view-box;opacity:0}
.hda-anim .hda-mirror-shine{animation:hda-mirror-shine 9s ease-in-out infinite}
.hda-anim .hda-mirror-fil{animation:hda-mirror-fil 3.4s ease-in-out infinite}
@keyframes hda-mirror-shine{0%{transform:translate(-120px,0);opacity:0}8%{opacity:1}30%{transform:translate(160px,0);opacity:1}34%,100%{transform:translate(160px,0);opacity:0}}
@keyframes hda-mirror-fil{0%,100%{opacity:1}45%{opacity:.86}55%{opacity:.95}}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-mirror-shine,.hda-anim .hda-mirror-fil{animation:none}}`,
    icons,
  });
})();
