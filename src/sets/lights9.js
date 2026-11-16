(function () {
  const H = window.HDAH, P = "hda-lights9-";
  const f = (n) => (+n).toFixed(1);
  const rnd = (seed) => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };

  function ctx(o, lit) {
    const c = o.color || "#d77bff", on = lit == null ? !!o.on : !!lit, lv = o.level == null ? 1 : o.level;
    const L = on ? .3 + .7 * lv : 0;
    const id = (s) => `${o.uid}-${s}`, url = (s) => `url(#${o.uid}-${s})`;
    return { c, on, L, lv, anim: !!o.anim, opt: o.opt || {}, id, url, hot: H.mix(c, "#ffffff", .6), op: (k) => Math.min(1, k * L).toFixed(2) };
  }
  const stops = (a) => a.map(([o, c, op]) => `<stop offset="${o}" stop-color="${c}"${op == null ? "" : ` stop-opacity="${op}"`}/>`).join("");
  const lg = (id, a, x1, y1, x2, y2) => `<linearGradient id="${id}" x1="${x1 || 0}" y1="${y1 || 0}" x2="${x2 == null ? 1 : x2}" y2="${y2 || 0}">${stops(a)}</linearGradient>`;
  const rg = (id, a, cx, cy, r) => `<radialGradient id="${id}" cx="${cx == null ? .5 : cx}" cy="${cy == null ? .5 : cy}" r="${r || .5}">${stops(a)}</radialGradient>`;

  function defs(x, extra) {
    const { c, id, hot } = x;
    return `<defs>
<clipPath id="${id("wc")}"><rect x="8" y="8" width="184" height="184" rx="16"/></clipPath>
${rg(id("vig"), [[0, "#000", 0], [.62, "#000", .05], [1, "#000", .5]], .5, .48, .74)}
${rg(id("halo"), [[0, c, .85], [.45, c, .3], [1, c, 0]])}
${rg(id("pool"), [[0, hot, .7], [.35, c, .4], [1, c, 0]])}
${rg(id("sh"), [[0, "#000", .6], [.6, "#000", .22], [1, "#000", 0]])}
${lg(id("beam"), [[0, hot, .7], [.3, c, .4], [1, c, 0]], 0, 0, 0, 1)}
${lg(id("wall"), [[0, "#4a4750"], [1, "#2e2c34"]], 0, 0, 0, 1)}
${lg(id("ceil"), [[0, "#24222a"], [1, "#3a3840"]], 0, 0, 0, 1)}
${lg(id("wood"), [[0, "#8a6440"], [.12, "#6e4e30"], [1, "#3a2818"]], 0, 0, 0, 1)}
${lg(id("alu"), [[0, "#f2f4f6"], [.35, "#c4c9cf"], [.6, "#8d949c"], [1, "#5d636b"]], 0, 0, 0, 1)}
${lg(id("aluh"), [[0, "#6a7078"], [.25, "#c9ced4"], [.5, "#f4f6f8"], [.75, "#aab0b7"], [1, "#5d636b"]])}
${lg(id("blk"), [[0, "#3a3b44"], [.35, "#24252c"], [1, "#0b0b0f"]], 0, 0, 0, 1)}
${lg(id("blkh"), [[0, "#0d0d12"], [.3, "#3a3b46"], [.45, "#52545f"], [.75, "#1f2029"], [1, "#09090d"]])}
${lg(id("wp"), [[0, "#ffffff"], [.5, "#e9ebee"], [1, "#b9bec5"]], 0, 0, 0, 1)}
${lg(id("wph"), [[0, "#aeb3ba"], [.25, "#eef0f2"], [.55, "#ffffff"], [1, "#b4b9c0"]])}
${lg(id("leaf"), [[0, "#86c46a"], [.55, "#4f9440"], [1, "#2c5e28"]], 0, 0, 1, 1)}
${lg(id("pot"), [[0, "#7a3e22"], [.3, "#c46a3e"], [.55, "#d98458"], [1, "#6e361c"]])}
${lg(id("soil"), [[0, "#3a2a1e"], [1, "#22180f"]], 0, 0, 0, 1)}
${extra || ""}</defs>`;
  }
  function svg(x, s, extra) {
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs(x, extra)}
<g clip-path="${x.url("wc")}"><g class="hda-bg"><rect x="8" y="8" width="184" height="184" fill="#1c1b24"/>${s.bg || ""}</g>${x.on ? s.light || "" : ""}<g class="hda-bg"><rect x="8" y="8" width="184" height="184" fill="${x.url("vig")}"/></g>${s.fx || ""}${x.on ? s.over || "" : ""}</g>
<g class="hda-bg"><rect x="8.5" y="8.5" width="183" height="183" rx="15.5" fill="none" stroke="#fff" stroke-opacity=".08"/></g></svg>`;
  }
  const E = (cx, cy, rx, ry, fill, more) => `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}" ${more || ""}/>`;
  const glo = (x, cx, cy, rx, ry, k) => x.on ? E(cx, cy, rx, ry, x.url("halo"), `opacity="${x.op(k)}"`) : "";
  const shadow = (x, cx, cy, rx, ry, k) => E(cx, cy, rx, ry, x.url("sh"), `opacity="${k == null ? .8 : k}"`);
  const hl = (d, o, w) => `<path d="${d}" fill="none" stroke="#fff" stroke-opacity="${o == null ? .35 : o}" stroke-width="${w || 1.2}" stroke-linecap="round"/>`;
  const poly = (pts) => pts.map((p) => f(p[0]) + " " + f(p[1])).join(" ");
  const wallBg = (x, y0, y1, seed) => `<rect x="8" y="${y0}" width="184" height="${y1 - y0}" fill="${x.url("wall")}"/>` + (() => { const r = rnd(seed || 7); let s = ""; for (let i = 0; i < 36; i++) s += `<circle cx="${f(10 + r() * 180)}" cy="${f(y0 + 2 + r() * (y1 - y0 - 4))}" r="${f(.3 + r() * .6)}" fill="${r() > .5 ? "#000" : "#fff"}" fill-opacity="${(.04 + r() * .07).toFixed(2)}"/>`; return s; })();
  const ceil = (x, y1) => `<rect x="8" y="8" width="184" height="${y1 - 8}" fill="${x.url("ceil")}"/><rect x="8" y="${y1}" width="184" height="2.4" fill="#000" fill-opacity=".35"/>`;
  function floorBoards(x, y0) {
    let s = `<rect x="8" y="${y0}" width="184" height="${192 - y0}" fill="${x.url("wood")}"/><rect x="8" y="${y0 - 3}" width="184" height="3.4" fill="#d8d4cc" fill-opacity=".5"/>`;
    for (let i = -6; i <= 26; i++) { const bx = 8 + i * 9; s += `<path d="M${f(100 + (bx - 100) * .6)} ${y0} L${f(bx + (bx - 100) * .35)} 192" stroke="#000" stroke-opacity=".28" stroke-width=".8"/>`; }
    return s;
  }
  const bench = (x, y0) => `<rect x="8" y="${y0 - 8}" width="184" height="8" fill="#8f6a46"/><rect x="8" y="${y0 - 8}" width="184" height="1.4" fill="#fff" fill-opacity=".2"/><rect x="8" y="${y0}" width="184" height="${192 - y0}" fill="${x.url("wood")}"/><path d="M8 ${y0 + 6} H192 M8 ${y0 + 15} H192" stroke="#000" stroke-opacity=".18" stroke-width=".8"/>`;

  function plant(x, cx, by, s, seed, n) {
    const r = rnd(seed); let t = ""; n = n || 7;
    for (let i = 0; i < n; i++) {
      const a = -Math.PI / 2 + (n > 1 ? (i / (n - 1) - .5) * 2.3 : 0) + (r() - .5) * .3;
      const len = s * (.7 + r() * .4), w = s * .26;
      const tx = cx + Math.cos(a) * len, ty = by + Math.sin(a) * len * .9;
      const nx = -Math.sin(a), ny = Math.cos(a), mx = (cx + tx) / 2, my = (by + ty) / 2;
      t += `<path d="M${f(cx)} ${f(by)} Q${f(mx + nx * w)} ${f(my + ny * w)} ${f(tx)} ${f(ty)} Q${f(mx - nx * w)} ${f(my - ny * w)} ${f(cx)} ${f(by)} Z" fill="${x.url("leaf")}" stroke="#1e4a1c" stroke-width=".5"/>` +
        `<path d="M${f(cx)} ${f(by)} Q${f(mx + nx * w * .15)} ${f(my + ny * w * .15)} ${f(tx)} ${f(ty)}" fill="none" stroke="#c8f0a8" stroke-opacity=".45" stroke-width=".6"/>`;
    }
    return t;
  }
  const sprout = (x, cx, by, s) => `<path d="M${cx} ${by} V${f(by - s)}" stroke="#7cb85a" stroke-width="1.1"/>` +
    `<path d="M${cx} ${f(by - s)} q-${f(s * .7)} -${f(s * .1)} -${f(s * .8)} -${f(s * .55)} q${f(s * .55)} -${f(s * .05)} ${f(s * .8)} ${f(s * .55)} Z" fill="${x.url("leaf")}"/>` +
    `<path d="M${cx} ${f(by - s)} q${f(s * .7)} -${f(s * .1)} ${f(s * .8)} -${f(s * .55)} q-${f(s * .55)} -${f(s * .05)} -${f(s * .8)} ${f(s * .55)} Z" fill="${x.url("leaf")}"/>`;
  const pot = (x, cx, by, w, h) => shadow(x, cx, by + 1, w * .75, 3.5) +
    `<path d="M${f(cx - w / 2)} ${f(by - h)} H${f(cx + w / 2)} L${f(cx + w * .38)} ${by} H${f(cx - w * .38)} Z" fill="${x.url("pot")}"/>` +
    `<rect x="${f(cx - w / 2 - 2)}" y="${f(by - h - 4)}" width="${f(w + 4)}" height="5" rx="1.2" fill="${x.url("pot")}"/><rect x="${f(cx - w / 2 - 2)}" y="${f(by - h - 4)}" width="${f(w + 4)}" height="1.2" fill="#fff" fill-opacity=".25"/>` +
    E(cx, by - h - 3.6, w / 2, 1.6, "#2a1c12");

  const SPEC = { full: ["#fff4e4", "#fff4e4", "#ff4b5c", "#fff4e4", "#ffcf9a"], rb: ["#ff3550", "#ff3550", "#5a6cff", "#ff3550"], bloom: ["#ff3550", "#ff6a3a", "#fff0e0", "#ff3550"] };
  function chips(x, pts, spec) {
    const pal = SPEC[spec] || SPEC.full;
    return pts.map(([cx, cy, r], i) => {
      const col = pal[i % pal.length];
      return x.on ? `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r * 2.2)}" fill="${col}" opacity="${x.op(.3)}"/><circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="${H.mix(col, "#ffffff", .45)}"/>`
        : `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="#e9dfc4" fill-opacity=".7"/><circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r * .45)}" fill="#c9a860" fill-opacity=".8"/>`;
    }).join("");
  }
  const GROW = ["#d77bff", "#ff6fb8", "#f4f0ff", "#ffd2a6", "#9d7bff"];
  const SPECOPT = { id: "spec", name: "Spectrum", values: [["full", "Full spectrum"], ["rb", "Red + blue"], ["bloom", "Bloom"]] };
  const MODEOPT = { id: "mode", name: "Mode", values: [["normal", "Normal"], ["battery", "On battery"], ["test", "Test"]] };
  const COUNTOPT = { id: "count", name: "Count", values: [["2", "2"], ["3", "3"], ["4", "4"]] };
  const base = (o) => Object.assign({ picker: true, colorLabel: "Light", cast: "down" }, o);

  function statusLed(x, cx, cy, mode) {
    const col = mode === "battery" ? "#ffb02e" : mode === "test" ? "#ff4040" : "#3ddc6a";
    return `<g${mode === "test" ? ` class="${P}blink"` : ""}><circle cx="${cx}" cy="${cy}" r="4.2" fill="${col}" opacity=".35"/><circle cx="${cx}" cy="${cy}" r="1.9" fill="${H.mix(col, "#fff", .4)}"/></g>`;
  }

  const icons = [
    base({ id: "growbar", name: "Grow bar panel", colors: GROW, glow: { x: .5, y: .3, r: 1.2 }, options: [SPECOPT], render(o) {
      const x = ctx(o), sp = x.opt.spec || "full";
      const bg = ceil(x, 20) + wallBg(x, 22, 152, 3) + bench(x, 160) +
        `<rect x="66" y="20" width="8" height="3" fill="#8a8f96"/><rect x="126" y="20" width="8" height="3" fill="#8a8f96"/>`;
      const BY = 40, FY = 68, bx0 = 54, bw = 92, fx0 = 34, fw = 132;
      let fx = "";
      [[bx0, BY, 70], [bx0 + bw, BY, 130], [fx0, FY, 70], [fx0 + fw, FY, 130]].forEach(([cx, cy, hx]) => {
        fx += `<path d="M${cx} ${cy} L${hx} 23" stroke="#141418" stroke-width="1"/>`;
      });
      fx += `<rect x="66" y="27" width="8" height="5" rx="1" fill="#2a2b31"/><rect x="126" y="27" width="8" height="5" rx="1" fill="#2a2b31"/>`;
      fx += `<rect x="86" y="31" width="28" height="9" rx="1.6" fill="${x.url("blk")}"/><path d="M89 34 H111 M89 36.5 H111" stroke="#fff" stroke-opacity=".1"/>`;
      for (let i = 0; i < 4; i++) {
        const t0 = (i + .12) / 4, t1 = (i + .88) / 4, tm = (i + .5) / 4;
        const a = bx0 + bw * t0, b = bx0 + bw * t1, c = fx0 + fw * t0, d = fx0 + fw * t1;
        fx += `<path d="M${f(a)} ${BY} L${f(b)} ${BY} L${f(d)} ${FY} L${f(c)} ${FY} Z" fill="${x.url("aluh")}"/>`;
        const ia = bx0 + bw * (tm - .07), ib = bx0 + bw * (tm + .07), ic = fx0 + fw * (tm - .07), id2 = fx0 + fw * (tm + .07);
        fx += `<path d="M${f(ia)} ${BY + 1} L${f(ib)} ${BY + 1} L${f(id2)} ${FY - 1} L${f(ic)} ${FY - 1} Z" fill="#17171c"/>`;
        const pts = []; for (let k = 0; k < 7; k++) { const u = (k + .5) / 7; pts.push([bx0 + bw * tm + (fx0 + fw * tm - bx0 - bw * tm) * u, BY + 1 + (FY - BY - 2) * u, .9 + .7 * u]); }
        fx += chips(x, pts, sp);
        fx += `<path d="M${f(c)} ${FY} L${f(d)} ${FY} L${f(d)} ${FY + 2.6} L${f(c)} ${FY + 2.6} Z" fill="#5d636b"/>`;
      }
      fx += `<rect x="${bx0 - 3}" y="${BY - 2}" width="${bw + 6}" height="3" rx="1.4" fill="${x.url("blkh")}"/><rect x="${fx0 - 4}" y="${FY + 1}" width="${fw + 8}" height="4" rx="2" fill="${x.url("blkh")}"/>`;
      fx += pot(x, 58, 160, 22, 16) + plant(x, 58, 140, 22, 5) + pot(x, 100, 160, 24, 18) + plant(x, 100, 138, 26, 9, 8) + pot(x, 142, 160, 22, 16) + plant(x, 142, 140, 21, 13);
      const cone = poly([[fx0, FY + 4], [fx0 + fw, FY + 4], [188, 156], [12, 156]]);
      const light = `<polygon points="${cone}" fill="${x.url("beam")}" opacity="${x.op(.7)}"/>` + E(100, 154, 88, 8, x.url("pool"), `opacity="${x.op(.8)}"`);
      const over = `<polygon points="${cone}" fill="${x.url("beam")}" opacity="${x.op(.16)}"/>` + glo(x, 100, FY, 70, 10, .5);
      return svg(x, { bg, light, fx, over });
    } }),

    base({ id: "clipgrow", name: "Clip-on grow lamp", colors: GROW, glow: { x: .62, y: .3, r: 1 }, options: [SPECOPT], render(o) {
      const x = ctx(o), sp = x.opt.spec || "full";
      const bg = wallBg(x, 8, 142, 11) + `<rect x="150" y="34" width="34" height="46" fill="#2a3448"/><path d="M167 34 V80 M150 57 H184" stroke="#cfc8bc" stroke-width="2.2"/><rect x="148" y="32" width="38" height="50" fill="none" stroke="#d8d2c6" stroke-width="2"/>` +
        `<rect x="8" y="142" width="184" height="10" fill="#9a7450"/><rect x="8" y="142" width="184" height="1.4" fill="#fff" fill-opacity=".22"/><rect x="8" y="152" width="184" height="40" fill="${x.url("wood")}"/>`;
      const heads = [[92, 56, 16], [124, 40, -4], [152, 62, -26]];
      let fx = "", light = "";
      fx += `<path d="M22 136 H44 V160 H38 V146 H22 Z" fill="${x.url("blkh")}"/><rect x="30" y="160" width="4" height="12" fill="#7d838b"/><rect x="24" y="170" width="16" height="4" rx="2" fill="${x.url("blkh")}"/>`;
      fx += `<rect x="30" y="100" width="6" height="38" rx="2" fill="${x.url("blkh")}"/><circle cx="33" cy="100" r="5" fill="${x.url("blk")}"/>`;
      fx += `<path d="M40 150 C56 156 60 166 70 168" stroke="#141418" stroke-width="1.6" fill="none"/><rect x="68" y="162" width="24" height="12" rx="2.4" fill="${x.url("blk")}"/><circle cx="74" cy="168" r="1.6" fill="#888"/><circle cx="80" cy="168" r="1.6" fill="#888"/><circle cx="86" cy="168" r="1.6" fill="${x.on ? "#69db7c" : "#555"}"/>`;
      heads.forEach(([hx, hy, ang]) => {
        const rad = ang * Math.PI / 180, ex = hx - Math.cos(rad) * 18, ey = hy - Math.sin(rad) * 18;
        const d = `M33 100 C33 ${f(hy + 10)} ${f(ex - 30)} ${f(ey - 26)} ${f(ex)} ${f(ey)}`;
        fx += `<path d="${d}" stroke="#18181d" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="${d}" stroke="#6a6e76" stroke-width="3.4" fill="none" stroke-dasharray=".7 1.6"/>`;
      });
      heads.forEach(([hx, hy, ang], j) => {
        const pts = []; for (let k = 0; k < 8; k++) pts.push([-14 + k * 4, 3.4, .95]);
        light += `<g transform="translate(${hx} ${hy}) rotate(${ang})"><polygon points="-16,4 16,4 34,96 -34,96" fill="${x.url("beam")}" opacity="${x.op(.45)}"/></g>`;
        fx += `<g transform="translate(${hx} ${hy}) rotate(${ang})"><rect x="-18" y="-4" width="36" height="8" rx="3.6" fill="${x.url("blkh")}"/><rect x="-16" y="1.6" width="32" height="3.6" rx="1.6" fill="#101014"/>${chips(x, pts, sp)}${hl("M-15 -2.6 H15", .25, .8)}</g>`;
        light += glo(x, hx, hy + 6, 22, 10, .55);
      });
      fx += pot(x, 124, 146, 34, 24) + plant(x, 124, 118, 40, 21, 9);
      light += E(124, 144, 54, 7, x.url("pool"), `opacity="${x.op(.75)}"`);
      const over = `<polygon points="70,70 180,70 180,142 70,142" fill="${x.url("beam")}" opacity="${x.op(.12)}"/>`;
      return svg(x, { bg, light, fx, over });
    } }),

    base({ id: "growstrip", name: "Shelf grow strip", colors: ["#f4f0ff", "#d77bff", "#ff6fb8", "#ffd2a6", "#9d7bff"], glow: { x: .5, y: .3, r: 1.1 }, options: [SPECOPT], render(o) {
      const x = ctx(o), sp = x.opt.spec || "full";
      const bg = wallBg(x, 8, 192, 17);
      let fx = "";
      [24, 176].forEach((px) => { fx += `<rect x="${px - 3}" y="8" width="6" height="184" fill="${x.url("aluh")}"/>`; for (let y = 12; y < 192; y += 5) fx += `<path d="M${px - 3} ${y} H${px + 3}" stroke="#000" stroke-opacity=".22" stroke-width=".6"/>`; });
      for (let i = 0; i < 18; i++) fx += `<path d="M${f(28 + i * 8.3)} 44 L${f(30 + i * 8)} 52" stroke="#aeb4bb" stroke-width=".8"/>`;
      fx += `<rect x="20" y="40" width="160" height="4" fill="${x.url("alu")}"/><rect x="20" y="52" width="160" height="4" fill="${x.url("alu")}"/>`;
      const strip = (y, x0, x1, h) => {
        const pts = []; const n = Math.round((x1 - x0 - 8) / 5); for (let k = 0; k < n; k++) pts.push([x0 + 6 + k * ((x1 - x0 - 12) / (n - 1)), y + h * .6, h * .26]);
        return `<rect x="${x0}" y="${y}" width="${x1 - x0}" height="${h}" rx="${h / 2.4}" fill="${x.url("alu")}"/><rect x="${x0 + 3}" y="${f(y + h * .35)}" width="${x1 - x0 - 6}" height="${f(h * .55)}" rx="1.4" fill="#18181c"/>${chips(x, pts, sp)}` +
          `<rect x="${f(x0 + 3)}" y="${f(y + h * .35)}" width="${x1 - x0 - 6}" height="${f(h * .55)}" rx="1.4" fill="#fff" fill-opacity="${x.on ? .12 : .06}"/><rect x="${x0 - 1}" y="${y - .5}" width="4" height="${h + 1}" rx="1" fill="#2a2b31"/><rect x="${x1 - 3}" y="${y - .5}" width="4" height="${h + 1}" rx="1" fill="#2a2b31"/>`;
      };
      fx += strip(57, 40, 160, 6) + strip(64, 34, 166, 8);
      fx += `<path d="M166 68 C172 70 174 74 174 82" stroke="#141418" stroke-width="1.4" fill="none"/>`;
      for (let i = 0; i < 18; i++) fx += `<path d="M${f(30 + i * 8)} 150 L${f(28 + i * 8.3)} 160" stroke="#aeb4bb" stroke-width=".8"/>`;
      fx += `<rect x="20" y="148" width="160" height="3" fill="${x.url("alu")}"/><rect x="20" y="160" width="160" height="5" fill="${x.url("alu")}"/>`;
      fx += shadow(x, 100, 154, 66, 5) + `<path d="M40 128 H160 L166 154 H34 Z" fill="#1d1e22"/><path d="M40 128 H160 L162 134 H38 Z" fill="#3a3c42"/>`;
      for (let col = 0; col < 8; col++) for (let row = 0; row < 2; row++) {
        const cx = 50 + col * 14.3 + (row ? -1.5 : 0), by = 138 + row * 9;
        fx += E(cx, by, 5.2, 1.6, x.url("soil")) + sprout(x, cx, by, 6 + ((col * 7 + row * 3) % 5));
      }
      const cone = poly([[34, 72], [166, 72], [178, 150], [22, 150]]);
      const light = `<polygon points="${cone}" fill="${x.url("beam")}" opacity="${x.op(.75)}"/>` + E(100, 140, 72, 8, x.url("pool"), `opacity="${x.op(.8)}"`);
      const over = `<polygon points="${cone}" fill="${x.url("beam")}" opacity="${x.op(.14)}"/>` + glo(x, 100, 68, 76, 7, .55);
      return svg(x, { bg, light, fx, over });
    } }),

    base({ id: "blacklight", name: "Blacklight tube", colors: ["#8a4dff", "#6a3dff", "#b06aff", "#5a6cff"], cast: "down", glow: { x: .5, y: .24, r: 1.2 }, render(o) {
      const x = ctx(o), L = x.L;
      const neon = (col) => x.on ? H.mix(col, "#ffffff", .25 * L) : H.mix(col, "#55525e", .7);
      const poster = `<rect x="56" y="78" width="88" height="96" fill="#0c0b12"/><rect x="56" y="78" width="88" height="96" fill="none" stroke="#2a2833" stroke-width="2"/>` +
        `<circle cx="100" cy="114" r="20" fill="none" stroke="${neon("#ff3cc8")}" stroke-width="2.4"/><ellipse cx="100" cy="114" rx="32" ry="7" fill="none" stroke="${neon("#5aff7a")}" stroke-width="2" transform="rotate(-14 100 114)"/>` +
        `<path d="M64 158 Q76 148 88 158 T112 158 T136 158" fill="none" stroke="${neon("#ffe14a")}" stroke-width="2.2"/><path d="M64 166 Q76 156 88 166 T112 166 T136 166" fill="none" stroke="${neon("#4ad8ff")}" stroke-width="1.6"/>` +
        [[70, 90], [128, 92], [134, 136], [66, 130], [118, 140]].map(([sx, sy]) => `<path d="M${sx} ${sy - 3} L${sx + 1} ${sy} L${sx} ${sy + 3} L${sx - 1} ${sy} Z M${sx - 3} ${sy} L${sx} ${sy + 1} L${sx + 3} ${sy} L${sx} ${sy - 1} Z" fill="${neon("#ffffff")}"/>`).join("") +
        (x.on ? `<rect x="56" y="78" width="88" height="96" fill="${x.c}" opacity="${(.12 * L).toFixed(2)}"/>` : "");
      const bg = `<rect x="8" y="8" width="184" height="184" fill="#24212c"/>` + wallBg(x, 8, 180, 23).replace(x.url("wall"), "#26232e") +
        (x.on ? E(100, 70, 110, 70, x.url("halo"), `opacity="${x.op(.32)}"`) : "") + poster + `<rect x="8" y="180" width="184" height="12" fill="#121016"/>`;
      let fx = shadow(x, 100, 54, 70, 4, .6);
      fx += `<rect x="28" y="40" width="144" height="12" rx="3" fill="${x.url("blkh")}"/><rect x="30" y="49" width="140" height="1" fill="#fff" fill-opacity=".1"/>`;
      const tubeFill = x.on ? x.url("tube") : x.url("tubeoff");
      fx += `<rect x="36" y="31" width="128" height="10" rx="5" fill="${tubeFill}"/>`;
      if (x.on) fx += `<g class="${P}hum"><rect x="36" y="29" width="128" height="14" rx="7" fill="${x.c}" opacity="${x.op(.35)}"/><rect x="38" y="34" width="124" height="2.6" rx="1.3" fill="#ffffff" opacity="${x.op(.75)}"/></g>`;
      fx += hl("M40 33.2 H160", x.on ? .3 : .45, .9);
      fx += `<rect x="30" y="30" width="8" height="12" rx="1.6" fill="${x.url("alu")}"/><rect x="162" y="30" width="8" height="12" rx="1.6" fill="${x.url("alu")}"/>`;
      fx += `<path d="M70 41 V44 M130 41 V44" stroke="#9aa0a8" stroke-width="2.6"/><path d="M172 46 C182 48 184 60 184 80" stroke="#141418" stroke-width="1.4" fill="none"/><rect x="152" y="46" width="12" height="4" rx="1" fill="#1a1a1f"/><circle cx="160" cy="48" r=".9" fill="${x.on ? "#b06aff" : "#444"}"/>`;
      const light = `<polygon points="36,42 164,42 192,180 8,180" fill="${x.url("beam")}" opacity="${x.op(.3)}"/>` + glo(x, 100, 36, 90, 16, .7);
      const extra = lg(x.id("tube"), [[0, H.mix(x.c, "#fff", .4)], [.45, "#ffffff"], [1, x.c]], 0, 0, 0, 1) +
        lg(x.id("tubeoff"), [[0, "#5a4f78"], [.4, "#c9c2dc"], [.6, "#7a6e9a"], [1, "#2e2840"]], 0, 0, 0, 1);
      return svg(x, { bg, light, fx }, extra);
    } }),

    base({ id: "uvsanitizer", name: "UV sanitizer lamp", colors: ["#8fa8ff", "#b07cff", "#6fd0ff", "#e0d8ff"], cast: "around", glow: { x: .5, y: .5, r: 1.1 }, render(o) {
      const x = ctx(o);
      const bg = wallBg(x, 8, 158, 29) + bench(x, 166);
      let fx = shadow(x, 100, 170, 48, 6);
      fx += `<path d="M58 152 V164 A42 9 0 0 0 142 164 V152 Z" fill="${x.url("wph")}"/>` + E(100, 152, 42, 9, x.url("wp")) + E(100, 152, 30, 6, "#d6dadf");
      fx += `<rect x="84" y="158" width="32" height="10" rx="2" fill="#15161b"/>`;
      fx += x.on ? `<text x="100" y="165.6" font-family="Arial, Helvetica, sans-serif" font-size="7" font-weight="700" fill="${H.mix(x.c, "#fff", .5)}" text-anchor="middle">14<tspan class="${P}blink">:</tspan>59</text>`
        : `<text x="100" y="165.6" font-family="Arial, Helvetica, sans-serif" font-size="7" font-weight="700" fill="#2c2e36" text-anchor="middle">00:00</text>`;
      fx += `<circle cx="72" cy="163" r="2.4" fill="#cfd3d8" stroke="#9aa0a8" stroke-width=".6"/><circle cx="128" cy="163" r="2.4" fill="${x.on ? "#ff5a5a" : "#cfd3d8"}" stroke="#9aa0a8" stroke-width=".6"/>`;
      fx += `<rect x="80" y="140" width="40" height="12" rx="3" fill="${x.url("wph")}"/>`;
      const tube = (cx) => `M${cx - 7} 141 V70 A7 7 0 0 1 ${cx + 7} 70 V141`;
      let tubes = "";
      [88, 112].forEach((cx) => {
        tubes += x.on ? `<path d="${tube(cx)}" stroke="${x.c}" stroke-width="9" fill="none" opacity="${x.op(.45)}"/><path d="${tube(cx)}" stroke="${H.mix(x.hot, "#fff", .4)}" stroke-width="4.4" fill="none"/><path d="${tube(cx)}" stroke="#ffffff" stroke-width="1.6" fill="none" opacity="${x.op(.9)}"/>`
          : `<path d="${tube(cx)}" stroke="#d9dcef" stroke-opacity=".55" stroke-width="5" fill="none"/><path d="${tube(cx)}" stroke="#ffffff" stroke-opacity=".7" stroke-width="1" fill="none" transform="translate(-1.4 0)"/>`;
      });
      fx += tubes;
      fx += `<rect x="98.5" y="66" width="3" height="76" fill="${x.url("aluh")}"/>` + E(100, 62, 24, 5, x.url("wph")) + `<rect x="76" y="56" width="48" height="6" rx="3" fill="${x.url("wph")}"/>` + E(100, 56, 24, 4.4, x.url("wp"));
      fx += hl("M62 154 Q64 162 70 165", .5, 1.2);
      const light = `<g class="${P}pulse">${E(100, 104, 80, 74, x.url("halo"), `opacity="${x.op(.75)}"`)}</g>` + E(100, 166, 74, 7, x.url("pool"), `opacity="${x.op(.7)}"`);
      return svg(x, { bg, light, fx });
    } }),

    base({ id: "twinhead", name: "Twin-head emergency", colors: ["#fff8e8", "#ffffff", "#ffe2a8", "#e8f0ff"], glow: { x: .5, y: .44, r: 1.1 }, options: [MODEOPT], render(o) {
      const mode = (o.opt && o.opt.mode) || "normal";
      const x = ctx(o, o.on || mode !== "normal");
      let bg = wallBg(x, 8, 172, 31).replace(x.url("wall"), x.url("block"));
      for (let r = 0; r < 9; r++) { const y = 8 + r * 18.5; bg += `<path d="M8 ${f(y)} H192" stroke="#000" stroke-opacity=".22" stroke-width="1"/>`; for (let c = 0; c < 5; c++) bg += `<path d="M${f(8 + c * 46 + (r % 2) * 23)} ${f(y)} V${f(y + 18.5)}" stroke="#000" stroke-opacity=".2" stroke-width="1"/>`; }
      bg += floorBoards(x, 172).replace(x.url("wood"), "#3a3a40");
      const blinkCls = mode === "test" ? ` class="${P}blink"` : "";
      let fx = shadow(x, 100, 128, 40, 3.5, .5);
      fx += `<rect x="64" y="90" width="72" height="36" rx="5" fill="${x.url("wp")}"/><rect x="64" y="90" width="72" height="36" rx="5" fill="none" stroke="#9aa0a8" stroke-width=".6"/>`;
      fx += `<rect x="68" y="94" width="64" height="2" rx="1" fill="#fff" fill-opacity=".8"/>`;
      for (let i = 0; i < 6; i++) fx += `<rect x="${74 + i * 5}" y="104" width="2.2" height="12" rx="1.1" fill="#b4b9c0"/>`;
      fx += `<circle cx="116" cy="110" r="4" fill="#d83a3a" stroke="#8a1f1f" stroke-width=".6"/>${hl("M114 108.4 A2.4 2.4 0 0 1 117 107.6", .6, .8)}` + statusLed(x, 127, 110, mode);
      let light = "";
      [[64, 84, -1], [136, 84, 1]].forEach(([hx, hy, s]) => {
        fx += `<path d="M${hx + s * -6} 92 L${hx} ${hy + 4}" stroke="#c4c9cf" stroke-width="4" stroke-linecap="round"/>`;
        fx += `<g transform="translate(${hx} ${hy}) rotate(${s * 28})">` +
          `<rect x="-11" y="-10" width="22" height="16" rx="6" fill="${x.url("wph")}"/>` +
          E(0, 6, 10, 4.6, "#cfd3d8") + E(0, 6.4, 8, 3.6, x.on ? x.url("lens") : "#e6e8ea") +
          (x.on ? "" : `<path d="M-6 6.4 H6 M-4 4.4 H4 M-4 8.4 H4" stroke="#b4b9c0" stroke-width=".5"/>`) + `</g>`;
        light += `<g${blinkCls}><polygon points="${poly([[hx - 8, hy + 8], [hx + 8, hy + 8], [hx + s * 70, 182], [hx + s * 6, 186]])}" fill="${x.url("beam")}" opacity="${x.op(.55)}"/>` +
          E(hx + s * 38, 178, 34, 6, x.url("pool"), `opacity="${x.op(.8)}"`) + E(hx + s * 2, hy + 8, 16, 12, x.url("halo"), `opacity="${x.op(.8)}"`) + `</g>`;
      });
      const extra = lg(x.id("block"), [[0, "#6c6a66"], [1, "#4a4844"]], 0, 0, 0, 1) + rg(x.id("lens"), [[0, "#ffffff"], [.5, x.hot], [1, x.c]]);
      return svg(x, { bg, light, fx }, extra);
    } }),

    base({ id: "exitsign", name: "Lit EXIT sign", colors: ["#ff3b30", "#33d16a", "#ff5a4a", "#4ae08a"], colorLabel: "Letters", glow: { x: .5, y: .4, r: 1 }, options: [MODEOPT, { id: "arrow", name: "Arrows", values: [["none", "None"], ["left", "Left"], ["right", "Right"], ["both", "Both"]] }], render(o) {
      const mode = (o.opt && o.opt.mode) || "normal", arrow = (o.opt && o.opt.arrow) || "none";
      const x = ctx(o, o.on || mode !== "normal");
      const bg = ceil(x, 24) + wallBg(x, 26, 176, 37) +
        `<rect x="58" y="120" width="84" height="64" fill="#5a4a3a"/><rect x="62" y="124" width="76" height="60" fill="#7a6248"/><rect x="62" y="124" width="76" height="60" fill="none" stroke="#000" stroke-opacity=".3"/>` +
        `<rect x="70" y="152" width="60" height="5" rx="2" fill="${x.url("alu")}"/><path d="M8 176 H192" stroke="#888" stroke-opacity=".4"/><rect x="8" y="176" width="184" height="16" fill="#2e2c30"/>`;
      let fx = `<rect x="96" y="24" width="8" height="12" fill="${x.url("aluh")}"/><rect x="88" y="22" width="24" height="4" rx="1" fill="${x.url("wp")}"/>`;
      fx += shadow(x, 100, 104, 62, 4, .4) + `<rect x="36" y="36" width="128" height="66" rx="4" fill="${x.url("wp")}"/><rect x="36" y="36" width="128" height="66" rx="4" fill="none" stroke="#9aa0a8" stroke-width=".7"/>`;
      fx += `<rect x="42" y="42" width="116" height="52" rx="2" fill="${x.on ? H.mix(x.c, "#ffffff", .9) : "#eceae6"}"/><rect x="42" y="42" width="116" height="52" rx="2" fill="none" stroke="#c4c9cf" stroke-width=".6"/>`;
      const letter = x.on ? H.mix(x.c, "#ffffff", .1 * x.L) : H.mix(x.c, "#3a3a3a", .55);
      const lcls = mode === "test" ? ` class="${P}blink"` : "";
      const fs2 = arrow === "both" ? 24 : arrow === "none" ? 30 : 27, tx = arrow === "left" ? 106 : arrow === "right" ? 94 : 100;
      let face = `<text x="${tx}" y="${arrow === "none" ? 80 : 78}" font-family="Arial, Helvetica, sans-serif" font-size="${fs2}" font-weight="700" letter-spacing="2" text-anchor="middle" fill="${letter}">EXIT</text>`;
      const chev = (cx, dir) => `<path d="M${cx + dir * 6} 56 L${cx - dir * 4} 68 L${cx + dir * 6} 80" fill="none" stroke="${letter}" stroke-width="4.4" stroke-linejoin="miter"/>`;
      if (arrow === "left" || arrow === "both") face += chev(50, 1);
      if (arrow === "right" || arrow === "both") face += chev(150, -1);
      fx += `<g${lcls}>${x.on ? `<g opacity="${x.op(.75)}" filter="url(#${x.id("bl")})">${face}</g>` : ""}${face}</g>`;
      fx += statusLed(x, 152, 98, mode) + `<circle cx="48" cy="98" r="2" fill="#d8dce0" stroke="#9aa0a8" stroke-width=".5"/>`;
      fx += hl("M40 39 H160", .6, .8);
      const light = `<g${lcls}>` + `<polygon points="40,102 160,102 184,176 16,176" fill="${x.url("beam")}" opacity="${x.op(.28)}"/>` + E(100, 70, 86, 46, x.url("halo"), `opacity="${x.op(.55)}"`) + `</g>`;
      const extra = `<filter id="${x.id("bl")}" x="-20%" y="-40%" width="140%" height="180%"><feGaussianBlur stdDeviation="2.4"/></filter>`;
      return svg(x, { bg, light, fx }, extra);
    } }),

    base({ id: "pendantgroup", name: "Pendant group", colors: ["#ffc477", "#ffe2ad", "#fff6ea", "#ffb36b", "#a5d8ff"], colors2: ["#1d1e24", "#e9e6df", "#3e5a4a", "#7a2e2e"], picker2: true, colorLabel2: "Shade", glow: { x: .5, y: .5, r: 1.3 }, options: [COUNTOPT], render(o) {
      const x = ctx(o), n = +((o.opt && o.opt.count) || 2), sc = o.color2 || "#1d1e24";
      const gap = n === 4 ? 40 : n === 3 ? 50 : 62, w = n === 4 ? 30 : 34;
      const bg = ceil(x, 20) + wallBg(x, 22, 150, 41) + `<rect x="18" y="150" width="164" height="7" rx="1" fill="#d9d6d0"/><rect x="18" y="150" width="164" height="1.6" fill="#fff" fill-opacity=".6"/><rect x="22" y="157" width="156" height="35" fill="#34404a"/>` +
        [0, 1, 2, 3].map((i) => `<rect x="${26 + i * 38.5}" y="161" width="34" height="31" fill="none" stroke="#000" stroke-opacity=".25"/><rect x="${39 + i * 38.5}" y="165" width="8" height="1.8" rx=".9" fill="#c9a24a"/>`).join("");
      let fx = "", light = "";
      for (let i = 0; i < n; i++) {
        const cx = 100 + (i - (n - 1) / 2) * gap, sy = 92;
        fx += `<rect x="${cx - 5}" y="20" width="10" height="3" rx="1" fill="${x.url("blkh")}"/><path d="M${cx} 23 V${sy - 14}" stroke="#141418" stroke-width="1.3"/><rect x="${cx - 3}" y="${sy - 16}" width="6" height="6" rx="1" fill="${x.url("brs")}"/>`;
        const d = `M${cx - 4} ${sy - 11} C${cx - 8} ${sy - 10} ${cx - w / 2} ${sy - 6} ${cx - w / 2} ${sy + 4} H${cx + w / 2} C${cx + w / 2} ${sy - 6} ${cx + 8} ${sy - 10} ${cx + 4} ${sy - 11} Z`;
        fx += `<path d="${d}" fill="${sc}"/><path d="${d}" fill="${x.url("shg")}"/>` + E(cx, sy + 4, w / 2, 3, x.on ? x.url("lit") : "#c9a868") + (x.on ? E(cx, sy + 5, 4, 2, "#ffffff", `opacity="${x.op(1)}"`) : "");
        fx += hl(`M${cx - w / 2 + 4} ${sy} C${cx - w / 2 + 5} ${sy - 6} ${cx - 8} ${sy - 9} ${cx - 4} ${sy - 10}`, .3, 1);
        light += `<polygon points="${poly([[cx - w / 2, sy + 4], [cx + w / 2, sy + 4], [cx + w / 2 + 14, 150], [cx - w / 2 - 14, 150]])}" fill="${x.url("beam")}" opacity="${x.op(.45)}"/>` + E(cx, 151, w * .9, 3.6, x.url("pool"), `opacity="${x.op(.85)}"`) + glo(x, cx, sy + 6, w * .9, 12, .6);
      }
      const extra = rg(x.id("lit"), [[0, "#ffffff"], [.4, x.hot], [1, x.c]]) + lg(x.id("brs"), [[0, "#6e4a17"], [.35, "#fbe7a6"], [.7, "#b07f33"], [1, "#4d3210"]]) +
        lg(x.id("shg"), [[0, "#000", .45], [.3, "#fff", .18], [.45, "#fff", .05], [.8, "#000", .2], [1, "#000", .55]]);
      return svg(x, { bg, light, fx }, extra);
    } }),

    base({ id: "bulbgroup", name: "Bulb group", colors: ["#ffd8a8", "#fff3e0", "#ffffff", "#a5d8ff", "#ffc9de"], cast: "around", glow: { x: .5, y: .5, r: 1.3 }, options: [COUNTOPT], render(o) {
      const x = ctx(o), n = +((o.opt && o.opt.count) || 2);
      const LAY = { 2: [[76, 98, 1], [124, 98, 1]], 3: [[58, 104, .9], [142, 104, .9], [100, 92, 1]], 4: [[42, 108, .8], [158, 108, .8], [80, 96, .92], [120, 96, .92]] }[n] || [];
      const bg = wallBg(x, 8, 172, 43) + `<rect x="8" y="172" width="184" height="20" fill="#2a2830"/><rect x="8" y="171" width="184" height="1.4" fill="#fff" fill-opacity=".12"/>`;
      let fx = "", light = "";
      const glassD = "M-6 26 C-6 18 -22 6 -22 -14 A22 22 0 1 1 22 -14 C22 6 6 18 6 26 Z";
      LAY.forEach(([cx, cy, s]) => {
        fx += shadow(x, cx, 174, 18 * s, 3, .7);
        light += glo(x, cx, cy - 14 * s, 44 * s, 44 * s, .55);
        let b = `<path d="${glassD}" fill="${x.on ? x.url("lit") : x.url("frost")}"/><path d="${glassD}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width=".7"/>` + hl("M-15 -24 C-18 -18 -18 -10 -15 -4", x.on ? .3 : .55, 2);
        b += `<rect x="-7" y="25" width="14" height="5" rx="1" fill="${x.url("aluh")}"/>`;
        for (let k = 0; k < 4; k++) b += `<path d="M-7 ${31 + k * 3} L7 ${30 + k * 3} L7 ${32 + k * 3} L-7 ${33 + k * 3} Z" fill="${x.url("aluh")}"/>`;
        b += `<path d="M-5 43 H5 L3 47 H-3 Z" fill="#1d1d22"/><circle cx="0" cy="48" r="2" fill="#c9a24a"/>`;
        fx += `<g transform="translate(${cx} ${cy}) scale(${s})">${b}</g>`;
        if (x.on) light += E(cx, 174, 26 * s, 4, x.url("pool"), `opacity="${x.op(.6)}"`);
      });
      const extra = rg(x.id("lit"), [[0, "#ffffff"], [.45, x.hot], [1, x.c]], .5, .45, .6) + rg(x.id("frost"), [[0, "#f4f2ee"], [.7, "#d8d6d2"], [1, "#a8a6a2"]], .4, .35, .7);
      return svg(x, { bg, light, fx }, extra);
    } }),

    base({ id: "poollight", name: "Underwater pool light", colors: ["#3fa9ff", "#3ce0d0", "#b05cff", "#ff5ca8", "#ffffff", "#4cd964"], cast: "around", glow: { x: .5, y: .55, r: 1.3 }, render(o) {
      const x = ctx(o), L = x.L;
      let bg = `<rect x="8" y="8" width="184" height="26" fill="#121a2a"/><rect x="8" y="30" width="184" height="8" fill="#c8c0b0"/><rect x="8" y="30" width="184" height="1.6" fill="#fff" fill-opacity=".5"/>` +
        `<rect x="8" y="38" width="184" height="154" fill="${x.url("water")}"/>`;
      for (let y = 44; y < 160; y += 10) bg += `<path d="M8 ${y} H192" stroke="#fff" stroke-opacity=".08" stroke-width=".7"/>`;
      for (let xx = 14; xx < 192; xx += 10) bg += `<path d="M${xx} 38 V160" stroke="#fff" stroke-opacity=".07" stroke-width=".7"/>`;
      bg += `<rect x="8" y="44" width="184" height="5" fill="#2a4a8a" fill-opacity=".55"/>`;
      bg += `<path d="M8 160 H192 V192 H8 Z" fill="#0a2240" fill-opacity=".5"/>`;
      for (let i = -8; i <= 28; i++) { const bx = 8 + i * 9; bg += `<path d="M${f(100 + (bx - 100) * .5)} 160 L${f(bx + (bx - 100) * .4)} 192" stroke="#fff" stroke-opacity=".06" stroke-width=".7"/>`; }
      bg += `<path d="M8 168 H192 M8 178 H192" stroke="#fff" stroke-opacity=".05"/>`;
      bg += `<path d="M8 38 Q30 35 52 38 T96 38 T140 38 T192 38 V42 H8 Z" fill="#9fd4ff" fill-opacity=".25"/>`;
      const cx = 100, cy = 104;
      let light = `<rect x="8" y="38" width="184" height="154" fill="${x.url("wglow")}" opacity="${x.op(1)}"/>`;
      let rays = ""; for (let i = 0; i < 9; i++) { const a = (i / 9) * Math.PI * 2 + .2, a2 = a + .16; rays += `<polygon points="${poly([[cx, cy], [cx + Math.cos(a) * 120, cy + Math.sin(a) * 120], [cx + Math.cos(a2) * 120, cy + Math.sin(a2) * 120]])}" fill="${x.url("ray")}"/>`; }
      light += `<g opacity="${x.op(.5)}">${rays}</g>`;
      let caus = ""; const r = rnd(51); for (let i = 0; i < 16; i++) { const px = 14 + r() * 172, py = 46 + r() * 140; caus += `<path d="M${f(px)} ${f(py)} q6 -4 12 0 t12 0" fill="none" stroke="${x.hot}" stroke-width="1" stroke-linecap="round"/>`; }
      light += `<g class="${P}caus" opacity="${x.op(.35)}">${caus}</g>`;
      light += `<path class="${P}wave" d="M8 39 Q30 36 52 39 T96 39 T140 39 T192 39" fill="none" stroke="${x.hot}" stroke-width="1.6" opacity="${x.op(.7)}"/>`;
      let fx = E(cx, cy + 2, 30, 30, "#000", `opacity=".25"`);
      fx += `<circle cx="${cx}" cy="${cy}" r="28" fill="${x.url("ring")}"/><circle cx="${cx}" cy="${cy}" r="28" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width=".8"/>`;
      fx += `<circle cx="${cx}" cy="${cy}" r="21" fill="${x.on ? x.url("lens") : x.url("lensoff")}"/>`;
      for (let k = 1; k <= 4; k++) fx += `<circle cx="${cx}" cy="${cy}" r="${f(k * 4.6)}" fill="none" stroke="#fff" stroke-opacity="${x.on ? (.25 * L).toFixed(2) : .12}" stroke-width=".6"/>`;
      fx += `<circle cx="${cx}" cy="${cy - 24.6}" r="1.8" fill="#8a9098"/><path d="M${cx - 1.2} ${cy - 24.6} H${cx + 1.2}" stroke="#333" stroke-width=".5"/>`;
      fx += hl(`M${cx - 20} ${cy - 14} A24 24 0 0 1 ${cx - 6} ${cy - 25}`, .6, 1.4);
      if (x.on) fx += E(cx, cy, 40, 40, x.url("halo"), `opacity="${x.op(.6)}"`);
      fx += [[60, 150, 0], [148, 132, .8], [132, 168, 1.6]].map(([bx, by, d]) => `<circle class="${P}bub" style="animation-delay:${d}s" cx="${bx}" cy="${by}" r="1.6" fill="none" stroke="#cfe8ff" stroke-opacity=".6" stroke-width=".6"/>`).join("");
      const extra = lg(x.id("water"), [[0, "#0d3a6a"], [.6, "#0a2648"], [1, "#061528"]], 0, 0, 0, 1) +
        rg(x.id("wglow"), [[0, x.hot, .8], [.3, x.c, .55], [.75, x.c, .18], [1, x.c, .05]], .5, .43, .62) +
        rg(x.id("ray"), [[0, "#ffffff", .5], [.5, x.c, .25], [1, x.c, 0]], 0, 0, 1) +
        lg(x.id("ring"), [[0, "#f4f6f8"], [.4, "#a8b0b8"], [.6, "#e4e8ec"], [1, "#6a737c"]], 0, 0, 1, 1) +
        rg(x.id("lens"), [[0, "#ffffff"], [.45, x.hot], [1, x.c]]) + rg(x.id("lensoff"), [[0, "#4a6a8a"], [.7, "#1e3450"], [1, "#0e1e30"]], .4, .35, .7);
      return svg(x, { bg, light, fx }, extra);
    } }),

    base({ id: "spalight", name: "Spa light", colors: ["#3ce0d0", "#3fa9ff", "#b05cff", "#ff5ca8", "#ffb347", "#ffffff"], cast: "around", glow: { x: .5, y: .5, r: 1.2 }, render(o) {
      const x = ctx(o);
      let bg = `<rect x="8" y="8" width="184" height="184" fill="#18161c"/>` + `<rect x="8" y="8" width="184" height="80" fill="${x.url("wall")}"/>`;
      for (let i = 0; i < 9; i++) bg += `<rect x="8" y="${88 + i * 12}" width="184" height="11" fill="#4a3826"/><path d="M8 ${88 + i * 12} H192" stroke="#000" stroke-opacity=".45"/>`;
      let fx = shadow(x, 100, 182, 84, 8);
      fx += `<path d="M22 112 H178 L172 182 H28 Z" fill="${x.url("cab")}"/>`;
      for (let i = 0; i < 16; i++) fx += `<path d="M${f(30 + i * 9.4)} 116 L${f(31 + i * 9)} 182" stroke="#000" stroke-opacity=".3" stroke-width=".8"/>`;
      fx += `<rect x="22" y="112" width="156" height="5" fill="#3a2a1a"/>`;
      fx += `<path d="M28 60 Q28 52 36 52 H164 Q172 52 172 60 L178 110 Q178 118 170 118 H30 Q22 118 22 110 Z" fill="${x.url("shell")}"/>`;
      const waterD = "M40 64 Q40 60 44 60 H156 Q160 60 160 64 L164 104 Q164 108 160 108 H40 Q36 108 36 104 Z";
      fx += `<path d="${waterD}" fill="${x.url("spaw")}"/>`;
      fx += `<path d="M44 96 Q60 88 76 96 M86 96 Q100 88 114 96 M124 96 Q140 88 156 96" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="1.4"/>`;
      if (x.on) fx += `<path d="${waterD}" fill="${x.url("spalit")}" opacity="${x.op(1)}"/>`;
      fx += `<circle cx="100" cy="68" r="5" fill="#c8d0d8"/><circle cx="100" cy="68" r="3.6" fill="${x.on ? x.url("lens") : "#3a5068"}"/>`;
      [[52, 72], [148, 72], [60, 100], [140, 100]].forEach(([jx, jy]) => { fx += `<circle cx="${jx}" cy="${jy}" r="2" fill="#aeb6be"/><circle cx="${jx}" cy="${jy}" r=".9" fill="#2a3440"/>`; });
      fx += `<path d="M48 82 Q60 79 72 82 T96 82 M108 88 Q120 85 132 88 T156 88" fill="none" stroke="#fff" stroke-opacity=".18" stroke-width=".8"/>`;
      if (x.on) {
        const r = rnd(61); let bub = "";
        for (let i = 0; i < 14; i++) bub += `<circle class="${P}bub" style="animation-delay:${(r() * 2.4).toFixed(2)}s" cx="${f(48 + r() * 104)}" cy="${f(76 + r() * 28)}" r="${f(.8 + r() * 1.2)}" fill="#ffffff" fill-opacity=".55"/>`;
        fx += bub + `<g opacity="${x.op(.35)}"><path class="${P}steam" d="M70 58 C64 46 76 40 70 26" fill="none" stroke="#e8eef4" stroke-width="3" stroke-linecap="round"/><path class="${P}steam" style="animation-delay:1.3s" d="M120 58 C114 46 126 40 120 26" fill="none" stroke="#e8eef4" stroke-width="3" stroke-linecap="round"/></g>`;
        fx += E(100, 68, 14, 9, x.url("halo"), `opacity="${x.op(.9)}"`);
      }
      fx += hl("M32 58 Q34 54 40 54 H120", .55, 1);
      const light = E(100, 84, 96, 52, x.url("halo"), `opacity="${x.op(.35)}"`);
      const extra = lg(x.id("cab"), [[0, "#6e5034"], [.5, "#5a3e26"], [1, "#3a2818"]], 0, 0, 0, 1) +
        lg(x.id("shell"), [[0, "#f4f4f2"], [.5, "#d8d8d4"], [1, "#a8a8a2"]], 0, 0, 0, 1) +
        lg(x.id("spaw"), [[0, "#2a5a7a"], [1, "#0e2a40"]], 0, 0, 0, 1) +
        rg(x.id("spalit"), [[0, x.hot, .95], [.35, x.c, .7], [1, x.c, .3]], .5, .15, .9) +
        rg(x.id("lens"), [[0, "#ffffff"], [.5, x.hot], [1, x.c]]);
      return svg(x, { bg, light, fx }, extra);
    } }),
  ];

  (window.HDA = window.HDA || []).push({
    id: "lights9",
    tab: "Grow, UV & special lights",
    group: "Lights",
    kind: "light",
    intro: "Grow lights, UV lamps, emergency and EXIT lights, light groups and pool and spa lights. Lit, each glows in the light color; the slider dims it. Grow lights have a Spectrum menu (the diode chips change), emergency lights a Mode menu (on battery lights the heads), groups a Count menu.",
    css: `.hda-anim .hda-lights9-blink{animation:hda-lights9-blink 1s steps(1) infinite}
@keyframes hda-lights9-blink{0%{opacity:1}50%{opacity:.12}}
.hda-anim .hda-lights9-hum{animation:hda-lights9-hum 3.2s ease-in-out infinite}
@keyframes hda-lights9-hum{0%,100%{opacity:1}50%{opacity:.78}}
.hda-anim .hda-lights9-pulse{animation:hda-lights9-pulse 2.6s ease-in-out infinite}
@keyframes hda-lights9-pulse{0%,100%{opacity:1}50%{opacity:.62}}
.hda-anim .hda-lights9-caus{animation:hda-lights9-caus 3.6s ease-in-out infinite alternate}
@keyframes hda-lights9-caus{0%{transform:translate(0,0)}100%{transform:translate(7px,3px)}}
.hda-anim .hda-lights9-wave{animation:hda-lights9-wave 2.8s ease-in-out infinite alternate}
@keyframes hda-lights9-wave{0%{transform:translate(0,0)}100%{transform:translate(-10px,0)}}
.hda-anim .hda-lights9-bub{transform-box:fill-box;animation:hda-lights9-bub 2.4s linear infinite}
@keyframes hda-lights9-bub{0%{transform:translate(0,0);opacity:0}20%{opacity:.9}100%{transform:translate(0,-20px);opacity:0}}
.hda-anim .hda-lights9-steam{animation:hda-lights9-steam 4s ease-in-out infinite}
@keyframes hda-lights9-steam{0%{transform:translate(0,6px);opacity:0}40%{opacity:1}100%{transform:translate(4px,-10px);opacity:0}}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-lights9-blink,.hda-anim .hda-lights9-hum,.hda-anim .hda-lights9-pulse,.hda-anim .hda-lights9-caus,.hda-anim .hda-lights9-wave,.hda-anim .hda-lights9-bub,.hda-anim .hda-lights9-steam{animation:none}}`,
    icons,
  });
})();
