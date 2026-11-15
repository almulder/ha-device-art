(function () {
  const P = "hda-fridge-";
  const H = window.HDAH;
  const f = (n) => (+n).toFixed(1);
  const lerp = (a, b, t) => a + (b - a) * t;
  const SS = "#c3c8ce", BS = "#5b5f66", WH = "#f1f1ee", BK = "#26282c", MATW = "#eceae6", CHG = "#3a3c41",
    NAVY = "#2b3c63", SAGE = "#9fb39a", PINK = "#e6c3c0", MBLUE = "#a9c3d6", CLAY = "#d9b8a4", BEIGE = "#e3d9c6", MINT = "#bfe0d3";
  const METAL = [SS, BS];
  const isMetal = (c) => METAL.indexOf(String(c).toLowerCase()) >= 0;
  const PANELCOLORS = [MATW, NAVY, SAGE, PINK, MBLUE, CHG, SS];
  const STEEL = [SS, BS, WH, BK];
  const first = (c, list) => [c].concat(list.filter((k) => k !== c));

  const st = (stops) => stops.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a == null ? "" : ` stop-opacity="${a}"`}/>`).join("");
  const lg = (id, stops, v) => `<linearGradient id="${id}" x1="0" y1="0" x2="${v ? 0 : 1}" y2="${v ? 1 : 0}">${st(stops)}</linearGradient>`;
  const rg = (id, stops, cx, cy, r) => `<radialGradient id="${id}" cx="${cx || .5}" cy="${cy || .5}" r="${r || .5}">${st(stops)}</radialGradient>`;

  // (parts) every door and drawer is its own part (type "contact": o.parts[id] true = open); switch parts (light, ice, screen,
  // insta, door light): on / off; value parts (temp, ftemp): o.pval[id], a number. o.mf = a Multi-Function Image: o.parts holds
  // only the ticked parts, a part left out is drawn plain (a door closed, a switch off, a reading blank) and never animates.
  // A Device Image (no o.mf) follows its one device as today: the switches o.on, every door the device's contact (o.open).
  function ctx(o) {
    const c = o.color || SS, mf = !!o.mf, on = !!o.on || mf, lv = o.level == null ? 1 : o.level, p = o.parts || {};
    const has = (k) => p[k] != null;
    const part = (k) => (mf ? !!p[k] : on && (p[k] == null ? true : !!p[k]));
    const open = (k) => (mf ? !!p[k] : !!o.open);
    const val = (k) => (o.pval && o.pval[k] != null && o.pval[k] !== "" && isFinite(+o.pval[k]) ? Math.round(+o.pval[k]) : null);
    // the one inside light for the whole fridge: the Light part when ticked, else it comes on with the door (as a real fridge)
    const lit = (opened) => (mf && has("light") ? !!p.light : opened);
    const id = (s) => `${o.uid}-${s}`, url = (s) => `url(#${o.uid}-${s})`;
    return { o, c, on, mf, lv, p, has, part, open, val, lit, id, url, metal: isMetal(c), B: .45 + .55 * lv };
  }

  function defs(x, extra) {
    const { c, id } = x, l = H.shade(c, .32), d = H.shade(c, -.2), k = H.shade(c, -.45);
    return `<defs>
${lg(id("f"), x.metal ? [[0, d], [.12, l], [.45, c], [.8, H.shade(c, .12)], [1, d]] : [[0, H.shade(c, -.1)], [.18, H.shade(c, .1)], [.6, c], [1, H.shade(c, -.14)]])}
${lg(id("fv"), [[0, H.shade(c, .12)], [1, H.shade(c, -.1)]], 1)}
${lg(id("side"), [[0, k], [1, H.shade(c, -.6)]])}
${lg(id("top"), [[0, H.shade(c, .2)], [1, H.shade(c, -.05)]])}
<pattern id="${id("br")}" width="4" height="40" patternUnits="userSpaceOnUse"><rect width=".5" height="40" fill="#fff" fill-opacity=".16"/><rect x="1.6" width=".4" height="40" fill="#000" fill-opacity=".1"/><rect x="2.8" width=".6" height="40" fill="#fff" fill-opacity=".08"/></pattern>
<linearGradient id="${id("gloss")}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".28" stop-color="#fff" stop-opacity=".22"/><stop offset=".36" stop-color="#fff" stop-opacity="0"/><stop offset=".7" stop-color="#fff" stop-opacity="0"/><stop offset=".76" stop-color="#fff" stop-opacity=".1"/><stop offset=".82" stop-color="#fff" stop-opacity="0"/></linearGradient>
${lg(id("bar"), [[0, "#5d646c"], [.4, "#f4f6f8"], [.7, "#a9b0b8"], [1, "#4e545b"]])}
${lg(id("barh"), [[0, "#f4f6f8"], [.5, "#a9b0b8"], [1, "#4e545b"]], 1)}
${lg(id("dark"), [[0, "#0e1015"], [1, "#24272e"]], 1)}
<linearGradient id="${id("glass")}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e6f4ff" stop-opacity=".22"/><stop offset=".3" stop-color="#e6f4ff" stop-opacity=".03"/><stop offset=".5" stop-color="#e6f4ff" stop-opacity=".12"/><stop offset=".56" stop-color="#e6f4ff" stop-opacity="0"/><stop offset="1" stop-color="#e6f4ff" stop-opacity=".08"/></linearGradient>
${lg(id("in"), [[0, "#fffaf0"], [1, "#d8d2c4"]], 1)}
${lg(id("wall"), [[0, "#3a3550"], [1, "#2c2840"]], 1)}
${lg(id("floor"), [[0, "#8a7d70"], [1, "#4d443c"]], 1)}
${lg(id("cab"), [[0, "#ebe8e0"], [1, "#c9c4b8"]], 1)}
${lg(id("ctr"), [[0, "#d7d3e0"], [.5, "#a9a5ba"], [1, "#c4c0d0"]])}
${rg(id("sh"), [[0, "#000", .6], [1, "#000", 0]])}
${rg(id("led"), [[0, "#e8f6ff", .95], [.5, "#bfe4ff", .35], [1, "#bfe4ff", 0]])}
${rg(id("warm"), [[0, "#fff4d6", .9], [1, "#fff4d6", 0]])}
${lg(id("photo"), [[0, "#f6b26b"], [.45, "#e07a7a"], [1, "#4a5d9c"]], 1)}
${lg(id("photo2"), [[0, "#9fd3f0"], [.6, "#6fb38a"], [1, "#2f5d3c"]], 1)}
${lg(id("lin"), [[0, "#fbf8f0"], [1, "#e2dbcb"]], 1)}
${lg(id("din"), [[0, "#efeae0"], [.5, "#f8f5ee"], [1, "#ddd6c7"]])}
${rg(id("glow"), [[0, "#fffbea", .95], [.5, "#fff3d2", .35], [1, "#fff3d2", 0]], .5, .08, .75)}
${lg(id("bin"), [[0, "#ffffff", .62], [1, "#dfe8f0", .38]], 1)}
${lg(id("fzb"), [[0, "#eef3f8"], [1, "#cdd8e3"]], 1)}
${extra || ""}</defs>`;
  }
  const svg = (x, body, extra) => `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs(x, extra)}${body}</svg>`;

  function kitchen(x, fx, fw, opt) {
    opt = opt || {};
    let tl = ""; for (let i = 0; i < 9; i++) tl += `<path d="M${f(100 + (i - 4) * 22)} 174 L${f(100 + (i - 4) * 40)} 200" stroke="#000" stroke-opacity=".18"/>`;
    const L = fx - 3, R = fx + fw + (opt.flush ? 3 : 11);
    const cab = (x0, x1) => x1 - x0 < 6 ? "" : `<rect x="${x0}" y="104" width="${x1 - x0}" height="70" fill="${x.url("cab")}"/><rect x="${x0}" y="98" width="${x1 - x0}" height="7" fill="${x.url("ctr")}"/>
<path d="M${x0} 99 H${x1}" stroke="#fff" stroke-opacity=".5"/><rect x="${x0}" y="166" width="${x1 - x0}" height="8" fill="#2a2638"/>
${x1 - x0 > 20 ? `<rect x="${x0 + 3}" y="109" width="${x1 - x0 - 6}" height="18" rx="1.2" fill="none" stroke="#9c968a" stroke-opacity=".6"/><rect x="${x0 + 3}" y="131" width="${x1 - x0 - 6}" height="32" rx="1.2" fill="none" stroke="#9c968a" stroke-opacity=".6"/>` : ""}`;
    return `<g class="hda-bg"><rect width="200" height="174" fill="${x.url("wall")}"/><rect x="0" y="174" width="200" height="26" fill="${x.url("floor")}"/>${tl}
${cab(0, L)}${cab(R, 200)}${opt.uppers ? `<rect x="0" y="0" width="200" height="${opt.uppers}" fill="${x.url("cab")}"/><path d="M0 ${opt.uppers} H200" stroke="#000" stroke-opacity=".3"/>` : ""}</g>`;
  }
  function body(x, X, Y, W, Hh, depth) {
    const d = depth == null ? 7 : depth;
    return `<ellipse cx="${X + W / 2 + 3}" cy="174" rx="${W / 2 + 12}" ry="4" fill="${x.url("sh")}"/>
${d ? `<path d="M${X + W} ${Y} L${X + W + d} ${Y + 3} V174 H${X + W} Z" fill="${x.url("side")}"/>` : ""}
<rect x="${X}" y="${Y}" width="${W}" height="${174 - Y}" rx="1.6" fill="#141519"/>`;
  }
  function door(x, X, Y, W, Hh, glass) {
    return `<rect x="${f(X)}" y="${f(Y)}" width="${f(W)}" height="${f(Hh)}" rx="1.4" fill="${x.url("f")}"/>
${x.metal ? `<rect x="${f(X)}" y="${f(Y)}" width="${f(W)}" height="${f(Hh)}" rx="1.4" fill="${x.url("br")}"/>` : ""}
${glass || !x.metal ? `<rect x="${f(X)}" y="${f(Y)}" width="${f(W)}" height="${f(Hh)}" rx="1.4" fill="${x.url("gloss")}"/>` : ""}
<path d="M${f(X + 1)} ${f(Y + .7)} H${f(X + W - 1)}" stroke="#fff" stroke-opacity=".45" stroke-width=".8"/><path d="M${f(X + 1)} ${f(Y + Hh - .5)} H${f(X + W - 1)}" stroke="#000" stroke-opacity=".3" stroke-width=".8"/>`;
  }
  const vbar = (x, X, y1, y2) => `<rect x="${f(X - 1.8)}" y="${f(y1)}" width="3.6" height="${f(y2 - y1)}" rx="1.8" fill="${x.url("bar")}"/><rect x="${f(X - 1)}" y="${f(y1 - 2)}" width="2" height="3" fill="#6b7179"/><rect x="${f(X - 1)}" y="${f(y2 - 1)}" width="2" height="3" fill="#6b7179"/>`;
  const hbar = (x, x1, x2, Y) => `<rect x="${f(x1)}" y="${f(Y - 1.8)}" width="${f(x2 - x1)}" height="3.6" rx="1.8" fill="${x.url("barh")}"/><rect x="${f(x1 + 2)}" y="${f(Y - 3.4)}" width="3" height="2" fill="#6b7179"/><rect x="${f(x2 - 5)}" y="${f(Y - 3.4)}" width="3" height="2" fill="#6b7179"/>`;
  const pocket = (x, X, y1, y2) => `<rect x="${f(X - 1.2)}" y="${f(y1)}" width="2.4" height="${f(y2 - y1)}" rx="1.2" fill="#0d0e12"/><path d="M${f(X + 1.2)} ${f(y1 + 1)} V${f(y2 - 1)}" stroke="#d9dce2" stroke-width=".7"/>`;
  const groove = (X, W, Y) => `<rect x="${f(X + 3)}" y="${f(Y)}" width="${f(W - 6)}" height="2" rx="1" fill="#0d0e12" opacity=".85"/><path d="M${f(X + 3)} ${f(Y + 2.4)} H${f(X + W - 3)}" stroke="#fff" stroke-opacity=".3" stroke-width=".6"/>`;
  // (parts) the light leaking at a closed seam follows the Light part when ticked, else the drawing's on (as today)
  const seam = (x, x1, y1, x2, y2) => (x.mf && x.has("light") ? x.p.light : x.on) ? `<path d="M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}" stroke="#fff4d6" stroke-width="1" stroke-opacity="${(.25 * x.B).toFixed(2)}"/>` : "";
  function dispenser(x, X, Y, W, Hh, craft) {
    const lit = x.part("ice");
    return `<rect x="${f(X)}" y="${f(Y - 7)}" width="${f(W)}" height="5" rx="1" fill="#101216"/>
${[0, 1, 2, 3].map((i) => `<rect x="${f(X + 2 + i * (W - 4) / 4)}" y="${f(Y - 5.6)}" width="${f((W - 4) / 4 - 1.4)}" height="2" rx=".6" fill="${x.on ? "#bfe4ff" : "#2c3038"}" opacity="${x.on ? (.5 + .5 * x.B).toFixed(2) : 1}"/>`).join("")}
${craft ? `<circle cx="${f(X + W - 3)}" cy="${f(Y - 4.5)}" r="1.5" fill="none" stroke="${x.on ? "#bfe4ff" : "#4a505a"}" stroke-width=".7"/>` : ""}
<rect x="${f(X)}" y="${f(Y)}" width="${f(W)}" height="${f(Hh)}" rx="3" fill="${x.url("dark")}"/><rect x="${f(X + 1.5)}" y="${f(Y + 1.5)}" width="${f(W - 3)}" height="${f(Hh - 3)}" rx="2.2" fill="#07080b"/>
${lit ? `<ellipse cx="${f(X + W / 2)}" cy="${f(Y + 4)}" rx="${f(W / 2)}" ry="${f(Hh * .6)}" fill="${x.url("led")}" opacity="${(.4 + .6 * x.B).toFixed(2)}"/>` : ""}
<rect x="${f(X + W / 2 - 3)}" y="${f(Y + 3)}" width="6" height="${f(Hh * .5)}" rx="1.5" fill="#2c3038"/><rect x="${f(X + 3)}" y="${f(Y + Hh - 4)}" width="${f(W - 6)}" height="2" rx="1" fill="#2c3038"/>
<rect x="${f(X)}" y="${f(Y)}" width="${f(W)}" height="${f(Hh)}" rx="3" fill="none" stroke="#fff" stroke-opacity=".18" stroke-width=".6"/>`;
  }
  function screen(x, X, Y, W, Hh) {
    const lit = x.part("screen"), id = x.id("scr");
    let s = `<rect x="${f(X - 1)}" y="${f(Y - 1)}" width="${f(W + 2)}" height="${f(Hh + 2)}" rx="2" fill="#050608"/>`;
    if (!lit) return s + `<rect x="${f(X)}" y="${f(Y)}" width="${f(W)}" height="${f(Hh)}" rx="1.4" fill="${x.url("dark")}"/><rect x="${f(X)}" y="${f(Y)}" width="${f(W)}" height="${f(Hh)}" rx="1.4" fill="${x.url("glass")}"/>`;
    const u = W / 10, v = Hh / 16, op = (.55 + .45 * x.B).toFixed(2);
    s += `<g opacity="${op}"><rect x="${f(X)}" y="${f(Y)}" width="${f(W)}" height="${f(Hh)}" rx="1.4" fill="#eef1f6"/>
<g class="${P}slide"><rect x="${f(X + u * .5)}" y="${f(Y + v * .6)}" width="${f(u * 9)}" height="${f(v * 6)}" rx="1.2" fill="${x.url("photo")}"/><circle cx="${f(X + u * 7)}" cy="${f(Y + v * 2.2)}" r="${f(u * .9)}" fill="#ffe7a8"/><path d="M${f(X + u * .5)} ${f(Y + v * 5.2)} L${f(X + u * 3.4)} ${f(Y + v * 3.4)} L${f(X + u * 5.6)} ${f(Y + v * 5)} L${f(X + u * 9.5)} ${f(Y + v * 3.8)} V${f(Y + v * 6.6)} H${f(X + u * .5)} Z" fill="#3b2f4a" opacity=".7"/></g>
<g class="${P}slide2"><rect x="${f(X + u * .5)}" y="${f(Y + v * .6)}" width="${f(u * 9)}" height="${f(v * 6)}" rx="1.2" fill="${x.url("photo2")}"/><path d="M${f(X + u * 2)} ${f(Y + v * 6.6)} V${f(Y + v * 4)} M${f(X + u * 2)} ${f(Y + v * 4.4)} L${f(X + u * 1)} ${f(Y + v * 3.4)} M${f(X + u * 2)} ${f(Y + v * 4.6)} L${f(X + u * 3)} ${f(Y + v * 3.6)}" stroke="#2f5d3c" stroke-width="${f(u * .5)}"/></g>
<rect x="${f(X + u * .5)}" y="${f(Y + v * 7.2)}" width="${f(u * 4.2)}" height="${f(v * 3.4)}" rx="1" fill="#5aa0e6"/><circle cx="${f(X + u * 1.7)}" cy="${f(Y + v * 8.6)}" r="${f(u * .7)}" fill="#ffd36e"/><rect x="${f(X + u * 2.9)}" y="${f(Y + v * 8)}" width="${f(u * 1.4)}" height="${f(v * .7)}" fill="#fff"/><rect x="${f(X + u * 2.9)}" y="${f(Y + v * 9.1)}" width="${f(u * 1)}" height="${f(v * .5)}" fill="#fff" opacity=".7"/>
<rect x="${f(X + u * 5.2)}" y="${f(Y + v * 7.2)}" width="${f(u * 4.3)}" height="${f(v * 3.4)}" rx="1" fill="#fff"/><rect x="${f(X + u * 5.2)}" y="${f(Y + v * 7.2)}" width="${f(u * 4.3)}" height="${f(v * .9)}" fill="#e2645c"/>
${[0, 1, 2].map((r) => [0, 1, 2, 3].map((c) => `<rect x="${f(X + u * (5.6 + c * 1))}" y="${f(Y + v * (8.5 + r * .7))}" width="${f(u * .6)}" height="${f(v * .4)}" fill="${r === 1 && c === 2 ? "#e2645c" : "#c4c8d2"}"/>`).join("")).join("")}
${[0, 1, 2, 3].map((i) => `<rect x="${f(X + u * (.5 + i * 2.3))}" y="${f(Y + v * 11.3)}" width="${f(u * 1.9)}" height="${f(v * 1.9)}" rx="1" fill="${["#7a6cf0", "#3fbf8f", "#f0a33f", "#e2645c"][i]}"/>`).join("")}
${[0, 1, 2, 3].map((i) => `<rect x="${f(X + u * (.5 + i * 2.3))}" y="${f(Y + v * 13.6)}" width="${f(u * 1.9)}" height="${f(v * 1.9)}" rx="1" fill="${["#c4c8d2", "#5aa0e6", "#c4c8d2", "#9b7ae0"][i]}"/>`).join("")}
</g><rect x="${f(X)}" y="${f(Y)}" width="${f(W)}" height="${f(Hh)}" rx="1.4" fill="${x.url("glass")}"/>`;
    return s.replace(/__ID__/g, id);
  }
  function insta(x, X, Y, W, Hh, tint) {
    const lit = x.part("insta");
    let s = `<rect x="${f(X)}" y="${f(Y)}" width="${f(W)}" height="${f(Hh)}" rx="3" fill="#07080b"/>`;
    if (lit) {
      const sh = [.3, .55, .8].map((k) => Y + Hh * k);
      s += `<g opacity="${(.5 + .5 * x.B).toFixed(2)}"><rect x="${f(X + 1.5)}" y="${f(Y + 1.5)}" width="${f(W - 3)}" height="${f(Hh - 3)}" rx="2" fill="${tint ? H.mix(tint, "#fffaf0", .55) : x.url("in")}"/>
${sh.map((y) => `<rect x="${f(X + 2)}" y="${f(y)}" width="${f(W - 4)}" height="1.4" fill="#fff" opacity=".9"/><rect x="${f(X + 2)}" y="${f(y + 1.4)}" width="${f(W - 4)}" height="1.4" fill="#000" opacity=".12"/>`).join("")}
${[[.12, .07, .2, "#3e8fd0"], [.32, .1, .16, "#e6e2d8"], [.55, .08, .2, "#e2645c"], [.75, .1, .14, "#7fbf5a"]].map(([a, w, hh, col]) => `<rect x="${f(X + W * a)}" y="${f(sh[0] - Hh * hh)}" width="${f(W * w)}" height="${f(Hh * hh)}" rx="1" fill="${col}"/>`).join("")}
${[[.1, .2, "#f0c24a"], [.4, .26, "#c96f3a"], [.72, .16, "#9fd36b"]].map(([a, w, col]) => `<rect x="${f(X + W * a)}" y="${f(sh[1] - Hh * .1)}" width="${f(W * w)}" height="${f(Hh * .1)}" rx="2" fill="${col}"/>`).join("")}
${[[.12, "#f6f2ea"], [.36, "#e6a35c"], [.62, "#d94f4f"]].map(([a, col]) => `<rect x="${f(X + W * a)}" y="${f(sh[2] - Hh * .12)}" width="${f(W * .2)}" height="${f(Hh * .12)}" rx="1" fill="${col}"/>`).join("")}
<rect x="${f(X + 1.5)}" y="${f(Y + 1.5)}" width="${f(W - 3)}" height="${f(Hh * .2)}" fill="${x.url("warm")}" opacity=".6"/></g>`;
    } else s += `<rect x="${f(X + 1.5)}" y="${f(Y + 1.5)}" width="${f(W - 3)}" height="${f(Hh - 3)}" rx="2" fill="${x.url("dark")}"/>`;
    return s + `<rect x="${f(X)}" y="${f(Y)}" width="${f(W)}" height="${f(Hh)}" rx="3" fill="${x.url("glass")}"/><rect x="${f(X)}" y="${f(Y)}" width="${f(W)}" height="${f(Hh)}" rx="3" fill="none" stroke="#9aa1a9" stroke-opacity=".6" stroke-width=".8"/>`;
  }
  function tdisp(x, X, Y) {
    const on = x.on, c = on ? "#bfe4ff" : "#2c3038";
    return `<rect x="${X}" y="${Y}" width="14" height="5" rx="1" fill="#0d0e12"/><rect x="${X + 1.6}" y="${Y + 1.6}" width="4" height="1.8" rx=".5" fill="${c}"/><rect x="${X + 7}" y="${Y + 1.6}" width="5" height="1.8" rx=".5" fill="${c}"/>`;
  }
  const floorGlow = (x, cx, w) => x.on ? `<ellipse cx="${cx}" cy="176" rx="${w}" ry="3" fill="${x.url("warm")}" opacity="${(.25 * x.B).toFixed(2)}"/>` : "";

  function french(x, X, Y, W, Hh, topF, lower, opt) {
    opt = opt || {};
    const g = 1.3, tH = Hh * topF, hw = (W - g) / 2; let s = "";
    s += door(x, X, Y, hw, tH, opt.glass) + door(x, X + hw + g, Y, hw, tH, opt.glass) + seam(x, X + hw + .65, Y + 2, X + hw + .65, Y + tH - 2);
    let y = Y + tH + g; const rest = Hh - tH - g * lower.length;
    lower.forEach(([fr, split], i) => { const hh = rest * fr;
      if (split) s += door(x, X, y, hw, hh, opt.glass) + door(x, X + hw + g, y, hw, hh, opt.glass);
      else s += door(x, X, y, W, hh, opt.glass);
      if (opt.handle === "bar") s += split ? vbar(x, X + hw - 5, y + 4, y + hh * .5) + vbar(x, X + hw + g + 5, y + 4, y + hh * .5) : hbar(x, X + W * .2, X + W * .8, y + 6);
      else if (opt.handle === "pocket") s += split ? pocket(x, X + hw - 3, y + 3, y + Math.min(hh * .45, 26)) + pocket(x, X + hw + g + 3, y + 3, y + Math.min(hh * .45, 26)) : groove(X, W, y + 2);
      else s += groove(X, W, y + 2);
      y += hh + g; });
    if (opt.handle === "bar") s += vbar(x, X + hw - 5, Y + tH * .25, Y + tH * .92) + vbar(x, X + hw + g + 5, Y + tH * .25, Y + tH * .92);
    else if (opt.handle === "pocket") s += pocket(x, X + hw - 3, Y + tH * .4, Y + tH - 3) + pocket(x, X + hw + g + 3, Y + tH * .4, Y + tH - 3);
    return { s, hw, tH, g };
  }

  // ---------- (parts) the readouts, the lit inside, a door swung open, a drawer pulled out (from the doors pilot) ----------
  // 7-segment digits (as habitats.js)
  const SEG = { 0: "abcdef", 1: "bc", 2: "abged", 3: "abgcd", 4: "fgbc", 5: "afgcd", 6: "afgecd", 7: "abc", 8: "abcdefg", 9: "abcdfg", "-": "g", " ": "" };
  function digits(str, x, y, s, col) {
    const w = s * .52, t = Math.max(.7, s * .14); let out = "", X = x;
    String(str).split("").forEach((ch) => {
      const sg = { a: [X + t * .6, y, X + w - t * .6, y], b: [X + w, y + t * .6, X + w, y + s / 2 - t * .5], c: [X + w, y + s / 2 + t * .5, X + w, y + s - t * .6],
        d: [X + t * .6, y + s, X + w - t * .6, y + s], e: [X, y + s / 2 + t * .5, X, y + s - t * .6], f: [X, y + t * .6, X, y + s / 2 - t * .5], g: [X + t * .6, y + s / 2, X + w - t * .6, y + s / 2] };
      const on = SEG[ch] || "";
      for (const k in sg) { if (on.indexOf(k) < 0) continue; const q = sg[k]; out += `<path d="M${f(q[0])} ${f(q[1])}L${f(q[2])} ${f(q[3])}" stroke="${col}" stroke-width="${f(t)}" stroke-linecap="round"/>`; }
      X += w + t * 2.2;
    });
    return out;
  }
  const dw = (str, s) => String(str).length * (s * .52 + Math.max(.7, s * .14) * 2.2);
  const FOK = [33, 40], ZOK = [-8, 5];
  const tcol = (t, ok) => (t < ok[0] - 3 || t > ok[1] + 6 ? "#ff6b6b" : t < ok[0] || t > ok[1] ? "#ffb547" : "#bfe4ff");
  const deg = (X, Y, col) => `<circle cx="${f(X)}" cy="${f(Y)}" r=".75" fill="none" stroke="${col}" stroke-width=".5"/>`;
  const flake = (X, Y, col) => `<path d="M${f(X - 1.4)} ${f(Y)}H${f(X + 1.4)}M${f(X - .7)} ${f(Y - 1.2)}L${f(X + .7)} ${f(Y + 1.2)}M${f(X + .7)} ${f(Y - 1.2)}L${f(X - .7)} ${f(Y + 1.2)}" stroke="${col}" stroke-width=".45"/>`;
  // the door's readout: the fridge's temperature, then the freezer's (a snowflake marks it). A reading left out = blank;
  // a Device Image with no readings shows today's two display bars while running
  function temps(x, X, Y, W) {
    const a = x.val("temp"), b = x.val("ftemp");
    let s = `<rect x="${f(X)}" y="${f(Y)}" width="${f(W)}" height="9" rx="1.6" fill="#0b0d11"/><rect x="${f(X + .4)}" y="${f(Y + .4)}" width="${f(W - .8)}" height="8.2" rx="1.3" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width=".5"/>`;
    if (a == null && b == null) return s + (!x.mf && x.on ? `<rect x="${f(X + 2)}" y="${f(Y + 3.6)}" width="${f(W * .3)}" height="1.8" rx=".5" fill="#bfe4ff"/><rect x="${f(X + W * .55)}" y="${f(Y + 3.6)}" width="${f(W * .32)}" height="1.8" rx=".5" fill="#bfe4ff"/>` : "");
    const half = W / 2;
    if (a != null) { const c = tcol(a, FOK), w = dw(a, 5); s += digits(a, X + half / 2 - w / 2, Y + 2, 5, c) + deg(X + half / 2 + w / 2 + .3, Y + 2.6, c); }
    if (b != null) { const c = tcol(b, ZOK), w = dw(b, 5); s += flake(X + half + 2, Y + 4.5, "#bfe4ff") + digits(b, X + half + 4.4 + (half - 6 - w) / 2, Y + 2, 5, c); }
    return s;
  }

  // the food: bottles, cartons, jars, fruit and tubs on the shelves; bags and boxes in a freezer
  const FOOD = [["#f6f4ee", "c"], ["#f0a33f", "b"], ["#e2645c", "j"], ["#7fbf5a", "o"], ["#5aa0e6", "k"], ["#f0c24a", "j"], ["#c96f3a", "k"], ["#9b7ae0", "b"], ["#e6e2d8", "k"], ["#3fbf8f", "b"], ["#ff8a5c", "o"]];
  function item(col, sh, ix, base, iw, ih) {
    const iy = base - ih, dk = H.shade(col, -.28);
    if (sh === "b") return `<rect x="${f(ix)}" y="${f(iy + ih * .34)}" width="${f(iw)}" height="${f(ih * .66)}" rx="${f(iw * .3)}" fill="${col}"/><rect x="${f(ix + iw * .3)}" y="${f(iy + ih * .1)}" width="${f(iw * .4)}" height="${f(ih * .28)}" fill="${col}"/><rect x="${f(ix + iw * .26)}" y="${f(iy)}" width="${f(iw * .48)}" height="${f(ih * .12)}" fill="${dk}"/><rect x="${f(ix + iw * .14)}" y="${f(iy + ih * .42)}" width="${f(iw * .18)}" height="${f(ih * .48)}" fill="#fff" opacity=".35"/>`;
    if (sh === "c") return `<path d="M${f(ix)} ${f(iy + ih * .22)}L${f(ix + iw / 2)} ${f(iy)}L${f(ix + iw)} ${f(iy + ih * .22)}Z" fill="${dk}"/><rect x="${f(ix)}" y="${f(iy + ih * .22)}" width="${f(iw)}" height="${f(ih * .78)}" fill="${col}"/><rect x="${f(ix)}" y="${f(iy + ih * .5)}" width="${f(iw)}" height="${f(ih * .16)}" fill="#5aa0e6"/>`;
    if (sh === "j") return `<rect x="${f(ix)}" y="${f(iy + ih * .2)}" width="${f(iw)}" height="${f(ih * .8)}" rx="${f(iw * .18)}" fill="${col}"/><rect x="${f(ix - .3)}" y="${f(iy)}" width="${f(iw + .6)}" height="${f(ih * .22)}" rx=".5" fill="#c9ced4"/><rect x="${f(ix + iw * .15)}" y="${f(iy + ih * .4)}" width="${f(iw * .2)}" height="${f(ih * .45)}" fill="#fff" opacity=".35"/>`;
    if (sh === "o") { const r = iw / 2; return `<circle cx="${f(ix + r)}" cy="${f(base - r)}" r="${f(r)}" fill="${col}"/><circle cx="${f(ix + r * 2.1)}" cy="${f(base - r * .8)}" r="${f(r * .8)}" fill="${H.shade(col, -.12)}"/><circle cx="${f(ix + r * .7)}" cy="${f(base - r * 1.3)}" r="${f(r * .3)}" fill="#fff" opacity=".35"/>`; }
    if (sh === "bag") return `<path d="M${f(ix)} ${f(base)}V${f(iy + 2)}Q${f(ix + iw / 2)} ${f(iy - 1.4)} ${f(ix + iw)} ${f(iy + 2)}V${f(base)}Z" fill="${col}"/><path d="M${f(ix + 1)} ${f(iy + 2.4)}H${f(ix + iw - 1)}" stroke="${dk}" stroke-width=".6"/><rect x="${f(ix + iw * .2)}" y="${f(iy + ih * .45)}" width="${f(iw * .6)}" height="${f(ih * .25)}" rx=".6" fill="#fff" opacity=".45"/>`;
    return `<rect x="${f(ix)}" y="${f(iy)}" width="${f(iw)}" height="${f(ih)}" rx=".6" fill="${col}"/><rect x="${f(ix)}" y="${f(iy)}" width="${f(iw)}" height="${f(Math.min(1.6, ih * .2))}" fill="${dk}"/>`;
  }
  function shelfFood(x0, w, base, hm, seed) {
    const n = Math.max(2, Math.round(w / 10)), cw = w / n; let s = "";
    for (let i = 0; i < n; i++) {
      const [col, sh] = FOOD[(seed * 5 + i * 3) % FOOD.length];
      const iw = cw * (sh === "b" ? .44 : sh === "o" ? .42 : .7), ih = hm * (sh === "b" ? .95 : sh === "c" ? .85 : .5 + ((seed + i) % 3) * .15);
      s += item(col, sh, x0 + cw * (i + .5) - iw / 2, base, iw, sh === "o" ? iw : ih);
    }
    return s;
  }
  const FZ = [["#dff1ff", "bag"], ["#5aa0e6", "k"], ["#e2645c", "k"], ["#7fbf5a", "bag"], ["#f0c24a", "k"], ["#e6e2d8", "k"], ["#c96f3a", "bag"]];
  function frozen(x0, w, base, hm, seed) {
    const n = Math.max(2, Math.round(w / 12)), cw = w / n; let s = "";
    for (let i = 0; i < n; i++) { const [col, sh] = FZ[(seed * 3 + i * 2) % FZ.length], iw = cw * .82, ih = hm * (.62 + ((seed + i) % 3) * .16); s += item(col, sh, x0 + cw * (i + .5) - iw / 2, base, iw, ih); }
    return s + `<rect x="${f(x0)}" y="${f(base - hm)}" width="${f(w)}" height="${f(hm)}" fill="#e6f4ff" opacity=".12"/>`;
  }
  function iceBin(x0, w, base, hm) {
    const bw = Math.min(w, 34), bx = x0 + (w - bw) / 2, bh = Math.min(hm, 13); let s = "";
    for (let r = 0; r < 2; r++) for (let c = 0; c < Math.floor(bw / 4.2); c++) s += `<rect x="${f(bx + 1.6 + c * 4.2 + (r % 2) * 2)}" y="${f(base - bh * .62 + r * 2.6 - 2)}" width="3.2" height="3" rx=".8" fill="#d6f0ff" stroke="#9cc8e6" stroke-width=".35"/>`;
    return s + `<path d="M${f(bx)} ${f(base - bh * .6)}H${f(bx + bw)}L${f(bx + bw - 1.5)} ${f(base)}H${f(bx + 1.5)}Z" fill="#ffffff" fill-opacity=".42" stroke="#ffffff" stroke-opacity=".85" stroke-width=".6"/>`;
  }
  function crisper(x0, w, top, base) {
    const hw = (w - 2) / 2, hh = base - top; let s = "";
    [0, 1].forEach((i) => {
      const bx = x0 + i * (hw + 2);
      s += [.22, .5, .78].map((a, j) => `<ellipse cx="${f(bx + hw * a)}" cy="${f(base - hh * .34)}" rx="${f(hw * .17)}" ry="${f(hh * .27)}" fill="${i ? ["#ff8a5c", "#e2645c", "#f0a33f"][j] : ["#6fb84a", "#3f8a3a", "#8fd16a"][j]}"/>`).join("");
      s += `<rect x="${f(bx)}" y="${f(top)}" width="${f(hw)}" height="${f(hh)}" rx="1.2" fill="#ffffff" fill-opacity=".36" stroke="#ffffff" stroke-opacity=".85" stroke-width=".7"/><rect x="${f(bx + hw * .3)}" y="${f(top + 1.2)}" width="${f(hw * .4)}" height="1.6" rx=".8" fill="#9aa1a9" opacity=".7"/>`;
    });
    return s;
  }

  // the inside of a compartment, seen through an open door: the liner in perspective, glass shelves (wire in a freezer), the
  // food, crisper bins at the bottom (fridge) or an ice bin (freezer); lit warm white when its light is on, dim when it is off.
  // cp: the fridge's temperature panel at the top (a number, null = blank, undefined = none)
  function cavity(x, X, Y, W, Hh, kind, lit, cp, ice) {
    const d = Math.min(10, W * .14, Hh * .12), bx = X + d, by = Y + d * .75, bw = W - 2 * d, bh = Hh - d * 1.6, L = (k) => lerp(Y + Hh * k, by + bh * k, .5);
    let s = `<rect x="${f(X)}" y="${f(Y)}" width="${f(W)}" height="${f(Hh)}" fill="#cfc8b8"/><rect x="${f(bx)}" y="${f(by)}" width="${f(bw)}" height="${f(bh)}" fill="${x.url("lin")}"/>` +
      `<path d="M${f(X)} ${f(Y)}H${f(X + W)}L${f(bx + bw)} ${f(by)}H${f(bx)}Z" fill="#fbf8f1"/><path d="M${f(X)} ${f(Y)}L${f(bx)} ${f(by)}V${f(by + bh)}L${f(X)} ${f(Y + Hh)}Z" fill="#e6e0d2"/>` +
      `<path d="M${f(X + W)} ${f(Y)}L${f(bx + bw)} ${f(by)}V${f(by + bh)}L${f(X + W)} ${f(Y + Hh)}Z" fill="#ddd6c7"/><path d="M${f(X)} ${f(Y + Hh)}L${f(bx)} ${f(by + bh)}H${f(bx + bw)}L${f(X + W)} ${f(Y + Hh)}Z" fill="#cfc8b8"/>`;
    const fz = kind === "fz", ks = fz ? (Hh > 90 ? [.3, .56, .8] : Hh > 50 ? [.52] : []) : Hh > 90 ? [.28, .52, .74] : Hh > 50 ? [.5] : [];
    ks.forEach((k) => { s += `<path d="M${f(X)} ${f(Y + Hh * k)}H${f(X + W)}L${f(bx + bw)} ${f(by + bh * k)}H${f(bx)}Z" fill="#ffffff" fill-opacity="${fz ? .16 : .32}"/>`; });
    const bands = [0].concat(ks, [1]), x0 = lerp(X, bx, .55) + 1, w0 = W - 2 * (x0 - X);
    for (let i = 0; i < bands.length - 1; i++) {
      const k0 = bands[i], k1 = bands[i + 1], top = L(k0) + (i ? 1.5 : 5), base = k1 < 1 ? L(k1) : lerp(Y + Hh, by + bh, .55), hm = Math.max(3, base - top - 1);
      if (fz) s += i === 0 && ice ? iceBin(x0, w0, base, hm) : frozen(x0, w0, base, Math.min(hm * .8, 14), i + 1);
      else if (i === bands.length - 2 && Hh > 90) s += crisper(x0, w0, base - Math.min(hm * .85, 22), base);
      else s += shelfFood(x0, w0, base, Math.min(hm * .85, 17), i + (W > 60 ? 2 : 0) + (X > 90 ? 1 : 0));
    }
    ks.forEach((k) => { const a = Y + Hh * k;
      s += fz ? `<path d="M${f(X + .5)} ${f(a)}H${f(X + W - .5)}" stroke="#c9ced4" stroke-width="1.2"/>` + [.25, .5, .75].map((t) => `<path d="M${f(lerp(X, X + W, t))} ${f(a)}L${f(lerp(bx, bx + bw, t))} ${f(by + bh * k)}" stroke="#c9ced4" stroke-width=".45"/>`).join("")
        : `<path d="M${f(X + .5)} ${f(a)}H${f(X + W - .5)}" stroke="#ffffff" stroke-width="1"/><path d="M${f(X + .5)} ${f(a + .9)}H${f(X + W - .5)}" stroke="#8d97a3" stroke-opacity=".5" stroke-width=".5"/>`; });
    if (cp !== undefined) { const pw = Math.min(24, W * .5), px = X + W / 2 - pw / 2;
      s += `<rect x="${f(px)}" y="${f(Y + 1)}" width="${f(pw)}" height="5.6" rx="1" fill="#1b1e24"/>` + (cp != null ? (() => { const c = tcol(cp, FOK), w = dw(cp, 3.6); return digits(cp, px + pw / 2 - w / 2, Y + 2, 3.6, c) + deg(px + pw / 2 + w / 2 + .3, Y + 2.4, c); })() : ""); }
    s += lit ? `<ellipse cx="${f(X + W / 2)}" cy="${f(Y + 2)}" rx="${f(W * .5)}" ry="${f(Math.min(Hh * .5, 46))}" fill="${x.url("glow")}"/>` : `<rect x="${f(X)}" y="${f(Y)}" width="${f(W)}" height="${f(Hh)}" fill="#090c13" opacity=".66"/>`;
    const cid = x.id("cv" + Math.round(X) + "-" + Math.round(Y));
    return `<clipPath id="${cid}"><rect x="${f(X)}" y="${f(Y)}" width="${f(W)}" height="${f(Hh)}"/></clipPath><g clip-path="url(#${cid})">${s}</g>` + `<rect x="${f(X + .4)}" y="${f(Y + .4)}" width="${f(W - .8)}" height="${f(Hh - .8)}" fill="none" stroke="#8f969e" stroke-width=".8"/>`;
  }
  // a closed door's edge throws a soft shadow into the open compartment beside it (dir: the side the shadow falls)
  const edgeShade = (X, Y, Hh, dir) => `<rect x="${f(dir > 0 ? X : X - 3)}" y="${f(Y)}" width="3" height="${f(Hh)}" fill="#000" opacity=".2"/>`;

  // a door swung open about its hinge (hx), seen from the front: its inside face (the molded liner, door bins with bottles,
  // the gasket) beside the opening, its free edge nearer and so taller; dir -1 = opens to the left, +1 = to the right
  function swing(x, hx, Y, Hh, ow, dir, lit, opt) {
    opt = opt || {};
    const e = Math.min(4.5, Hh * .04), ox = hx + dir * ow, X = (t) => hx + dir * ow * t, yT = (t) => Y - e * t, yB = (t) => Y + Hh + e * t;
    const pt = (t, k) => `${f(X(t))} ${f(lerp(yT(t), yB(t), k))}`;
    const P4 = (t0, t1, k0, k1) => `M${pt(t0, k0)}L${pt(t1, k0)}L${pt(t1, k1)}L${pt(t0, k1)}Z`;
    let s = (Y + Hh > 168 ? `<ellipse cx="${f(X(.55))}" cy="176" rx="${f(ow * .7)}" ry="2.4" fill="${x.url("sh")}"/>` : "") +
      `<path d="${P4(0, 1, 0, 1)}" fill="${x.url("din")}"/><path d="${P4(.13, .87, .045, .955)}" fill="#fff" fill-opacity=".3"/>` +
      `<path d="${P4(.06, .94, .022, .978)}" fill="none" stroke="#a3a9b1" stroke-width="1.1"/>`;
    if (opt.chute) s += `<path d="${P4(.18, .82, .24, .44)}" fill="#cfc9bc"/><path d="${P4(.3, .7, .29, .4)}" fill="#2c3038"/>`;
    const bins = Hh > 100 ? (opt.chute ? [.6, .82] : [.2, .42, .64, .86]) : Hh > 55 ? [.32, .64, .9] : [.45, .88];
    bins.forEach((k, i) => {
      const hb = Math.min(.07, 7 / Hh);
      [.27, .5, .73].forEach((t, j) => {
        const [col, sh] = FOOD[(i * 3 + j * 2 + (opt.seed || 0)) % FOOD.length], cx = X(t), yb = lerp(yT(t), yB(t), k + hb * .7), bh = Math.min(Hh * .1, 10) * (sh === "b" ? 1.15 : .8), bw = ow * .15;
        s += sh === "b" ? `<rect x="${f(cx - bw / 2)}" y="${f(yb - bh * .72)}" width="${f(bw)}" height="${f(bh * .72)}" rx=".7" fill="${col}"/><rect x="${f(cx - bw * .2)}" y="${f(yb - bh)}" width="${f(bw * .4)}" height="${f(bh * .3)}" fill="${H.shade(col, -.3)}"/>`
          : `<rect x="${f(cx - bw / 2)}" y="${f(yb - bh * .7)}" width="${f(bw)}" height="${f(bh * .7)}" rx=".6" fill="${col}"/>`;
      });
      s += `<path d="${P4(.1, .9, k, k + hb)}" fill="${x.url("bin")}" stroke="#fff" stroke-opacity=".85" stroke-width=".6"/>`;
    });
    if (!lit) s += `<path d="${P4(0, 1, 0, 1)}" fill="#090c13" opacity=".42"/>`;
    // the free edge: the door's thickness in its finish
    return s + `<path d="M${f(ox)} ${f(Y - e)}L${f(ox + dir * 3)} ${f(Y - e + .8)}V${f(Y + Hh + e - .8)}L${f(ox)} ${f(Y + Hh + e)}Z" fill="${x.url("f")}" stroke="#000" stroke-opacity=".3" stroke-width=".4"/>`;
  }

  // a drawer pulled out, seen from the front and a little above: the empty opening, the bin from above with the food in it,
  // the drawer front nearer and lower. kind "fz" = frozen food, "fx" = a flex drawer (drinks, deli)
  function drawerOut(x, X, Y, W, Hh, lit, kind, handle, glass) {
    const dy = Math.min(17, Hh * .38), gx = 3.5, fx = X - gx, fw = W + 2 * gx, fy = Y + dy, fh = Math.min(Hh + 1.5, 198 - fy);
    const bk = Y + 3.5, fr = fy + .6, L0 = X + 5, R0 = X + W - 5, L1 = fx + 2.5, R1 = fx + fw - 2.5;
    const bin = `M${f(L0)} ${f(bk)}H${f(R0)}L${f(R1)} ${f(fr)}H${f(L1)}Z`;
    let s = `<rect x="${f(X)}" y="${f(Y)}" width="${f(W)}" height="${f(Hh)}" fill="#101216"/><path d="M${f(X)} ${f(Y)}H${f(X + W)}L${f(R0)} ${f(bk)}H${f(L0)}Z" fill="#2b2f37"/>` +
      `<path d="${bin}" fill="${x.url("fzb")}"/><path d="M${f(L0)} ${f(bk)}H${f(R0)}L${f(lerp(R0, R1, .3))} ${f(lerp(bk, fr, .3))}H${f(lerp(L0, L1, .3))}Z" fill="#b9c4cf"/>`;
    const iw = R1 - L1 - 8, base = fr - .4, hm = (fr - bk) * .9;
    s += kind === "fz" ? frozen(L1 + 4, iw, base, hm, 2) : shelfFood(L1 + 4, iw, base, hm, 4);
    s += `<path d="M${f(L1)} ${f(fr)}L${f(L0)} ${f(bk)}H${f(R0)}L${f(R1)} ${f(fr)}" fill="none" stroke="#fff" stroke-opacity=".85" stroke-width=".8"/>`;
    s += lit ? `<ellipse cx="${f(X + W / 2)}" cy="${f(bk)}" rx="${f(W * .5)}" ry="${f(dy)}" fill="${x.url("glow")}" opacity=".7"/>` : `<path d="${bin}" fill="#090c13" opacity=".58"/>`;
    s += `<ellipse cx="${f(X + W / 2)}" cy="${f(Math.min(fy + fh + 1.2, 199))}" rx="${f(fw / 2 + 4)}" ry="2.6" fill="${x.url("sh")}"/>` + door(x, fx, fy, fw, fh, glass) +
      (handle === "bar" ? hbar(x, fx + fw * .2, fx + fw * .8, fy + 6) : groove(fx, fw, fy + 2));
    return s;
  }
  // the warm light spilling onto the floor in front of an open, lit compartment
  const spill = (x, cx, w) => `<ellipse cx="${f(cx)}" cy="180" rx="${f(w)}" ry="6" fill="${x.url("warm")}" opacity=".55"/>`;

  // ---------- (parts) the open looks, drawn over the closed fridge ----------
  // A drawing lists its compartments: { k: "fr" | "fz", r: [X, Y, W, H], ice, cp, nb, doors: [{ id, r, t, glass, face, deco, chute, handle }] }.
  // t: "L" = hinged on its left edge, "R" = on its right edge, "D" = a drawer that pulls out. A compartment with any door open
  // shows its lit inside (cavity), its still-closed doors are drawn again over it (face / deco = the door's own look), and
  // every open door swings out (swing) or pulls out (drawerOut). nb: [door id, x, dir] = the closed neighbor's edge shadow.
  // Nothing is open = nothing is added: the closed drawing is exactly today's.
  function openLayer(x, comps) {
    const lit = x.lit(true);
    let s = "", sw = "", any = false; const dr = [];
    comps.forEach((c, ci) => {
      const op = c.doors.filter((d) => x.open(d.id));
      if (!op.length) return;
      any = true;
      if (c.doors[0].t === "D") { const d = c.doors[0]; dr.push([c.r[1], () => drawerOut(x, c.r[0], c.r[1], c.r[2], c.r[3], lit, c.k === "fz" ? "fz" : "fx", d.handle, d.glass)]); return; }
      s += cavity(x, c.r[0], c.r[1], c.r[2], c.r[3], c.k, lit, c.cp ? x.val(c.k === "fz" ? "ftemp" : "temp") : undefined, c.ice);
      if (c.nb && !x.open(c.nb[0])) s += edgeShade(c.nb[1], c.r[1], c.r[3], c.nb[2]);
      c.doors.forEach((d, i) => {
        const [dx, dy, dw, dh] = d.r;
        if (!x.open(d.id)) s += (d.face ? d.face(x) : door(x, dx, dy, dw, dh, d.glass) + (d.deco ? d.deco(x) : "")) + (d.t === "L" ? edgeShade(dx + dw, dy, dh, 1) : edgeShade(dx, dy, dh, -1));
        else sw += swing(x, d.t === "L" ? dx : dx + dw, dy, dh, dw * .42, d.t === "L" ? -1 : 1, lit, { chute: d.chute, seed: (ci * 3 + i * 2 + 1) % 9 });
      });
    });
    dr.sort((a, b) => b[0] - a[0]).forEach((d) => { s += d[1](); });
    return s + sw + (any && lit ? spill(x, 100, 34) : "");
  }
  // the fridge + freezer readout on the door, only when a temperature part gives a reading (tp: [X, Y, W, door ids that hide it])
  function tempLayer(x, tp) {
    if (!tp || (x.val("temp") == null && x.val("ftemp") == null)) return "";
    if ((tp[3] || []).some((id) => x.open(id))) return "";
    return temps(x, tp[0], tp[1], tp[2]);
  }
  const out = (x, s, comps, tp) => svg(x, s + openLayer(x, comps) + tempLayer(x, tp));

  // the part list: doors and drawers (contacts), the inside light, the drawing's own switches, the temperatures
  const D = (id, name) => ({ id, name, type: "contact" });
  const LIGHT = { id: "light", name: "Inside light", type: "switch" };
  const TEMP = { id: "temp", name: "Fridge temperature", type: "value", unit: "°F", min: 28, max: 50, def: 37 };
  const FTEMP = { id: "ftemp", name: "Freezer temperature", type: "value", unit: "°F", min: -10, max: 25, def: 0 };
  const PL = (doors, own) => doors.concat([LIGHT], own || [], [TEMP, FTEMP]);
  // a French-door top (two doors over one compartment) and the rows below it, as french() lays them out
  function fgeo(X, Y, W, Hh, topF, lower) {
    const g = 1.3, tH = Hh * topF, hw = (W - g) / 2, rx = X + hw + g, rows = []; let y = Y + tH + g; const rest = Hh - tH - g * lower.length;
    lower.forEach(([fr]) => { const hh = rest * fr; rows.push([y, hh]); y += hh + g; });
    return { g, tH, hw, rx, rows };
  }
  const top2 = (X, Y, G, glass, decoL, decoR, chute) => ({ k: "fr", cp: true, r: [X, Y, G.hw * 2 + G.g, G.tH], doors: [
    { id: "tl", t: "L", r: [X, Y, G.hw, G.tH], glass, deco: decoL, chute }, { id: "tr", t: "R", r: [G.rx, Y, G.hw, G.tH], glass, deco: decoR }] });
  const drw = (id, X, y, W, hh, k, handle, glass) => ({ k, r: [X, y, W, hh], doors: [{ id, t: "D", r: [X, y, W, hh], handle, glass }] });
  const one = (id, k, r, t, o2) => Object.assign({ k, r, doors: [{ id, t, r, glass: o2 && o2.glass, chute: o2 && o2.chute }] }, o2 || {});

  const WATER = { id: "ice", name: "Ice maker" };
  const SCR = { id: "screen", name: "Screen" }, INSTA = { id: "insta", name: "Knock-glass French door" };
  const FR4 = [D("tl", "Left door"), D("tr", "Right door")];
  const base = (o) => Object.assign({ picker: true, colorLabel: "Finish" }, o);
  const kit = (o, X, W, extra, kopt) => { const x = ctx(o); return [x, kitchen(x, X, W, kopt)]; };

  const icons = [
    base({ id: "4-door-flex-with-screen", name: "4-door flex with screen", colors: first(MATW, PANELCOLORS), parts: PL([D("tl", "Top left door"), D("tr", "Top right door"), D("bl", "Bottom left door"), D("br", "Bottom right door")], [SCR]), render(o) {
      const [x, k] = kit(o, 54, 92), X = 54, Y = 22, W = 92, Hh = 152;
      const F = french(x, X, Y, W, Hh, .55, [[1, true]], { handle: "pocket", glass: true }), G = fgeo(X, Y, W, Hh, .55, [[1, true]]), [by, bH] = G.rows[0];
      const s = k + body(x, X, Y, W, Hh) + F.s + screen(x, X + F.hw + F.g + 7, Y + 10, F.hw - 13, F.tH * .58) + floorGlow(x, 100, 40);
      return out(x, s, [top2(X, Y, G, true, (x) => pocket(x, X + G.hw - 3, Y + G.tH * .4, Y + G.tH - 3), (x) => pocket(x, G.rx + 3, Y + G.tH * .4, Y + G.tH - 3) + screen(x, G.rx + 7, Y + 10, G.hw - 13, G.tH * .58)),
        one("bl", "fz", [X, by, G.hw, bH], "L", { glass: true }), one("br", "fz", [G.rx, by, G.hw, bH], "R", { glass: true, ice: true })], [X + 6, Y + 5, 26, ["tl"]]);
    } }),

    base({ id: "4-door-flex-panels", name: "4-door flex panels", colors: first(NAVY, PANELCOLORS), parts: PL([D("tl", "Top left door"), D("tr", "Top right door"), D("bl", "Bottom left door"), D("br", "Bottom right door")]), render(o) {
      const [x, k] = kit(o, 54, 92), X = 54, Y = 22, W = 92, Hh = 152;
      const F = french(x, X, Y, W, Hh, .55, [[1, true]], { handle: "pocket", glass: true }), G = fgeo(X, Y, W, Hh, .55, [[1, true]]), [by, bH] = G.rows[0];
      const s = k + body(x, X, Y, W, Hh) + F.s + (x.on ? `<rect x="${X + 6}" y="${Y + 4}" width="8" height="2" rx="1" fill="#bfe4ff" opacity="${(.4 + .6 * x.B).toFixed(2)}"/>` : "") + floorGlow(x, 100, 40);
      return out(x, s, [top2(X, Y, G, true, (x) => pocket(x, X + G.hw - 3, Y + G.tH * .4, Y + G.tH - 3), (x) => pocket(x, G.rx + 3, Y + G.tH * .4, Y + G.tH - 3)),
        one("bl", "fz", [X, by, G.hw, bH], "L", { glass: true }), one("br", "fz", [G.rx, by, G.hw, bH], "R", { glass: true, ice: true })], [X + 6, Y + 3, 26, ["tl"]]);
    } }),

    base({ id: "3-door-panel-fridge", name: "3-door panel fridge", colors: first(SAGE, PANELCOLORS), parts: PL(FR4.concat([D("dz", "Freezer drawer")]), [WATER]), render(o) {
      const [x, k] = kit(o, 54, 92), X = 54, Y = 22, W = 92, Hh = 152;
      const F = french(x, X, Y, W, Hh, .62, [[1, false]], { handle: "pocket", glass: true }), G = fgeo(X, Y, W, Hh, .62, [[1, false]]), [by, bH] = G.rows[0];
      const s = k + body(x, X, Y, W, Hh) + F.s + dispenser(x, X + 9, Y + 40, 26, 30) + floorGlow(x, 100, 40);
      return out(x, s, [top2(X, Y, G, true, (x) => pocket(x, X + G.hw - 3, Y + G.tH * .4, Y + G.tH - 3) + dispenser(x, X + 9, Y + 40, 26, 30), (x) => pocket(x, G.rx + 3, Y + G.tH * .4, Y + G.tH - 3), true),
        drw("dz", X, by, W, bH, "fz", "groove", true)], [G.rx + 9, Y + 12, 27, ["tr"]]);
    } }),

    base({ id: "side-by-side-with-screen", name: "Side-by-side with screen", colors: first(SS, STEEL), parts: PL([D("dl", "Left door (freezer)"), D("dr", "Right door (fridge)")], [SCR, WATER]), render(o) {
      const [x, k] = kit(o, 52, 96), X = 52, Y = 20, W = 96, Hh = 154, lw = 43, g = 1.3, rx = X + lw + g;
      const s = k + body(x, X, Y, W, Hh) + door(x, X, Y, lw, Hh) + door(x, X + lw + g, Y, W - lw - g, Hh) + seam(x, X + lw + .65, Y + 2, X + lw + .65, Y + Hh - 2) +
        dispenser(x, X + 8, Y + 44, 26, 32) + screen(x, X + lw + 8, Y + 14, 38, 62) + vbar(x, X + lw - 5, Y + 34, Y + 124) + vbar(x, X + lw + g + 5, Y + 34, Y + 124) + floorGlow(x, 100, 42);
      return out(x, s, [one("dl", "fz", [X, Y, lw, Hh], "L", { ice: true, chute: true, nb: ["dr", rx, -1] }), one("dr", "fr", [rx, Y, W - lw - g, Hh], "R", { cp: true, nb: ["dl", X + lw, 1] })], [X + lw + 8, Y + 82, 38, ["dr"]]);
    } }),

    base({ id: "panel-bottom-freezer", name: "Panel bottom freezer", colors: first(PINK, PANELCOLORS), parts: PL([D("fd", "Fridge door"), D("dz", "Freezer drawer")]), render(o) {
      const [x, k] = kit(o, 62, 76), X = 62, Y = 22, W = 76, Hh = 152, tH = 98, g = 1.3;
      const s = k + body(x, X, Y, W, Hh) + door(x, X, Y, W, tH, true) + door(x, X, Y + tH + g, W, Hh - tH - g, true) + pocket(x, X + 4, Y + 40, Y + 94) + groove(X, W, Y + tH + 3) +
        seam(x, X + 2, Y + tH + .65, X + W - 2, Y + tH + .65) + floorGlow(x, 100, 34);
      return out(x, s, [one("fd", "fr", [X, Y, W, tH], "R", { glass: true, cp: true }), drw("dz", X, Y + tH + g, W, Hh - tH - g, "fz", "groove", true)], [X + W - 34, Y + 8, 28, ["fd"]]);
    } }),

    base({ id: "panel-column-pair", name: "Panel column pair", colors: first(MBLUE, PANELCOLORS), parts: PL([D("dl", "Freezer column"), D("dr", "Fridge column")]), render(o) {
      const [x, k] = kit(o, 48, 104, null, { flush: true, uppers: 18 }), X = 48, Y = 20, W = 104, cw = 51.5, g = 1;
      const s = k + body(x, X, Y, W, 154, 0) + door(x, X, Y, cw, 154, true) + door(x, X + cw + g, Y, W - cw - g, 154, true) +
        `<rect x="${X + cw}" y="${Y}" width="${g}" height="154" fill="#0d0e12"/>` + pocket(x, X + cw - 3, Y + 50, Y + 110) + pocket(x, X + cw + g + 3, Y + 50, Y + 110) +
        (x.on ? `<rect x="${X + 6}" y="${Y + 6}" width="7" height="2" rx="1" fill="#bfe4ff" opacity="${(.4 + .6 * x.B).toFixed(2)}"/><rect x="${X + cw + 7}" y="${Y + 6}" width="7" height="2" rx="1" fill="#bfe4ff" opacity="${(.4 + .6 * x.B).toFixed(2)}"/>` : "") + floorGlow(x, 100, 46);
      return out(x, s, [one("dl", "fz", [X, Y, cw, 154], "L", { glass: true, ice: true, nb: ["dr", X + cw + g, -1] }), one("dr", "fr", [X + cw + g, Y, W - cw - g, 154], "R", { glass: true, cp: true, nb: ["dl", X + cw, 1] })], [X + cw + 7, Y + 3, 26, ["dr"]]);
    } }),

    base({ id: "knock-glass-french-door", name: "Knock-glass French door", colors: first(SS, [SS, BS, BK, WH]), parts: PL(FR4.concat([D("dz", "Freezer drawer")]), [INSTA, WATER]), render(o) {
      const [x, k] = kit(o, 54, 92), X = 54, Y = 22, W = 92, Hh = 152;
      const F = french(x, X, Y, W, Hh, .6, [[1, false]], { handle: "bar" }), G = fgeo(X, Y, W, Hh, .6, [[1, false]]), [by, bH] = G.rows[0];
      const s = k + body(x, X, Y, W, Hh) + F.s + dispenser(x, X + 9, Y + 38, 25, 30) + insta(x, X + F.hw + F.g + 9, Y + 8, F.hw - 15, F.tH * .78) + floorGlow(x, 100, 40);
      return out(x, s, [top2(X, Y, G, false, (x) => vbar(x, X + G.hw - 5, Y + G.tH * .25, Y + G.tH * .92) + dispenser(x, X + 9, Y + 38, 25, 30), (x) => vbar(x, G.rx + 5, Y + G.tH * .25, Y + G.tH * .92) + insta(x, G.rx + 9, Y + 8, G.hw - 15, G.tH * .78), true),
        drw("dz", X, by, W, bH, "fz", "bar")], [X + 9, Y + 18, 25, ["tl"]]);
    } }),

    base({ id: "round-ice-4-door", name: "Round-ice 4-door", colors: first(BS, STEEL), parts: PL(FR4.concat([D("dm", "Middle drawer"), D("dz", "Freezer drawer")]), [WATER]), render(o) {
      const [x, k] = kit(o, 54, 92), X = 54, Y = 22, W = 92, Hh = 152;
      const F = french(x, X, Y, W, Hh, .56, [[.42, false], [.58, false]], { handle: "bar" }), G = fgeo(X, Y, W, Hh, .56, [[.42, false], [.58, false]]);
      const s = k + body(x, X, Y, W, Hh) + F.s + dispenser(x, X + 9, Y + 30, 25, 30, true) + floorGlow(x, 100, 40);
      return out(x, s, [top2(X, Y, G, false, (x) => vbar(x, X + G.hw - 5, Y + G.tH * .25, Y + G.tH * .92) + dispenser(x, X + 9, Y + 30, 25, 30, true), (x) => vbar(x, G.rx + 5, Y + G.tH * .25, Y + G.tH * .92), true),
        drw("dm", X, G.rows[0][0], W, G.rows[0][1], "fx", "bar"), drw("dz", X, G.rows[1][0], W, G.rows[1][1], "fz", "bar")], [G.rx + 9, Y + 24, 27, ["tr"]]);
    } }),

    base({ id: "door-within-door-side-by", name: "Door-within-door side-by-side", colors: first(SS, STEEL), parts: PL([D("dl", "Left door (freezer)"), D("dr", "Right door (fridge)")], [WATER]), render(o) {
      const [x, k] = kit(o, 52, 96), X = 52, Y = 20, W = 96, Hh = 154, lw = 46, g = 1.3, rx = X + lw + g;
      const s = k + body(x, X, Y, W, Hh) + door(x, X, Y, lw, Hh) + door(x, X + lw + g, Y, W - lw - g, Hh) +
        `<rect x="${X + lw + 5}" y="${Y + 12}" width="${W - lw - 12}" height="70" rx="2" fill="none" stroke="#000" stroke-opacity=".35"/><path d="M${X + lw + 6} ${Y + 13} H${X + W - 8}" stroke="#fff" stroke-opacity=".3"/>` +
        dispenser(x, X + 9, Y + 44, 26, 32) + vbar(x, X + lw - 5, Y + 30, Y + 128) + vbar(x, X + lw + g + 5, Y + 30, Y + 128) + seam(x, X + lw + .65, Y + 2, X + lw + .65, Y + Hh - 2) + floorGlow(x, 100, 42);
      return out(x, s, [one("dl", "fz", [X, Y, lw, Hh], "L", { ice: true, chute: true, nb: ["dr", rx, -1] }), one("dr", "fr", [rx, Y, W - lw - g, Hh], "R", { cp: true, nb: ["dl", X + lw, 1] })], [X + lw + 9, Y + 17, 30, ["dr"]]);
    } }),

    base({ id: "color-glow-french-door", name: "Color-glow French door", colors: first(MINT, [MINT, PINK, MBLUE, BEIGE, "#c9b8e6", MATW]), parts: PL([D("tl", "Top left door"), D("tr", "Top right door"), D("bl", "Bottom left door"), D("br", "Bottom right door")], [{ id: "door", name: "Door light" }, INSTA]), render(o) {
      const x = ctx(o), k = kitchen(x, 54, 92), X = 54, Y = 22, W = 92, Hh = 152, g = 1.3, hw = (W - g) / 2, tH = 84;
      const led = x.part("door"), b = (.35 + .4 * x.B).toFixed(2);
      const panel = (px, py, pw, ph, col) => `<rect x="${f(px)}" y="${f(py)}" width="${f(pw)}" height="${f(ph)}" rx="1.4" fill="${col}"/>${led ? `<rect class="${P}mood" x="${f(px)}" y="${f(py)}" width="${f(pw)}" height="${f(ph)}" rx="1.4" fill="${H.mix(col, "#ffffff", .5)}" opacity="${b}"/>` : ""}
<rect x="${f(px)}" y="${f(py)}" width="${f(pw)}" height="${f(ph)}" rx="1.4" fill="${x.url("gloss")}"/>`;
      const cA = x.c, cB = H.mix(x.c, "#f6f4ee", .45), cC = H.shade(x.c, -.12);
      const s = k + body(x, X, Y, W, Hh) + panel(X, Y, hw, tH, cA) + panel(X + hw + g, Y, hw, tH, cB) + panel(X, Y + tH + g, hw, Hh - tH - g, cB) + panel(X + hw + g, Y + tH + g, hw, Hh - tH - g, cC) +
        insta(x, X + hw + g + 6, Y + 8, hw - 12, 56) + pocket(x, X + hw - 3, Y + 40, Y + 80) + pocket(x, X + hw + g + 3, Y + 40, Y + 80) + pocket(x, X + hw - 3, Y + tH + 4, Y + tH + 26) + pocket(x, X + hw + g + 3, Y + tH + 4, Y + tH + 26) +
        floorGlow(x, 100, 40);
      const rx = X + hw + g, by = Y + tH + g, bH = Hh - tH - g;
      return out(x, s, [{ k: "fr", cp: true, r: [X, Y, W, tH], doors: [
        { id: "tl", t: "L", r: [X, Y, hw, tH], face: () => panel(X, Y, hw, tH, cA) + pocket(x, X + hw - 3, Y + 40, Y + 80) },
        { id: "tr", t: "R", r: [rx, Y, hw, tH], face: () => panel(rx, Y, hw, tH, cB) + insta(x, rx + 6, Y + 8, hw - 12, 56) + pocket(x, rx + 3, Y + 40, Y + 80) }] },
        one("bl", "fz", [X, by, hw, bH], "L"), one("br", "fz", [rx, by, hw, bH], "R", { ice: true })], [X + 6, Y + 8, 26, ["tl"]]);
    } }),

    base({ id: "steel-top-freezer", name: "Steel top freezer", colors: first(SS, STEEL), parts: PL([D("zd", "Freezer door"), D("fd", "Fridge door")]), render(o) {
      const [x, k] = kit(o, 64, 72), X = 64, Y = 26, W = 72, Hh = 148, tH = 44, g = 1.3;
      const s = k + body(x, X, Y, W, Hh) + door(x, X, Y, W, tH) + door(x, X, Y + tH + g, W, Hh - tH - g) + pocket(x, X + 4, Y + 10, Y + 38) + pocket(x, X + 4, Y + tH + 6, Y + tH + 50) +
        seam(x, X + 2, Y + tH + .65, X + W - 2, Y + tH + .65) + floorGlow(x, 100, 32);
      return out(x, s, [one("zd", "fz", [X, Y, W, tH], "R"), one("fd", "fr", [X, Y + tH + g, W, Hh - tH - g], "R", { cp: true })], [X + W - 34, Y + tH + 8, 28, ["fd"]]);
    } }),

    base({ id: "gefrench", name: "French Dispenser", colors: first(SS, [SS, BS, BK, WH, "#2f3a44"]), parts: PL(FR4.concat([D("dz", "Freezer drawer")]), [WATER]), render(o) {
      const [x, k] = kit(o, 54, 92), X = 54, Y = 22, W = 92, Hh = 152;
      const F = french(x, X, Y, W, Hh, .6, [[1, false]], { handle: "bar" }), G = fgeo(X, Y, W, Hh, .6, [[1, false]]), [by, bH] = G.rows[0];
      const s = k + body(x, X, Y, W, Hh) + F.s + dispenser(x, X + 9, Y + 36, 27, 34) + tdisp(x, X + F.hw + F.g + 10, Y + 30) + floorGlow(x, 100, 40);
      return out(x, s, [top2(X, Y, G, false, (x) => vbar(x, X + G.hw - 5, Y + G.tH * .25, Y + G.tH * .92) + dispenser(x, X + 9, Y + 36, 27, 34), (x) => vbar(x, G.rx + 5, Y + G.tH * .25, Y + G.tH * .92) + tdisp(x, G.rx + 10, Y + 30), true),
        drw("dz", X, by, W, bH, "fz", "bar")], [G.rx + 9, Y + 28, 27, ["tr"]]);
    } }),

    base({ id: "classictop", name: "Classic Top Freezer", colors: first(WH, [WH, SS, BK, BEIGE]), parts: PL([D("zd", "Freezer door"), D("fd", "Fridge door")]), render(o) {
      const [x, k] = kit(o, 64, 70), X = 64, Y = 28, W = 70, Hh = 146, tH = 40, g = 1.3;
      const curve = (y1, y2) => `<path d="M${X + 6} ${y1} C${X + 2} ${y1 + 4} ${X + 2} ${y2 - 4} ${X + 6} ${y2}" fill="none" stroke="${x.url("bar")}" stroke-width="3.4" stroke-linecap="round"/>`;
      const s = k + body(x, X, Y, W, Hh) + door(x, X, Y, W, tH) + door(x, X, Y + tH + g, W, Hh - tH - g) + curve(Y + 14, Y + 36) + curve(Y + tH + 6, Y + tH + 46) +
        `<rect x="${X + 6}" y="${Y + Hh - 7}" width="${W - 12}" height="5" fill="#141519" opacity=".6"/>` + seam(x, X + 2, Y + tH + .65, X + W - 2, Y + tH + .65) + floorGlow(x, 100, 32);
      return out(x, s, [one("zd", "fz", [X, Y, W, tH], "R"), one("fd", "fr", [X, Y + tH + g, W, Hh - tH - g], "R", { cp: true })], [X + W - 32, Y + tH + 8, 26, ["fd"]]);
    } }),

    base({ id: "bottomfr", name: "Bottom Freezer", colors: first(SS, STEEL), parts: PL([D("fd", "Fridge door"), D("dz", "Freezer drawer")]), render(o) {
      const [x, k] = kit(o, 60, 80), X = 60, Y = 22, W = 80, Hh = 152, tH = 100, g = 1.3;
      const s = k + body(x, X, Y, W, Hh) + door(x, X, Y, W, tH) + door(x, X, Y + tH + g, W, Hh - tH - g) + vbar(x, X + 6, Y + 26, Y + 94) + hbar(x, X + 12, X + W - 12, Y + tH + 8) +
        tdisp(x, X + W - 22, Y + 8) + seam(x, X + 2, Y + tH + .65, X + W - 2, Y + tH + .65) + floorGlow(x, 100, 34);
      return out(x, s, [one("fd", "fr", [X, Y, W, tH], "R", { cp: true }), drw("dz", X, Y + tH + g, W, Hh - tH - g, "fz", "bar")], [X + W - 28, Y + 6, 26, ["fd"]]);
    } }),

    base({ id: "basicsbs", name: "Basic Side-by-Side", colors: first(WH, STEEL), parts: PL([D("dl", "Left door (freezer)"), D("dr", "Right door (fridge)")], [WATER]), render(o) {
      const [x, k] = kit(o, 54, 92), X = 54, Y = 22, W = 92, Hh = 152, lw = 42, g = 1.3, rx = X + lw + g;
      const s = k + body(x, X, Y, W, Hh) + door(x, X, Y, lw, Hh) + door(x, X + lw + g, Y, W - lw - g, Hh) + dispenser(x, X + 9, Y + 46, 24, 28) +
        vbar(x, X + lw - 5, Y + 20, Y + 100) + vbar(x, X + lw + g + 5, Y + 20, Y + 100) + seam(x, X + lw + .65, Y + 2, X + lw + .65, Y + Hh - 2) + floorGlow(x, 100, 40);
      return out(x, s, [one("dl", "fz", [X, Y, lw, Hh], "L", { ice: true, chute: true, nb: ["dr", rx, -1] }), one("dr", "fr", [rx, Y, W - lw - g, Hh], "R", { cp: true, nb: ["dl", X + lw, 1] })], [X + 8, Y + 28, 26, ["dl"]]);
    } }),

    base({ id: "counterdepth", name: "Counter-Depth", colors: first(SS, [SS, BK, WH, BS]), parts: PL(FR4.concat([D("dm", "Middle drawer"), D("dz", "Freezer drawer")])), render(o) {
      const [x, k] = kit(o, 54, 92, null, { flush: true, uppers: 16 }), X = 54, Y = 20, W = 92, Hh = 154;
      const F = french(x, X, Y, W, Hh, .58, [[.4, false], [.6, false]], { handle: "bar" }), G = fgeo(X, Y, W, Hh, .58, [[.4, false], [.6, false]]);
      const s = k + body(x, X, Y, W, Hh, 2) + F.s + `<rect x="${X}" y="${Y}" width="${W}" height="3" fill="#0d0e12" opacity=".5"/>` + tdisp(x, X + 38, Y + 6) + floorGlow(x, 100, 40);
      return out(x, s, [top2(X, Y, G, false, (x) => vbar(x, X + G.hw - 5, Y + G.tH * .25, Y + G.tH * .92), (x) => vbar(x, G.rx + 5, Y + G.tH * .25, Y + G.tH * .92)),
        drw("dm", X, G.rows[0][0], W, G.rows[0][1], "fx", "bar"), drw("dz", X, G.rows[1][0], W, G.rows[1][1], "fz", "bar")], [X + 33, Y + 4.5, 26, ["tl", "tr"]]);
    } }),

    base({ id: "compact", name: "Compact 24 in.", colors: first(WH, [WH, SS, BK, BS]), parts: PL([D("fd", "Fridge door"), D("zd", "Freezer door")]), render(o) {
      const [x, k] = kit(o, 70, 60, null, { flush: true }), X = 70, Y = 34, W = 60, Hh = 140, tH = 88, g = 1.3;
      const s = k + body(x, X, Y, W, Hh, 2) + door(x, X, Y, W, tH) + door(x, X, Y + tH + g, W, Hh - tH - g) + vbar(x, X + W - 6, Y + 22, Y + 80) + vbar(x, X + W - 6, Y + tH + 6, Y + tH + 34) +
        seam(x, X + 2, Y + tH + .65, X + W - 2, Y + tH + .65) + floorGlow(x, 100, 28);
      return out(x, s, [one("fd", "fr", [X, Y, W, tH], "L", { cp: true }), one("zd", "fz", [X, Y + tH + g, W, Hh - tH - g], "L")], [X + 6, Y + 8, 26, ["fd"]]);
    } }),

    base({ id: "builtincol", name: "Built-in Columns", colors: first(SS, [SS, WH, BK, "#7a5a3c"]), parts: PL([D("dl", "Fridge column"), D("dr", "Freezer column")]), render(o) {
      const [x, k] = kit(o, 46, 108, null, { flush: true, uppers: 10 }), X = 46, Y = 12, W = 108, g = 1.4, cw = 53;
      let lv = ""; for (let i = 0; i < 18; i++) lv += `<rect x="${X + 4 + i * 5.6}" y="${Y + 3}" width="3" height="12" rx=".6" fill="#0d0e12"/>`;
      const s = k + body(x, X, Y, W, 162, 0) + `<rect x="${X}" y="${Y}" width="${W}" height="18" fill="${x.url("f")}"/>${x.metal ? `<rect x="${X}" y="${Y}" width="${W}" height="18" fill="${x.url("br")}"/>` : ""}${lv}` +
        door(x, X, Y + 19.4, cw, 142.6) + door(x, X + cw + g, Y + 19.4, W - cw - g, 142.6) + vbar(x, X + cw - 6, Y + 40, Y + 150) + vbar(x, X + cw + g + 6, Y + 40, Y + 150) +
        (x.on ? `<rect x="${X + 40}" y="${Y + 7}" width="26" height="4" rx="1" fill="#bfe4ff" opacity="${(.3 + .5 * x.B).toFixed(2)}"/>` : "") + floorGlow(x, 100, 48);
      return out(x, s, [one("dl", "fr", [X, Y + 19.4, cw, 142.6], "L", { cp: true, nb: ["dr", X + cw + g, -1] }), one("dr", "fz", [X + cw + g, Y + 19.4, W - cw - g, 142.6], "R", { ice: true, nb: ["dl", X + cw, 1] })], [X + 40, Y + 4.5, 26, []]);
    } }),

    base({ id: "builtinfd", name: "Built-in French", colors: first(SS, [SS, BK, WH, "#7a5a3c"]), parts: PL(FR4.concat([D("dz", "Freezer drawer")]), [WATER]), render(o) {
      const [x, k] = kit(o, 50, 100, null, { flush: true, uppers: 10 }), X = 50, Y = 12, W = 100;
      let lv = ""; for (let i = 0; i < 16; i++) lv += `<rect x="${X + 5 + i * 5.8}" y="${Y + 3}" width="3" height="12" rx=".6" fill="#0d0e12"/>`;
      const F = french(x, X, Y + 19.4, W, 142.6, .58, [[1, false]], { handle: "bar" }), G = fgeo(X, Y + 19.4, W, 142.6, .58, [[1, false]]), [by, bH] = G.rows[0], Y2 = Y + 19.4;
      const s = k + body(x, X, Y, W, 162, 0) + `<rect x="${X}" y="${Y}" width="${W}" height="18" fill="${x.url("f")}"/>${x.metal ? `<rect x="${X}" y="${Y}" width="${W}" height="18" fill="${x.url("br")}"/>` : ""}${lv}` +
        F.s + (x.part("ice") ? `<rect x="${X + 6}" y="${Y + 25}" width="8" height="2" rx="1" fill="#bfe4ff" opacity="${(.4 + .6 * x.B).toFixed(2)}"/>` : "") + floorGlow(x, 100, 46);
      return out(x, s, [top2(X, Y2, G, false, (x) => vbar(x, X + G.hw - 5, Y2 + G.tH * .25, Y2 + G.tH * .92) + (x.part("ice") ? `<rect x="${X + 6}" y="${Y + 25}" width="8" height="2" rx="1" fill="#bfe4ff" opacity="${(.4 + .6 * x.B).toFixed(2)}"/>` : ""), (x) => vbar(x, G.rx + 5, Y2 + G.tH * .25, Y2 + G.tH * .92)),
        drw("dz", X, by, W, bH, "fz", "bar")], [X + 37, Y + 4.5, 26, []]);
    } }),

    base({ id: "color-panel-glass-door", name: "Color-panel glass door", colors: first(SS, [SS, BS, BK]), parts: PL(FR4.concat([D("dm", "Middle drawer"), D("dz", "Freezer drawer")]), [INSTA, WATER]), render(o) {
      const [x, k] = kit(o, 54, 92), X = 54, Y = 22, W = 92, Hh = 152;
      const F = french(x, X, Y, W, Hh, .56, [[.42, false], [.58, false]], { handle: "bar" }), G = fgeo(X, Y, W, Hh, .56, [[.42, false], [.58, false]]);
      const tint = "#7aa8ff";
      const gl = (x, rx) => insta(x, rx + 9, Y + 7, G.hw - 15, G.tH * .82, tint) + (x.part("insta") ? `<rect x="${rx + 9}" y="${Y + 7}" width="${G.hw - 15}" height="${f(G.tH * .82)}" rx="3" fill="${tint}" opacity="${(.25 * x.B).toFixed(2)}"/>` : "");
      const s = k + body(x, X, Y, W, Hh) + F.s + dispenser(x, X + 9, Y + 30, 25, 28) + insta(x, X + F.hw + F.g + 9, Y + 7, F.hw - 15, F.tH * .82, tint) +
        (x.part("insta") ? `<rect x="${X + F.hw + F.g + 9}" y="${Y + 7}" width="${F.hw - 15}" height="${f(F.tH * .82)}" rx="3" fill="${tint}" opacity="${(.25 * x.B).toFixed(2)}"/>` : "") + floorGlow(x, 100, 40);
      return out(x, s, [top2(X, Y, G, false, (x) => vbar(x, X + G.hw - 5, Y + G.tH * .25, Y + G.tH * .92) + dispenser(x, X + 9, Y + 30, 25, 28), (x) => vbar(x, G.rx + 5, Y + G.tH * .25, Y + G.tH * .92) + gl(x, G.rx), true),
        drw("dm", X, G.rows[0][0], W, G.rows[0][1], "fx", "bar"), drw("dz", X, G.rows[1][0], W, G.rows[1][1], "fz", "bar")], [X + 9, Y + 9, 25, ["tl"]]);
    } }),
  ];

  const css = `.hda-anim .${P}slide{animation:${P}slide 10s ease-in-out infinite}
.${P}slide2{opacity:0}
.hda-anim .${P}slide2{animation:${P}slide2 10s ease-in-out infinite}
.hda-anim .${P}mood{animation:${P}mood 6s ease-in-out infinite}
@keyframes ${P}slide{0%,45%{opacity:1}55%,95%{opacity:0}100%{opacity:1}}
@keyframes ${P}slide2{0%,45%{opacity:0}55%,95%{opacity:1}100%{opacity:0}}
@keyframes ${P}mood{0%,100%{opacity:1}50%{opacity:.55}}
@media (prefers-reduced-motion:reduce){.hda-anim .${P}slide,.hda-anim .${P}slide2,.hda-anim .${P}mood{animation:none}}`;

  (window.HDA = window.HDA || []).push({
    id: "fridge", tab: "Fridges & freezers", group: "Appliances", kind: "device",
    levelLabel: "Display", onWord: "Running", offWord: "Off",
    intro: "Twenty fridge styles: 4-door flex panels and a screen fridge, knock-glass and color-glow French doors, plus classic top and bottom freezers, side-by-sides, a counter-depth French door and built-in columns. Running shows the dispenser light, displays, the door screen and lit glass panels; the slider sets display brightness. As a Multi-Function Image every door and drawer is its own part (open shows the lit inside), with one inside light, the ice maker, screen and the fridge and freezer temperatures.",
    
    css, icons,
  });
})();
