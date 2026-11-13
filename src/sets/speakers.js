(function () {
  const P = "hda-speakers-";
  const H = window.HDAH;
  const f = (n) => (+n).toFixed(1);
  const GB = "#4285f4", GR = "#ea4335", GY = "#fbbc05", GG = "#34a853", DOTS = [GB, GR, GY, GG];
  const CHALK = "#e7e5e1", CHAR = "#4a4c50", CORAL = "#f08f7b", AQUA = "#9fd5d1", SKY = "#a9c9e6", SAGE = "#b8c8b0", SAND = "#e6cfbd",
    MIST = "#bcd3d6", SNOW = "#f3f3f1", LINEN = "#e9ddcd", FOG = "#bfcbd4", LEMON = "#d9dfa8", PORC = "#ece8e1", HAZEL = "#6b7568",
    JADE = "#9ec2b0", BERRY = "#c86d86", SUNRISE = "#f3c6b8", IVY = "#8a9a8e", ASH = "#8d9195";

  const st = (stops) => stops.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a == null ? "" : ` stop-opacity="${a}"`}/>`).join("");
  const lg = (id, stops, v, x2, y2) => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2 != null ? x2 : v ? 0 : 1}" y2="${y2 != null ? y2 : v ? 1 : 0}">${st(stops)}</linearGradient>`;
  const rg = (id, stops, cx, cy, r) => `<radialGradient id="${id}" cx="${cx == null ? .5 : cx}" cy="${cy == null ? .5 : cy}" r="${r || .5}">${st(stops)}</radialGradient>`;

  function ctx(o) {
    const c = o.color || CHALK, on = !!o.on, lv = o.level == null ? .6 : o.level;
    const id = (s) => `${o.uid}-${s}`, url = (s) => `url(#${o.uid}-${s})`;
    const lum = (() => { const [r, g, b] = H.hx(c); return (r * .3 + g * .59 + b * .11) / 255; })();
    return { c, on, lv, id, url, dark: lum < .45 };
  }
  function defs(x, extra) {
    const { c, id } = x;
    return `<defs>
${rg(id("fab"), [[0, H.shade(c, .25)], [.6, c], [1, H.shade(c, -.28)]], .38, .3, .8)}
${lg(id("fabv"), [[0, H.shade(c, .12)], [.6, c], [1, H.shade(c, -.25)]], 1)}
${lg(id("fabh"), [[0, H.shade(c, -.22)], [.3, H.shade(c, .12)], [.6, c], [1, H.shade(c, -.3)]])}
<pattern id="${id("wv")}" width="2.6" height="2.6" patternUnits="userSpaceOnUse"><circle cx=".7" cy=".7" r=".55" fill="#000" fill-opacity=".14"/><circle cx="2" cy="2" r=".45" fill="#fff" fill-opacity=".12"/></pattern>
${rg(id("pl"), [[0, H.shade(c, .4)], [.55, c], [1, H.shade(c, -.22)]], .35, .28, .85)}
${lg(id("plv"), [[0, H.shade(c, .25)], [1, H.shade(c, -.18)]], 1)}
${lg(id("met"), [[0, H.shade(c, .5)], [.3, H.shade(c, -.25)], [.55, H.shade(c, .45)], [.8, H.shade(c, -.3)], [1, H.shade(c, .2)]], 0, 1, 1)}
${lg(id("wht"), [[0, "#ffffff"], [.6, "#eceae6"], [1, "#c9c6c0"]], 1)}
${lg(id("blk"), [[0, "#1a1b20"], [1, "#050608"]], 1)}
<linearGradient id="${id("glass")}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".35" stop-color="#fff" stop-opacity=".02"/><stop offset=".55" stop-color="#fff" stop-opacity=".1"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/></linearGradient>
${lg(id("wall"), [[0, "#4b4566"], [1, "#3a3550"]], 1)}
${lg(id("wood"), [[0, "#b48152"], [1, "#7c5130"]], 1)}
${lg(id("woodE"), [[0, "#6b4428"], [1, "#4a2c16"]], 1)}
${lg(id("ctr"), [[0, "#d7d3e0"], [.5, "#b3afc2"], [1, "#c9c5d4"]])}
${rg(id("sh"), [[0, "#000", .55], [1, "#000", 0]])}
${lg(id("photo"), [[0, "#f6b26b"], [.45, "#d97a8a"], [1, "#3e4f8c"]], 1)}
${rg(id("halo"), [[0, "#fff", .7], [1, "#fff", 0]])}
${extra || ""}</defs>`;
  }
  const svg = (x, body, extra) => `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs(x, extra)}${body}</svg>`;
  const wallBg = (x) => `<g class="hda-bg"><rect x="0" y="0" width="200" height="200" fill="${x.url("wall")}" opacity=".55"/></g>`;
  const shelf = (x, y) => `${wallBg(x)}<g class="hda-bg"><rect x="0" y="${y}" width="200" height="8" fill="${x.url("wood")}"/><rect x="0" y="${y + 8}" width="200" height="5" fill="${x.url("woodE")}"/><path d="M0 ${y + .5} H200" stroke="#fff" stroke-opacity=".3"/></g>`;
  const counter = (x, y) => `${wallBg(x)}<g class="hda-bg"><rect x="0" y="${y}" width="200" height="10" fill="${x.url("ctr")}"/><rect x="0" y="${y + 10}" width="200" height="${190 - y}" fill="#2a2638" opacity=".8"/><path d="M0 ${y + .5} H200" stroke="#fff" stroke-opacity=".5"/></g>`;
  const shadow = (cx, cy, rx, ry) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#__SH__)"/>`;
  const fin = (x, s) => s.replace(/__SH__/g, x.id("sh"));
  const weave = (x, d) => `<path d="${d}" fill="${x.url("wv")}"/>`;

  function dots(x, pts, r, white) {
    const vol = Math.max(1, Math.round(x.lv * 4));
    return pts.map(([a, b], i) => {
      if (!x.on) return `<circle cx="${f(a)}" cy="${f(b)}" r="${f(r * .55)}" fill="#000" opacity=".12"/>`;
      const col = white ? "#ffffff" : DOTS[i % 4], br = i < vol;
      return `<g class="${P}dot" style="animation-delay:-${(i * .35).toFixed(2)}s"><circle cx="${f(a)}" cy="${f(b)}" r="${f(r * 2.6)}" fill="${col}" opacity="${br ? .25 : .08}"/><circle cx="${f(a)}" cy="${f(b)}" r="${f(r)}" fill="${col}" opacity="${br ? 1 : .35}"/></g>`;
    }).join("");
  }
  const row4 = (cx, cy, gap) => [0, 1, 2, 3].map((i) => [cx + (i - 1.5) * gap, cy]);

  const SEG = { 0: "abcdef", 1: "bc", 2: "abdeg", 3: "abcdg", 4: "bcfg", 5: "acdfg", 6: "acdefg", 7: "abc", 8: "abcdefg", 9: "abcdfg" };
  function digits(str, X, Y, h, col) {
    const w = h * .52, t = Math.max(1, h * .13); let s = "", xx = X;
    for (const ch of str) {
      if (ch === ":") { s += `<circle cx="${f(xx + t)}" cy="${f(Y + h * .3)}" r="${f(t * .6)}" fill="${col}"/><circle cx="${f(xx + t)}" cy="${f(Y + h * .7)}" r="${f(t * .6)}" fill="${col}"/>`; xx += t * 3; continue; }
      if (ch === "°") { s += `<circle cx="${f(xx + t * 1.4)}" cy="${f(Y + t * 1.4)}" r="${f(t)}" fill="none" stroke="${col}" stroke-width="${f(t * .6)}"/>`; xx += t * 3.4; continue; }
      const g = SEG[ch] || "";
      const seg = { a: [xx + t, Y, w - 2 * t, t], d: [xx + t, Y + h - t, w - 2 * t, t], g: [xx + t, Y + h / 2 - t / 2, w - 2 * t, t],
        f: [xx, Y + t * .6, t, h / 2 - t], b: [xx + w - t, Y + t * .6, t, h / 2 - t], e: [xx, Y + h / 2 + t * .4, t, h / 2 - t], c: [xx + w - t, Y + h / 2 + t * .4, t, h / 2 - t] };
      for (const k of g) { const [a, b, c, d] = seg[k]; s += `<rect x="${f(a)}" y="${f(b)}" width="${f(c)}" height="${f(d)}" rx="${f(t / 2)}" fill="${col}"/>`; }
      xx += w + t * 1.6;
    }
    return s;
  }
  function ambient(x, X, Y, W, Hh) {
    if (!x.on) return `<rect x="${X}" y="${Y}" width="${W}" height="${Hh}" rx="2" fill="${x.url("blk")}"/><rect x="${X}" y="${Y}" width="${W}" height="${Hh}" rx="2" fill="${x.url("glass")}"/>`;
    return `<rect x="${X}" y="${Y}" width="${W}" height="${Hh}" rx="2" fill="${x.url("photo")}"/>
<circle cx="${f(X + W * .76)}" cy="${f(Y + Hh * .3)}" r="${f(Hh * .12)}" fill="#ffe7a8" opacity=".9"/>
<path d="M${X} ${f(Y + Hh * .78)} L${f(X + W * .28)} ${f(Y + Hh * .55)} L${f(X + W * .5)} ${f(Y + Hh * .72)} L${f(X + W * .72)} ${f(Y + Hh * .5)} L${X + W} ${f(Y + Hh * .7)} V${Y + Hh} H${X} Z" fill="#2c2742" opacity=".75"/>
${digits("10:08", X + W * .07, Y + Hh * .64, Hh * .22, "#ffffff")}
<circle cx="${f(X + W * .82)}" cy="${f(Y + Hh * .78)}" r="${f(Hh * .06)}" fill="#ffd36e"/><rect x="${f(X + W * .88)}" y="${f(Y + Hh * .74)}" width="${f(W * .07)}" height="${f(Hh * .07)}" rx="1" fill="#fff"/>
<rect x="${X}" y="${Y}" width="${W}" height="${Hh}" rx="2" fill="${x.url("glass")}"/>`;
  }
  function tv(x, X, Y, W, Hh) {
    let s = `<rect x="${X - 2}" y="${Y - 2}" width="${W + 4}" height="${Hh + 4}" rx="2" fill="#07070b"/>`;
    if (!x.on) return s + `<rect x="${X}" y="${Y}" width="${W}" height="${Hh}" fill="${x.url("blk")}"/><rect x="${X}" y="${Y}" width="${W}" height="${Hh}" fill="${x.url("glass")}"/>`;
    s += `<rect x="${X}" y="${Y}" width="${W}" height="${Hh}" fill="#141a2a"/><rect x="${X}" y="${Y}" width="${W}" height="${f(Hh * .5)}" fill="${x.url("photo")}" opacity=".85"/>
<rect x="${f(X + W * .05)}" y="${f(Y + Hh * .12)}" width="${f(W * .3)}" height="${f(Hh * .06)}" rx="1" fill="#fff" opacity=".9"/><rect x="${f(X + W * .05)}" y="${f(Y + Hh * .22)}" width="${f(W * .18)}" height="${f(Hh * .05)}" rx="1" fill="#fff" opacity=".6"/>`;
    for (let r = 0; r < 2; r++) for (let c = 0; c < 6; c++) s += `<rect x="${f(X + W * (.04 + c * .16))}" y="${f(Y + Hh * (.56 + r * .22))}" width="${f(W * .14)}" height="${f(Hh * .17)}" rx="1.2" fill="${["#e2645c", "#5aa0e6", "#3fbf8f", "#f0a33f", "#9b7ae0", "#6c7a96"][(c + r * 2) % 6]}" opacity=".9"/>`;
    return s + `<rect x="${X}" y="${Y}" width="${W}" height="${Hh}" fill="${x.url("glass")}"/>`;
  }
  const led = (x, cx, cy, col, cls) => x.on ? `<circle cx="${cx}" cy="${cy}" r="5" fill="${col}" opacity=".25"/><circle class="${cls || ""}" cx="${cx}" cy="${cy}" r="1.8" fill="${col}"/>` : `<circle cx="${cx}" cy="${cy}" r="1.4" fill="#000" opacity=".25"/>`;
  const base = (o) => Object.assign({ picker: true, colorLabel: "Color" }, o);
  const first = (c, l) => [c].concat(l.filter((k) => k !== c));

  const icons = [
    base({ id: "vase-speaker", name: "Vase speaker", colors: ["#6f747c", CORAL, "#b8774f", "#34363a", "#9cc3c9"], render(o) {
      const x = ctx(o), cx = 100;
      const top = "M72 60 L128 48 V122 A28 7 0 0 1 72 122 Z", fab = "M72 122 A28 7 0 0 0 128 122 V146 A28 7 0 0 1 72 146 Z";
      const ring = [0, 1, 2, 3].map((i) => { const a = i * Math.PI / 2 + .8; return [cx + Math.cos(a) * 7, 54 + Math.sin(a) * 2.6]; });
      return svg(x, fin(x, `${shelf(x, 150)}${shadow(100, 151, 36, 4)}<path d="${fab}" fill="${x.url("fabh")}"/>${weave(x, fab)}
<path d="${top}" fill="${x.url("wht")}"/><path d="M118 50 L128 48 V122 C126 124 122 125 118 125.6 Z" fill="#000" opacity=".08"/>
<ellipse cx="100" cy="54" rx="28.6" ry="8.6" transform="rotate(-12 100 54)" fill="#fbfaf8"/><ellipse cx="100" cy="54" rx="28.6" ry="8.6" transform="rotate(-12 100 54)" fill="none" stroke="#c9c6c0" stroke-width=".8"/>
<g transform="rotate(-12 100 54)">${dots(x, ring, 1.5)}</g>
<path d="M74 64 V118" stroke="#fff" stroke-opacity=".8" stroke-width="2"/>`));
    } }),

    base({ id: "fabric-mini-speaker", name: "Fabric mini speaker", colors: [CHALK, CHAR, CORAL, AQUA], render(o) {
      const x = ctx(o), dome = "M50 128 C50 98 150 98 150 128 Z";
      return svg(x, fin(x, `${shelf(x, 140)}${shadow(100, 141, 56, 5)}
<path d="M50 128 C50 134 54 138 60 139 H140 C146 138 150 134 150 128 Z" fill="${H.shade(x.c, -.3)}"/><path d="M52 132 H148" stroke="${H.shade(x.c, -.45)}" stroke-width="1.4"/>
<path d="${dome}" fill="${x.url("fab")}"/>${weave(x, dome)}<path d="M60 116 C70 106 96 103 112 104" stroke="#fff" stroke-opacity=".25" stroke-width="3" fill="none" stroke-linecap="round"/>
${dots(x, row4(100, 112, 10), 2.2, true)}`));
    } }),

    base({ id: "mini-speaker-wall-hook", name: "Mini speaker, wall hook", colors: [CHALK, CHAR, "#f4a196", SKY], render(o) {
      const x = ctx(o), d = "M54 96 a46 46 0 1 0 92 0 a46 46 0 1 0 -92 0 Z";
      return svg(x, fin(x, `${wallBg(x)}<circle cx="102" cy="100" r="47" fill="#000" opacity=".3"/>
<path d="M100 142 C100 160 108 170 104 200" stroke="#e9e6df" stroke-width="2.4" fill="none"/>
<circle cx="100" cy="96" r="47" fill="${H.shade(x.c, -.32)}"/><path d="${d}" fill="${x.url("fab")}"/>${weave(x, d)}
<path d="M66 72 C76 60 92 54 106 54" stroke="#fff" stroke-opacity=".25" stroke-width="3" fill="none" stroke-linecap="round"/>
${dots(x, row4(100, 96, 11), 2.4, true)}`));
    } }),

    base({ id: "fabric-smart-speaker", name: "Fabric smart speaker", colors: [CHALK, CHAR, SAGE, SAND, SKY], render(o) {
      const x = ctx(o), d = "M76 40 H124 C136 40 140 52 140 70 V128 C140 146 134 152 122 152 H78 C66 152 60 146 60 128 V70 C60 52 64 40 76 40 Z";
      return svg(x, fin(x, `${shelf(x, 152)}${shadow(100, 153, 44, 4)}<path d="${d}" fill="${x.url("fabh")}"/>${weave(x, d)}
<path d="M66 60 C66 50 70 44 78 43" stroke="#fff" stroke-opacity=".3" stroke-width="2.6" fill="none" stroke-linecap="round"/>
${dots(x, row4(100, 62, 9), 2.2, true)}`));
    } }),

    base({ id: "large-fabric-speaker", name: "Large fabric speaker", colors: [CHALK, CHAR], render(o) {
      const x = ctx(o);
      return svg(x, fin(x, `${shelf(x, 150)}${shadow(100, 151, 74, 4)}
<rect x="28" y="58" width="144" height="94" rx="16" fill="${x.dark ? "#3a3b3f" : "#e9e8e4"}"/><rect x="28" y="58" width="144" height="94" rx="16" fill="none" stroke="#000" stroke-opacity=".18"/><path d="M40 60.5 H160" stroke="#fff" stroke-opacity=".5" stroke-width="1.2" stroke-linecap="round"/>
<rect x="34" y="64" width="132" height="82" rx="11" fill="${x.url("fabv")}"/><rect x="34" y="64" width="132" height="82" rx="11" fill="${x.url("wv")}"/>
${dots(x, row4(100, 78, 8), 1.8, true)}`));
    } }),

    base({ id: "7-inch-smart-display", name: "7-inch smart display", colors: [CHALK, CHAR, SAND, MIST], render(o) {
      const x = ctx(o), bz = x.dark ? "#202125" : "#f4f3f0", bs = "M56 132 C56 124 144 124 144 132 L146 150 H54 Z";
      return svg(x, fin(x, `${counter(x, 150)}${shadow(100, 151, 44, 4)}
<path d="${bs}" fill="${x.url("fabh")}"/>${weave(x, bs)}
<rect x="44" y="52" width="112" height="80" rx="6" fill="${bz}"/><rect x="44" y="52" width="112" height="80" rx="6" fill="none" stroke="#000" stroke-opacity=".2"/>
${ambient(x, 49, 57, 102, 70)}`));
    } }),

    base({ id: "10-inch-smart-display", name: "10-inch smart display", colors: [CHALK, CHAR], render(o) {
      const x = ctx(o), bz = x.dark ? "#202125" : "#f4f3f0", bs = "M58 140 C58 132 142 132 142 140 L145 158 H55 Z";
      return svg(x, fin(x, `${counter(x, 158)}${shadow(100, 159, 52, 4)}
<path d="${bs}" fill="${x.url("fabh")}"/>${weave(x, bs)}
<rect x="26" y="38" width="148" height="104" rx="7" fill="${bz}"/><rect x="26" y="38" width="148" height="104" rx="7" fill="none" stroke="#000" stroke-opacity=".2"/>
<circle cx="100" cy="43" r="2.2" fill="#14151a"/>${led(x, 108, 43, "#34d17a", P + "blink")}
${ambient(x, 32, 48, 136, 88)}`));
    } }),

    base({ id: "pebble-tv-streamer", name: "Pebble TV streamer", colors: [PORC, HAZEL], render(o) {
      const x = ctx(o), sl = "M62 150 C55 150 55 139 64 135 C72 131 90 129 100 129 C112 129 130 131 138 135 C146 139 146 150 138 150 Z";
      return svg(x, fin(x, `${wallBg(x)}<g class="hda-bg">${tv(x, 22, 12, 156, 88)}</g>
<g class="hda-bg"><rect x="0" y="150" width="200" height="9" fill="${x.url("wood")}"/><rect x="0" y="159" width="200" height="41" fill="${x.url("woodE")}"/></g>
${shadow(100, 151, 46, 3)}<path d="${sl}" fill="${x.url("plv")}"/><path d="M66 136 C76 132 120 131 134 135" stroke="#fff" stroke-opacity=".5" stroke-width="1.6" fill="none"/>
${led(x, 100, 140, "#ffffff")}
<g transform="rotate(-8 166 146)"><rect x="152" y="141" width="30" height="8" rx="4" fill="${H.shade(x.c, .1)}"/><circle cx="160" cy="145" r="2.4" fill="${H.shade(x.c, -.2)}"/><circle cx="170" cy="145" r="1.2" fill="${H.shade(x.c, -.3)}"/></g>`));
    } }),

    base({ id: "streaming-dongle-remote", name: "Streaming dongle + remote", colors: [SNOW, SUNRISE, SKY], render(o) {
      const x = ctx(o), puck = "M84 124 C84 116 116 116 116 124 C116 134 84 134 84 124 Z";
      return svg(x, fin(x, `${wallBg(x)}<g class="hda-bg">${tv(x, 18, 10, 164, 92)}</g>
<path d="M100 104 C100 110 98 114 100 118" stroke="#16141c" stroke-width="2.2" fill="none"/>
<ellipse cx="100" cy="125" rx="16" ry="9" fill="${x.url("pl")}"/><path d="${puck}" fill="#fff" opacity=".12"/>
<g class="hda-bg"><rect x="0" y="156" width="200" height="9" fill="${x.url("wood")}"/><rect x="0" y="165" width="200" height="35" fill="${x.url("woodE")}"/></g>
<g transform="rotate(-70 140 150)"><rect x="128" y="144" width="40" height="11" rx="5.5" fill="${x.url("plv")}"/><circle cx="135" cy="149.5" r="3.2" fill="${H.shade(x.c, -.15)}"/><circle cx="145" cy="149.5" r="1.3" fill="${H.shade(x.c, -.3)}"/><circle cx="151" cy="149.5" r="1.3" fill="${H.shade(x.c, -.3)}"/></g>
${x.on ? `<circle cx="133" cy="150" r="1.4" fill="#fff"/>` : ""}`));
    } }),

    base({ id: "round-smart-speaker", name: "Round smart speaker", colors: [PORC, HAZEL, JADE, BERRY], render(o) {
      const x = ctx(o), d = "M50 140 C42 104 62 70 100 70 C138 70 158 104 150 140 Z";
      const ring = lg(x.id("rg"), [[0, GB], [.33, GR], [.66, GY], [1, GG]]);
      return svg(x, fin(x, `${shelf(x, 150)}${shadow(100, 151, 50, 4)}
${x.on ? `<ellipse class="${P}ring" cx="100" cy="146" rx="52" ry="9" fill="url(#${x.id("rg")})" opacity="${(.25 + .3 * x.lv).toFixed(2)}"/>` : ""}
<ellipse cx="100" cy="144" rx="48" ry="6" fill="${H.shade(x.c, -.4)}"/>
<path d="M54 138 C54 146 146 146 146 138 V144 C146 150 54 150 54 144 Z" fill="${x.on ? "url(#" + x.id("rg") + ")" : H.shade(x.c, -.15)}" opacity="${x.on ? (.6 + .4 * x.lv).toFixed(2) : 1}"/>
<path d="${d}" fill="${x.url("fab")}"/>${weave(x, d)}<path d="M70 96 C76 78 88 70 100 68" stroke="#fff" stroke-opacity=".25" stroke-width="3" fill="none" stroke-linecap="round"/>`), ring);
    } }),

    base({ id: "mesh-router", name: "Mesh router", colors: [SNOW, LINEN, FOG, LEMON], render(o) {
      const x = ctx(o), d = "M68 152 V78 C68 52 82 42 100 42 C118 42 132 52 132 78 V152 Z";
      return svg(x, fin(x, `${shelf(x, 152)}${shadow(100, 153, 38, 4)}<path d="${d}" fill="${x.url("pl")}"/>
<path d="M74 76 C74 58 84 48 98 46" stroke="#fff" stroke-opacity=".6" stroke-width="3" fill="none" stroke-linecap="round"/>${led(x, 100, 134, "#ffffff", P + "breath")}`));
    } }),

    base({ id: "mesh-point-speaker", name: "Mesh point speaker", colors: [SNOW, SAND, MIST], render(o) {
      const x = ctx(o), d = "M62 150 C60 128 62 100 68 92 C78 84 122 84 132 92 C138 100 140 128 138 150 Z";
      return svg(x, fin(x, `${shelf(x, 150)}${shadow(100, 151, 40, 4)}<path d="${d}" fill="${x.url("pl")}"/>
<ellipse cx="100" cy="89" rx="30" ry="5" fill="#fff" opacity=".35"/>
<ellipse cx="100" cy="89" rx="12" ry="2.4" fill="${x.on ? "#ffffff" : H.shade(x.c, -.15)}"/>${x.on ? `<ellipse class="${P}breath" cx="100" cy="89" rx="22" ry="6" fill="#fff" opacity=".3"/>` : ""}
<path d="M70 120 C70 104 74 96 80 93" stroke="#fff" stroke-opacity=".55" stroke-width="2.4" fill="none" stroke-linecap="round"/>`));
    } }),

    base({ id: "round-learning-thermostat", name: "Round learning thermostat", colors: ["#d6d9de", "#d9c08a", "#2a2b2e"], colorLabel: "Ring", render(o) {
      const x = ctx(o);
      const arc = (r, a0, a1) => { const p = (a) => `${f(100 + Math.cos(a) * r)} ${f(100 + Math.sin(a) * r)}`; return `M${p(a0)} A${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${p(a1)}`; };
      return svg(x, fin(x, `${wallBg(x)}<circle cx="102" cy="104" r="58" fill="#000" opacity=".3"/>
<circle cx="100" cy="100" r="58" fill="${x.url("met")}"/><circle cx="100" cy="100" r="54" fill="#000" opacity=".25"/><circle cx="100" cy="100" r="53" fill="${x.url("blk")}"/>
${x.on ? `<path d="${arc(44, Math.PI * .75, Math.PI * 2.25)}" stroke="#ffffff" stroke-opacity=".15" stroke-width="3" fill="none" stroke-linecap="round"/>
<path d="${arc(44, Math.PI * .75, Math.PI * 1.55)}" stroke="#ff8a2a" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="${f(100 + Math.cos(Math.PI * 1.55) * 44)}" cy="${f(100 + Math.sin(Math.PI * 1.55) * 44)}" r="3.4" fill="#fff"/>
${digits("71", 78, 82, 34, "#ffffff")}<rect x="86" y="126" width="28" height="3" rx="1.5" fill="#ff8a2a" opacity=".85"/>` : ""}
<circle cx="100" cy="100" r="53" fill="${x.url("glass")}"/>`));
    } }),

    base({ id: "frosted-thermostat", name: "Frosted thermostat", colors: [SNOW, "#e8e3da", "#d8dde2"], render(o) {
      const x = ctx(o);
      return svg(x, fin(x, `${wallBg(x)}<circle cx="102" cy="104" r="50" fill="#000" opacity=".28"/><circle cx="100" cy="100" r="50" fill="${x.url("pl")}"/>
<circle cx="100" cy="100" r="42" fill="#e6e8ec"/><circle cx="100" cy="100" r="42" fill="${x.url("glass")}"/>
${x.on ? `<circle cx="100" cy="100" r="40" fill="#fff" opacity=".7"/>${digits("70", 82, 86, 28, "#f29a4a")}` : `<circle cx="100" cy="100" r="42" fill="#000" opacity=".05"/>`}`));
    } }),

    base({ id: "smoke-and-co-alarm", name: "Smoke & CO alarm", colors: [SNOW, "#e9e6df", "#dcdfe3"], render(o) {
      const x = ctx(o); let holes = "";
      for (let r = 0; r < 13; r++) for (let c = 0; c < 13; c++) { const hx = 56 + c * 7.4, hy = 48 + r * 7.4; if (Math.hypot(hx - 100, hy - 92) < 26 || Math.hypot(Math.max(0, Math.abs(hx - 100) - 30), Math.max(0, Math.abs(hy - 92) - 30)) > 14) continue; holes += `<circle cx="${f(hx)}" cy="${f(hy)}" r="1.2" fill="#000" opacity=".22"/>`; }
      return svg(x, fin(x, `<g class="hda-bg"><rect width="200" height="200" fill="#d9d6e0" opacity=".35"/></g><rect x="50" y="42" width="104" height="104" rx="22" fill="#000" opacity=".2"/>
<rect x="48" y="40" width="104" height="104" rx="22" fill="${x.url("pl")}"/>${holes}
<circle cx="100" cy="92" r="20" fill="${H.shade(x.c, -.05)}"/>
${x.on ? `<circle class="${P}breath" cx="100" cy="92" r="20" fill="none" stroke="#5be08a" stroke-width="3.4" opacity=".9"/><circle cx="100" cy="92" r="26" fill="none" stroke="#5be08a" stroke-width="6" opacity=".2"/>` : `<circle cx="100" cy="92" r="20" fill="none" stroke="#000" stroke-opacity=".12" stroke-width="2"/>`}
<circle cx="100" cy="92" r="15" fill="${x.url("pl")}"/>`));
    } }),

    base({ id: "indoor-cam-wired", name: "Indoor cam, wired", colors: [SNOW, FOG, LINEN, SAND], render(o) {
      const x = ctx(o);
      return svg(x, fin(x, `${shelf(x, 152)}${shadow(100, 153, 34, 4)}
<ellipse cx="100" cy="150" rx="26" ry="5" fill="${H.shade(x.c, -.2)}"/><path d="M74 150 C74 144 126 144 126 150" fill="${x.url("plv")}"/>
<path d="M90 112 C92 124 92 134 82 147 H118 C108 134 108 124 110 112 Z" fill="${x.url("plv")}"/>
<circle cx="100" cy="82" r="35" fill="${x.url("pl")}"/>
<circle cx="100" cy="84" r="25" fill="${x.url("blk")}"/><circle cx="100" cy="84" r="25" fill="${x.url("glass")}"/>
<circle cx="100" cy="84" r="9" fill="#0a0b10"/><circle cx="100" cy="84" r="5" fill="#1d2a44"/><circle cx="98" cy="82" r="1.6" fill="#fff" opacity=".6"/>
${led(x, 100, 66, "#34d17a", P + "blink")}`));
    } }),

    base({ id: "battery-cam", name: "Battery cam", colors: [SNOW, FOG, ASH], render(o) {
      const x = ctx(o); let sid = ""; for (let y = 10; y < 200; y += 12) sid += `<path d="M0 ${y} H200" stroke="#000" stroke-opacity=".15"/>`;
      return svg(x, fin(x, `<g class="hda-bg"><rect width="200" height="200" fill="#8c95b0" opacity=".3"/>${sid}</g>
<rect x="118" y="70" width="34" height="44" rx="4" fill="#d9d6e0"/><circle cx="135" cy="92" r="9" fill="#bdb9c6"/><path d="M135 92 L112 96" stroke="#bdb9c6" stroke-width="6"/>
<rect x="64" y="42" width="54" height="116" rx="27" fill="#000" opacity=".25" transform="translate(3 4)"/>
<rect x="64" y="42" width="54" height="116" rx="27" fill="${x.url("pl")}"/>
<circle cx="91" cy="70" r="21" fill="${x.url("blk")}"/><circle cx="91" cy="70" r="21" fill="${x.url("glass")}"/>
<circle cx="91" cy="70" r="9" fill="#0a0b10"/><circle cx="91" cy="70" r="5" fill="#1d2a44"/><circle cx="89" cy="68" r="1.6" fill="#fff" opacity=".6"/>
${led(x, 91, 88, "#34d17a", P + "blink")}`));
    } }),

    base({ id: "battery-video-doorbell", name: "Battery video doorbell", colors: [SNOW, IVY, LINEN, ASH], render(o) {
      const x = ctx(o);
      return svg(x, fin(x, `<g class="hda-bg"><rect width="200" height="200" fill="#5a4a3c" opacity=".45"/><rect x="0" y="0" width="44" height="200" fill="#e9e6df" opacity=".85"/><rect x="40" y="0" width="6" height="200" fill="#bdb9c6"/></g>
<rect x="80" y="30" width="40" height="140" rx="20" fill="#000" opacity=".25" transform="translate(3 4)"/>
<rect x="80" y="30" width="40" height="140" rx="20" fill="${x.url("pl")}"/>
<path d="M84 52 C84 40 91 34 100 34 C109 34 116 40 116 52 V82 H84 Z" fill="${x.url("blk")}"/><path d="M84 52 C84 40 91 34 100 34 C109 34 116 40 116 52 V82 H84 Z" fill="${x.url("glass")}"/>
<circle cx="100" cy="54" r="7" fill="#0a0b10"/><circle cx="100" cy="54" r="4" fill="#1d2a44"/><circle cx="98.6" cy="52.6" r="1.2" fill="#fff" opacity=".6"/>
<circle cx="100" cy="142" r="12" fill="${H.shade(x.c, -.08)}"/>
${x.on ? `<circle class="${P}breath" cx="100" cy="142" r="12" fill="none" stroke="#fff" stroke-width="2.6"/><circle cx="100" cy="142" r="17" fill="none" stroke="#fff" stroke-width="5" opacity=".2"/>` : `<circle cx="100" cy="142" r="12" fill="none" stroke="#000" stroke-opacity=".15" stroke-width="1.6"/>`}
<circle cx="100" cy="142" r="9" fill="${x.url("pl")}"/>`));
    } }),

    base({ id: "touch-deadbolt", name: "Touch deadbolt", colors: ["#b8bcc0", "#4a3b30", "#c9a95a", "#2c2d30"], colorLabel: "Finish", render(o) {
      const x = ctx(o); let keys = "";
      for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) { if (r === 3 && c !== 1) continue; keys += x.on ? `<circle cx="${88 + c * 12}" cy="${70 + r * 18}" r="2.4" fill="#ffffff"/><circle cx="${88 + c * 12}" cy="${70 + r * 18}" r="5" fill="#bfe4ff" opacity=".18"/>` : `<circle cx="${88 + c * 12}" cy="${70 + r * 18}" r="1.4" fill="#fff" opacity=".08"/>`; }
      return svg(x, fin(x, `<g class="hda-bg"><rect width="200" height="200" fill="#6b4428" opacity=".6"/>${[30, 70, 130, 170].map((xx) => `<path d="M${xx} 0 V200" stroke="#000" stroke-opacity=".15"/>`).join("")}</g>
<rect x="76" y="40" width="48" height="124" rx="8" fill="#000" opacity=".3" transform="translate(2 4)"/>
<rect x="76" y="40" width="48" height="124" rx="8" fill="${x.url("met")}"/><rect x="80" y="46" width="40" height="112" rx="6" fill="${x.url("blk")}"/><rect x="80" y="46" width="40" height="112" rx="6" fill="${x.url("glass")}"/>
${keys}`));
    } }),

    base({ id: "plug-in-hub", name: "Plug-in hub", colors: [SNOW, "#e8e3da"], render(o) {
      const x = ctx(o);
      return svg(x, fin(x, `${wallBg(x)}<rect x="66" y="40" width="68" height="120" rx="6" fill="#e9e6df"/><rect x="66" y="40" width="68" height="120" rx="6" fill="none" stroke="#9c968a"/>
<rect x="80" y="112" width="40" height="34" rx="6" fill="#d9d4cc"/><rect x="92" y="122" width="3" height="8" rx="1" fill="#2a2638"/><rect x="105" y="122" width="3" height="8" rx="1" fill="#2a2638"/><circle cx="100" cy="137" r="2.4" fill="#2a2638"/>
<rect x="72" y="52" width="56" height="56" rx="18" fill="#000" opacity=".3" transform="translate(2 4)"/>
<rect x="72" y="52" width="56" height="56" rx="18" fill="${x.url("pl")}"/><path d="M80 62 C84 57 90 55 98 55" stroke="#fff" stroke-opacity=".7" stroke-width="2.4" fill="none" stroke-linecap="round"/>
${led(x, 100, 96, "#ffffff", P + "breath")}`));
    } }),
  ];

  const css = `.hda-anim .${P}dot{animation:${P}dot 2.4s ease-in-out infinite}
.hda-anim .${P}breath{animation:${P}breath 4s ease-in-out infinite}
.hda-anim .${P}blink{animation:${P}blink 3s steps(1) infinite}
.hda-anim .${P}ring{animation:${P}breath 3s ease-in-out infinite}
@keyframes ${P}dot{0%,100%{opacity:1}50%{opacity:.45}}
@keyframes ${P}breath{0%,100%{opacity:1}50%{opacity:.5}}
@keyframes ${P}blink{0%{opacity:1}85%{opacity:.25}}
@media (prefers-reduced-motion:reduce){.hda-anim .${P}dot,.hda-anim .${P}breath,.hda-anim .${P}blink,.hda-anim .${P}ring{animation:none}}`;

  (window.HDA = window.HDA || []).push({
    id: "speakers", tab: "Smart home speakers & displays A", group: "Home", kind: "device",
    levelLabel: "Volume", onWord: "Listening", offWord: "Off",
    intro: "Twenty smart home devices on shelves, counters, walls and doors: speakers, smart displays, streamers, mesh Wi-Fi, thermostats, a smoke alarm, cameras, the doorbell, a deadbolt and a plug-in hub. On shows the four breathing dots, ambient screens and status lights; the slider sets volume.",
    
    css, icons,
  });
})();
