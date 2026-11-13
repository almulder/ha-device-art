(function () {
  const P = "hda-fridgecfg-";
  const H = window.HDAH;
  const f = (n) => (+n).toFixed(1);
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

  function ctx(o) {
    const c = o.color || SS, on = !!o.on, lv = o.level == null ? 1 : o.level, p = o.parts || {};
    const part = (k) => on && (p[k] == null ? true : !!p[k]);
    const id = (s) => `${o.uid}-${s}`, url = (s) => `url(#${o.uid}-${s})`;
    return { o, c, on, lv, part, id, url, metal: isMetal(c), B: .45 + .55 * lv };
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
  const seam = (x, x1, y1, x2, y2) => x.on ? `<path d="M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}" stroke="#fff4d6" stroke-width="1" stroke-opacity="${(.25 * x.B).toFixed(2)}"/>` : "";
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
    const lit = x.part("door");
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


  const ICE = { id: "ice", name: "Ice maker" }, DOORL = { id: "door", name: "Door light" }, SCR = { id: "screen", name: "Screen", when: { opt: "screen", is: "door" } };
  const FEAT = ["sbs", "fr3", "fr4", "flex4", "col"];
  const OPTIONS = [
    { id: "style", name: "Style", values: [["sbs", "Side by side"], ["fr3", "French 2 doors + 1 drawer"], ["fr4", "2 doors + 2 drawers"], ["flex4", "4-door flex"], ["top", "Top freezer"], ["bot", "Bottom freezer"], ["col", "Column pair"]] },
    { id: "screen", name: "Screen", values: [["none", "None"], ["door", "Door screen"]], when: { opt: "style", is: FEAT } },
    { id: "disp", name: "Dispenser", values: [["none", "None"], ["ext", "Ice & water"], ["inside", "Ice only inside"]], when: { opt: "style", is: FEAT } },
    { id: "glass", name: "Glass door (knock-to-see)", values: [["no", "No"], ["yes", "Yes"]] },
  ];
  const LOOKS = {
    steel: { handle: "bar", glass: false, pro: false, white: false },
    glass: { handle: "pocket", glass: true, pro: false, white: false },
    pro: { handle: "bar", glass: false, pro: true, white: false },
    white: { handle: "bar", glass: false, pro: false, white: true },
  };
  const iceBadge = (x, X, Y) => `<rect x="${f(X)}" y="${f(Y)}" width="14" height="9" rx="2" fill="#0d0e12" opacity=".85"/>
<path d="M${f(X + 5)} ${f(Y + 4.5)} h4 M${f(X + 7)} ${f(Y + 2.5)} v4 M${f(X + 5.6)} ${f(Y + 3.1)} l2.8 2.8 M${f(X + 8.4)} ${f(Y + 3.1)} l-2.8 2.8" stroke="${x.part("ice") ? "#bfe4ff" : "#4a505a"}" stroke-width=".7"/>
<circle cx="${f(X + 11.6)}" cy="${f(Y + 4.5)}" r="1" fill="${x.part("ice") ? "#5be08a" : "#2c3038"}"/>`;
  const curve = (x, X, y1, y2) => `<path d="M${f(X + 4)} ${f(y1)} C${f(X)} ${f(y1 + 4)} ${f(X)} ${f(y2 - 4)} ${f(X + 4)} ${f(y2)}" fill="none" stroke="${x.url("bar")}" stroke-width="3.4" stroke-linecap="round"/>`;

  function build(o, look) {
    const x = ctx(o), L = LOOKS[look], op = o.opt || {};
    const style = op.style || "fr3", feat = FEAT.indexOf(style) >= 0, scr = feat && op.screen === "door", disp = feat ? op.disp || "none" : "none", gl = op.glass === "yes";
    const wide = style === "sbs" || style === "fr3" || style === "fr4" || style === "flex4", col = style === "col";
    const W = col ? 104 : wide ? 94 : 76, X = 100 - W / 2, Y = L.pro ? 30 : 22, Hh = 174 - Y, g = 1.3;
    let s = "";
    if (L.pro) s += kitchen(x, X, W, { flush: true, uppers: 12 }); else s += kitchen(x, X, W);
    s += body(x, X, Y, W, Hh, L.pro ? 0 : 7);
    if (L.pro) { let lv = ""; for (let i = 0; i < Math.floor((W - 8) / 5.6); i++) lv += `<rect x="${f(X + 4 + i * 5.6)}" y="${Y - 15}" width="3" height="10" rx=".6" fill="#0d0e12"/>`;
      s += `<rect x="${X}" y="${Y - 18}" width="${W}" height="16.6" fill="${x.url("f")}"/>${x.metal ? `<rect x="${X}" y="${Y - 18}" width="${W}" height="16.6" fill="${x.url("br")}"/>` : ""}${lv}`; }
    const H2 = L.handle === "pocket";
    let Ld, Rd;
    if (style === "sbs") {
      const lw = W * .46;
      s += door(x, X, Y, lw, Hh, L.glass) + door(x, X + lw + g, Y, W - lw - g, Hh, L.glass) + seam(x, X + lw + .65, Y + 2, X + lw + .65, Y + Hh - 2);
      s += H2 ? pocket(x, X + lw - 3, Y + 40, Y + 110) + pocket(x, X + lw + g + 3, Y + 40, Y + 110) : vbar(x, X + lw - 5, Y + 26, Y + 124) + vbar(x, X + lw + g + 5, Y + 26, Y + 124);
      Ld = { x: X, y: Y, w: lw, h: Hh * .62 }; Rd = { x: X + lw + g, y: Y, w: W - lw - g, h: Hh * .62 };
    } else if (style === "flex4") {
      const F = french(x, X, Y, W, Hh, .55, [[1, true]], { handle: L.handle === "bar" ? "bar" : "pocket", glass: true });
      s += F.s; Ld = { x: X, y: Y, w: F.hw, h: F.tH }; Rd = { x: X + F.hw + F.g, y: Y, w: F.hw, h: F.tH };
    } else if (style === "fr3" || style === "fr4") {
      const F = french(x, X, Y, W, Hh, style === "fr3" ? .6 : .56, style === "fr3" ? [[1, false]] : [[.42, false], [.58, false]], { handle: L.handle, glass: L.glass });
      s += F.s; Ld = { x: X, y: Y, w: F.hw, h: F.tH }; Rd = { x: X + F.hw + F.g, y: Y, w: F.hw, h: F.tH };
    } else if (style === "top" || style === "bot") {
      const top = style === "top", fH = Hh * (top ? .3 : .34), mY = top ? Y + fH + g : Y, mH = Hh - fH - g, fY = top ? Y : Y + mH + g;
      s += door(x, X, mY, W, mH, L.glass) + door(x, X, fY, W, fH, L.glass) + seam(x, X + 2, (top ? fY + fH : mY + mH) + .65, X + W - 2, (top ? fY + fH : mY + mH) + .65);
      if (L.white) s += curve(x, X + 4, mY + 8, mY + Math.min(48, mH * .5)) + curve(x, X + 4, fY + 6, fY + fH - 6);
      else if (H2) s += pocket(x, X + 4, mY + 10, mY + mH * .5) + (top ? pocket(x, X + 4, fY + 8, fY + fH - 8) : groove(X, W, fY + 3));
      else s += vbar(x, X + 6, mY + 10, mY + mH * .55) + (top ? vbar(x, X + 6, fY + 8, fY + fH - 8) : hbar(x, X + W * .2, X + W * .8, fY + 7));
      Ld = { x: X + 10, y: mY, w: W * .5 - 10, h: mH * .9 }; Rd = { x: X + W * .5, y: mY, w: W * .5, h: mH * .9 };
    } else {
      const cw = (W - 1) / 2;
      s += door(x, X, Y, cw, Hh, L.glass) + door(x, X + cw + 1, Y, cw, Hh, L.glass) + `<rect x="${f(X + cw)}" y="${Y}" width="1" height="${Hh}" fill="#0d0e12"/>`;
      s += H2 ? pocket(x, X + cw - 3, Y + 50, Y + 110) + pocket(x, X + cw + 4, Y + 50, Y + 110) : vbar(x, X + cw - 6, Y + 30, Y + 130) + vbar(x, X + cw + 7, Y + 30, Y + 130);
      Ld = { x: X, y: Y, w: cw, h: Hh * .62 }; Rd = { x: X + cw + 1, y: Y, w: cw, h: Hh * .62 };
    }
    const scrOnLeft = scr && gl;
    if (gl) s += insta(x, Rd.x + Rd.w * .16, Rd.y + Rd.h * .06, Rd.w * .68, Rd.h * .84);
    if (scr) { const D = scrOnLeft ? Ld : Rd, sw = D.w * .66, sh = Math.min(D.h * (scrOnLeft ? .36 : .56), sw * 1.55);
      s += screen(x, D.x + (D.w - sw) / 2, scrOnLeft ? D.y + D.h * .08 : D.y + (D.h - sh) / 2, sw, sh); }
    if (disp === "ext") { const dw = Math.min(27, Ld.w * .62), dh = Math.min(30, Ld.h * .3), dy = scrOnLeft ? Ld.y + Ld.h * .56 : Ld.y + (Ld.h - dh) / 2 + 4;
      s += dispenser(x, Ld.x + (Ld.w - 6 - dw) / 2, dy, dw, dh); }
    else if (disp === "inside") s += iceBadge(x, Ld.x + Ld.w / 2 - 7, Ld.y + 8);
    if (!scr && !gl && wide) s += tdisp(x, Rd.x + Rd.w / 2 - 7, Rd.y + 9);
    if (x.part("door") && !gl) s += seam(x, X + 2, Y + Hh - 1, X + W - 2, Y + Hh - 1);
    if (L.white) {
      const bar = x.url("bar"), barh = x.url("barh"), bw = `url(#${x.id("barw")})`;
      s = s.replace(/<(rect|path)([^>]*?)(fill|stroke)="url\(#[^)]*-bar(h?)\)"([^>]*)\/>/g, (m, tag, pre, kind, hv, post) =>
        `<${tag}${pre}${kind}="#000"${post} opacity=".28" transform="translate(1.2 1.6)"/><${tag}${pre}${kind}="${bw}"${post}/>`);
    }
    return svg(x, s + floorGlow(x, 100, W * .45), L.white ? lg(x.id("barw"), [[0, "#5d636c"], [.35, "#c9ced6"], [.55, "#eef1f4"], [.8, "#8a9099"], [1, "#4a5058"]]) : "");
  }

  const card = (id, name, look, colors) => ({ id, name, picker: true, colorLabel: "Finish", colors, parts: [ICE, DOORL, SCR], options: OPTIONS, render: (o) => build(o, look) });
  const icons = [
    card("steel", "Stainless fridge", "steel", [SS, BS, BK, WH]),
    card("glasspanel", "Glass-panel fridge", "glass", first(MATW, PANELCOLORS)),
    card("probuilt", "Pro built-in fridge", "pro", [SS, BK, WH, "#7a5a3c"]),
    card("classic", "Classic white fridge", "white", [WH, BEIGE, BK, SS]),
  ];

  const css = `.hda-anim .${P}slide{animation:${P}slide 10s ease-in-out infinite}
.${P}slide2{opacity:0}
.hda-anim .${P}slide2{animation:${P}slide2 10s ease-in-out infinite}
@keyframes ${P}slide{0%,45%{opacity:1}55%,95%{opacity:0}100%{opacity:1}}
@keyframes ${P}slide2{0%,45%{opacity:0}55%,95%{opacity:1}100%{opacity:0}}
@media (prefers-reduced-motion:reduce){.hda-anim .${P}slide,.hda-anim .${P}slide2{animation:none}}`;

  (window.HDA = window.HDA || []).push({
    id: "fridgecfg", tab: "Fridge builder", group: "Appliances", kind: "device",
    levelLabel: "Display", onWord: "Running", offWord: "Off",
    intro: "Four fridge looks (flat stainless, glass panel, pro built-in, classic white). Pick the style, a door screen, the dispenser and a knock-to-see glass door from the menus on each card.",
    
    css, icons,
  });
})();
