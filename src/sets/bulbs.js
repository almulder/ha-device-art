(function () {
  const H = window.HDAH;
  const f = (n) => (+n).toFixed(1);

  function ctx(o) {
    const c = o.color || "#ffc477", on = !!o.on, lv = o.level == null ? 1 : o.level;
    const L = on ? .3 + .7 * lv : 0;
    const id = (s) => `${o.uid}-${s}`, url = (s) => `url(#${o.uid}-${s})`;
    return { c, on, L, id, url, hot: H.mix(c, "#ffffff", .6), op: (k) => Math.min(1, k * L).toFixed(2) };
  }
  function hue(hex, deg, dl) {
    let [r, g, b] = H.hx(hex).map((v) => v / 255);
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b); let h = 0, s = 0, l = (mx + mn) / 2;
    if (mx !== mn) { const d = mx - mn; s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn);
      h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; }
    h = ((h + deg) % 360 + 360) % 360; l = Math.max(0, Math.min(1, l + (dl || 0)));
    const q = l < .5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
    const t = (u) => { u = (u + 1) % 1; return u < 1 / 6 ? p + (q - p) * 6 * u : u < .5 ? q : u < 2 / 3 ? p + (q - p) * (2 / 3 - u) * 6 : p; };
    const to = (v) => Math.round(v * 255).toString(16).padStart(2, "0");
    return "#" + to(t(h / 360 + 1 / 3)) + to(t(h / 360)) + to(t(h / 360 - 1 / 3));
  }
  const st = (stops) => stops.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a == null ? "" : ` stop-opacity="${a}"`}/>`).join("");
  const lg = (id, stops, v, x2, y2) => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2 != null ? x2 : v ? 0 : 1}" y2="${y2 != null ? y2 : v ? 1 : 0}">${st(stops)}</linearGradient>`;
  const rg = (id, stops, cx = .5, cy = .5, r = .5) => `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${st(stops)}</radialGradient>`;

  function defs(x, extra) {
    const { c, id, hot } = x;
    return `<defs>
${rg(id("halo"), [[0, c, .85], [.4, c, .3], [1, c, 0]])}
${lg(id("cone"), [[0, c, .65], [.55, c, .18], [1, c, 0]], 1)}
${lg(id("coneU"), [[0, c, 0], [.45, c, .18], [1, c, .65]], 1)}
${rg(id("pool"), [[0, c, .6], [1, c, 0]])}
${rg(id("fill"), [[0, "#ffffff", .97], [.42, hot, 1], [1, c, .85]], .5, .45, .62)}
${rg(id("frost"), [[0, "#ffffff"], [.55, "#e7e4f0"], [1, "#9d99b2"]], .4, .34, .78)}
${rg(id("gl"), [[0, "#ffffff", .5], [.35, "#ffffff", .1], [.85, "#ffffff", .03], [1, "#ffffff", .22]], .34, .28, .75)}
${lg(id("blk"), [[0, "#111117"], [.28, "#3b3c49"], [.42, "#555769"], [.72, "#22232c"], [1, "#0c0c11"]])}
${lg(id("brs"), [[0, "#6e4a17"], [.22, "#c99a48"], [.38, "#fbe7a6"], [.58, "#b07f33"], [.82, "#7a5118"], [1, "#4d3210"]])}
${lg(id("chr"), [[0, "#4a4f5c"], [.2, "#e9ecf4"], [.36, "#8e94a6"], [.55, "#f4f6fb"], [.8, "#6c7284"], [1, "#3a3e4a"]])}
${lg(id("alu"), [[0, "#6d7180"], [.3, "#d9dce6"], [.5, "#a7abba"], [.75, "#e6e8ef"], [1, "#5d606e"]])}
${lg(id("wht"), [[0, "#9c98b0"], [.3, "#f2f0fa"], [.45, "#ffffff"], [.75, "#d4d0e2"], [1, "#8a86a0"]])}
${lg(id("wood"), [[0, "#9a6a3c"], [.5, "#74482a"], [1, "#4a2c16"]], 1)}
${lg(id("woodT"), [[0, "#b48152"], [1, "#7c5130"]], 1)}
${lg(id("ceil"), [[0, "#4a4562"], [1, "#363149"]], 1)}
${lg(id("sh"), [[0, "#000", .42], [.3, "#000", 0], [.62, "#000", .06], [1, "#000", .5]])}
${rg(id("cs"), [[0, "#000", .55], [1, "#000", 0]])}
${rg(id("softg"), [[0, "#fff"], [.5, "#fff"], [1, "#000"]])}
<mask id="${id("soft")}" maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="200"><rect width="200" height="200" fill="url(#${id("softg")})"/></mask>
${extra || ""}</defs>`;
  }
  const svg = (x, body, extra) => `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs(x, extra)}${body}</svg>`;
  const soft = (x, inner) => `<g class="hda-bg"><g mask="${x.url("soft")}">${inner}</g></g>`;
  const wall = (x, col, a) => soft(x, `<rect width="200" height="200" fill="${col || "#4b4566"}" opacity="${((a || .55) * .7).toFixed(2)}"/>`);
  const halo = (x, cx, cy, r, k) => x.on ? `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${x.url("halo")}" opacity="${x.op(k || .6)}"/>` : "";
  const wash = (x, cx, cy, rx, ry, k) => x.on ? `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${x.url("halo")}" opacity="${x.op(k || .5)}"/>` : "";
  const pool = (x, cx, cy, rx, ry, k) => x.on ? `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${x.url("pool")}" opacity="${x.op(k || .8)}"/>` : "";
  const cshadow = (cx, cy, rx, ry, a) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#__CS__)" opacity="${a || .8}"/>`;
  const hl = (d, a, w) => `<path d="${d}" fill="none" stroke="#fff" stroke-opacity="${a}" stroke-width="${w}" stroke-linecap="round"/>`;
  function beam(x, cx, y, hw, sp, y2, k) {
    if (!x.on) return ""; k = k || 1; y2 = y2 || 196;
    return `<path d="M${cx - hw - 3} ${y} L${f(cx - hw - sp * 1.3)} ${y2} L${f(cx + hw + sp * 1.3)} ${y2} L${cx + hw + 3} ${y} Z" fill="${x.url("cone")}" opacity="${x.op(.34 * k)}"/>
<path d="M${cx - hw} ${y} L${cx - hw - sp} ${y2} L${cx + hw + sp} ${y2} L${cx + hw} ${y} Z" fill="${x.url("cone")}" opacity="${x.op(.55 * k)}"/>`;
  }
  function screw(x, y0, y1, w, m) {
    let t = ""; for (let y = y0 + 1.4; y < y1 - .6; y += 2.5) t += `<path d="M${-w / 2} ${f(y)} Q0 ${f(y + 1.6)} ${w / 2} ${f(y)}" stroke="#2c2f3a" stroke-opacity=".55" stroke-width=".7" fill="none"/>`;
    return `<path d="M${-w / 2 + 1.6} ${y0} L${-w / 2 + 2.8} ${y0 - 2.6} H${w / 2 - 2.8} L${w / 2 - 1.6} ${y0} Z" fill="#17161d"/><ellipse cx="0" cy="${y0 - 2.8}" rx="1.8" ry=".9" fill="${x.url("brs")}"/>
<rect x="${-w / 2}" y="${y0}" width="${w}" height="${y1 - y0}" rx="1.2" fill="${x.url(m || "alu")}"/>${t}`;
  }
  function glass(x, d, frost) {
    if (frost) return `<path d="${d}" fill="${x.url("frost")}"${x.on ? ` opacity="${(1 - .6 * x.L).toFixed(2)}"` : ""}/>${x.on ? `<path d="${d}" fill="${x.url("fill")}" opacity="${x.op(1)}"/>` : ""}`;
    return x.on ? `<path d="${d}" fill="${x.c}" fill-opacity="${x.op(.22)}"/>` : `<path d="${d}" fill="#fff" fill-opacity=".05"/>`;
  }
  const sheen = (x, d) => `<path d="${d}" fill="${x.url("gl")}" stroke="#fff" stroke-opacity=".4" stroke-width=".6"/>`;
  function fil(x, d, w) {
    w = w || 1;
    return x.on ? `<g class="hda-bulbs-fil"><path d="${d}" fill="none" stroke="${x.c}" stroke-width="${f(3.4 * w)}" stroke-opacity="${x.op(.5)}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${H.mix(x.hot, "#fff", .55)}" stroke-width="${f(1.1 * w)}" stroke-linecap="round" stroke-linejoin="round"/></g>`
      : `<path d="${d}" fill="none" stroke="#d9a24a" stroke-opacity=".7" stroke-width="${f(.9 * w)}" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  const wire = (d, w) => `<path d="${d}" fill="none" stroke="#d8d4e6" stroke-opacity=".5" stroke-width="${w || .45}"/>`;
  const out = (x, body, extra) => svg(x, body.replace(/__CS__/g, x.id("cs")), extra);

  const ENV = {
    a19: "M-7 -14 C-7 -7 -19 -3 -19 11 C-19 23 -10 30 0 30 C10 30 19 23 19 11 C19 -3 7 -7 7 -14 Z",
    a21: "M-7.5 -14 C-7.5 -6 -21 -2 -21 13 C-21 26 -11 34 0 34 C11 34 21 26 21 13 C21 -2 7.5 -6 7.5 -14 Z",
    st64: "M-5 -18 C-5 -12 -16 -6 -16 12 C-16 28 -9 38 0 38 C9 38 16 28 16 12 C16 -6 5 -12 5 -18 Z",
    g40: "M-5 -16 C-5 -12 -22 -10 -22 10 C-22 26 -12 33 0 33 C12 33 22 26 22 10 C22 -10 5 -12 5 -16 Z",
    g30: "M-5 -16 C-5 -12 -17 -8 -17 7 C-17 19 -9 25 0 25 C9 25 17 19 17 7 C17 -8 5 -12 5 -16 Z",
  };
  function smartBulb(x, env) {
    return screw(x, -32, -22, 12.4) + `<path d="M-8.4 -22.4 H8.4 L7.4 -13.6 H-7.4 Z" fill="${x.url("wht")}"/><path d="M-8.4 -22.4 H8.4" stroke="#6c6880" stroke-width=".6"/>
${glass(x, env, true)}${x.on ? "" : `<path d="${env}" fill="${x.url("sh")}" opacity=".35"/>`}<path d="${env}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width=".6"/>
${hl("M-13 2 C-14 8 -12 15 -8 20", x.on ? .35 : .7, 1.6)}`;
  }

  const WARM = "#ffc477", SOFT = "#ffe2b8", DAY = "#eef4ff";
  const RGB = [WARM, DAY, "#ff6fa8", "#6e8bff", "#3fe0b5"];
  const RGB2 = [SOFT, DAY, "#ffa94d", "#b18cff", "#5fd4ff"];
  const FIL = [WARM, "#ffb45e", SOFT, DAY, "#ff9fb6"];
  const STRIP = ["#8f6bff", WARM, DAY, "#ff4fa0", "#38c8ff", "#3fe08f"];
  const STRIP2 = ["#ff5f8f", WARM, DAY, "#6e8bff", "#3fe0b5", "#ffb02e"];
  const base = (o) => Object.assign({ picker: true, colorLabel: "Light", cast: "down" }, o);

  const icons = [
    base({ id: "a19", name: "A19 smart bulb", colors: RGB, glow: { x: .5, y: .5, r: 1 }, render(o) {
      const x = ctx(o); let ch = "";
      for (let y = 44; y < 96; y += 3.4) ch += `<ellipse cx="${f(117 + (y - 44) * .03)}" cy="${f(y)}" rx=".9" ry="1.5" fill="${x.url("brs")}"/>`;
      return out(x, `<g class="hda-bg"><path d="M6 0 H194 V12 Q100 18 6 12 Z" fill="${x.url("ceil")}"/><path d="M6 12 Q100 18 194 12" fill="none" stroke="#fff" stroke-opacity=".1"/>
${x.on ? `<ellipse cx="100" cy="14" rx="80" ry="8" fill="${x.url("halo")}" opacity="${x.op(.45)}"/>` : ""}</g>
${beam(x, 100, 116, 22, 44)}${halo(x, 100, 100, 72, .55)}
<ellipse cx="100" cy="15" rx="25" ry="5" fill="#d9d4e2"/>
<path d="M80 15 C80 27 86 29 88 33 L88 50 C88 53.5 112 53.5 112 50 L112 33 C114 29 120 27 120 15 Z" fill="${x.url("wht")}"/>
<path d="M104 15 C112 15 120 20 120 15 C120 27 114 29 112 33 L112 50 C110 52 106 53 104 53 Z" fill="#000" fill-opacity=".12"/>
<path d="M88 40 H112 M88 45 H112" stroke="#8a86a0" stroke-opacity=".5" stroke-width=".7"/>${hl("M92 34 V49", .7, 1.6)}
${ch}<path d="M115.6 96 h4 l.8 7 h-5.6 Z" fill="${x.url("brs")}"/>
<g transform="translate(100 84) scale(1.45)">${smartBulb(x, ENV.a19)}</g>`);
    } }),

    base({ id: "a21", name: "A21 bright bulb", colors: RGB2, cast: "around", glow: { x: .5, y: .3, r: 1.05 }, render(o) {
      const x = ctx(o);
      const ex = lg(x.id("cer"), [[0, "#3c5a52"], [.3, "#7fa596"], [.45, "#b8d4c6"], [.7, "#5b8274"], [1, "#2c443d"]]);
      return out(x, `${halo(x, 100, 48, 92, .5)}
<g class="hda-bg"><path d="M10 170 H190 L196 181 H4 Z" fill="${x.url("woodT")}"/><rect x="4" y="181" width="192" height="9" fill="${x.url("wood")}"/></g>
${pool(x, 100, 174, 86, 7, .7)}${cshadow(100, 170, 40, 5)}
<path d="M86 128 C70 136 64 152 72 169 L128 169 C136 152 130 136 114 128 Z" fill="url(#${x.id("cer")})"/>
<path d="M114 128 C130 136 136 152 128 169 L118 169 C124 152 120 138 108 129 Z" fill="#000" fill-opacity=".18"/>${hl("M80 140 C74 150 74 158 77 165", .45, 2.4)}
<rect x="95" y="114" width="10" height="15" fill="${x.url("brs")}"/>
<g transform="translate(100 67.6) scale(1.35 -1.35)">${smartBulb(x, ENV.a21)}</g>
<path d="M90 117 C76 108 70 58 98 13 M110 117 C124 108 130 58 102 13" fill="none" stroke="${x.url("brs")}" stroke-width="1.8"/>
<path d="M90 117 C76 108 70 58 98 13" fill="none" stroke="#fbe7a6" stroke-opacity=".35" stroke-width=".6"/>
<ellipse cx="100" cy="12" rx="5" ry="2.4" fill="${x.url("brs")}"/><circle cx="100" cy="7.5" r="4" fill="${x.url("brs")}"/><circle cx="98.6" cy="6.2" r="1.2" fill="#fff" fill-opacity=".6"/>
<rect x="89" y="99" width="22" height="18" rx="2" fill="${x.url("brs")}"/><path d="M89 104 H111 M89 112 H111" stroke="#4d3210" stroke-opacity=".5" stroke-width=".7"/>
<rect x="111" y="104" width="6" height="4" rx="1" fill="${x.url("brs")}"/><rect x="116" y="102.5" width="3" height="7" rx="1" fill="#6e4a17"/>`, ex);
    } }),

    base({ id: "br30", name: "BR30 flood", colors: RGB, glow: { x: .5, y: .3, r: 1.15 }, render(o) {
      const x = ctx(o), lens = "M70 54 C70 66 84 74 100 74 C116 74 130 66 130 54 Z";
      return out(x, `<g class="hda-bg"><path d="M4 4 H196 V44 Q100 52 4 44 Z" fill="${x.url("ceil")}"/><path d="M4 44 Q100 52 196 44" fill="none" stroke="#fff" stroke-opacity=".1"/>
${x.on ? `<ellipse cx="100" cy="46" rx="90" ry="14" fill="${x.url("halo")}" opacity="${x.op(.4)}"/>` : ""}</g>
${beam(x, 100, 66, 30, 44, 186, 1.1)}${pool(x, 100, 184, 92, 10, .85)}
<path d="M20 186 H180" stroke="#fff" stroke-opacity=".08"/>
<ellipse cx="100" cy="50" rx="47" ry="13" fill="${x.url("wht")}"/><ellipse cx="100" cy="50" rx="47" ry="13" fill="none" stroke="#6c6880" stroke-opacity=".6"/>
<ellipse cx="100" cy="51" rx="38" ry="9.6" fill="#141219"/><ellipse cx="100" cy="51" rx="38" ry="9.6" fill="none" stroke="#000" stroke-opacity=".5" stroke-width="1.5"/>
${glass(x, lens, true)}<path d="${lens}" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width=".6"/>
<ellipse cx="100" cy="54" rx="30" ry="6.4" fill="${x.on ? x.hot : "#cfcbdc"}" opacity="${x.on ? x.op(.9) : ".55"}"/>
${x.on ? `<ellipse cx="100" cy="62" rx="16" ry="5" fill="#fff" opacity="${x.op(.8)}"/>` : hl("M78 60 C84 67 92 70 100 70", .5, 1.4)}
${hl("M60 44 C70 40 84 38 96 38", .5, 1.6)}`);
    } }),

    base({ id: "par38", name: "PAR38 outdoor", colors: [DAY, WARM, "#3fe08f", "#ff5f6d", "#6e8bff"], glow: { x: .5, y: .3, r: 1.1 }, render(o) {
      const x = ctx(o);
      const ex = lg(x.id("grass"), [[0, "#3e6b3a"], [1, "#1f3a22"]], 1) + lg(x.id("par"), [[0, "#5e6170"], [.35, "#c7c9d4"], [.6, "#8b8e9c"], [1, "#4a4c58"]]) +
        lg(x.id("brz"), [[0, "#2a211b"], [.35, "#6b5546"], [.55, "#4b3b30"], [1, "#1c1612"]]);
      const flood = (rot) => { let g = ""; for (let i = -16; i <= 16; i += 5.3) g += `<path d="M${f(i)} ${f(4 - Math.sqrt(Math.max(0, 1 - (i / 20) ** 2)) * 5)} V${f(4 + Math.sqrt(Math.max(0, 1 - (i / 20) ** 2)) * 5)}" stroke="#fff" stroke-opacity="${x.on ? .25 : .3}" stroke-width=".5"/>`;
        return `<g transform="translate(100 40) rotate(${rot})">
${x.on ? `<path d="M-22 6 L-62 150 L62 150 L22 6 Z" fill="${x.url("cone")}" opacity="${x.op(.4)}"/><path d="M-18 6 L-40 150 L40 150 L18 6 Z" fill="${x.url("cone")}" opacity="${x.op(.45)}"/>` : ""}
<rect x="-3" y="-4" width="6" height="12" fill="url(#${x.id("brz")})"/><circle cx="0" cy="8" r="4.6" fill="url(#${x.id("brz")})"/>
<rect x="-9" y="10" width="18" height="12" rx="2" fill="url(#${x.id("brz")})"/>
<path d="M-6 22 L-6 26 C-6 31 -18 34 -20 44 L20 44 C18 34 6 31 6 26 L6 22 Z" fill="url(#${x.id("par")})"/>
<ellipse cx="0" cy="44" rx="20" ry="5.6" fill="${x.on ? x.url("fill") : "#b9bcc8"}" ${x.on ? `opacity="${x.op(1)}"` : 'opacity=".75"'}/>
<g transform="translate(0 40)">${g}</g><ellipse cx="0" cy="44" rx="20" ry="5.6" fill="none" stroke="#2f313b" stroke-width="1"/></g>`; };
      return out(x, `<g class="hda-bg"><rect x="0" y="54" width="200" height="124" fill="#3a3550" opacity=".25" mask="${x.url("soft")}"/></g>
${soft(x, [62, 76, 90, 104, 118, 132, 146, 160].map((y) => `<path d="M0 ${y} H200" stroke="#fff" stroke-opacity=".06" stroke-width="1.2"/>`).join(""))}
<g class="hda-bg"><path d="M0 178 C40 172 80 176 120 173 C150 171 180 175 200 172 V196 H0 Z" fill="url(#${x.id("grass")})"/></g>
${pool(x, 52, 182, 50, 10, .7)}${pool(x, 148, 182, 50, 10, .7)}
<g class="hda-bg"><path d="M0 6 H200 V30 H0 Z" fill="#c9c4d4"/><path d="M0 30 H200 V34 H0 Z" fill="#8c879c"/>${[30, 60, 90, 120, 150, 180].map((xx) => `<path d="M${xx} 6 V30" stroke="#8c879c" stroke-opacity=".5"/>`).join("")}</g>
${flood(32)}${flood(-32)}<ellipse cx="100" cy="36" rx="14" ry="4" fill="url(#${x.id("brz")})"/><rect x="88" y="33" width="24" height="5" rx="2" fill="url(#${x.id("brz")})"/>`, ex);
    } }),

    base({ id: "gu10", name: "GU10 track", colors: [WARM, DAY, SOFT, "#ff8fb0", "#7fb2ff"], glow: { x: .5, y: .24, r: 1.1 }, render(o) {
      const x = ctx(o);
      const head = (cx, rot, s) => `<g transform="translate(${cx} 26) rotate(${rot}) scale(${s})">
${x.on ? `<path d="M-8 36 L-34 150 L34 150 L8 36 Z" fill="${x.url("cone")}" opacity="${x.op(.5)}"/>` : ""}
<rect x="-2.2" y="0" width="4.4" height="10" fill="${x.url("blk")}"/><circle cx="0" cy="11" r="3.6" fill="#24242c"/>
<rect x="-9.5" y="12" width="19" height="24" rx="2.6" fill="${x.url("blk")}"/><path d="M-9.5 16 H9.5 M-9.5 19 H9.5" stroke="#000" stroke-opacity=".5" stroke-width=".7"/>
<ellipse cx="0" cy="36" rx="9.5" ry="3" fill="#0b0b10"/><ellipse cx="0" cy="36" rx="7" ry="2.1" fill="${x.on ? x.hot : "#6c6a7a"}" ${x.on ? `opacity="${x.op(1)}"` : ""}/>
${x.on ? `<ellipse cx="0" cy="36" rx="3" ry="1" fill="#fff" opacity="${x.op(1)}"/>` : ""}${hl("M-6 14 V33", .3, 1.4)}</g>`;
      const pic = lg(x.id("pic"), [[0, "#2f5d7c"], [.5, "#d39a5c"], [1, "#7a3d5c"]], 0, 1, 1);
      return out(x, `${wall(x, "#4b4566", .45)}
<g class="hda-bg"><rect x="62" y="122" width="76" height="54" rx="1.5" fill="${x.url("brs")}"/><rect x="67" y="127" width="66" height="44" fill="url(#${x.id("pic")})"/>
<path d="M67 160 C82 150 92 156 104 146 C116 138 124 146 133 140 V171 H67 Z" fill="#1d2b2a" fill-opacity=".55"/><circle cx="116" cy="138" r="5" fill="#ffe2a8" fill-opacity=".8"/>
${x.on ? `<rect x="67" y="127" width="66" height="44" fill="${x.c}" opacity="${x.op(.22)}"/>` : `<rect x="62" y="122" width="76" height="54" fill="#000" opacity=".35"/>`}</g>
${pool(x, 100, 150, 54, 34, .45)}
<g class="hda-bg"><path d="M0 4 H200 V16 H0 Z" fill="${x.url("ceil")}"/></g>
<rect x="10" y="17" width="180" height="9" rx="2" fill="${x.url("blk")}"/><path d="M10 20 H190" stroke="#fff" stroke-opacity=".18" stroke-width=".7"/>
${head(48, -24, 1)}${head(100, 0, 1.05)}${head(152, 24, 1)}`, pic);
    } }),

    base({ id: "mr16", name: "MR16 spot", colors: [WARM, DAY, SOFT, "#ff8a5c", "#8fd0ff"], cast: "around", glow: { x: .5, y: .5, r: .95 }, render(o) {
      const x = ctx(o), cx = 102, cy = 98; let fac = "";
      for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2, a2 = (i + 1) / 14 * Math.PI * 2;
        const p = (r, aa) => `${f(cx + Math.cos(aa) * r)} ${f(cy + Math.sin(aa) * r * .94)}`;
        const tone = x.on ? H.mix(x.c, i % 2 ? "#ffffff" : H.shade(x.c, -.35), i % 2 ? .45 : .3) : (i % 3 === 0 ? "#b8c7e6" : i % 3 === 1 ? "#e3cfa4" : "#d6d6e0");
        fac += `<path d="M${p(9, a)} L${p(27, a)} L${p(27, a2)} L${p(9, a2)} Z" fill="${tone}" ${x.on ? `opacity="${(.45 + .55 * x.L).toFixed(2)}"` : 'opacity=".8"'} stroke="#000" stroke-opacity=".22" stroke-width=".5"/>`; }
      const ex = rg(x.id("pl"), [[0, "#59526f"], [.7, "#3f3956"], [1, "#2c2741"]]);
      return out(x, `<g opacity=".6">${soft(x, `<rect x="0" y="0" width="200" height="200" fill="url(#${x.id("pl")})"/>`)}</g>
${halo(x, 100, 100, 96, .55)}
<rect x="52" y="50" width="98" height="98" rx="14" fill="#000" opacity=".25" transform="translate(2 3)"/>
<rect x="52" y="50" width="98" height="98" rx="14" fill="${x.url("wht")}"/><rect x="56" y="54" width="90" height="90" rx="11" fill="none" stroke="#fff" stroke-opacity=".5"/>
<circle cx="101" cy="99" r="38" fill="#18161f"/><circle cx="101" cy="99" r="38" fill="none" stroke="#6c6880" stroke-width="1.4"/>
<ellipse cx="${cx}" cy="${cy}" rx="33" ry="31" fill="${x.url("alu")}"/><ellipse cx="${cx}" cy="${cy}" rx="29" ry="27.4" fill="#22202a"/>
${fac}<ellipse cx="${cx}" cy="${cy}" rx="27" ry="25.4" fill="none" stroke="${x.url("chr")}" stroke-width="1.6"/>
<circle cx="${cx}" cy="${cy}" r="9" fill="${x.on ? x.url("fill") : "#8e8aa0"}" ${x.on ? `opacity="${x.op(1)}"` : ""}/>${x.on ? `<circle cx="${cx}" cy="${cy}" r="4" fill="#fff" opacity="${x.op(1)}"/>` : `<circle cx="${cx - 2}" cy="${cy - 2}" r="2.4" fill="#fff" fill-opacity=".6"/>`}
${hl("M78 82 C82 74 90 70 98 69", .35, 1.6)}`, ex);
    } }),

    base({ id: "st64", name: "Edison ST64", colors: FIL, cast: "around", glow: { x: .5, y: .34, r: 1 }, render(o) {
      const x = ctx(o), e = ENV.st64;
      let pl = ""; for (let xx = 8; xx < 196; xx += 23) pl += `<rect x="${xx}" y="0" width="22" height="200" fill="${["#6b4428", "#5a381f", "#74492b", "#61401f"][(xx / 23 | 0) % 4]}"/><path d="M${xx + 22.5} 0 V200" stroke="#1e1209" stroke-width="1.2"/><path d="M${xx + 6} 0 C${xx + 9} 60 ${xx + 4} 120 ${xx + 8} 200" stroke="#000" stroke-opacity=".12" fill="none"/>`;
      return out(x, `${soft(x, pl)}${halo(x, 100, 70, 94, .6)}
<circle cx="100" cy="162" r="17" fill="#000" opacity=".3" transform="translate(1 3)"/><circle cx="100" cy="162" r="17" fill="${x.url("blk")}"/><circle cx="100" cy="162" r="13" fill="none" stroke="#000" stroke-opacity=".5"/>
${[0, 90, 180, 270].map((a) => `<circle cx="${f(100 + Math.cos(a * Math.PI / 180 + .8) * 13.5)}" cy="${f(162 + Math.sin(a * Math.PI / 180 + .8) * 13.5)}" r="1.4" fill="#777a88"/>`).join("")}
<rect x="94" y="142" width="12" height="14" fill="${x.url("blk")}"/>
<g transform="translate(100 89.6) scale(1.6 -1.6)">${screw(x, -32, -22, 11, "brs")}${glass(x, e)}
${wire("M0 -18 V-4 M-1.5 -18 L-8 -2 M1.5 -18 L8 -2")}${fil(x, "M-8 -2 L-9.5 25 M-3 -3 L-3.4 28 M3 -3 L3.4 28 M8 -2 L9.5 25", .7)}${wire("M0 -4 L-9.5 25 M0 -4 L9.5 25 M0 -4 L-3.4 28 M0 -4 L3.4 28", .3)}
${sheen(x, e)}${hl("M-11 18 C-12 10 -10 2 -6 -4", .45, 1)}</g>
<rect x="90" y="122" width="20" height="22" rx="2" fill="${x.url("blk")}"/><path d="M90 127 H110 M90 131 H110 M90 135 H110" stroke="#000" stroke-opacity=".5" stroke-width=".8"/>${hl("M93 124 V142", .25, 1.4)}`);
    } }),

    base({ id: "g25", name: "G25 vanity", colors: [SOFT, DAY, WARM, "#ffb3c7", "#a8c8ff"], cast: "around", glow: { x: .5, y: .34, r: 1.15 }, render(o) {
      const x = ctx(o);
      const mir = lg(x.id("mir"), [[0, "#3c4a62"], [.45, "#1f2638"], [1, "#151a28"]], 0, .4, 1);
      const globe = (cx) => { const d = `M${cx - 21} 70 a21 21 0 1 0 42 0 a21 21 0 1 0 -42 0 Z`;
        return `${halo(x, cx, 70, 46, .5)}<ellipse cx="${cx}" cy="70" rx="8" ry="10" fill="${x.url("chr")}"/>${glass(x, d, true)}${x.on ? "" : `<path d="${d}" fill="${x.url("sh")}" opacity=".3"/>`}
<path d="${d}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width=".6"/>${hl(`M${cx - 14} 62 C${cx - 12} 56 ${cx - 7} 52 ${cx - 2} 51`, x.on ? .4 : .75, 2)}`; };
      return out(x, `${wall(x, "#4b4566", .45)}
<g class="hda-bg"><rect x="26" y="104" width="148" height="88" rx="6" fill="#0d0f16"/><rect x="30" y="108" width="140" height="80" rx="4" fill="url(#${x.id("mir")})"/>
<path d="M44 108 L68 108 L40 188 L30 188 L30 140 Z M80 108 H88 L60 188 H52 Z" fill="#fff" fill-opacity=".05"/>
${x.on ? [54, 100, 146].map((cx) => `<ellipse cx="${cx}" cy="128" rx="20" ry="16" fill="${x.url("halo")}" opacity="${x.op(.45)}"/>`).join("") : ""}</g>
<rect x="22" y="63" width="156" height="14" rx="7" fill="${x.url("chr")}"/><path d="M28 66 H172" stroke="#fff" stroke-opacity=".6" stroke-width=".8"/>
${globe(54)}${globe(100)}${globe(146)}`, mir);
    } }),

    base({ id: "g40", name: "G40 large globe", colors: FIL, cast: "around", glow: { x: .5, y: .38, r: 1.05 }, render(o) {
      const x = ctx(o), e = ENV.g40; let sp = "M0 -4";
      for (let t = 0; t <= Math.PI * 7; t += .3) sp += ` L${f(Math.sin(t) * (6 + t * .35))} ${f(-2 + t * 1.05 + Math.cos(t) * 2.4)}`;
      return out(x, `${halo(x, 100, 76, 92, .6)}
<g class="hda-bg"><path d="M8 166 H192 L198 177 H2 Z" fill="${x.url("woodT")}"/><rect x="2" y="177" width="196" height="8" fill="${x.url("wood")}"/></g>
${pool(x, 100, 170, 84, 7, .7)}${cshadow(100, 167, 36, 4)}
<rect x="72" y="126" width="56" height="42" rx="2" fill="${x.url("woodT")}"/><rect x="72" y="126" width="56" height="5" fill="#d3a273" opacity=".55"/>
<path d="M76 138 C90 136 104 142 124 138 M76 150 C92 148 108 154 124 150 M76 160 C88 158 110 162 124 159" stroke="#5a381f" stroke-opacity=".45" fill="none"/>
<rect x="114" y="126" width="14" height="42" fill="#000" opacity=".16"/>${x.on ? `<rect x="72" y="126" width="56" height="10" fill="${x.c}" opacity="${x.op(.25)}"/>` : ""}
<g transform="translate(100 76) scale(1.5 -1.5)">${screw(x, -32, -22, 11, "brs")}${glass(x, e)}${wire("M0 -16 V-4")}${fil(x, sp, .7)}${sheen(x, e)}
${hl("M-17 14 C-18 6 -15 -2 -9 -7", .45, 1.1)}</g>
<rect x="90" y="110" width="20" height="17" rx="2" fill="${x.url("blk")}"/><path d="M90 115 H110 M90 119 H110" stroke="#000" stroke-opacity=".5" stroke-width=".8"/>`);
    } }),

    base({ id: "b11", name: "Candle B11", colors: FIL, cast: "around", glow: { x: .5, y: .4, r: 1 }, render(o) {
      const x = ctx(o), e = "M0 -38 C3 -30 9 -21 9 -11 C9 -4 5 -1 3 0 L-3 0 C-5 -1 -9 -4 -9 -11 C-9 -21 -3 -30 0 -38 Z";
      const ivo = lg(x.id("ivo"), [[0, "#a59a86"], [.3, "#f4ecda"], [.5, "#fffaf0"], [.8, "#d9ceb6"], [1, "#8f8470"]]);
      const cand = (cx, by, s) => `<g transform="translate(${cx} ${by}) scale(${s})">${halo(x, 0, -60, 44, .6)}
<ellipse cx="0" cy="22" rx="18" ry="4.4" fill="${x.url("brs")}"/><path d="M-18 22 C-14 30 14 30 18 22" fill="${x.url("brs")}"/>
<rect x="-7" y="-28" width="14" height="50" fill="url(#${x.id("ivo")})"/><path d="M-7 -28 C-7 -24 -5 -22 -4.4 -17 C-3.8 -22 -2 -24 0 -27 L7 -28 Z" fill="#fffaf0"/>
<ellipse cx="0" cy="-28" rx="7" ry="1.8" fill="#e9dfc8"/><rect x="-3.4" y="-34" width="6.8" height="6" fill="${x.url("brs")}"/>
<g transform="translate(0 -34)">${glass(x, e)}${wire("M-1 -1 V-12 M1 -1 V-12")}${fil(x, "M-1 -12 C-1 -18 2 -21 2.6 -26 M1 -12 C1 -18 -2 -21 -2.6 -26", .9)}${sheen(x, e)}${hl("M-5 -8 C-6 -14 -4 -22 -1 -28", .5, .9)}</g></g>`;
      const arm = (cx, cy, y0, w) => `<path d="M34 ${y0} C${f(34 + (cx - 34) * .2)} ${y0 + 30} ${f(cx - 22)} ${cy + 22} ${cx} ${cy}" fill="none" stroke="${x.url("brs")}" stroke-width="${w}" stroke-linecap="round"/><path d="M34 ${y0} C${f(34 + (cx - 34) * .2)} ${y0 + 30} ${f(cx - 22)} ${cy + 22} ${cx} ${cy}" fill="none" stroke="#fbe7a6" stroke-opacity=".4" stroke-width="${(w / 3).toFixed(1)}"/>`;
      return out(x, `<path d="M34 0 V196" stroke="${x.url("brs")}" stroke-width="5"/><path d="M33 0 V196" stroke="#fbe7a6" stroke-opacity=".4" stroke-width="1.4"/>
${arm(150, 116, 96, 2.6)}${cand(150, 98, .66)}${arm(100, 158, 116, 3.6)}${cand(100, 132, 1)}
<ellipse cx="34" cy="110" rx="8" ry="10" fill="${x.url("brs")}"/><ellipse cx="34" cy="64" rx="5" ry="4" fill="${x.url("brs")}"/><circle cx="31" cy="106" r="2" fill="#fff" fill-opacity=".55"/>`, ivo);
    } }),

    base({ id: "t30", name: "Tube T30", colors: FIL, cast: "around", glow: { x: .55, y: .45, r: 1.1 }, render(o) {
      const x = ctx(o), e = "M66 84 C72 84 74 76 84 76 H166 C173 76 178 82 178 90 C178 98 173 104 166 104 H84 C74 104 72 96 66 96 Z";
      const con = rg(x.id("con"), [[0, "#6a6678"], [.7, "#4c4858"], [1, "#363240"]]);
      let dots = ""; [[30, 40], [150, 30], [60, 160], [170, 150], [110, 170], [20, 120]].forEach(([a, b]) => { dots += `<circle cx="${a}" cy="${b}" r="1.6" fill="#000" opacity=".25"/>`; });
      return out(x, `<g opacity=".65">${soft(x, `<rect width="200" height="200" fill="url(#${x.id("con")})"/>${dots}<path d="M0 66 H200 M0 134 H200" stroke="#000" stroke-opacity=".18"/>`)}</g>
${wash(x, 120, 92, 92, 62, .55)}
<circle cx="28" cy="90" r="15" fill="#000" opacity=".3" transform="translate(1 3)"/><circle cx="28" cy="90" r="15" fill="${x.url("blk")}"/>
<rect x="26" y="84" width="22" height="12" fill="${x.url("blk")}" transform="rotate(90 37 90)"/><rect x="28" y="84" width="20" height="12" fill="${x.url("blk")}"/>
<rect x="44" y="80" width="18" height="20" rx="2" fill="${x.url("blk")}"/><path d="M48 80 V100 M52 80 V100 M56 80 V100" stroke="#000" stroke-opacity=".5" stroke-width=".8"/>
<rect x="61" y="83" width="7" height="14" fill="${x.url("brs")}"/><path d="M63 83 V97 M65.5 83 V97" stroke="#4d3210" stroke-opacity=".6" stroke-width=".6"/>
${glass(x, e)}${wire("M68 90 H80 M68 88 L82 81 M68 92 L82 99")}${fil(x, "M82 81 H168 M82 87 H170 M82 93 H170 M82 99 H168", 1)}${wire("M168 81 V99", .4)}
${sheen(x, e)}${hl("M86 79 H162", .55, 1.2)}`, con);
    } }),

    base({ id: "cord", name: "Cord pendant", colors: [WARM, SOFT, DAY, "#ff9f6e", "#ff8fb0"], cast: "around", glow: { x: .5, y: .66, r: 1.05 }, render(o) {
      const x = ctx(o), e = ENV.g30;
      const gold = rg(x.id("gold"), [[0, "#fff3c4"], [.35, "#e3b558"], [.75, "#9c6b1f"], [1, "#5a3b0c"]], .4, .3, .8);
      return out(x, `<g class="hda-bg"><path d="M6 0 H194 V8 Q100 13 6 8 Z" fill="${x.url("ceil")}"/></g>
<ellipse cx="100" cy="11" rx="17" ry="4" fill="${x.url("brs")}"/><rect x="96" y="12" width="8" height="5" fill="${x.url("brs")}"/>
<g class="hda-bulbs-sway">${halo(x, 100, 128, 82, .6)}
<path d="M100 17 V92" stroke="#b8862c" stroke-width="3.2"/><path d="M100 17 V92" stroke="#6e4a17" stroke-width="3.2" stroke-dasharray="1.6 1.6"/>
<g transform="translate(100 124) scale(1.75)">${screw(x, -26, -16, 10, "brs")}${glass(x, e, true)}
<path d="M-17 9 C-16 19 -9 25 0 25 C9 25 16 19 17 9 C10 12 -10 12 -17 9 Z" fill="url(#${x.id("gold")})"/>
${x.on ? `<path d="M-16 12 C-12 13 12 13 16 12" stroke="${x.hot}" stroke-opacity="${x.op(.7)}" stroke-width="1" fill="none"/>` : ""}
<path d="${e}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width=".5"/>${hl("M-11 -2 C-11 -6 -8 -10 -4 -11", x.on ? .4 : .7, 1.3)}<ellipse cx="-5" cy="19" rx="3" ry="1.6" fill="#fff" fill-opacity=".55"/></g>
<rect x="91" y="88" width="18" height="16" rx="2.4" fill="${x.url("brs")}"/><rect x="89.5" y="99" width="21" height="4" rx="1.5" fill="${x.url("brs")}"/>${hl("M94 90 V102", .45, 1.4)}</g>`, gold);
    } }),

    base({ id: "undercab", name: "Under-cabinet", colors: [WARM, DAY, SOFT, "#8f6bff", "#3fe0b5"], glow: { x: .5, y: .45, r: 1.15 }, render(o) {
      const x = ctx(o); let tl = "";
      for (let r = 0; r < 8; r++) { const y = 72 + r * 10; tl += `<path d="M6 ${y} H194" stroke="#2a2735" stroke-width="1"/>`;
        for (let xx = 6 + (r % 2) * 11; xx < 194; xx += 22) tl += `<path d="M${xx} ${y} V${y + 10}" stroke="#2a2735" stroke-width="1"/>`; }
      const stn = lg(x.id("stn"), [[0, "#9d98ac"], [1, "#6c6880"]], 1);
      return out(x, `<g class="hda-bg"><rect x="6" y="70" width="188" height="82" fill="#5a566a"/>${tl}${hl("M10 76 H190", .06, 1)}
${x.on ? `<rect x="6" y="70" width="188" height="82" fill="${x.url("cone")}" opacity="${x.op(.75)}"/>` : `<rect x="6" y="70" width="188" height="82" fill="#000" opacity=".25"/>`}
<rect x="2" y="150" width="196" height="10" fill="url(#${x.id("stn")})"/><rect x="2" y="160" width="196" height="10" fill="#4a4658"/>${hl("M4 151 H196", .5, 1)}
${x.on ? `<rect x="2" y="150" width="196" height="10" fill="${x.c}" opacity="${x.op(.4)}"/>` : ""}
<rect x="126" y="116" width="26" height="35" rx="3" fill="${x.url("chr")}"/><rect x="124" y="112" width="30" height="6" rx="2" fill="#2c2a35"/>
${x.on ? `<rect x="126" y="116" width="26" height="8" fill="${x.c}" opacity="${x.op(.35)}"/>` : ""}
<path d="M30 150 L42 104 C44 98 56 98 58 104 L64 150 Z" fill="${x.url("woodT")}"/><circle cx="50" cy="110" r="3" fill="#2a1b10"/>
${x.on ? `<path d="M42 104 C44 98 56 98 58 104 L60 112 L40 112 Z" fill="${x.c}" opacity="${x.op(.35)}"/>` : ""}
<rect x="4" y="6" width="192" height="60" fill="${x.url("wood")}"/><rect x="10" y="10" width="86" height="52" rx="2" fill="${x.url("woodT")}"/><rect x="104" y="10" width="86" height="52" rx="2" fill="${x.url("woodT")}"/>
<rect x="18" y="18" width="70" height="36" rx="1.5" fill="none" stroke="#3a2412" stroke-opacity=".5" stroke-width="1.4"/><rect x="112" y="18" width="70" height="36" rx="1.5" fill="none" stroke="#3a2412" stroke-opacity=".5" stroke-width="1.4"/>
<rect x="88" y="44" width="3" height="12" rx="1.5" fill="${x.url("chr")}"/><rect x="109" y="44" width="3" height="12" rx="1.5" fill="${x.url("chr")}"/>
<rect x="4" y="64" width="192" height="6" fill="#3a2412"/></g>
<rect x="18" y="69" width="164" height="4" rx="1" fill="${x.url("alu")}"/><rect x="20" y="71.6" width="160" height="2" rx="1" fill="${x.on ? x.hot : "#d8d4e2"}" ${x.on ? `opacity="${x.op(1)}"` : 'opacity=".6"'}/>`, stn);
    } }),

    base({ id: "tvback", name: "TV backlight", colors: STRIP, cast: "around", glow: { x: .5, y: .44, r: 1.25 }, render(o) {
      const x = ctx(o);
      const scr = lg(x.id("scr"), [[0, "#1d2232"], [.5, "#0e111a"], [1, "#171a26"]], 0, 1, 1);
      return out(x, `${wall(x, "#4b4566", .45)}
${x.on ? `<ellipse cx="100" cy="86" rx="96" ry="66" fill="${x.url("halo")}" opacity="${x.op(.75)}"/><rect x="28" y="40" width="144" height="92" rx="6" fill="none" stroke="${x.c}" stroke-width="6" stroke-opacity="${x.op(.55)}"/>` : ""}
<rect x="96" y="128" width="8" height="10" fill="#1a1a22"/>
<rect x="34" y="46" width="132" height="80" rx="3" fill="#07070b"/><rect x="37" y="49" width="126" height="74" rx="1.5" fill="url(#${x.id("scr")})"/>
<path d="M37 49 H90 L56 123 H37 Z" fill="#fff" fill-opacity=".045"/>${hl("M35 47 H165", .18, .8)}
${x.on ? `<path d="M34 46 H166" stroke="${x.hot}" stroke-opacity="${x.op(.6)}" stroke-width="1"/>` : ""}
<g class="hda-bg"><rect x="26" y="156" width="148" height="20" rx="2" fill="${x.url("wood")}"/><rect x="26" y="156" width="148" height="3" fill="#b48152" opacity=".7"/>
<path d="M100 159 V176" stroke="#2a1b10" stroke-opacity=".6"/><rect x="34" y="176" width="4" height="10" fill="#1a1a22"/><rect x="162" y="176" width="4" height="10" fill="#1a1a22"/>
<rect x="64" y="148" width="72" height="8" rx="3" fill="${x.url("blk")}"/>${x.on ? `<rect x="26" y="156" width="148" height="4" fill="${x.c}" opacity="${x.op(.35)}"/>` : ""}</g>`, scr);
    } }),

    base({ id: "neon", name: "Neon flex", colors: ["#ff4fa0", "#38c8ff", WARM, "#8f6bff", "#3fe08f", DAY], cast: "around", glow: { x: .5, y: .45, r: 1.05 }, render(o) {
      const x = ctx(o); let br = "";
      for (let r = 0; r < 15; r++) for (let c = -1; c < 9; c++) { const xx = c * 26 + (r % 2) * 13, y = r * 13.5;
        br += `<rect x="${xx + 1}" y="${f(y + 1)}" width="24" height="11.5" rx="1" fill="${["#5c2f2a", "#683630", "#52292a", "#6f3b32"][(r * 3 + c * 7 + 20) % 4]}"/>`; }
      const moon = "M108 46 C80 50 62 74 66 102 C70 132 100 152 130 144 C110 138 94 118 94 94 C94 72 100 56 108 46 Z";
      const star = "M146 52 L150 64 L162 64 L152 71 L156 83 L146 76 L136 83 L140 71 L130 64 L142 64 Z";
      const tube = (d) => x.on ? `<path d="${d}" fill="none" stroke="${x.c}" stroke-width="15" stroke-opacity="${x.op(.1)}" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${x.c}" stroke-width="8" stroke-opacity="${x.op(.28)}" stroke-linejoin="round"/>
<g class="hda-bulbs-neon"><path d="${d}" fill="none" stroke="${x.c}" stroke-width="4.6" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${H.mix(x.hot, "#fff", .5)}" stroke-width="1.6" stroke-linejoin="round" opacity="${(.5 + .5 * x.L).toFixed(2)}"/></g>`
        : `<path d="${d}" fill="none" stroke="#1d1a22" stroke-width="5.6" stroke-opacity=".6" stroke-linejoin="round" transform="translate(1 2)"/><path d="${d}" fill="none" stroke="#d6d2de" stroke-width="4.6" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#fff" stroke-width="1.2" stroke-opacity=".7" stroke-linejoin="round"/>`;
      return out(x, `${soft(x, `<rect width="200" height="200" fill="#2a1614"/>${br}`)}${halo(x, 106, 96, 90, .55)}
${tube(moon)}${tube(star)}
<path d="M128 144 C132 158 124 170 126 196" fill="none" stroke="#151319" stroke-width="2.2"/>
${[[67, 92], [100, 147], [99, 70], [146, 82]].map(([a, b]) => `<rect x="${a - 4}" y="${b - 2.4}" width="8" height="4.8" rx="1.4" fill="#fff" fill-opacity=".22" stroke="#fff" stroke-opacity=".35" stroke-width=".5"/>`).join("")}`);
    } }),

    base({ id: "bars", name: "Light bar pair", colors: STRIP2, cast: "up", glow: { x: .5, y: .45, r: 1.2 }, render(o) {
      const x = ctx(o);
      const bar = (cx) => `${x.on ? `<path d="M${cx - 5} 72 L${cx - 46} 0 L${cx + 46} 0 L${cx + 5} 72 Z" fill="${x.url("coneU")}" opacity="${x.op(.6)}"/>${halo(x, cx, 70, 40, .5)}` : ""}
<ellipse cx="${cx}" cy="154" rx="11" ry="3" fill="#000" opacity=".5"/><rect x="${cx - 9}" y="148" width="18" height="6" rx="2" fill="${x.url("blk")}"/>
<rect x="${cx - 5.5}" y="66" width="11" height="84" rx="3" fill="${x.url("blk")}"/>
<rect x="${cx - 3.5}" y="69" width="7" height="78" rx="2.4" fill="${x.on ? x.url("fill") : "#c8c4d6"}" ${x.on ? `opacity="${x.op(1)}"` : 'opacity=".55"'}/>`;
      const lf = lg(x.id("lf"), [[0, "#4f8a4a"], [1, "#24502a"]], 1);
      return out(x, `${wall(x, "#4b4566", .45)}
<g class="hda-bg"><rect x="18" y="154" width="164" height="22" rx="2" fill="${x.url("wood")}"/><rect x="18" y="154" width="164" height="3" fill="#b48152" opacity=".7"/>
<rect x="24" y="176" width="4" height="12" fill="#1a1a22"/><rect x="172" y="176" width="4" height="12" fill="#1a1a22"/><path d="M73 158 V176 M127 158 V176" stroke="#2a1b10" stroke-opacity=".6"/>
${x.on ? `<rect x="18" y="154" width="164" height="5" fill="${x.c}" opacity="${x.op(.35)}"/>` : ""}
<path d="M88 154 L91 134 H109 L112 154 Z" fill="#d9d4e2"/><path d="M104 134 H109 L112 154 H106 Z" fill="#000" opacity=".15"/>
<path d="M100 134 C92 120 80 116 76 104 C88 108 96 118 100 134 C102 116 110 104 124 98 C116 112 106 120 100 134 Z" fill="url(#${x.id("lf")})"/><path d="M100 134 C98 118 100 106 104 94 C108 108 104 122 100 134 Z" fill="#3e7a3c"/></g>
${bar(46)}${bar(154)}`, lf);
    } }),

    base({ id: "hex", name: "Hexagon panels", colors: STRIP, cast: "around", glow: { x: .5, y: .5, r: 1.2 }, render(o) {
      const x = ctx(o), R = 22, g = 1.1;
      const cells = [[0, 0], [1, 0], [1, -1], [2, -1], [-1, 1], [0, 1], [-1, 2]];
      const shifts = [0, 18, 36, -18, -36, 10, -26];
      let back = "", tiles = "";
      cells.forEach(([q, r], i) => {
        const cx = 88 + 1.5 * R * g * q, cy = 92 + Math.sqrt(3) * R * g * (r + q / 2);
        const pts = (rr) => Array.from({ length: 6 }, (_, k) => `${f(cx + Math.cos(k * Math.PI / 3) * rr)},${f(cy + Math.sin(k * Math.PI / 3) * rr)}`).join(" ");
        const col = hue(x.c, shifts[i], i % 2 ? -.06 : .04), hc = H.mix(col, "#fff", .55);
        back += x.on ? `<circle cx="${f(cx)}" cy="${f(cy)}" r="40" fill="${col}" opacity="${x.op(.12)}"/>` : "";
        tiles += `<polygon points="${pts(R)}" fill="#000" opacity=".35" transform="translate(1.5 3)"/><polygon points="${pts(R)}" fill="${x.on ? col : "#cfcbdb"}" ${x.on ? `opacity="${(.55 + .45 * x.L).toFixed(2)}"` : ""}/>
<g class="hda-bulbs-breathe" style="animation-delay:-${i * .7}s"><polygon points="${pts(R - 5)}" fill="${x.on ? hc : "#e9e6f1"}" ${x.on ? `opacity="${x.op(.9)}"` : ""}/></g>
<polygon points="${pts(R)}" fill="none" stroke="${x.on ? H.mix(col, "#fff", .3) : "#8a86a0"}" stroke-width="1"/>${x.on ? "" : `<path d="M${f(cx - R / 2)} ${f(cy + R * .866)} L${f(cx + R / 2)} ${f(cy + R * .866)} L${f(cx + R)} ${f(cy)}" stroke="#000" stroke-opacity=".2" stroke-width="2" fill="none"/>`}`;
      });
      return out(x, `${wall(x, "#4b4566", .5)}${back}${tiles}`);
    } }),

    base({ id: "tri", name: "Triangle panels", colors: STRIP2, cast: "around", glow: { x: .5, y: .5, r: 1.2 }, render(o) {
      const x = ctx(o), s = 46, h = s * .866, gap = 2.6;
      const list = [[0, 0, 1], [1, 0, 0], [2, 0, 1], [3, 0, 0], [4, 0, 1], [1, 1, 1], [2, 1, 0], [3, 1, 1]];
      let back = "", tiles = "";
      list.forEach(([c, r, up], i) => {
        const x0 = 22 + c * (s / 2 + gap), y0 = 56 + r * (h + gap);
        const p = up ? [[x0, y0 + h], [x0 + s / 2, y0], [x0 + s, y0 + h]] : [[x0, y0], [x0 + s, y0], [x0 + s / 2, y0 + h]];
        const cxm = (p[0][0] + p[1][0] + p[2][0]) / 3, cym = (p[0][1] + p[1][1] + p[2][1]) / 3;
        const inner = p.map(([a, b]) => `${f(cxm + (a - cxm) * .66)},${f(cym + (b - cym) * .66)}`).join(" ");
        const pts = p.map(([a, b]) => `${f(a)},${f(b)}`).join(" ");
        const col = hue(x.c, (i - 3) * 14, i % 2 ? -.05 : .05), hc = H.mix(col, "#fff", .55);
        back += x.on ? `<circle cx="${f(cxm)}" cy="${f(cym)}" r="36" fill="${col}" opacity="${x.op(.13)}"/>` : "";
        tiles += `<polygon points="${pts}" fill="#000" opacity=".35" transform="translate(1.5 3)"/><polygon points="${pts}" fill="${x.on ? col : "#cfcbdb"}" stroke-linejoin="round" ${x.on ? `opacity="${(.55 + .45 * x.L).toFixed(2)}"` : ""}/>
<g class="hda-bulbs-breathe" style="animation-delay:-${i * .6}s"><polygon points="${inner}" fill="${x.on ? hc : "#e9e6f1"}" ${x.on ? `opacity="${x.op(.85)}"` : ""}/></g>
<polygon points="${pts}" fill="none" stroke="${x.on ? H.mix(col, "#fff", .3) : "#8a86a0"}" stroke-width="1" stroke-linejoin="round"/>`;
      });
      return out(x, `${wall(x, "#4b4566", .5)}${back}${tiles}`);
    } }),

    base({ id: "orb", name: "Glow orb", colors: RGB2, cast: "around", glow: { x: .5, y: .5, r: 1.1 }, render(o) {
      const x = ctx(o), d = "M54 104 a46 46 0 1 0 92 0 a46 46 0 1 0 -92 0 Z";
      const orb = rg(x.id("orb"), [[0, "#ffffff"], [.3, x.hot], [.75, x.c], [1, H.shade(x.c, -.35)]], .5, .62, .6);
      return out(x, `${halo(x, 100, 104, 96, .6)}
<g class="hda-bg"><path d="M10 154 H190 L196 166 H4 Z" fill="${x.url("woodT")}"/><rect x="4" y="166" width="192" height="10" fill="${x.url("wood")}"/></g>
${pool(x, 100, 158, 90, 9, .8)}${cshadow(100, 154, 46, 5)}
<ellipse cx="100" cy="150" rx="26" ry="5" fill="#1a1a22"/><rect x="74" y="144" width="52" height="6" fill="${x.url("blk")}"/><ellipse cx="100" cy="144" rx="26" ry="4.4" fill="#33333f"/>
<path d="${d}" fill="${x.url("frost")}"${x.on ? ` opacity="${(1 - .7 * x.L).toFixed(2)}"` : ""}/>${x.on ? `<path d="${d}" fill="url(#${x.id("orb")})" opacity="${x.op(1)}"/>` : `<path d="${d}" fill="${x.url("sh")}" opacity=".35"/>`}
<path d="${d}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width=".8"/>
${hl("M66 86 C72 70 86 62 100 60", x.on ? .35 : .7, 3)}<ellipse cx="74" cy="78" rx="4" ry="2.4" fill="#fff" fill-opacity="${x.on ? .35 : .75}" transform="rotate(-36 74 78)"/>`, orb);
    } }),

    base({ id: "shelf", name: "Shelf gradient", colors: STRIP, glow: { x: .5, y: .5, r: 1.2 }, render(o) {
      const x = ctx(o), c2 = hue(x.c, 70), c3 = hue(x.c, 140);
      const ex = lg(x.id("gr"), [[0, x.c], [.5, c2], [1, c3]]) + rg(x.id("fade"), [[0, "#fff"], [.45, "#fff", .75], [1, "#000"]], .5, 0, .62) +
        `<mask id="${x.id("fm")}" maskContentUnits="objectBoundingBox"><rect width="1" height="1" fill="url(#${x.id("fade")})"/></mask>`;
      const shelf = (y, items) => `${x.on ? `<rect x="22" y="${y + 10}" width="156" height="58" fill="url(#${x.id("gr")})" mask="url(#${x.id("fm")})" opacity="${x.op(.75)}"/>` : ""}
${items}<rect x="20" y="${y}" width="160" height="9" rx="1.5" fill="${x.url("woodT")}"/><rect x="20" y="${y + 7}" width="160" height="2.5" fill="#4a2c16"/>
<rect x="26" y="${y + 9}" width="148" height="2.4" rx="1" fill="${x.on ? `url(#${x.id("gr")})` : "#d8d4e2"}" ${x.on ? `opacity="${(.6 + .4 * x.L).toFixed(2)}"` : 'opacity=".5"'}/>`;
      const books = [[34, 30, "#7a3d5c"], [42, 34, "#2f5d7c"], [51, 28, "#c9a24a"], [58, 32, "#3e6b3a"]].map(([bx, hh, col]) => `<rect x="${bx}" y="${52 - hh}" width="7.4" height="${hh}" rx="1" fill="${col}"/><path d="M${bx + 1.6} ${52 - hh + 4} V48" stroke="#fff" stroke-opacity=".25"/>`).join("") +
        `<rect x="66" y="28" width="7" height="24" rx="1" fill="#8a5a32" transform="rotate(14 66 52)"/><path d="M128 52 L131 34 H149 L152 52 Z" fill="#d9d4e2"/><circle cx="140" cy="28" r="9" fill="#3e7a3c"/><circle cx="134" cy="31" r="6" fill="#4f8a4a"/>`;
      const items2 = `<rect x="40" y="104" width="22" height="24" rx="3" fill="#b65b3a"/><path d="M44 104 C40 94 46 88 50 86 C50 94 54 98 51 104 Z M54 104 C56 94 62 92 66 92 C62 98 60 100 58 104 Z" fill="#4f8a4a"/>
<path d="M118 128 C112 120 112 110 118 100 V92 H126 V100 C132 110 132 120 126 128 Z" fill="#8fb8c9" opacity=".8"/><rect x="146" y="114" width="20" height="14" rx="1" fill="#2a2735"/><rect x="148" y="116" width="16" height="10" fill="#d9c7a0" opacity=".7"/>`;
      return out(x, `${wall(x, "#4b4566", .45)}${shelf(52, books)}${shelf(128, items2)}`, ex);
    } }),
  ];

  (window.HDA = window.HDA || []).push({
    id: "bulbs",
    tab: "Bulbs & strips",
    group: "Lights",
    kind: "light",
    intro: "Twenty bare smart bulbs and LED strips people actually own, each in its socket, can, track or on its wall. Lit bulbs glow in the light color, filaments burn, and strips wash the wall.",
    
    css: `.hda-bulbs-sway{transform-box:view-box;transform-origin:100px 12px}
.hda-anim .hda-bulbs-sway{animation:hda-bulbs-sway 7s ease-in-out infinite}
.hda-anim .hda-bulbs-fil{animation:hda-bulbs-fil 3.4s ease-in-out infinite}
.hda-anim .hda-bulbs-neon{animation:hda-bulbs-neon 6s linear infinite}
.hda-anim .hda-bulbs-breathe{animation:hda-bulbs-breathe 5s ease-in-out infinite}
@keyframes hda-bulbs-sway{0%,100%{transform:rotate(-.8deg)}50%{transform:rotate(.8deg)}}
@keyframes hda-bulbs-fil{0%,100%{opacity:1}45%{opacity:.85}55%{opacity:.95}}
@keyframes hda-bulbs-neon{0%,88%,92%,100%{opacity:1}90%{opacity:.7}}
@keyframes hda-bulbs-breathe{0%,100%{opacity:1}50%{opacity:.6}}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-bulbs-sway,.hda-anim .hda-bulbs-fil,.hda-anim .hda-bulbs-neon,.hda-anim .hda-bulbs-breathe{animation:none}}`,
    icons,
  });
})();
