(function () {
  const H = window.HDAH, P = "hda-outdoor2-";
  const f = (n) => (+n).toFixed(1);
  const rnd = (seed) => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
  const BRASS = "#c9a24a", BRONZE = "#5a4636", BLACK = "#2a2c31", VERD = "#5a8a7a", WHITE = "#eceae6", SILVER = "#b8bdc4", GALV = "#a9b0b8", WOOD = "#9a6a42";
  const WARM = "#ffc477";

  function ctx(o) {
    const c = o.color || BLACK, lv = o.level == null ? 1 : o.level, on = !!o.on;
    const id = (s) => `${o.uid}-${s}`, url = (s) => `url(#${o.uid}-${s})`;
    const L = on ? .3 + .7 * lv : 0;
    return { c, on, lv, L, id, url, lc: WARM, lhot: H.mix(WARM, "#fff", .6), op: (k) => Math.min(1, k * L).toFixed(2) };
  }
  const stops = (a) => a.map(([o, c, op]) => `<stop offset="${o}" stop-color="${c}"${op == null ? "" : ` stop-opacity="${op}"`}/>`).join("");
  const lg = (id, a, x1, y1, x2, y2) => `<linearGradient id="${id}" x1="${x1 || 0}" y1="${y1 || 0}" x2="${x2 == null ? 1 : x2}" y2="${y2 || 0}">${stops(a)}</linearGradient>`;
  const rg = (id, a, cx, cy, r) => `<radialGradient id="${id}" cx="${cx == null ? .5 : cx}" cy="${cy == null ? .5 : cy}" r="${r || .5}">${stops(a)}</radialGradient>`;

  function defs(x, extra) {
    const { c, id } = x, S = H.shade, W = x.lc;
    return `<defs>
<clipPath id="${id("wc")}"><rect x="8" y="8" width="184" height="184" rx="16"/></clipPath>
${rg(id("vig"), [[0, "#000", 0], [.62, "#000", .05], [1, "#000", .48]], .5, .48, .74)}
${lg(id("bd"), [[0, S(c, .22)], [.5, c], [1, S(c, -.3)]], 0, 0, 0, 1)}
${lg(id("bdh"), [[0, S(c, -.3)], [.18, S(c, .25)], [.5, c], [.85, S(c, -.12)], [1, S(c, -.42)]])}
${lg(id("bds"), [[0, S(c, -.2)], [1, S(c, -.45)]], 0, 0, 0, 1)}
${rg(id("halo"), [[0, W, .85], [.45, W, .3], [1, W, 0]])}
${rg(id("pool"), [[0, x.lhot, .75], [.35, W, .42], [1, W, 0]])}
${lg(id("cu"), [[0, W, .75], [.45, W, .28], [1, W, 0]], 0, 1, 0, 0)}
${lg(id("sky"), [[0, "#1d2a48"], [.6, "#3a4a6c"], [1, "#6f6f8a"]], 0, 0, 0, 1)}
${lg(id("lawn"), [[0, "#3a5a34"], [1, "#1a2e1c"]], 0, 0, 0, 1)}
${lg(id("conc"), [[0, "#6e6f74"], [1, "#404146"]], 0, 0, 0, 1)}
${lg(id("asph"), [[0, "#3a3c42"], [1, "#24252a"]], 0, 0, 0, 1)}
${lg(id("stuc"), [[0, "#8a7a66"], [1, "#5e5244"]], 0, 0, 0, 1)}
${lg(id("door"), [[0, "#6a3a22"], [1, "#4a2614"]])}
${lg(id("brs"), [[0, "#6e4a17"], [.22, "#c99a48"], [.38, "#fbe7a6"], [.58, "#b07f33"], [.82, "#7a5118"], [1, "#4d3210"]])}
${lg(id("chr"), [[0, "#4a4f5c"], [.2, "#e9ecf4"], [.36, "#8e94a6"], [.55, "#f4f6fb"], [.8, "#6c7284"], [1, "#3a3e4a"]])}
${lg(id("post"), [[0, "#4a3220"], [.4, "#8a6440"], [1, "#3a2616"]])}
${rg(id("sh"), [[0, "#000", .6], [.6, "#000", .22], [1, "#000", 0]])}
${rg(id("lens"), [[0, "#7a8399"], [.6, "#2b3140"], [1, "#0d1016"]], .4, .35, .7)}
<filter id="${id("bl")}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.2"/></filter>
${extra || ""}</defs>`;
  }
  function svg(x, s, extra) {
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs(x, extra)}
<g clip-path="${x.url("wc")}"><g class="hda-bg"><rect x="8" y="8" width="184" height="184" fill="#1c1b24"/>${s.bg || ""}</g>${s.light || ""}<g class="hda-bg"><rect x="8" y="8" width="184" height="184" fill="${x.url("vig")}"/></g>${s.fx || ""}</g>
<g class="hda-bg"><rect x="8.5" y="8.5" width="183" height="183" rx="15.5" fill="none" stroke="#fff" stroke-opacity=".08"/></g></svg>`;
  }
  const E = (cx, cy, rx, ry, fill, more) => `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}" ${more || ""}/>`;
  const shadow = (x, cx, cy, rx, ry, k) => E(cx, cy, rx, ry, x.url("sh"), `opacity="${k == null ? .8 : k}"`);
  const hl = (d, o, w) => `<path d="${d}" fill="none" stroke="#fff" stroke-opacity="${o == null ? .35 : o}" stroke-width="${w || 1.2}" stroke-linecap="round"/>`;
  const drop = (x, shape, dx, dy, k) => `<g transform="translate(${dx == null ? 3 : dx} ${dy == null ? 5 : dy})" fill="#000" opacity="${k == null ? .45 : k}" filter="${x.url("bl")}">${shape}</g>`;
  const led = (cx, cy, r, col, on, blink) => `<circle cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="${on ? col : "#2a2c30"}" ${on && blink ? `class="${P}blink"` : ""}/>${on ? `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r * 2.6)}" fill="${col}" fill-opacity=".25"/>` : ""}`;
  function beam(x, lx, ly, tx, ty, w0, w1, k) {
    if (!x.on) return "";
    const dx = tx - lx, dy = ty - ly, D = Math.hypot(dx, dy) || 1, nx = -dy / D, ny = dx / D, gid = x.id("bm" + Math.round(lx + ly));
    const Pp = (a, b) => `M${f(lx + nx * a)} ${f(ly + ny * a)} L${f(tx + nx * b)} ${f(ty + ny * b)} L${f(tx - nx * b)} ${f(ty - ny * b)} L${f(lx - nx * a)} ${f(ly - ny * a)} Z`;
    return `<linearGradient id="${gid}" gradientUnits="userSpaceOnUse" x1="${f(lx)}" y1="${f(ly)}" x2="${f(tx)}" y2="${f(ty)}">${stops([[0, x.lhot, .85], [.3, x.lc, .34], [1, x.lc, .04]])}</linearGradient>
<path d="${Pp(w0 * 1.3, w1 * 1.15)}" fill="url(#${gid})" opacity="${x.op(.35 * k)}"/><path d="${Pp(w0, w1)}" fill="url(#${gid})" opacity="${x.op(.5 * k)}"/>`;
  }
  function sky(x, y1, seed) { const r = rnd(seed); let s = `<rect x="8" y="8" width="184" height="${y1 - 8}" fill="${x.url("sky")}"/>`; for (let i = 0; i < 12; i++) s += `<circle cx="${f(12 + r() * 176)}" cy="${f(12 + r() * (y1 - 30))}" r="${f(.4 + r() * .5)}" fill="#fff" fill-opacity="${(.3 + r() * .4).toFixed(2)}"/>`; return s; }
  function lawn(x, y0, seed) { const r = rnd(seed); let s = `<rect x="8" y="${y0}" width="184" height="${192 - y0}" fill="${x.url("lawn")}"/>`; for (let i = 0; i < 60; i++) { const bx = 8 + r() * 184, by = y0 + 3 + r() * (192 - y0); s += `<path d="M${f(bx)} ${f(by)} l${f((r() - .5) * 2)} -${f(2 + r() * 4)}" stroke="${r() > .5 ? "#5f8c52" : "#0b170e"}" stroke-opacity=".6" stroke-width=".8"/>`; } return s; }
  function bricks(x0, y0, x1, y1, seed, base) {
    const r = rnd(seed); let s = `<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" fill="${base || "#5e3a2b"}"/>`;
    for (let row = 0, y = y0; y < y1; y += 11, row++) {
      for (let bx = x0 - (row % 2) * 12; bx < x1; bx += 24) { const v = r(); s += `<rect x="${f(bx + .8)}" y="${f(y + .8)}" width="22.4" height="9.4" rx="1.1" fill="${v > .5 ? "#000" : "#e3a07f"}" fill-opacity="${(.04 + v * .1).toFixed(2)}"/><path d="M${f(bx)} ${y} v11" stroke="#bcae9f" stroke-opacity=".2" stroke-width="1.5"/>`; }
      s += `<path d="M${x0} ${y} H${x1}" stroke="#bcae9f" stroke-opacity=".22" stroke-width="1.5"/>`;
    }
    return s;
  }
  function stucco(x, x0, y0, x1, y1, seed) { const r = rnd(seed); let s = `<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" fill="${x.url("stuc")}"/>`; for (let i = 0; i < 100; i++) s += `<circle cx="${f(x0 + r() * (x1 - x0))}" cy="${f(y0 + r() * (y1 - y0))}" r="${f(.3 + r())}" fill="${r() > .5 ? "#000" : "#fff"}" fill-opacity="${(.04 + r() * .08).toFixed(2)}"/>`; return s; }
  const drive = (x, y0) => `<rect x="8" y="${y0}" width="184" height="${192 - y0}" fill="${x.url("asph")}"/><path d="M8 ${y0} H192" stroke="#fff" stroke-opacity=".12"/>`;
  const letter = (cx, cy, w, h, rot) => `<g transform="translate(${cx} ${cy}) rotate(${rot || 0})"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="#f4efe2"/><path d="M${-w / 2} ${-h / 2} L0 ${h * .1} L${w / 2} ${-h / 2}" fill="none" stroke="#b8b0a0" stroke-width=".8"/><rect x="${w * .2}" y="${-h * .38}" width="${w * .18}" height="${h * .3}" fill="#c0392b" fill-opacity=".8"/></g>`;

  const base = (o) => Object.assign({ picker: true, colorLabel: "Finish" }, o);
  const SPOT = [BRASS, BRONZE, BLACK, VERD];
  const GATE = [BLACK, BRONZE, WHITE, SILVER, WOOD];

  function slatPanel(x, w, h) { let s = `<rect x="0" y="${-h}" width="${w}" height="${h}" fill="${x.url("bds")}" fill-opacity=".35"/>`; for (let y = -h + 4; y < -4; y += 7.6) s += `<rect x="3" y="${f(y)}" width="${w - 6}" height="5.6" fill="${x.url("bd")}"/><path d="M3 ${f(y + 5.6)} H${w - 3}" stroke="#000" stroke-opacity=".35"/>`; return s + `<rect x="0" y="${-h}" width="${w}" height="${h}" fill="none" stroke="${H.shade(x.c, -.35)}" stroke-width="3.4"/>`; }
  function chainPanel(x, w, h) {
    const pid = x.id("cl");
    return `<pattern id="${pid}" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="7" fill="none"/><path d="M0 0 H7 M0 0 V7" stroke="#c9ced4" stroke-opacity=".75" stroke-width=".8"/></pattern>
<rect x="2" y="${-h + 2}" width="${w - 4}" height="${h - 4}" fill="url(#${pid})"/><rect x="0" y="${-h}" width="${w}" height="${h}" fill="none" stroke="${x.url("bdh")}" stroke-width="4"/><path d="M2 ${-h / 2} H${w - 2} M${w / 2} ${-h} V0" stroke="${H.shade(x.c, -.1)}" stroke-width="2.4"/><path d="M2 -2 L${w - 2} ${-h + 2}" stroke="${H.shade(x.c, -.1)}" stroke-width="1.6" stroke-dasharray="3 2"/>`;
  }
  function ironPanel(x, w, h) {
    let s = `<path d="M0 ${-h + 10} Q${w / 2} ${-h - 10} ${w} ${-h + 10}" fill="none" stroke="${x.url("bd")}" stroke-width="3.4"/><path d="M0 -8 H${w} M0 ${-h + 22} H${w}" stroke="${x.url("bd")}" stroke-width="3"/>`;
    for (let bx = 4; bx < w; bx += 8) { const top = -h + 10 - Math.sin(bx / w * Math.PI) * 15; s += `<path d="M${bx} 0 V${f(top)}" stroke="${H.shade(x.c, -.15)}" stroke-width="2"/><path d="M${bx - 2.4} ${f(top + 1)} L${bx} ${f(top - 6)} L${bx + 2.4} ${f(top + 1)} Z" fill="${H.shade(x.c, .1)}"/>`; }
    for (let bx = 12; bx < w - 6; bx += 16) s += `<circle cx="${bx}" cy="${-h + 30}" r="4" fill="none" stroke="${H.shade(x.c, -.1)}" stroke-width="1.4"/>`;
    return s + `<rect x="-2" y="${-h - 2}" width="5" height="${h + 2}" fill="${x.url("bdh")}"/><rect x="${w - 3}" y="${-h + 6}" width="5" height="${h - 6}" fill="${x.url("bdh")}"/>`;
  }
  function gateScene(x, panel, opts) {
    const open = x.on ? 80 : 0, w = 116, h = opts.h || 70;
    const bg = sky(x, 108, 11) + `<rect x="8" y="94" width="184" height="16" fill="#1c2a1e"/>` + Array.from({ length: 9 }, (_, i) => `<circle cx="${20 + i * 22}" cy="${96 - (i % 3) * 4}" r="${12 + (i % 2) * 4}" fill="#1f3322"/>`).join("") + drive(x, 150) + lawn(x, 108, 5).replace(/height="84"/, 'height="42"');
    const rail = opts.track ? `<rect x="10" y="158" width="180" height="3" fill="url(#${x.id("chr")})"/>` : "";
    const wheels = opts.track ? [14, w - 14].map((wx) => `<circle cx="${wx}" cy="-2" r="4.4" fill="#222"/><circle cx="${wx}" cy="-2" r="1.6" fill="#888"/>`).join("") : "";
    const gate = `<g transform="translate(${44 - open} 158)">${drop(x, `<rect x="0" y="${-h}" width="${w}" height="${h}"/>`, 3, 2, .3)}${panel(x, w, h)}${wheels}</g>`;
    const cant = opts.cant ? [16, 34].map((px) => `<rect x="${px}" y="96" width="6" height="64" fill="url(#${x.id("chr")})"/><rect x="${px - 3}" y="118" width="12" height="8" rx="2" fill="#333"/><rect x="${px - 3}" y="146" width="12" height="8" rx="2" fill="#333"/>`).join("") : "";
    const posts = `<rect x="36" y="${158 - h - 14}" width="10" height="${h + 20}" fill="${opts.postFill || "#7a7066"}"/><rect x="34" y="${158 - h - 18}" width="14" height="5" fill="#9a9086"/><rect x="160" y="${158 - h - 14}" width="10" height="${h + 20}" fill="${opts.postFill || "#7a7066"}"/><rect x="158" y="${158 - h - 18}" width="14" height="5" fill="#9a9086"/>`;
    const fence = `<rect x="8" y="${158 - h + 6}" width="28" height="${h - 6}" fill="${opts.fenceFill || "#5a5048"}"/>${Array.from({ length: 4 }, (_, i) => `<path d="M8 ${158 - h + 14 + i * 14} H36" stroke="#000" stroke-opacity=".3"/>`).join("")}`;
    const motor = `<rect x="48" y="146" width="14" height="14" rx="2" fill="#3a3d44"/><rect x="50" y="148" width="10" height="3" fill="#5a5d66"/>${led(55, 155, 1, "#7dff9a", x.on, true)}`;
    return svg(x, { bg: bg + rail, fx: shadow(x, 100, 162, 70, 4, .5) + cant + gate + `<g>${posts}${fence}</g>` + (opts.cant ? "" : motor) });
  }

  function barrier(x, armSvg, extraFx) {
    const bg = sky(x, 120, 21) + `<rect x="8" y="96" width="184" height="24" fill="#24303a"/>${Array.from({ length: 8 }, (_, i) => `<rect x="${14 + i * 24}" y="${88 - (i % 3) * 8}" width="18" height="${32 + (i % 3) * 8}" fill="#1c2630"/>`).join("")}
<rect x="8" y="120" width="184" height="72" fill="#3a3c42"/><path d="M8 120 H192" stroke="#fff" stroke-opacity=".15"/>${[90, 130].map((a) => `<path d="M${a} 150 h18" stroke="#e8e0b0" stroke-opacity=".6" stroke-width="3"/>`).join("")}<rect x="8" y="166" width="184" height="6" fill="#8a8a88"/>`;
    const fx = shadow(x, 42, 170, 24, 4) + armSvg + `<rect x="24" y="110" width="34" height="58" rx="3" fill="${x.url("bdh")}"/><path d="M24 110 L32 104 H66 L58 110 Z" fill="${x.url("bd")}"/><path d="M58 110 L66 104 V162 L58 168 Z" fill="${x.url("bds")}"/>
<rect x="30" y="126" width="22" height="30" rx="2" fill="none" stroke="#000" stroke-opacity=".3"/><circle cx="48" cy="141" r="1.6" fill="#333"/><circle cx="46" cy="116" r="6" fill="#3a3d44"/><circle cx="46" cy="116" r="2.4" fill="${x.url("chr")}"/>${hl("M27 114 V164", .35, 1.2)}` + (extraFx || "");
    return svg(x, { bg, fx });
  }
  const stripes = (len, col) => Array.from({ length: Math.floor((len - 10) / 16) }, (_, i) => `<rect x="${12 + i * 16}" y="-3" width="8" height="6" fill="${col || "#d83a3a"}"/>`).join("");

  function doorBg(x, col) {
    return bricks(8, 8, 192, 192, 5).replace('fill="#5e3a2b"', 'fill="#5a3a2c"') + `<rect x="36" y="8" width="128" height="184" fill="#e8e4dc"/><rect x="44" y="8" width="112" height="184" fill="${col || x.url("door")}"/>
<rect x="56" y="20" width="88" height="54" rx="2" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="2"/><rect x="56" y="124" width="88" height="60" rx="2" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="2"/><path d="M57 21 H143 M57 125 H143" stroke="#fff" stroke-opacity=".12"/>`;
  }

  const icons = [
    base({ id: "brassspike", name: "Brass spike spot", colors: SPOT, render(o) {
      const x = ctx(o);
      const bg = stucco(x, 8, 8, 192, 150, 3) + `<rect x="8" y="148" width="184" height="44" fill="#3a2a1e"/>` + Array.from({ length: 40 }, (_, i) => `<path d="M${f(10 + (i * 47) % 180)} ${f(152 + (i * 13) % 38)} l3 1" stroke="#7a5638" stroke-width="1.2" stroke-opacity=".6"/>`).join("") +
        Array.from({ length: 6 }, (_, i) => `<circle cx="${130 + (i % 3) * 14}" cy="${130 - Math.floor(i / 3) * 16}" r="13" fill="${["#24402a", "#2f4d2f", "#1f3a26"][i % 3]}"/>`).join("");
      const lx = 89, ly = 118;
      const light = beam(x, lx, ly, 120, 40, 4, 40, 1) + (x.on ? `<ellipse cx="120" cy="56" rx="50" ry="56" fill="${x.url("halo")}" opacity="${x.op(.35)}"/>` : "");
      const fx = `<g transform="translate(70 186) scale(1.6) translate(-70 -186)"><path d="M68 186 L70 160" stroke="#222" stroke-width="2"/><path d="M66 186 L70 194 L74 186 Z" fill="#222"/><circle cx="70" cy="159" r="3.4" fill="${x.url("bd")}"/>
<g transform="translate(71 158) rotate(-62)"><rect x="0" y="-7" width="26" height="14" rx="3" fill="${x.url("bd")}"/><path d="M14 -8.4 L34 -8.4 L34 7 L26 7" fill="${x.url("bdh")}"/><path d="M14 -8.4 H34" stroke="#fff" stroke-opacity=".3"/>
${x.on ? `<ellipse cx="26.4" cy="0" rx="2" ry="6" fill="${x.lhot}"/><ellipse cx="28" cy="0" rx="10" ry="12" fill="${x.url("halo")}" opacity="${x.op(1)}"/>` : `<ellipse cx="26.4" cy="0" rx="2" ry="6" fill="${x.url("lens")}"/>`}${hl("M3 -4 H22", .4, 1)}</g>
<path d="M70 162 C64 170 58 178 50 186" stroke="#111" stroke-width="1.2" fill="none"/></g>`;
      return svg(x, { bg, light, fx });
    } }),
    base({ id: "floodstake", name: "LED flood stake", colors: [BLACK, BRONZE, "#8a8f96", WHITE], render(o) {
      const x = ctx(o);
      let sid = `<rect x="8" y="8" width="184" height="152" fill="#5c6670"/>`; for (let y = 8; y < 160; y += 11) sid += `<path d="M8 ${y + 10} H192" stroke="#000" stroke-opacity=".35" stroke-width="1.6"/>`;
      const bg = sid + `<rect x="8" y="152" width="184" height="40" fill="${x.url("lawn")}"/>` + Array.from({ length: 5 }, (_, i) => `<circle cx="${28 + i * 36}" cy="${150 + (i % 2) * 4}" r="${14 + (i % 2) * 3}" fill="${["#24402a", "#2f4d2f"][i % 2]}"/>`).join("");
      const light = beam(x, 112, 140, 112, 30, 12, 70, 1.1) + (x.on ? `<ellipse cx="112" cy="70" rx="80" ry="70" fill="${x.url("halo")}" opacity="${x.op(.35)}"/>` : "");
      const fx = `<path d="M110 190 V158" stroke="#1a1a1e" stroke-width="3"/><path d="M106 190 L110 198 L114 190 Z" fill="#1a1a1e"/><path d="M104 160 H116 L110 152 Z" fill="${x.url("bd")}"/>
<g transform="translate(110 150) rotate(-18)"><rect x="-18" y="-16" width="36" height="16" rx="2.4" fill="${x.url("bd")}"/>${[-12, -6, 0, 6, 12].map((a) => `<path d="M${a} -16 V-20" stroke="${H.shade(x.c, -.3)}" stroke-width="2.4"/>`).join("")}
<rect x="-15" y="-13" width="30" height="5" rx="1" fill="${x.on ? x.lhot : "#2a2e38"}" ${x.on ? `opacity="${(.6 + .4 * x.L).toFixed(2)}"` : ""}/>${x.on ? `<ellipse cx="0" cy="-12" rx="22" ry="9" fill="${x.url("halo")}" opacity="${x.op(1)}"/>` : ""}${hl("M-15 -3 H15", .25, 1)}</g>`;
      return svg(x, { bg, light, fx });
    } }),

    base({ id: "slatgate", name: "Aluminum slat slider", colors: GATE, render(o) { return gateScene(ctx(o), slatPanel, { track: true, h: 66, postFill: "#4a4e56", fenceFill: "#3a3e46" }); } }),
    base({ id: "chainlink", name: "Chain-link cantilever", colors: [GALV, BLACK, "#2f4a34", SILVER], render(o) { return gateScene(ctx(o), chainPanel, { cant: true, h: 62, postFill: "#9aa0a8", fenceFill: "#6a7078" }); } }),
    base({ id: "irongate", name: "Wrought iron slider", colors: [BLACK, BRONZE, "#2f4a34", WHITE], render(o) { return gateScene(ctx(o), ironPanel, { track: true, h: 64, postFill: "#8a7a66", fenceFill: "#6a5a48" }); } }),

    base({ id: "foldarm", name: "Folding-arm barrier", colorLabel: "Body", colors: ["#f2b632", "#e8833a", "#c9ccd2", "#3a3d44"], render(o) {
      const x = ctx(o), seg = (len) => `<rect x="0" y="-3" width="${len}" height="6" rx="3" fill="#f4f4f2"/>${stripes(len)}<rect x="0" y="-3" width="${len}" height="6" rx="3" fill="none" stroke="#000" stroke-opacity=".3"/>`;
      const arm = x.on ? `<g transform="translate(46 116) rotate(-90)">${seg(56)}</g><g transform="translate(46 60)">${seg(70)}<circle r="4" fill="#3a3d44"/></g>`
        : `<g transform="translate(46 116)">${seg(62)}<g transform="translate(62 0)">${seg(70)}<circle r="4" fill="#3a3d44"/></g></g>`;
      return barrier(x, arm, `<rect x="34" y="96" width="14" height="8" rx="2" fill="${x.on ? "#7dff9a" : "#d83a3a"}" ${x.on ? `class="${P}blink"` : ""}/>`);
    } }),
    base({ id: "ledarm", name: "LED strip boom", colorLabel: "Body", colors: ["#c9ccd2", "#3a3d44", "#f2b632", WHITE], render(o) {
      const x = ctx(o), col = x.on ? "#5cf08a" : "#ff4a3a";
      const arm = `<g transform="translate(46 116) rotate(${x.on ? -84 : 0})"><rect x="0" y="-4" width="128" height="8" rx="4" fill="#f4f4f2"/><rect x="2" y="-1.2" width="124" height="2.4" rx="1.2" fill="${col}"/><rect x="2" y="-4" width="124" height="8" rx="4" fill="${col}" fill-opacity=".18" class="${P}pulse"/><rect x="0" y="-4" width="128" height="8" rx="4" fill="none" stroke="#000" stroke-opacity=".25"/></g>`;
      return barrier(x, arm);
    } }),
    base({ id: "skirtarm", name: "Barrier with skirt", colorLabel: "Body", colors: ["#f2b632", "#c9ccd2", "#e8833a", "#3a3d44"], render(o) {
      const x = ctx(o), th = x.on ? -86 : 0, a = -th * Math.PI / 180, ux = -Math.sin(a), uy = Math.cos(a);
      let sk = ""; for (let bx = 18; bx < 120; bx += 10) sk += `<path d="M${bx} 3 l${f(ux * 22)} ${f(uy * 22)}" stroke="#d8dadf" stroke-width="2"/>`;
      if (!x.on) sk += `<path d="M18 25 H118" stroke="#d8dadf" stroke-width="1.6"/>`;
      const arm = `<g transform="translate(46 116) rotate(${th})">${sk}<rect x="0" y="-3" width="124" height="6" rx="3" fill="#f4f4f2"/>${stripes(124)}<rect x="0" y="-3" width="124" height="6" rx="3" fill="none" stroke="#000" stroke-opacity=".3"/></g>`;
      return barrier(x, arm);
    } }),

    base({ id: "postbox", name: "Post-mount mailbox", colors: [BLACK, "#2f4a34", GALV, WHITE, "#7a2a24"], render(o) {
      const x = ctx(o);
      const bg = sky(x, 130, 31) + lawn(x, 130, 7) + `<path d="M8 168 H192 V192 H8 Z" fill="${x.url("conc")}"/><path d="M8 168 H192" stroke="#fff" stroke-opacity=".25"/>`;
      const box = "M44 108 V70 C44 56 52 50 64 50 H136 C148 50 156 56 156 70 V108 Z";
      const fx = shadow(x, 100, 170, 30, 4) + `<rect x="92" y="104" width="16" height="66" fill="${x.url("post")}"/><rect x="70" y="104" width="60" height="8" fill="${x.url("post")}"/>
${drop(x, `<path d="${box}"/>`, 2, 4, .45)}<path d="${box}" fill="${x.url("bd")}"/><path d="M44 70 C44 56 52 50 64 50 H136" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="1.6"/>${[70, 100, 130].map((a) => `<path d="M${a} 52 V107" stroke="#000" stroke-opacity=".15"/>`).join("")}
<path d="M44 108 V70 C44 60 48 54 54 52 V108 Z" fill="${H.shade(x.c, -.35)}"/><rect x="46" y="74" width="4" height="10" rx="1" fill="${x.url("chr")}"/>
<g transform="translate(152 86) rotate(${x.on ? -90 : 0})"><rect x="0" y="-3" width="30" height="6" rx="1" fill="#d83a2a"/><rect x="20" y="-8" width="12" height="16" rx="1" fill="#d83a2a"/></g><circle cx="152" cy="86" r="3" fill="#333"/>`;
      return svg(x, { bg, fx });
    } }),
    base({ id: "castbox", name: "Decorative mailbox", colors: [BLACK, BRONZE, "#2f4a34", WHITE], render(o) {
      const x = ctx(o);
      const bg = sky(x, 140, 41) + lawn(x, 140, 9) + `<rect x="8" y="176" width="184" height="16" fill="${x.url("conc")}"/>`;
      const box = "M58 92 V66 C58 52 66 44 80 44 H120 C134 44 142 52 142 66 V92 Z";
      const fx = shadow(x, 100, 178, 34, 4) + `<path d="M76 178 C80 168 88 166 92 160 V100 H108 V160 C112 166 120 168 124 178 Z" fill="${x.url("bdh")}"/>${[95, 100, 105].map((a) => `<path d="M${a} 104 V158" stroke="#000" stroke-opacity=".3"/>`).join("")}
<path d="M92 120 C80 118 74 108 82 102 C86 100 90 104 88 108" fill="none" stroke="${H.shade(x.c, .1)}" stroke-width="3"/><path d="M108 120 C120 118 126 108 118 102 C114 100 110 104 112 108" fill="none" stroke="${H.shade(x.c, .1)}" stroke-width="3"/>
<rect x="86" y="92" width="28" height="10" fill="${x.url("bd")}"/>${drop(x, `<path d="${box}"/>`, 2, 4, .45)}<path d="${box}" fill="${x.url("bd")}"/><path d="M58 66 C58 52 66 44 80 44 H120" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="1.6"/>
<path d="M66 88 V66 C66 58 72 52 80 52 H120 C128 52 134 58 134 66 V88 Z" fill="none" stroke="${H.shade(x.c, .2)}" stroke-width="1.6"/><circle cx="100" cy="72" r="6" fill="none" stroke="#c9a24a" stroke-width="1.4"/><path d="M100 44 V36" stroke="${H.shade(x.c, -.2)}" stroke-width="2"/><circle cx="100" cy="34" r="3.4" fill="#c9a24a"/>
<g transform="translate(140 72) rotate(${x.on ? -90 : 0})"><rect x="0" y="-2.6" width="24" height="5.2" rx="1" fill="#d83a2a"/><rect x="16" y="-7" width="10" height="14" rx="1" fill="#d83a2a"/></g><circle cx="140" cy="72" r="2.6" fill="#c9a24a"/>`;
      return svg(x, { bg, fx });
    } }),
    base({ id: "parcel", name: "Locking parcel box", colors: [BLACK, "#5a5e66", BRONZE, WHITE, "#2f4a34"], render(o) {
      const x = ctx(o);
      let sid = `<rect x="8" y="8" width="184" height="160" fill="#a8a094"/>`; for (let y = 8; y < 168; y += 12) sid += `<path d="M8 ${y + 11} H192" stroke="#000" stroke-opacity=".3" stroke-width="1.6"/>`;
      const bg = sid + `<rect x="8" y="160" width="184" height="32" fill="${x.url("conc")}"/><path d="M8 160 H192" stroke="#fff" stroke-opacity=".25"/><rect x="138" y="24" width="40" height="120" fill="#2a3a44"/><rect x="134" y="20" width="48" height="128" fill="none" stroke="#e8e4dc" stroke-width="6"/>`;
      const fx = shadow(x, 92, 168, 42, 5) + `<path d="M118 34 L128 28 V162 L118 168 Z" fill="${x.url("bds")}"/><path d="M58 34 L68 28 H128 L118 34 Z" fill="${H.shade(x.c, .2)}"/><rect x="58" y="34" width="60" height="134" rx="2" fill="${x.url("bdh")}"/>
<path d="M62 40 H114 L110 62 H66 Z" fill="${H.shade(x.c, -.25)}"/><path d="M62 40 H114" stroke="#fff" stroke-opacity=".3"/><rect x="80" y="64" width="16" height="3" rx="1.4" fill="${x.url("chr")}"/>${x.on ? `<path d="M74 58 L78 44 H100 L104 58 Z" fill="#b8865a"/><path d="M78 44 H100" stroke="#8a6440"/>` : ""}
<rect x="64" y="78" width="48" height="82" rx="2" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="1.4"/><circle cx="104" cy="118" r="4" fill="${x.url("chr")}"/><rect x="103" y="116" width="2" height="4" fill="#222"/>
<rect x="72" y="86" width="14" height="6" rx="1.4" fill="#0e1014"/>${led(76, 89, 1.3, "#7dff9a", x.on, true)}${led(82, 89, 1.3, "#ff5a3a", !x.on, false)}${hl("M61 38 V164", .35, 1.2)}`;
      return svg(x, { bg, fx });
    } }),

    base({ id: "brassslot", name: "Brass door slot", colors: [BRASS, BLACK, SILVER, BRONZE], render(o) {
      const x = ctx(o);
      const fx = drop(x, `<rect x="56" y="90" width="88" height="28" rx="3"/>`, 1, 3, .5) + `<rect x="56" y="90" width="88" height="28" rx="3" fill="${x.url("bd")}"/><rect x="59" y="93" width="82" height="22" rx="2" fill="none" stroke="#fff" stroke-opacity=".3"/>
<rect x="66" y="99" width="68" height="10" rx="2" fill="#0c0c10"/>${x.on ? letter(100, 98, 44, 18, -4) : ""}<path d="M64 97 H136 L134 ${x.on ? 92 : 103} H66 Z" fill="${x.url("bdh")}"/><path d="M64 97 H136" stroke="#fff" stroke-opacity=".4"/>
<circle cx="62" cy="104" r="1.6" fill="${H.shade(x.c, -.4)}"/><circle cx="138" cy="104" r="1.6" fill="${H.shade(x.c, -.4)}"/><circle cx="132" cy="150" r="5" fill="${x.url("brs")}"/>`;
      return svg(x, { bg: doorBg(x), fx });
    } }),
    base({ id: "chute", name: "Wall chute + rear box", colors: [BRASS, BLACK, SILVER, WHITE], render(o) {
      const x = ctx(o);
      const bg = bricks(8, 8, 74, 192, 9) + `<rect x="74" y="8" width="20" height="184" fill="#8f8878"/><path d="M74 8 V192 M94 8 V192" stroke="#000" stroke-opacity=".35"/>` + `<rect x="94" y="8" width="98" height="184" fill="#6a6660"/><rect x="94" y="164" width="98" height="28" fill="#5a4430"/>`;
      const fx = `<rect x="62" y="72" width="14" height="30" rx="2" fill="${x.url("bdh")}"/><rect x="66" y="82" width="6" height="10" fill="#0c0c10"/>
<path d="M76 80 H100 V96 H76 Z" fill="#3a3a40"/><path d="M76 80 H100" stroke="#fff" stroke-opacity=".15"/>` + drop(x, `<rect x="100" y="70" width="70" height="80"/>`, 3, 5, .5) +
        `<rect x="100" y="70" width="70" height="80" rx="3" fill="${x.url("bd")}"/><rect x="106" y="84" width="58" height="60" rx="2" fill="${H.shade(x.c, -.15)}"/><path d="M106 84 H164" stroke="#fff" stroke-opacity=".25"/><rect x="128" y="96" width="14" height="4" rx="2" fill="#0c0c10"/>${x.on ? `<rect x="112" y="136" width="46" height="4" rx="1" fill="#000" fill-opacity=".3"/>` : ""}
<rect x="100" y="70" width="70" height="10" rx="2" fill="${H.shade(x.c, .15)}"/><circle cx="135" cy="128" r="3.6" fill="${x.url("chr")}"/>${led(158, 76, 1.4, "#ff5a3a", x.on, true)}${hl("M103 82 V146", .35, 1)}` +
        (x.on ? `<g class="${P}drop">${letter(86, 88, 14, 9, 0)}</g>` : "");
      return svg(x, { bg, fx });
    } }),
    base({ id: "steelplate", name: "Stainless letter plate", colors: [SILVER, BLACK, BRASS, "#3a3d44"], render(o) {
      const x = ctx(o);
      const fx = drop(x, `<rect x="88" y="54" width="24" height="96" rx="2"/>`, 1, 3, .5) + `<rect x="88" y="54" width="24" height="96" rx="2" fill="${x.url("bdh")}"/>${Array.from({ length: 30 }, (_, i) => `<path d="M90 ${56 + i * 3.1} H110" stroke="#fff" stroke-opacity=".06"/>`).join("")}
<rect x="96" y="64" width="8" height="58" rx="1.6" fill="#0c0c10"/>${x.on ? `<rect x="97" y="70" width="6" height="40" fill="#f4efe2"/><path d="M97 70 H103" stroke="#b8b0a0"/>` : ""}<rect x="94" y="62" width="12" height="${x.on ? 30 : 62}" rx="1.6" fill="${x.url("bdh")}" opacity=".95"/>
<circle cx="100" cy="134" r="3" fill="#111"/>${led(100, 134, 1.4, "#4dabf7", x.on, true)}<rect x="108" y="40" width="6" height="74" rx="3" fill="${x.url("chr")}"/>`;
      return svg(x, { bg: doorBg(x, "#2a2c31").replace(/stroke-opacity="\.3" stroke-width="2"/g, 'stroke-opacity=".5" stroke-width="2"'), fx });
    } }),
  ];

  (window.HDA = window.HDA || []).push({
    id: "outdoor2",
    tab: "Gates, mailboxes & spots",
    group: "Outdoor",
    kind: "device",
    onWord: "On", offWord: "Off",
    intro: "Garden spotlights (on = lit), sliding gates (on = open), boom barriers (on = arm up), mailboxes and letter slots (on = mail inside).",
    
    css: `.hda-anim .hda-outdoor2-blink{animation:hda-outdoor2-blink 1.2s steps(1) infinite}
@keyframes hda-outdoor2-blink{0%{opacity:1}50%{opacity:.2}}
.hda-anim .hda-outdoor2-pulse{animation:hda-outdoor2-pulse 1.6s ease-in-out infinite}
@keyframes hda-outdoor2-pulse{0%,100%{opacity:.4}50%{opacity:1}}
.hda-anim .hda-outdoor2-drop{animation:hda-outdoor2-drop 2s ease-in infinite}
@keyframes hda-outdoor2-drop{0%{transform:translate(0,0);opacity:1}100%{transform:translate(18px,0);opacity:0}}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-outdoor2-blink,.hda-anim .hda-outdoor2-pulse,.hda-anim .hda-outdoor2-drop{animation:none}}`,
    icons,
  });
})();
