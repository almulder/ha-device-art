(function () {
  const H = window.HDAH, P = "hda-evap-";
  const f = (n) => (+n).toFixed(1);
  const rnd = (seed) => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };

  const GALV = "#aab1b9", BEIGE = "#d6cbb2", WHITE = "#ebe9e4", GRAY = "#878c94", BLACK = "#2b2d33", TAN = "#bfa27a", BRONZE = "#5a4636";

  function ctx(o) {
    const c = o.color || GALV, lv = o.level == null ? 1 : o.level;
    const pr = o.parts || {};
    const fan = o.parts && pr.fan != null ? !!pr.fan : !!o.on, pump = o.parts && pr.pump != null ? !!pr.pump : !!o.on;
    const id = (s) => `${o.uid}-${s}`, url = (s) => `url(#${o.uid}-${s})`;
    const dur = (1.3 - 1.0 * lv).toFixed(2) + "s", fdur = (2.2 - 1.5 * lv).toFixed(2) + "s";
    return { c, on: !!o.on, fan, pump, lv, id, url, dur, fdur, n: 0 };
  }
  const stops = (a) => a.map(([o, c, op]) => `<stop offset="${o}" stop-color="${c}"${op == null ? "" : ` stop-opacity="${op}"`}/>`).join("");
  const lg = (id, a, x1, y1, x2, y2) => `<linearGradient id="${id}" x1="${x1 || 0}" y1="${y1 || 0}" x2="${x2 == null ? 1 : x2}" y2="${y2 || 0}">${stops(a)}</linearGradient>`;
  const rg = (id, a, cx, cy, r) => `<radialGradient id="${id}" cx="${cx == null ? .5 : cx}" cy="${cy == null ? .5 : cy}" r="${r || .5}">${stops(a)}</radialGradient>`;

  function defs(x, extra) {
    const { c, id } = x, S = H.shade;
    return `<defs>
<clipPath id="${id("wc")}"><rect x="8" y="8" width="184" height="184" rx="16"/></clipPath>
${rg(id("vig"), [[0, "#000", 0], [.62, "#000", .05], [1, "#000", .48]], .5, .48, .74)}
${lg(id("bd"), [[0, S(c, .22)], [.5, c], [1, S(c, -.28)]], 0, 0, 0, 1)}
${lg(id("bdh"), [[0, S(c, -.25)], [.18, S(c, .18)], [.5, c], [.85, S(c, -.12)], [1, S(c, -.38)]])}
${lg(id("bds"), [[0, S(c, -.18)], [1, S(c, -.42)]], 0, 0, 0, 1)}
${lg(id("bdt"), [[0, S(c, .35)], [1, S(c, .1)]], 0, 0, 0, 1)}
${rg(id("dome"), [[0, S(c, .45)], [.45, S(c, .05)], [1, S(c, -.45)]], .38, .25, .85)}
${lg(id("sky"), [[0, "#1d2a48"], [.6, "#3a4a6c"], [1, "#6f6f8a"]], 0, 0, 0, 1)}
${lg(id("shing"), [[0, "#4a4440"], [1, "#2a2624"]], 0, 0, 0, 1)}
${lg(id("stuc"), [[0, "#8a7a66"], [1, "#5e5244"]], 0, 0, 0, 1)}
${lg(id("glass"), [[0, "#4d6380"], [.5, "#26324a"], [1, "#151c2c"]], 0, 0, 1, 1)}
${lg(id("ceil"), [[0, "#bdb8b0"], [1, "#8d8880"]], 0, 0, 0, 1)}
${lg(id("roomw"), [[0, "#6a6660"], [1, "#4a4640"]], 0, 0, 0, 1)}
${lg(id("floor"), [[0, "#5a4430"], [1, "#2e2218"]], 0, 0, 0, 1)}
${lg(id("raft"), [[0, "#8a6a44"], [.5, "#b08a5a"], [1, "#6a4e30"]])}
${lg(id("ins"), [[0, "#e8b4a0"], [1, "#b07a68"]], 0, 0, 0, 1)}
${lg(id("galv"), [[0, "#5d636b"], [.25, "#c9ced4"], [.45, "#8d939b"], [.7, "#b7bcc2"], [1, "#4a4f56"]])}
${lg(id("blk"), [[0, "#4a4b58"], [.4, "#22232b"], [1, "#0b0b10"]], 0, 0, 0, 1)}
${lg(id("cell"), [[0, "#3a5fa8"], [.5, "#1a2f63"], [1, "#0e1b3d"]], 0, 0, 1, 1)}
${rg(id("sh"), [[0, "#000", .6], [.6, "#000", .22], [1, "#000", 0]])}
${lg(id("water"), [[0, "#7fd0ff", .85], [1, "#2a7ab8", .9]], 0, 0, 0, 1)}
<filter id="${id("bl")}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.2"/></filter>
${extra || ""}</defs>`;
  }
  function svg(x, s, extra) {
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs(x, extra)}
<g clip-path="${x.url("wc")}"><g class="hda-bg"><rect x="8" y="8" width="184" height="184" fill="#1c1b24"/>${s.bg || ""}</g><g class="hda-bg"><rect x="8" y="8" width="184" height="184" fill="${x.url("vig")}"/></g>${s.fx || ""}</g>
<g class="hda-bg"><rect x="8.5" y="8.5" width="183" height="183" rx="15.5" fill="none" stroke="#fff" stroke-opacity=".08"/></g></svg>`;
  }

  const shadow = (x, cx, cy, rx, ry, k) => `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="${x.url("sh")}" opacity="${k == null ? .8 : k}"/>`;
  const hl = (d, o, w) => `<path d="${d}" fill="none" stroke="#fff" stroke-opacity="${o == null ? .35 : o}" stroke-width="${w || 1.2}" stroke-linecap="round"/>`;
  const drop = (x, shape, dx, dy, k) => `<g transform="translate(${dx == null ? 3 : dx} ${dy == null ? 5 : dy})" fill="#000" opacity="${k == null ? .45 : k}" filter="${x.url("bl")}">${shape}</g>`;
  const padCol = (x) => x.pump ? "#6e5129" : "#d4b474";
  function louvers(x, w, h, n, face) {
    const gap = h / n; let s = `<rect width="${w}" height="${h}" fill="${padCol(x)}"/>`;
    if (x.pump) s += `<rect width="${w}" height="${h}" fill="#3a6a8a" fill-opacity=".18"/>`;
    const r = rnd(w * 7 + h); for (let i = 0; i < 24; i++) s += `<path d="M${f(r() * w)} ${f(r() * h)} l${f(2 + r() * 3)} ${f(1 + r() * 2)}" stroke="#000" stroke-opacity=".18" stroke-width=".6"/>`;
    for (let i = 0; i < n; i++) { const y = i * gap;
      s += `<path d="M0 ${f(y)} H${w} V${f(y + gap * .55)} L0 ${f(y + gap * .7)} Z" fill="${face || x.url("bd")}"/><path d="M0 ${f(y + gap * .7)} L${w} ${f(y + gap * .55)}" stroke="#000" stroke-opacity=".45" stroke-width=".8"/><path d="M0 ${f(y + .4)} H${w}" stroke="#fff" stroke-opacity=".3" stroke-width=".5"/>`; }
    return s + `<rect width="${w}" height="${h}" fill="none" stroke="${H.shade(x.c, -.4)}" stroke-width="2.4"/>`;
  }
  function drips(x, xs, y, len) {
    if (!x.pump) return "";
    return xs.map((dx, i) => `<g class="${P}drip" style="animation-delay:-${(i * .37 % 1.1).toFixed(2)}s"><path d="M${f(dx)} ${f(y)} c-1.4 2.4 -1.4 4 0 4.4 c1.4 -.4 1.4 -2 0 -4.4 Z" fill="#9fd8ff" fill-opacity=".9"/></g>`).join("") +
      xs.map((dx) => `<path d="M${f(dx)} ${f(y - 1)} v1.6" stroke="#9fd8ff" stroke-opacity=".7" stroke-width="1"/>`).join("");
  }
  function flow(x, d, col, w, delay) {
    if (!x.fan) return "";
    return `<path d="${d}" fill="none" stroke="${col || "#cfeaff"}" stroke-opacity=".55" stroke-width="${w || 1.6}" stroke-linecap="round" stroke-dasharray="7 11" class="${P}flow" style="animation-duration:${x.fdur};animation-delay:-${delay || 0}s"/>`;
  }
  function blades(x, cx, cy, R, n, col, hub) {
    let b = "";
    for (let i = 0; i < n; i++) b += `<path d="M0 0 C${f(R * .2)} ${f(-R * .2)} ${f(R * .5)} ${f(-R * .42)} ${f(R * .92)} ${f(-R * .3)} C${f(R * .98)} ${f(-R * .05)} ${f(R * .6)} ${f(R * .12)} 0 0 Z" fill="${col}" transform="rotate(${f(i * 360 / n)})"/>`;
    const spin = x.fan ? `class="${P}spin" style="animation-duration:${x.dur}"` : "";
    return `<g transform="translate(${f(cx)} ${f(cy)})"><g ${spin}><circle r="${f(R)}" fill="none"/>${b}${x.fan ? `<circle r="${f(R * .85)}" fill="${col}" fill-opacity=".12"/>` : ""}</g><circle r="${f(hub || R * .16)}" fill="#2a2c33"/><circle r="${f((hub || R * .16) * .5)}" fill="#888"/></g>`;
  }
  function digit(cx, cy, s, d, col) {
    const M = { 0: "abcdef", 1: "bc", 2: "abged", 3: "abgcd", 4: "fgbc", 5: "afgcd", 6: "afgedc", 7: "abc", 8: "abcdefg", 9: "abcfgd" }[d] || "";
    const w = 6 * s, h = 5 * s, t = 1.3 * s, seg = {
      a: [-w / 2, -h - t / 2, w, t], g: [-w / 2, -t / 2, w, t], d: [-w / 2, h - t / 2, w, t],
      f: [-w / 2 - t / 2, -h, t, h], b: [w / 2 - t / 2, -h, t, h], e: [-w / 2 - t / 2, 0, t, h], c: [w / 2 - t / 2, 0, t, h] };
    return Object.keys(seg).map((k) => { const [a, b, ww, hh] = seg[k]; return `<rect x="${f(cx + a)}" y="${f(cy + b)}" width="${f(ww)}" height="${f(hh)}" rx="${f(t / 2)}" fill="${col}" fill-opacity="${M.indexOf(k) >= 0 ? 1 : .08}"/>`; }).join("");
  }
  function sky(x, y1, seed) {
    const r = rnd(seed); let s = `<rect x="8" y="8" width="184" height="${y1 - 8}" fill="${x.url("sky")}"/>`;
    for (let i = 0; i < 4; i++) { const cx = 20 + r() * 160, cy = 18 + r() * (y1 - 40); s += `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(14 + r() * 14)}" ry="4" fill="#fff" fill-opacity=".07"/>`; }
    return s;
  }
  function roof(x, y0, tile) {
    let s = `<path d="M8 ${y0} H192 V192 H8 Z" fill="${tile ? "#7a4a32" : x.url("shing")}"/>`;
    for (let y = y0 + 4, i = 0; y < 196; y += 5 + i * 1.3, i++) {
      s += `<path d="M8 ${f(y)} H192" stroke="#000" stroke-opacity=".4" stroke-width="${f(.8 + i * .15)}"/>`;
      const step = 10 + i * 3; for (let xx = 8 + (i % 2) * step / 2; xx < 192; xx += step) s += `<path d="M${f(xx)} ${f(y)} v${f(5 + i * 1.3)}" stroke="#000" stroke-opacity=".25" stroke-width=".7"/>`;
      if (tile) s += `<path d="M8 ${f(y + 1)} H192" stroke="#e8a080" stroke-opacity=".15"/>`;
    }
    return s + `<path d="M8 ${y0} H192" stroke="#fff" stroke-opacity=".2"/>`;
  }
  function stucco(x, y0, y1, seed) {
    const r = rnd(seed); let s = `<rect x="8" y="${y0}" width="184" height="${y1 - y0}" fill="${x.url("stuc")}"/>`;
    for (let i = 0; i < 140; i++) s += `<circle cx="${f(8 + r() * 184)}" cy="${f(y0 + r() * (y1 - y0))}" r="${f(.3 + r())}" fill="${r() > .5 ? "#000" : "#fff"}" fill-opacity="${(.04 + r() * .08).toFixed(2)}"/>`;
    return s;
  }
  function attic(x, seed) {
    let s = `<rect x="8" y="8" width="184" height="184" fill="#2a2018"/>`;
    for (let i = 0; i < 6; i++) { const xx = 8 + i * 36; s += `<path d="M${xx} 8 L${xx + 18} 8 L${100 + (xx - 100) * .35 + 6} 120 L${100 + (xx - 100) * .35 - 2} 120 Z" fill="${x.url("raft")}" opacity=".55"/>`; }
    s += `<rect x="8" y="8" width="184" height="184" fill="#000" fill-opacity=".25"/>`;
    const r = rnd(seed || 3); let ins = `<path d="M8 150 Q50 142 100 148 T192 146 V192 H8 Z" fill="${x.url("ins")}"/>`;
    for (let i = 0; i < 50; i++) ins += `<circle cx="${f(8 + r() * 184)}" cy="${f(152 + r() * 40)}" r="${f(2 + r() * 4)}" fill="#fff" fill-opacity="${(.04 + r() * .1).toFixed(2)}"/>`;
    return s + ins + `<rect x="8" y="158" width="184" height="5" fill="${x.url("raft")}" opacity=".6"/>`;
  }
  function room(x, ceilY, floorY) {
    let s = `<rect x="8" y="8" width="184" height="${ceilY - 8}" fill="${x.url("ceil")}"/><rect x="8" y="${ceilY}" width="184" height="${floorY - ceilY}" fill="${x.url("roomw")}"/><rect x="8" y="${ceilY}" width="184" height="3" fill="#000" fill-opacity=".25"/>`;
    s += `<rect x="8" y="${floorY}" width="184" height="${192 - floorY}" fill="${x.url("floor")}"/><rect x="8" y="${floorY - 3}" width="184" height="3.4" fill="#d8d4cc" fill-opacity=".6"/>`;
    for (let i = -6; i <= 26; i++) { const bx = 8 + i * 9; s += `<path d="M${f(100 + (bx - 100) * .6)} ${floorY} L${f(bx + (bx - 100) * .35)} 192" stroke="#000" stroke-opacity=".3" stroke-width=".8"/>`; }
    return s;
  }
  function coolerBox(x, fx, fy, w, h, d, n, frontFace) {
    const k = .5, top = `M${fx} ${fy} L${fx + d} ${f(fy - d * k)} L${fx + w + d} ${f(fy - d * k)} L${fx + w} ${fy} Z`;
    return drop(x, `<rect x="${fx}" y="${fy}" width="${w + d}" height="${h}"/>`, 3, 6, .5) +
      `<g transform="translate(${fx + w} ${fy}) skewY(-26.6)"><rect x="-1" y="-2" width="${d + 2}" height="${h + 4}" fill="${x.url("bds")}"/><g transform="translate(3 4)">${louvers(x, d - 6, h - 8, n, x.url("bds"))}</g></g>
<path d="${top}" fill="${x.url("bdt")}"/><path d="M${fx + 2} ${fy - 1} L${fx + d} ${f(fy - d * k + 1)}" stroke="#fff" stroke-opacity=".3"/>
<rect x="${fx}" y="${fy}" width="${w}" height="${h}" fill="${x.url("bd")}"/>${frontFace || `<g transform="translate(${fx + 5} ${fy + 5})">${louvers(x, w - 10, h - 10, n)}</g>`}
<path d="M${fx} ${fy + h} H${fx + w} L${fx + w + d} ${f(fy + h - d * k)}" fill="none" stroke="#000" stroke-opacity=".35"/>`;
  }

  const FIN = [GALV, BEIGE, WHITE, GRAY, BLACK];
  const base = (o) => Object.assign({ picker: true, colorLabel: "Body", colors: FIN }, o);
  const CP = [{ id: "fan", name: "Fan" }, { id: "pump", name: "Pump" }];
  const cool = (o) => base(Object.assign({ parts: CP }, o));

  const icons = [
    cool({ id: "window", name: "Window cooler", colors: [BEIGE, GALV, WHITE, GRAY, TAN], render(o) {
      const x = ctx(o);
      const bg = stucco(x, 8, 192, 11) + `<rect x="38" y="20" width="110" height="128" fill="#e8e4dc"/><rect x="44" y="26" width="98" height="116" fill="${x.url("glass")}"/><path d="M44 84 H142" stroke="#e8e4dc" stroke-width="4"/><path d="M50 30 L90 30 L50 76 Z" fill="#fff" fill-opacity=".08"/>
<rect x="32" y="146" width="122" height="6" fill="#d8d2c6"/><rect x="32" y="152" width="122" height="3" fill="#000" fill-opacity=".3"/>`;
      const fx = coolerBox(x, 50, 92, 74, 62, 30, 9) +
        `<path d="M56 154 L66 176 M118 154 L108 176" stroke="#4a4a4a" stroke-width="2.4"/><path d="M60 176 H114" stroke="#4a4a4a" stroke-width="2.4"/>` +
        drips(x, [62, 80, 98, 114], 156) +
        [0, 1, 2].map((i) => flow(x, `M${190 - i * 4} ${100 + i * 16} C170 ${98 + i * 16} 160 ${96 + i * 14} 140 ${92 + i * 14}`, "#dfe8ff", 1.6, i * .4)).join("");
      return svg(x, { bg, fx });
    } }),

    cool({ id: "thruwall", name: "Through-wall cooler", colors: [BEIGE, WHITE, GALV, GRAY, TAN], render(o) {
      const x = ctx(o);
      const bg = `<rect x="8" y="8" width="88" height="184" fill="${x.url("roomw")}"/><rect x="8" y="160" width="88" height="32" fill="${x.url("floor")}"/><rect x="8" y="157" width="88" height="3" fill="#d8d4cc" fill-opacity=".6"/>` +
        `<rect x="112" y="8" width="80" height="120" fill="${x.url("sky")}"/>` + `<g transform="translate(0 0)">${stucco(x, 128, 192, 4).replace(/x="8" y="128" width="184"/, 'x="112" y="128" width="80"')}</g>` +
        `<rect x="96" y="8" width="16" height="184" fill="#8f8878"/><path d="M96 8 V192 M112 8 V192" stroke="#000" stroke-opacity=".35"/>${Array.from({ length: 12 }, (_, i) => `<path d="M96 ${16 + i * 15} H112" stroke="#000" stroke-opacity=".15"/>`).join("")}`;
      const box = `<rect x="104" y="62" width="74" height="70" fill="${x.url("bd")}"/><g transform="translate(116 68)">${louvers(x, 56, 58, 8)}</g><path d="M104 132 H178" stroke="#000" stroke-opacity=".4"/><path d="M110 132 L104 150 M172 132 L178 150" stroke="#444" stroke-width="2.4"/>`;
      const grille = `<rect x="80" y="70" width="24" height="56" fill="${x.url("bdh")}"/>${Array.from({ length: 8 }, (_, i) => `<path d="M82 ${76 + i * 6.4} L94 ${x.fan ? 79 + i * 6.4 : 76.6 + i * 6.4}" stroke="${H.shade(x.c, -.45)}" stroke-width="2"/>`).join("")}<rect x="80" y="70" width="24" height="56" fill="none" stroke="${H.shade(x.c, -.4)}" stroke-width="1.6"/>`;
      const fx = drop(x, `<rect x="104" y="62" width="74" height="70"/>`, 2, 4, .4) + box + grille +
        `<rect x="116" y="68" width="56" height="58" fill="${padCol(x)}" fill-opacity="0"/>` + drips(x, [122, 138, 156, 170], 133) +
        [0, 1, 2].map((i) => flow(x, `M80 ${84 + i * 14} C60 ${92 + i * 14} 40 ${100 + i * 16} 14 ${110 + i * 18}`, "#bfe6ff", 1.7, i * .5)).join("");
      return svg(x, { bg, fx });
    } }),

    cool({ id: "downdraft", name: "Rooftop downdraft", colors: [GALV, BEIGE, WHITE, GRAY, TAN], render(o) {
      const x = ctx(o);
      const bg = sky(x, 120, 5) + roof(x, 120);
      const fx = shadow(x, 104, 168, 62, 9) + `<path d="M74 150 H118 L124 168 H68 Z" fill="${x.url("galv")}"/><path d="M68 168 H124" stroke="#000" stroke-opacity=".4"/><rect x="62" y="166" width="68" height="6" fill="#3a3a3a"/>` +
        coolerBox(x, 52, 70, 80, 78, 36, 10) +
        `<path d="M134 150 C150 150 156 160 170 162" fill="none" stroke="#b9c0c8" stroke-width="1.6"/>` + drips(x, [60, 78, 96, 116, 126], 149) +
        [0, 1, 2, 3].map((i) => flow(x, `M${14 + i * 3} ${78 + i * 18} C30 ${80 + i * 18} 40 ${84 + i * 16} 54 ${86 + i * 15}`, "#e6eeff", 1.5, i * .35)).join("");
      return svg(x, { bg, fx });
    } }),

    cool({ id: "sidedraft", name: "Side-draft cooler", colors: [GALV, BEIGE, WHITE, GRAY, TAN], render(o) {
      const x = ctx(o);
      const bg = sky(x, 116, 9) + roof(x, 116, true);
      const fx = shadow(x, 92, 162, 66, 9) + `<rect x="34" y="148" width="92" height="10" fill="#3a3632"/><path d="M38 158 V168 M122 158 V168" stroke="#2a2622" stroke-width="3"/>` +
        coolerBox(x, 30, 64, 82, 84, 30, 10) +
        `<path d="M142 92 H166 C176 92 180 98 180 108 V172 H162 V114 C162 110 160 110 156 110 H142 Z" fill="${x.url("galv")}"/><path d="M142 92 H166 C176 92 180 98 180 108 V172" fill="none" stroke="#fff" stroke-opacity=".3"/><rect x="156" y="168" width="30" height="8" fill="#4a4844"/>${[100, 140, 160].map((y) => `<path d="M162 ${y} H180" stroke="#000" stroke-opacity=".3"/>`).join("")}` +
        drips(x, [38, 56, 76, 96], 149) + flow(x, "M146 101 H168 C172 101 172 104 172 110 V164", "#dff2ff", 2, 0) + flow(x, "M146 101 H168 C172 101 172 104 172 110 V164", "#dff2ff", 2, .7);
      return svg(x, { bg, fx });
    } }),

    cool({ id: "grille", name: "Ceiling cooler grille", colors: [WHITE, BEIGE, GALV, GRAY, BLACK], render(o) {
      const x = ctx(o);
      const bg = `<path d="M8 8 H192 V70 H8 Z" fill="${x.url("ceil")}"/><path d="M8 70 H192 V192 H8 Z" fill="${x.url("roomw")}"/><rect x="8" y="68" width="184" height="3" fill="#000" fill-opacity=".3"/><rect x="8" y="166" width="184" height="26" fill="${x.url("floor")}"/><rect x="8" y="163" width="184" height="3" fill="#d8d4cc" fill-opacity=".55"/>
<rect x="128" y="98" width="44" height="40" fill="#e9e4da"/><rect x="132" y="102" width="36" height="32" fill="#4f7aa0"/><path d="M134 128 L146 114 L156 124 L166 112 V132 H134 Z" fill="#3e6040"/>
<rect x="24" y="136" width="54" height="30" rx="6" fill="#5a4b6a"/><rect x="20" y="130" width="12" height="34" rx="5" fill="#4d4060"/><rect x="70" y="130" width="12" height="34" rx="5" fill="#4d4060"/>`;
      const air = x.pump ? "#9fd8ff" : "#e6e6ea";
      const sl = (a, b, c2, d2) => `<path d="M${a} ${b} L${c2} ${d2}" stroke="${H.shade(x.c, -.35)}" stroke-width="1.4"/>`;
      let lv = ""; for (let i = 0; i < 4; i++) { lv += sl(70 + i * 3, 30 + i * 2.2, 130 - i * 3, 30 + i * 2.2) + sl(70 + i * 3, 50 - i * 2.2, 130 - i * 3, 50 - i * 2.2); }
      const fx = `<path d="M62 24 H138 L146 56 H54 Z" fill="#000" fill-opacity=".25"/><path d="M60 22 H140 L148 56 H52 Z" fill="${x.url("bd")}"/><path d="M68 28 H132 L138 52 H62 Z" fill="${H.shade(x.c, -.5)}"/>${lv}
<rect x="86" y="36" width="28" height="8" fill="${x.url("bdh")}"/><path d="M60 22 H140" stroke="#fff" stroke-opacity=".5"/>` +
        [[-1, 0], [-.4, .3], [.4, .6], [1, .9], [0, 1.2]].map(([d, del], i) => flow(x, `M${f(100 + d * 30)} 56 C${f(100 + d * 44)} 90 ${f(100 + d * 58)} 120 ${f(100 + d * 70)} 160`, air, 2, del)).join("") +
        (x.pump && x.fan ? [70, 96, 120, 140].map((a, i) => `<g class="${P}drip" style="animation-delay:-${(i * .3).toFixed(1)}s"><circle cx="${a}" cy="${80 + (i % 2) * 14}" r="1.2" fill="#bfe6ff"/></g>`).join("") : "");
      return svg(x, { bg, fx });
    } }),

    cool({ id: "tower", name: "Tower evap cooler", colors: [WHITE, GRAY, BLACK, BEIGE, "#c9d6e3"], render(o) {
      const x = ctx(o);
      const bg = room(x, 20, 160) + `<rect x="140" y="60" width="38" height="50" fill="#e9e4da"/><rect x="144" y="64" width="30" height="42" fill="#a07a50"/>`;
      const fx = shadow(x, 92, 184, 40, 5) +
        `<g transform="translate(118 46) skewY(-22)"><rect width="22" height="132" fill="${x.url("bds")}"/><rect x="3" y="20" width="16" height="64" fill="${padCol(x)}"/>${Array.from({ length: 16 }, (_, i) => `<path d="M3 ${20 + i * 4} h16" stroke="#000" stroke-opacity=".25" stroke-width=".7"/>`).join("")}${Array.from({ length: 5 }, (_, i) => `<path d="M${5 + i * 3.4} 20 v64" stroke="#000" stroke-opacity=".2" stroke-width=".7"/>`).join("")}</g>
<path d="M66 46 L88 38 H140 L118 46 Z" fill="${x.url("bdt")}"/><rect x="66" y="46" width="52" height="132" rx="4" fill="${x.url("bdh")}"/>
<rect x="72" y="52" width="40" height="16" rx="3" fill="#15181e"/>${digit(84, 60, .9, x.on ? Math.max(1, Math.round(x.lv * 3)) : 8, x.on ? "#6fd0ff" : "#3a4048")}<circle cx="100" cy="60" r="2.2" fill="${x.fan ? "#6fd0ff" : "#333"}"/><circle cx="107" cy="60" r="2.2" fill="${x.pump ? "#6fd0ff" : "#333"}"/>
<rect x="72" y="74" width="40" height="66" rx="3" fill="#22252c"/>${Array.from({ length: 8 }, (_, i) => `<path d="M${76 + i * 4.6} 76 l${x.fan ? 2.4 : 0} 62" stroke="${H.shade(x.c, -.1)}" stroke-width="2.2"/>`).join("")}
<rect x="72" y="146" width="40" height="22" rx="3" fill="#000" fill-opacity=".18"/><rect x="76" y="150" width="10" height="14" rx="2" fill="#0e1218"/><rect x="77" y="${x.pump ? 155 : 158}" width="8" height="${x.pump ? 8 : 5}" rx="1" fill="${x.url("water")}"/>
<circle cx="74" cy="180" r="3.4" fill="#111"/><circle cx="112" cy="180" r="3.4" fill="#111"/>${hl("M69 50 V174", .35, 1.4)}` + drips(x, [126, 132], 132) +
        [0, 1, 2].map((i) => flow(x, `M70 ${86 + i * 18} C50 ${88 + i * 18} 34 ${92 + i * 18} 14 ${94 + i * 20}`, "#bfe6ff", 1.6, i * .4)).join("");
      return svg(x, { bg, fx });
    } }),

    cool({ id: "shop", name: "Shop patio cooler", colors: [BLACK, GRAY, WHITE, "#2f4a6a", BEIGE], render(o) {
      const x = ctx(o);
      let bg = `<rect x="8" y="8" width="184" height="140" fill="#5a5c62"/>`;
      for (let y = 8; y < 148; y += 22) bg += `<path d="M8 ${y} H192" stroke="#000" stroke-opacity=".3"/>`;
      bg += `<rect x="8" y="148" width="184" height="44" fill="#6a6b70"/><path d="M8 148 H192" stroke="#fff" stroke-opacity=".2"/><path d="M60 148 L40 192 M140 148 L160 192" stroke="#000" stroke-opacity=".3"/>`;
      const fx = shadow(x, 100, 182, 64, 6) +
        `<g transform="translate(146 38) skewY(-20)"><rect width="30" height="124" fill="${x.url("bds")}"/><rect x="4" y="10" width="22" height="80" fill="${padCol(x)}"/>${Array.from({ length: 20 }, (_, i) => `<path d="M4 ${10 + i * 4} h22" stroke="#000" stroke-opacity=".25" stroke-width=".7"/>`).join("")}</g>
<path d="M40 38 L70 28 H176 L146 38 Z" fill="${x.url("bdt")}"/><rect x="40" y="38" width="106" height="124" rx="6" fill="${x.url("bd")}"/>
<circle cx="93" cy="88" r="44" fill="#121318"/>` + blades(x, 93, 88, 38, 3, "#c9a24a", 7) +
        `<circle cx="93" cy="88" r="44" fill="none" stroke="${H.shade(x.c, .15)}" stroke-width="2.6"/>${[14, 24, 34].map((r2) => `<circle cx="93" cy="88" r="${r2}" fill="none" stroke="#9a9ca4" stroke-opacity=".55" stroke-width=".8"/>`).join("")}${Array.from({ length: 12 }, (_, i) => `<path d="M93 88 L${f(93 + Math.cos(i * 30 * Math.PI / 180) * 44)} ${f(88 + Math.sin(i * 30 * Math.PI / 180) * 44)}" stroke="#9a9ca4" stroke-opacity=".45" stroke-width=".7"/>`).join("")}
<rect x="46" y="138" width="94" height="20" rx="3" fill="#000" fill-opacity=".22"/><rect x="52" y="142" width="30" height="12" rx="2" fill="#0e1218"/><rect x="53" y="${x.pump ? 145 : 149}" width="28" height="${x.pump ? 8 : 4}" rx="1" fill="${x.url("water")}"/>
<rect x="120" y="44" width="20" height="10" rx="2" fill="#15181e"/>${digit(130, 49, .55, x.on ? Math.max(1, Math.round(x.lv * 3)) : 8, x.on ? "#7dff9a" : "#2a3a2a")}
<path d="M44 38 V22 H70" fill="none" stroke="#1a1a1f" stroke-width="3"/><circle cx="54" cy="170" r="7" fill="#111"/><circle cx="54" cy="170" r="3" fill="#555"/><circle cx="134" cy="170" r="7" fill="#111"/><circle cx="134" cy="170" r="3" fill="#555"/>${hl("M44 44 V156", .3, 1.4)}` +
        drips(x, [152, 160, 168], 128) + [0, 1, 2].map((i) => flow(x, `M${60 + i * 30} ${70 + i * 12} C${40 + i * 30} ${74 + i * 12} 24 ${76 + i * 14} 10 ${80 + i * 14}`, "#bfe6ff", 1.8, i * .4)).join("");
      return svg(x, { bg, fx });
    } }),

    cool({ id: "desk", name: "Desktop mini cooler", colors: [WHITE, "#c9e7f0", GRAY, BLACK, "#f3c6d1"], render(o) {
      const x = ctx(o);
      const bg = `<rect x="8" y="8" width="184" height="128" fill="#4a5460"/><rect x="8" y="136" width="184" height="56" fill="${x.url("raft")}"/><rect x="8" y="134" width="184" height="3" fill="#fff" fill-opacity=".2"/>${Array.from({ length: 6 }, (_, i) => `<path d="M8 ${142 + i * 9} H192" stroke="#000" stroke-opacity=".15"/>`).join("")}
<rect x="134" y="104" width="48" height="32" rx="3" fill="#20242c"/><rect x="138" y="108" width="40" height="22" fill="#3a5a7a"/><path d="M152 136 V140 H164 V136" fill="#20242c"/>`;
      const fx = shadow(x, 88, 160, 46, 5) + `<path d="M50 72 L60 66 H130 L120 72 Z" fill="${x.url("bdt")}"/>
<rect x="56" y="48" width="58" height="26" rx="4" fill="#cfe9ff" fill-opacity=".35" stroke="#fff" stroke-opacity=".5"/><rect x="58" y="${x.pump ? 56 : 66}" width="54" height="${x.pump ? 16 : 6}" rx="2" fill="${x.url("water")}"/>${x.pump ? `<path d="M60 56 Q85 53 110 56" stroke="#fff" stroke-opacity=".5" fill="none"/>` : ""}
<g transform="translate(120 72) skewY(-31)"><rect width="10" height="84" fill="${x.url("bds")}"/></g><rect x="50" y="72" width="70" height="84" rx="5" fill="${x.url("bdh")}"/>
<circle cx="85" cy="106" r="24" fill="#16191f"/>` + blades(x, 85, 106, 20, 5, "#7a8a9a") + `<circle cx="85" cy="106" r="24" fill="none" stroke="${H.shade(x.c, -.2)}" stroke-width="2"/>${[-16, -8, 0, 8, 16].map((d) => `<path d="M${85 + d} 83 V129" stroke="${H.shade(x.c, -.15)}" stroke-opacity=".6" stroke-width=".8"/>`).join("")}
<circle cx="64" cy="144" r="3" fill="${x.fan ? "#6fd0ff" : "#555"}"/><circle cx="76" cy="144" r="3" fill="${x.pump ? "#6fd0ff" : "#555"}"/><circle cx="106" cy="144" r="4.4" fill="${H.shade(x.c, -.25)}"/>${hl("M54 78 V150", .4, 1.2)}` +
        [0, 1, 2].map((i) => flow(x, `M62 ${96 + i * 10} C46 ${96 + i * 10} 32 ${98 + i * 10} 14 ${100 + i * 12}`, "#bfe6ff", 1.5, i * .35)).join("") +
        (x.pump && x.fan ? [0, 1, 2, 3].map((i) => `<g class="${P}mist" style="animation-delay:-${(i * .5).toFixed(1)}s"><circle cx="${40 - i * 6}" cy="${100 + i * 6}" r="${3 + i}" fill="#e6f6ff" fill-opacity=".25"/></g>`).join("") : "");
      return svg(x, { bg, fx });
    } }),

    cool({ id: "blower", name: "Cooler, panel off", colors: [GALV, BEIGE, WHITE, GRAY, TAN], render(o) {
      const x = ctx(o);
      const bg = sky(x, 128, 13) + roof(x, 128);
      let wheel = ""; for (let i = 0; i < 28; i++) wheel += `<path d="M${f(Math.cos(i * 12.86 * Math.PI / 180) * 22)} ${f(Math.sin(i * 12.86 * Math.PI / 180) * 22)} L${f(Math.cos((i * 12.86 + 9) * Math.PI / 180) * 16)} ${f(Math.sin((i * 12.86 + 9) * Math.PI / 180) * 16)}" stroke="#9aa0a8" stroke-width="2"/>`;
      const fx = shadow(x, 100, 172, 70, 8) + `<rect x="34" y="60" width="132" height="108" fill="${x.url("bd")}"/><rect x="40" y="66" width="120" height="96" fill="#2a2c31"/>
<rect x="40" y="66" width="18" height="96" fill="${padCol(x)}"/>${Array.from({ length: 16 }, (_, i) => `<path d="M40 ${70 + i * 6} l18 3" stroke="#000" stroke-opacity=".25"/>`).join("")}
<rect x="140" y="66" width="20" height="96" fill="${padCol(x)}" opacity=".85"/><path d="M40 68 H160" stroke="#9fd8ff" stroke-opacity="${x.pump ? .8 : .15}" stroke-width="2.4"/>
<rect x="70" y="146" width="62" height="14" fill="#4a5058"/><rect x="72" y="${x.pump ? 148 : 154}" width="58" height="${x.pump ? 10 : 4}" fill="${x.url("water")}"/><rect x="76" y="136" width="10" height="12" rx="2" fill="#2a4a7a"/><path d="M81 136 V70" stroke="#3a3a3a" stroke-width="1.6"/>
<circle cx="104" cy="104" r="30" fill="#1a1c22" stroke="#555" stroke-width="2"/><g transform="translate(104 104)"><g ${x.fan ? `class="${P}spin" style="animation-duration:${x.dur}"` : ""}><circle r="23" fill="none" stroke="#b9bfc6" stroke-width="2"/>${wheel}<circle r="15" fill="none" stroke="#b9bfc6" stroke-width="1.4"/></g><circle r="4" fill="#666"/></g>
<circle cx="132" cy="80" r="8" fill="#3a3d44"/><path d="M104 104 L132 80" stroke="#222" stroke-width="2" stroke-opacity=".6"/>${hl("M36 62 H164", .35, 1)}` + drips(x, [44, 52, 146, 154], 162);
      return svg(x, { bg, fx });
    } }),

    base({ id: "gable", name: "Gable attic fan", colors: [GALV, BLACK, WHITE, GRAY, BRONZE], render(o) {
      const x = ctx(o); x.fan = x.on;
      const bg = attic(x, 5) + `<path d="M8 8 L100 8 L100 8 Z"/><path d="M40 120 L100 30 L160 120 Z" fill="#3a2e22"/><path d="M58 112 L100 50 L142 112 Z" fill="#1a1d26"/>${Array.from({ length: 9 }, (_, i) => `<path d="M${64 + i * 1.6} ${104 - i * 6.6} H${136 - i * 1.6}" stroke="#7a7066" stroke-width="2.6"/>`).join("")}<path d="M58 112 L100 50 L142 112 Z" fill="none" stroke="#6a5a48" stroke-width="3"/>`;
      const fx = drop(x, `<circle cx="100" cy="94" r="36"/>`, 2, 5, .5) + `<rect x="58" y="54" width="84" height="80" rx="3" fill="${x.url("bd")}"/><circle cx="100" cy="94" r="35" fill="#111318"/><circle cx="100" cy="94" r="35" fill="none" stroke="${H.shade(x.c, .2)}" stroke-width="2"/>` +
        blades(x, 100, 94, 31, 5, "#c4c9cf") + `<circle cx="100" cy="94" r="35" fill="none" stroke="#9ca2aa" stroke-opacity=".5" stroke-width=".8"/>${[12, 22].map((r2) => `<circle cx="100" cy="94" r="${r2}" fill="none" stroke="#9ca2aa" stroke-opacity=".35" stroke-width=".6"/>`).join("")}
<rect x="62" y="58" width="8" height="8" rx="1" fill="#222"/><path d="M66 66 V140" stroke="#222" stroke-width="1.6"/>${hl("M60 56 H140", .35, 1)}` +
        [0, 1, 2].map((i) => flow(x, `M${30 + i * 50} 170 C${40 + i * 40} 150 ${70 + i * 15} 130 100 100`, "#f0e0c8", 1.6, i * .4)).join("");
      return svg(x, { bg, fx });
    } }),

    base({ id: "powervent", name: "Power roof vent", colors: [GALV, BLACK, BRONZE, GRAY, WHITE], render(o) {
      const x = ctx(o); x.fan = x.on;
      const bg = sky(x, 96, 17) + roof(x, 96);
      const fx = shadow(x, 100, 150, 66, 10) + `<path d="M34 146 L52 128 H148 L166 146 Z" fill="${x.url("galv")}"/><path d="M34 146 H166" stroke="#000" stroke-opacity=".4"/>
<rect x="64" y="110" width="72" height="20" fill="#16181d"/><g clip-path="url(#${x.id("mesh")})"><g ${x.on ? `class="${P}slide" style="animation-duration:${x.dur}"` : ""}>${Array.from({ length: 10 }, (_, i) => `<path d="M${56 + i * 10} 110 l4 20" stroke="#8a9098" stroke-width="2.6"/>`).join("")}</g></g>
${Array.from({ length: 13 }, (_, i) => `<path d="M${64 + i * 6} 110 V130" stroke="#3a3d44" stroke-width=".6"/>`).join("")}
<path d="M48 114 C52 76 76 60 100 60 C124 60 148 76 152 114 Z" fill="${x.url("dome")}"/><path d="M46 114 H154 L150 118 H50 Z" fill="${H.shade(x.c, -.35)}"/>${hl("M62 98 C66 82 80 70 96 67", .5, 2.4)}<circle cx="100" cy="60" r="3" fill="${H.shade(x.c, -.2)}"/>` +
        [-1, 1].map((s2) => [0, 1].map((i) => flow(x, `M${100 + s2 * 40} ${122 + i * 4} C${100 + s2 * 60} ${116 + i * 4} ${100 + s2 * 74} ${104 + i * 6} ${100 + s2 * 88} ${92 + i * 6}`, "#f3e6cf", 1.6, i * .5 + (s2 > 0 ? .3 : 0))).join("")).join("");
      return svg(x, { bg, fx }, `<clipPath id="${x.id("mesh")}"><rect x="64" y="110" width="72" height="20"/></clipPath>`);
    } }),

    base({ id: "solar", name: "Solar attic fan", colors: [BLACK, GALV, BRONZE, GRAY, WHITE], render(o) {
      const x = ctx(o); x.fan = x.on;
      const bg = sky(x, 90, 23) + roof(x, 90);
      let cells = ""; for (let i = 1; i < 6; i++) cells += `<path d="M${54 + i * 15.4} 70 L${50 + i * 16.4} 100" stroke="#8fb3ff" stroke-opacity=".4" stroke-width=".6"/>`;
      for (let j = 1; j < 3; j++) cells += `<path d="M${54 - j * 1.3} ${70 + j * 10} H${146 + j * 1.3}" stroke="#8fb3ff" stroke-opacity=".4" stroke-width=".6"/>`;
      const fx = shadow(x, 100, 158, 70, 10) + `<path d="M30 154 L48 134 H152 L170 154 Z" fill="${x.url("galv")}"/>
<rect x="56" y="116" width="88" height="22" fill="#16181d"/>${Array.from({ length: 15 }, (_, i) => `<path d="M${56 + i * 6} 116 V138" stroke="#4a4d54" stroke-width=".8"/>`).join("")}
<path d="M46 118 C50 100 70 92 100 92 C130 92 150 100 154 118 Z" fill="${x.url("dome")}"/><path d="M44 118 H156 L152 122 H48 Z" fill="${H.shade(x.c, -.35)}"/>
<path d="M60 102 L54 70 H146 L140 102 Z" fill="#000" fill-opacity=".35" transform="translate(2 4)"/><path d="M58 100 L52 66 H148 L142 100 Z" fill="#20232a"/><path d="M60 98 L55 69 H145 L140 98 Z" fill="${x.url("cell")}"/>${cells}<path d="M56 70 L90 70 L60 96 Z" fill="#fff" fill-opacity=".14"/>
<path d="M100 100 V112" stroke="#222" stroke-width="3"/>` +
        [-1, 1].map((s2) => [0, 1].map((i) => flow(x, `M${100 + s2 * 44} ${126 + i * 5} C${100 + s2 * 62} ${120 + i * 4} ${100 + s2 * 76} ${108 + i * 6} ${100 + s2 * 90} ${96 + i * 6}`, "#f3e6cf", 1.6, i * .5 + (s2 > 0 ? .3 : 0))).join("")).join("") +
        (x.on ? `<path d="M64 66 L72 58 M100 64 V54 M136 66 L128 58" stroke="#ffe08a" stroke-opacity=".7" stroke-width="1.6" stroke-linecap="round"/>` : "");
      return svg(x, { bg, fx });
    } }),

    base({ id: "wholehouse", name: "Whole-house fan", colors: [WHITE, BEIGE, GRAY, GALV, BLACK], render(o) {
      const x = ctx(o); x.fan = x.on;
      const bg = `<path d="M8 8 H192 V96 H8 Z" fill="${x.url("ceil")}"/>${Array.from({ length: 10 }, (_, i) => `<path d="M${8 + i * 20} 96 L${100 + (8 + i * 20 - 100) * .4} 8" stroke="#000" stroke-opacity=".05"/>`).join("")}<rect x="8" y="96" width="184" height="96" fill="${x.url("roomw")}"/><rect x="8" y="94" width="184" height="4" fill="#fff" fill-opacity=".35"/>
<rect x="20" y="110" width="40" height="82" fill="#5a4636"/><rect x="24" y="114" width="32" height="78" fill="#6e5743"/><circle cx="50" cy="152" r="2" fill="#c9a24a"/><rect x="140" y="112" width="40" height="44" fill="#e8e4dc"/><rect x="144" y="116" width="32" height="36" fill="${x.url("sky")}"/><path d="M160 116 V152" stroke="#e8e4dc" stroke-width="2"/>`;
      const sx = 46, sy = 34, sw = 108, sh2 = 44, n = 7;
      let sl = "";
      for (let i = 0; i < n; i++) { const xx = sx + 6 + i * (sw - 12) / n, w = (sw - 12) / n;
        sl += x.on ? `<path d="M${f(xx)} ${sy + 6} l${f(w * .2)} -3 v${sh2 - 6} l${f(-w * .2)} 3 Z" fill="${x.url("bdh")}"/>`
          : `<rect x="${f(xx)}" y="${sy + 5}" width="${f(w + .4)}" height="${sh2 - 10}" fill="${x.url("bd")}"/><path d="M${f(xx + w)} ${sy + 5} V${sy + sh2 - 5}" stroke="#000" stroke-opacity=".3"/>`; }
      const fx = `<rect x="${sx - 4}" y="${sy - 4}" width="${sw + 8}" height="${sh2 + 8}" fill="${x.url("bd")}"/><rect x="${sx}" y="${sy}" width="${sw}" height="${sh2}" fill="#14161b"/>` +
        (x.on ? `<g clip-path="url(#${x.id("sc")})">${blades(x, 100, 56, 40, 4, "#7a8088", 6)}</g>` : "") + sl + `<path d="M${sx - 4} ${sy - 4} H${sx + sw + 4}" stroke="#fff" stroke-opacity=".5"/>` +
        [[-1, .0], [-.4, .5], [.3, .2], [1, .7], [0, 1]].map(([d, del]) => flow(x, `M${f(100 + d * 80)} 182 C${f(100 + d * 70)} 140 ${f(100 + d * 50)} 110 ${f(100 + d * 28)} 82`, "#e6e6ea", 1.8, del)).join("");
      return svg(x, { bg, fx }, `<clipPath id="${x.id("sc")}"><rect x="${sx}" y="${sy}" width="${sw}" height="${sh2}"/></clipPath>`);
    } }),

    base({ id: "ducted", name: "Ducted house fan", colors: [WHITE, GALV, GRAY, BEIGE, BLACK], render(o) {
      const x = ctx(o); x.fan = x.on;
      let bg = `<rect x="8" y="8" width="184" height="112" fill="#2a2018"/>`;
      for (let i = 0; i < 5; i++) bg += `<rect x="${20 + i * 40}" y="8" width="8" height="104" fill="${x.url("raft")}" opacity=".5"/>`;
      bg += `<path d="M8 96 Q60 90 100 96 T192 94 V116 H8 Z" fill="${x.url("ins")}"/><rect x="8" y="116" width="184" height="8" fill="#c9c4bc"/><rect x="8" y="124" width="184" height="68" fill="${x.url("roomw")}"/><rect x="8" y="124" width="184" height="4" fill="#000" fill-opacity=".25"/>`;
      let duct = ""; for (let i = 0; i < 18; i++) { const t = i / 17, px = 52 + t * 80, py = 104 - Math.sin(t * Math.PI) * 50; duct += `<ellipse cx="${f(px)}" cy="${f(py)}" rx="5" ry="10" fill="#b9bcc2" transform="rotate(${f(-60 + t * 120)} ${f(px)} ${f(py)})"/><ellipse cx="${f(px)}" cy="${f(py)}" rx="5" ry="10" fill="none" stroke="#6a6e76" stroke-width=".8" transform="rotate(${f(-60 + t * 120)} ${f(px)} ${f(py)})"/>`; }
      const fx = duct + `<rect x="130" y="44" width="46" height="56" rx="4" fill="${x.url("bd")}"/><rect x="136" y="56" width="34" height="34" rx="17" fill="#1a1c22"/>` + blades(x, 153, 73, 14, 5, "#8a9098") + `<rect x="130" y="44" width="46" height="8" rx="3" fill="${x.url("bdt")}"/>${hl("M133 50 V96", .3, 1)}
<rect x="40" y="112" width="34" height="8" fill="#6a6e76"/><rect x="34" y="120" width="46" height="8" fill="${x.url("bd")}"/>${Array.from({ length: 7 }, (_, i) => `<path d="M${38 + i * 6} 121 v6" stroke="${H.shade(x.c, -.45)}" stroke-width="1.6"/>`).join("")}` +
        [0, 1, 2].map((i) => flow(x, `M${30 + i * 18} 186 C${36 + i * 12} 160 ${48 + i * 6} 140 ${56 + i * 2} 128`, "#e6e6ea", 1.6, i * .4)).join("") +
        flow(x, "M52 104 C70 60 110 50 132 70", "#f0e0c8", 2, 0) + flow(x, "M176 72 C184 66 188 60 192 56", "#f0e0c8", 2, .3);
      return svg(x, { bg, fx });
    } }),

    base({ id: "turbine", name: "Turbine roof vent", colors: [GALV, BLACK, BRONZE, WHITE, GRAY], render(o) {
      const x = ctx(o); x.fan = x.on;
      const bg = sky(x, 120, 29) + roof(x, 120);
      let vanes = ""; for (let i = 0; i < 24; i++) { const xx = 40 + i * 10; vanes += `<path d="M${xx} 60 C${xx + 8} 76 ${xx + 8} 100 ${xx} 118" fill="none" stroke="${H.shade(x.c, .25)}" stroke-width="3.4"/><path d="M${xx + 3} 60 C${xx + 11} 76 ${xx + 11} 100 ${xx + 3} 118" fill="none" stroke="${H.shade(x.c, -.45)}" stroke-width="1.4"/>`; }
      const fx = shadow(x, 100, 160, 56, 9) + `<path d="M40 158 L56 140 H144 L160 158 Z" fill="${x.url("galv")}"/><path d="M76 140 L80 120 H120 L124 140 Z" fill="${x.url("bdh")}"/>
<g clip-path="url(#${x.id("tb")})"><ellipse cx="100" cy="89" rx="40" ry="34" fill="${H.shade(x.c, -.5)}"/><g ${x.on ? `class="${P}slide" style="animation-duration:${(parseFloat(x.dur) * 2.5).toFixed(2)}s"` : ""}>${vanes}</g><ellipse cx="100" cy="89" rx="40" ry="34" fill="url(#${x.id("tsh")})"/></g>
<ellipse cx="100" cy="60" rx="30" ry="6" fill="${x.url("bdh")}"/><path d="M72 60 C76 46 88 40 100 40 C112 40 124 46 128 60 Z" fill="${x.url("dome")}"/>${hl("M80 54 C84 46 92 43 98 43", .5, 1.6)}<ellipse cx="100" cy="119" rx="24" ry="4" fill="${x.url("bdh")}"/>` +
        (x.on ? [0, 1, 2].map((i) => flow(x, `M${120 + i * 6} ${46 - i * 4} C140 ${36 - i * 4} 160 ${30 - i * 2} 190 ${24 - i * 2}`, "#f3e6cf", 1.4, i * .4)).join("") : "");
      return svg(x, { bg, fx }, `<clipPath id="${x.id("tb")}"><ellipse cx="100" cy="89" rx="40" ry="32"/></clipPath>` + lg(x.id("tsh"), [[0, "#000", .6], [.25, "#000", .05], [.5, "#fff", .12], [.75, "#000", .1], [1, "#000", .65]]));
    } }),

    base({ id: "solargable", name: "Solar gable fan", colors: [BLACK, GALV, WHITE, GRAY, BRONZE], render(o) {
      const x = ctx(o); x.fan = x.on;
      let sid = `<path d="M8 192 V110 L100 30 L192 110 V192 Z" fill="#5c6670"/>`;
      for (let y = 44; y < 192; y += 9) sid += `<path d="M8 ${y} H192" stroke="#000" stroke-opacity=".35" stroke-width="1.4"/>`;
      const bg = sky(x, 192, 31) + `<g clip-path="url(#${x.id("gb")})">${sid}</g><path d="M2 114 L100 26 L198 114" fill="none" stroke="#e8e4dc" stroke-width="6"/>`;
      let cells = ""; for (let i = 1; i < 4; i++) cells += `<path d="M${130 + i * 9} 48 L${138 + i * 9} 76" stroke="#8fb3ff" stroke-opacity=".4" stroke-width=".6"/>`;
      const fx = `<rect x="68" y="84" width="64" height="64" fill="#e8e4dc"/><rect x="72" y="88" width="56" height="56" fill="#121318"/>` + blades(x, 100, 116, 24, 5, "#3a3d44") +
        `${Array.from({ length: 8 }, (_, i) => `<path d="M72 ${92 + i * 7} H128 L128 ${95 + i * 7} H72 Z" fill="${x.url("bd")}" opacity=".9"/>`).join("")}<rect x="72" y="88" width="56" height="56" fill="none" stroke="#000" stroke-opacity=".4"/>
<path d="M128 46 L162 40 L172 70 L138 78 Z" fill="#20232a"/><path d="M130 48 L160 42 L169 69 L139 76 Z" fill="${x.url("cell")}"/>${cells}<path d="M150 74 V96" stroke="#333" stroke-width="2"/><path d="M150 96 C140 100 136 104 130 110" fill="none" stroke="#111" stroke-width="1.2"/>` +
        (x.on ? `<path d="M140 36 L136 28 M156 32 L156 24 M172 38 L178 30" stroke="#ffe08a" stroke-opacity=".7" stroke-width="1.6" stroke-linecap="round"/>` : "") +
        [0, 1, 2].map((i) => flow(x, `M${86 + i * 14} 148 C${80 + i * 14} 160 ${70 + i * 16} 172 ${60 + i * 18} 188`, "#f3e6cf", 1.5, i * .4)).join("");
      return svg(x, { bg, fx }, `<clipPath id="${x.id("gb")}"><path d="M8 192 V110 L100 30 L192 110 V192 Z"/></clipPath>`);
    } }),

    base({ id: "controller", name: "Attic fan controller", colors: [WHITE, BLACK, GRAY, BEIGE, GALV], render(o) {
      const x = ctx(o); x.fan = x.on;
      const temp = 98, hum = 42, col = x.on ? "#7fd8ff" : "#4a5a66";
      const bg = `<rect x="8" y="8" width="184" height="184" fill="${x.url("roomw")}"/>` + `<rect x="8" y="150" width="184" height="42" fill="#000" fill-opacity=".12"/><rect x="146" y="40" width="30" height="46" rx="3" fill="#e8e4dc"/><rect x="156" y="52" width="10" height="20" rx="2" fill="#cfcac0"/>`;
      const fx = drop(x, `<rect x="54" y="40" width="80" height="116" rx="12"/>`, 3, 6, .5) + `<rect x="54" y="40" width="80" height="116" rx="12" fill="${x.url("bdh")}"/><rect x="54" y="40" width="80" height="116" rx="12" fill="none" stroke="#fff" stroke-opacity=".3"/>
<rect x="64" y="52" width="60" height="58" rx="6" fill="#0e1218"/>${x.on ? `<rect x="64" y="52" width="60" height="58" rx="6" fill="#7fd8ff" fill-opacity=".06"/>` : ""}
${digit(80, 72, 1.25, Math.floor(temp / 10), col)}${digit(94, 72, 1.25, temp % 10, col)}<circle cx="104" cy="64" r="1.8" fill="none" stroke="${col}" stroke-width="1"/>
${digit(102, 96, .6, Math.floor(hum / 10), col)}${digit(108, 96, .6, hum % 10, col)}<path d="M113 92 l3 -3 M113 89 h.5 M116 92 h.5" stroke="${col}" stroke-width=".8"/>` +
        `<g transform="translate(78 97)"><g ${x.on ? `class="${P}spin" style="animation-duration:${x.dur}"` : ""}><circle r="7" fill="none"/>${[0, 120, 240].map((a) => `<path d="M0 0 C2 -2 4 -6 1 -7 C-2 -6 -1 -2 0 0 Z" fill="${col}" transform="rotate(${a})"/>`).join("")}</g></g>
<rect x="66" y="120" width="22" height="12" rx="6" fill="${H.shade(x.c, -.15)}"/><rect x="100" y="120" width="22" height="12" rx="6" fill="${H.shade(x.c, -.15)}"/><path d="M73 126 h8 M107 126 h8 M111 122 v8" stroke="${H.shade(x.c, -.5)}" stroke-width="1.4"/>
<circle cx="94" cy="144" r="2.4" fill="${x.on ? "#7dff9a" : "#2a3a2a"}"/>${x.on ? `<circle cx="94" cy="144" r="5" fill="#7dff9a" fill-opacity=".25"/>` : ""}`;
      return svg(x, { bg, fx });
    } }),
  ];

  (window.HDA = window.HDA || []).push({
    id: "evap",
    tab: "Swamp coolers & attic fans",
    group: "Air",
    kind: "fan",
    levelLabel: "Speed",
    intro: "Evaporative coolers in windows, walls and on roofs, portable ones, and attic fans. Coolers have a Fan and a Pump: the pump wets and darkens the pads and drips water, the fan moves the air. The slider sets the speed.",
    
    css: `.hda-anim .hda-evap-spin{animation:hda-evap-spin 1s linear infinite;transform-box:fill-box;transform-origin:center}
@keyframes hda-evap-spin{to{transform:rotate(360deg)}}
.hda-anim .hda-evap-flow{animation:hda-evap-flow 1.4s linear infinite}
@keyframes hda-evap-flow{to{stroke-dashoffset:-36}}
.hda-anim .hda-evap-drip{animation:hda-evap-drip 1.1s ease-in infinite}
@keyframes hda-evap-drip{0%{transform:translate(0,0);opacity:1}100%{transform:translate(0,14px);opacity:0}}
.hda-anim .hda-evap-slide{animation:hda-evap-slide 1s linear infinite}
@keyframes hda-evap-slide{to{transform:translate(-10px,0)}}
.hda-anim .hda-evap-mist{animation:hda-evap-mist 2s ease-out infinite}
@keyframes hda-evap-mist{0%{transform:translate(0,0);opacity:.9}100%{transform:translate(-14px,-6px);opacity:0}}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-evap-spin,.hda-anim .hda-evap-flow,.hda-anim .hda-evap-drip,.hda-anim .hda-evap-slide,.hda-anim .hda-evap-mist{animation:none}}`,
    icons,
  });
})();
