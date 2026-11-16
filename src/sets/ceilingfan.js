(function () {
  const H = window.HDAH, sh = H.shade, rgba = H.rgba;
  const P = "hda-ceilingfan-";
  const PK = 0.36, WARM = "#ffe0a6", HOT = "#fff8ea";
  const f = (n) => Math.round(n * 100) / 100;
  const C = { nickel: "#b4bac1", chrome: "#dfe4ea", black: "#3a3b40", bronze: "#5e4433", brass: "#c4954a", white: "#eeede9", galv: "#9aa2a8", alu: "#c9ced4" };

  const pon = (o, id) => (o.parts && o.parts[id] != null ? !!o.parts[id] : !!o.on);
  const LC = (o) => (o.pcolor && /^#[0-9a-fA-F]{6}$/.test(o.pcolor.light || "") ? o.pcolor.light : null);
  const LK = [{ id: "fan", name: "Fan" }, { id: "light", name: "Light", when: { opt: "kit", is: ["light"] } }];
  const KITOPT = [{ id: "kit", name: "Light kit", values: [["none", "Fan only"], ["light", "Fan + light"]] }];

  function K(o) {
    const u = o.uid, defs = [], seen = {};
    const stops = (a) => a.map((s) => `<stop offset="${s[0]}" stop-color="${s[1]}"${s[2] == null ? "" : ` stop-opacity="${s[2]}"`}/>`).join("");
    const k = {
      u, o, on: !!o.on, lv: Math.max(0.05, Math.min(1, +o.level || 0)),
      fn: { on: pon(o, "fan"), lv: Math.max(0.05, Math.min(1, o.plevel && o.plevel.fan != null ? +o.plevel.fan || 0 : +o.level || 0)) },
      kit: !!(o.opt && o.opt.kit === "light"),
      lt: { on: pon(o, "light") && !!(o.opt && o.opt.kit === "light"), a: o.plevel && o.plevel.light != null ? f(0.35 + 0.65 * Math.max(0, Math.min(1, +o.plevel.light || 0))) : 1 },
      lc(d, t) { return LC(o) ? H.mix(LC(o), "#ffffff", t) : d; },
      def(n, s) { if (!seen[n]) { seen[n] = 1; defs.push(s); } return `url(#${u}-${n})`; },
      lin(n, a, x1 = 0, y1 = 0, x2 = 1, y2 = 0) { return k.def(n, `<linearGradient id="${u}-${n}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops(a)}</linearGradient>`); },
      rad(n, a, cx = 0.5, cy = 0.5, r = 0.5) { return k.def(n, `<radialGradient id="${u}-${n}" cx="${cx}" cy="${cy}" r="${r}">${stops(a)}</radialGradient>`); },
      pre: "",
      svg(body, dy = 0) { return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="${P}svg" aria-hidden="true"><defs>${defs.join("")}</defs>${k.pre}${dy ? `<g transform="translate(0 ${dy})">${body}</g>` : body}</svg>`; },
    };
    k.W = k.lc(WARM, 0.3); k.HOT = k.lc(HOT, 0.78);
    return k;
  }

  const MAT = {
    metal: (c) => [[0, sh(c, -0.55)], [0.2, sh(c, 0.25)], [0.4, sh(c, 0.7)], [0.58, c], [0.82, sh(c, -0.22)], [1, sh(c, -0.6)]],
    satin: (c) => [[0, sh(c, -0.45)], [0.3, sh(c, 0.32)], [0.55, sh(c, 0.08)], [0.8, sh(c, -0.15)], [1, sh(c, -0.5)]],
    matte: (c) => [[0, sh(c, -0.5)], [0.3, sh(c, 0.12)], [0.6, c], [1, sh(c, -0.55)]],
    wood: (c) => [[0, sh(c, -0.42)], [0.28, sh(c, 0.18)], [0.62, c], [1, sh(c, -0.4)]],
  };
  const mg = (k, c, kind = "metal") => k.lin(kind + c.slice(1), MAT[kind](c));

  const ell = (cx, cy, r, fill, x = "") => `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(r)}" ry="${f(r * PK)}" fill="${fill}"${x}/>`;
  const cylP = (cx, yT, yB, rT, rB) => `M${f(cx - rT)} ${f(yT)}A${f(rT)} ${f(rT * PK)} 0 0 0 ${f(cx + rT)} ${f(yT)}L${f(cx + rB)} ${f(yB)}A${f(rB)} ${f(rB * PK)} 0 0 1 ${f(cx - rB)} ${f(yB)}Z`;
  function cap(k, cx, y, r, c) { return ell(cx, y, r, k.rad("cap" + c.slice(1), [[0, sh(c, 0.22)], [0.7, sh(c, -0.18)], [1, sh(c, -0.5)]], 0.45, 0.35, 0.65)); }
  function cyl(k, cx, yT, yB, rT, rB, c, kind = "metal", withCap = true) {
    let s = `<path d="${cylP(cx, yT, yB, rT, rB)}" fill="${mg(k, c, kind)}"/>`;
    s += `<path d="M${f(cx - rT * 0.55)} ${f(yT + rT * PK * 0.84)}L${f(cx - rB * 0.55)} ${f(yB + rB * PK * 0.84)}" stroke="#fff" stroke-opacity=".2" stroke-width="1.1"/>`;
    if (withCap) s += cap(k, cx, yB, rB, c);
    return s;
  }
  const band = (cx, y, r, col = "#000", op = 0.35, w = 1) => `<path d="M${f(cx - r)} ${f(y)}A${f(r)} ${f(r * PK)} 0 0 0 ${f(cx + r)} ${f(y)}" fill="none" stroke="${col}" stroke-opacity="${op}" stroke-width="${w}"/>`;
  function canopy(k, cx, y, r, c, kind = "metal") {
    return ell(cx, y + 1, r + 14, k.rad("ceil", [[0, "#000", 0.4], [1, "#000", 0]])) + cyl(k, cx, y, y + 7, r, r * 0.8, c, kind, false);
  }
  function rod(k, cx, y1, y2, c, w = 5, kind = "metal") {
    return `<rect x="${f(cx - w / 2)}" y="${y1}" width="${w}" height="${f(y2 - y1)}" fill="${mg(k, c, kind)}"/>` + cyl(k, cx, y2 - 4, y2, w * 0.85, w * 0.85, c, kind, false);
  }
  function motor(k, cx, yT, yB, r, c, kind = "metal") {
    return cyl(k, cx, yT, yT + 5, r * 0.42, r * 0.42, c, kind, false) + cyl(k, cx, yT + 5, yB - 5, r * 0.74, r, c, kind, false) +
      cyl(k, cx, yB - 5, yB, r, r * 0.93, c, kind, true) + band(cx, yB - 5, r) + band(cx, yB - 4.2, r, "#fff", 0.18, 0.8);
  }
  function chain(x, y, len, c = "#c9b27a") {
    return `<path d="M${x} ${y}V${y + len}" stroke="${c}" stroke-width="1.2" stroke-dasharray="1.5 .9"/><circle cx="${x}" cy="${y + len + 2.2}" r="2.3" fill="${c}"/><circle cx="${x - 0.7}" cy="${y + len + 1.5}" r=".8" fill="#fff" fill-opacity=".6"/>`;
  }
  function floorShadow(k, cx, rx, y = 186) { k.pre += `<ellipse cx="${cx}" cy="${y}" rx="${rx}" ry="${f(rx * 0.09)}" fill="${k.rad("fsh", [[0, "#000", 0.34], [1, "#000", 0]])}"/>`; return ""; }
  function cast(k, cx, y, w, rx, yF = 184) {
    if (!k.lt.on) return floorShadow(k, cx, rx * 0.9);
    const cone = k.lin("cone", [[0, k.W, 0.4], [0.55, k.W, 0.12], [1, k.W, 0]], 0, 0, 0, 1);
    const pool = k.rad("pool", [[0, k.W, 0.55], [0.5, k.W, 0.2], [1, k.W, 0]]);
    return `<g class="${P}lit" opacity="${k.lt.a}"><path d="M${f(cx - w)} ${y}L${f(cx + w)} ${y}L${f(cx + rx)} ${yF}L${f(cx - rx)} ${yF}Z" fill="${cone}"/><ellipse cx="${cx}" cy="${yF}" rx="${f(rx * 1.2)}" ry="${f(rx * 0.17)}" fill="${pool}"/></g>`;
  }
  function halo(k, cx, cy, r, a = 1) { return k.lt.on ? `<g opacity="${f(a * k.lt.a)}"><circle class="${P}halo" cx="${cx}" cy="${cy}" r="${r}" fill="${k.rad("halo", [[0, k.W, 0.62], [0.4, k.W, 0.24], [1, k.W, 0]])}"/></g>` : ""; }
  function glass(k, kind) {
    if (k.lt.on) { const w = kind === "amber" ? k.lc("#ffc56e", 0.2) : k.W; return k.rad("lit" + kind, [[0, k.HOT], [0.45, w, 0.97], [1, sh(w, -0.25), 0.92]], 0.5, 0.42, 0.62); }
    if (kind === "milk") return k.rad("gm", [[0, "#fbfaf6"], [0.55, "#dad6cd"], [1, "#9a958c"]], 0.4, 0.32, 0.72);
    if (kind === "amber") return k.rad("ga", [[0, "#f3dcb4"], [0.6, "#c9a374"], [1, "#7a5a36"]], 0.4, 0.32, 0.72);
    return k.rad("gf", [[0, "#ffffff", 0.6], [0.6, "#d6dae4", 0.42], [1, "#8d93a3", 0.5]], 0.4, 0.32, 0.72);
  }
  function air(k, cx, cy, R, xs = [-0.86, -0.55, 0.55, 0.86]) {
    if (!k.fn.on) return "";
    const d = (2.8 - 1.4 * k.fn.lv).toFixed(2);
    return xs.map((t, i) => { const x = cx + R * t, y = cy + R * PK * Math.sqrt(1 - t * t) + 7;
      return `<path class="${P}air" style="animation-duration:${d}s;animation-delay:-${(i * 0.55).toFixed(2)}s" d="M${f(x)} ${f(y)}c${f(t * 3)} 7 ${f(-t * 3)} 13 ${f(t * 2)} 22" fill="none" stroke="#d6ebff" stroke-opacity=".34" stroke-width="1.3" stroke-linecap="round"/>`; }).join("");
  }

  function rotor(k, q) {
    const { cx, cy, R, n, blade, phase = 0, key = "r", disc = "#999999", r0 = R * 0.3, over = "", under = "" } = q;
    const u = k.u, on = k.fn.on, lv = k.fn.lv;
    k.def(key + "b", `<g id="${u}-${key}b">${blade}</g>`);
    let set = `<circle r="${R + 8}" fill="none"/>`;
    for (let i = 0; i < n; i++) set += `<use xlink:href="#${u}-${key}b" transform="rotate(${f(phase + (i * 360) / n)})"/>`;
    k.def(key + "s", `<g id="${u}-${key}s">${set}</g>`);
    let mid = "";
    if (on) {
      const a = Math.min(0.9, r0 / R);
      const dg = k.rad(key + "disc", [[0, disc, 0], [a, disc, 0], [Math.min(0.96, a + 0.1), disc, f(0.1 + 0.16 * lv)], [0.93, disc, f(0.07 + 0.12 * lv)], [1, disc, 0]]);
      mid += `<circle r="${R}" fill="${dg}"/>`;
      const step = Math.min(13, (360 / n) * 0.15) * (0.5 + 0.7 * lv);
      [0.34, 0.2, 0.1].forEach((g, i) => { mid += `<use xlink:href="#${u}-${key}s" transform="rotate(${f(-step * (i + 1))})" opacity="${f(g * (0.55 + 0.5 * lv))}"/>`; });
    }
    mid += `<use xlink:href="#${u}-${key}s"${on ? ` opacity="${f(1 - 0.22 * lv)}"` : ""}/>`;
    const spin = on ? ` class="${P}spin" style="animation-duration:${(1.45 - lv).toFixed(2)}s"` : "";
    return `<g transform="translate(${cx} ${cy}) scale(1 ${PK})">${under}<g${spin}><circle r="${R + 8}" fill="none"/>${mid}</g>${over}</g>`;
  }

  function iron(k, r0, c, kind = "metal", w = 1) {
    const e = r0 + 12;
    return `<path d="M${-3 * w} -8L${-4 * w} ${-r0}L${-7 * w} ${-e}L${7 * w} ${-e}L${4 * w} ${-r0}L${3 * w} -8Z" fill="${mg(k, c, kind)}"/>` +
      `<circle cx="${-3.2 * w}" cy="${-e + 4}" r="1.5" fill="${sh(c, 0.5)}"/><circle cx="${3.2 * w}" cy="${-e + 4}" r="1.5" fill="${sh(c, 0.5)}"/>`;
  }
  function paddle(k, c, q) {
    const { r0 = 26, R = 86, w0 = 8, w1 = 12, kind = "wood", ir = C.bronze, irKind = "metal", round = 1, grain = kind === "wood" } = q;
    const t = w1 * round;
    const d = `M${-w0} ${-r0}L${-w1} ${f(-(R - t))}Q${-w1} ${-R} 0 ${-R}Q${w1} ${-R} ${w1} ${f(-(R - t))}L${w0} ${-r0}Q0 ${-r0 + 2} ${-w0} ${-r0}Z`;
    let s = `<path d="${d}" fill="${mg(k, c, kind)}" stroke="${sh(c, -0.6)}" stroke-opacity=".55" stroke-width=".8"/>`;
    if (grain) s += [-0.45, -0.05, 0.4].map((x, i) => `<path d="M${f(w0 * x)} ${-r0 - 2}C${f(w1 * x + 2)} ${f(-r0 - (R - r0) * 0.35)} ${f(w1 * x - 2)} ${f(-r0 - (R - r0) * 0.65)} ${f(w1 * x + (i - 1))} ${-R + 4}" fill="none" stroke="${sh(c, -0.5)}" stroke-opacity=".3" stroke-width=".8"/>`).join("");
    s += `<path d="M${f(-w0 + 1.6)} ${-r0 - 3}L${f(-w1 + 1.8)} ${f(-(R - t))}" stroke="#fff" stroke-opacity=".28" stroke-width="1.6" stroke-linecap="round"/>`;
    return s + (ir ? iron(k, r0, ir, irKind) : "");
  }
  function clear(k, c, d, hl) {
    return `<path d="${d}" fill="${rgba(c, 0.3)}" stroke="#2a3140" stroke-opacity=".35" stroke-width="2"/><path d="${d}" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="1"/><path d="${hl}" stroke="#fff" stroke-opacity=".5" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
  }

  function schoolhouse(k, cx, y) {
    const d = `M${cx - 9} ${y}C${cx - 10} ${y + 6} ${cx - 18} ${y + 10} ${cx - 18} ${y + 21}C${cx - 18} ${y + 31} ${cx - 9} ${y + 35} ${cx} ${y + 35}C${cx + 9} ${y + 35} ${cx + 18} ${y + 31} ${cx + 18} ${y + 21}C${cx + 18} ${y + 10} ${cx + 10} ${y + 6} ${cx + 9} ${y}Z`;
    return `<path d="${d}" fill="${glass(k, "milk")}"/>` + `<path d="M${cx - 12} ${y + 12}C${cx - 15} ${y + 17} ${cx - 15} ${y + 25} ${cx - 11} ${y + 30}" stroke="#fff" stroke-opacity=".55" stroke-width="2" fill="none" stroke-linecap="round"/>` +
      `<path d="M${cx - 18} ${y + 21}C${cx - 18} ${y + 31} ${cx - 9} ${y + 35} ${cx} ${y + 35}C${cx + 9} ${y + 35} ${cx + 18} ${y + 31} ${cx + 18} ${y + 21}" fill="none" stroke="#000" stroke-opacity=".12" stroke-width="3"/>`;
  }
  function bowl(k, cx, y, r, dep, kind = "frost") {
    const d = `M${cx - r} ${y}A${r} ${f(r * PK)} 0 0 0 ${cx + r} ${y}C${cx + r} ${f(y + dep * 0.75)} ${f(cx + r * 0.55)} ${y + dep} ${cx} ${y + dep}C${f(cx - r * 0.55)} ${y + dep} ${cx - r} ${f(y + dep * 0.75)} ${cx - r} ${y}Z`;
    return `<path d="${d}" fill="${glass(k, kind)}"/><path d="M${f(cx - r * 0.7)} ${f(y + dep * 0.35)}C${f(cx - r * 0.62)} ${f(y + dep * 0.7)} ${f(cx - r * 0.35)} ${f(y + dep * 0.9)} ${f(cx - r * 0.1)} ${f(y + dep * 0.95)}" stroke="#fff" stroke-opacity=".45" stroke-width="2" fill="none" stroke-linecap="round"/>` +
      band(cx, y, r, "#fff", 0.35, 1.2);
  }
  const glowCast = (k, ...a) => (k.lt.on ? cast(k, ...a) : "");   // (a new kit: its light on the floor, the fan's own shadow stays)
  const finial = (k, cx, y, c, r = 2.8) => `<circle cx="${cx}" cy="${f(y)}" r="${r}" fill="${mg(k, c)}"/>`;
  const LEDOFF = [[0, "#e4e6ec"], [0.75, "#b1b4bd"], [1, "#767983"]];
  function ledDisc(k, cx, y, r, c) {
    const disc = k.lt.on ? k.rad("lring", [[0, k.HOT], [0.6, k.lc("#fff1d6", 0.7)], [0.9, k.W], [1, sh(k.W, -0.2)]]) : k.rad("lringoff", LEDOFF, 0.45, 0.4, 0.6);
    return ell(cx, y, r + 1.8, mg(k, c)) + ell(cx, y + 0.4, r, disc) + (k.lt.on ? ell(cx, y + 0.4, r, "none", ` stroke="#fff" stroke-opacity=".75" stroke-width=".9"`) : band(cx, y + 0.4, r, "#fff", 0.3));
  }
  function ringLight(k, cx, y, r, c, kind = "satin") {
    const lit = k.lt.on;
    return ell(cx, y, r + 2.4, mg(k, c, kind)) + ell(cx, y + 0.3, r, "none", ` stroke="${lit ? k.W : "#cfd3da"}" stroke-width="3.2"${lit ? "" : ` stroke-opacity=".9"`}`) +
      (lit ? ell(cx, y + 0.3, r, "none", ` stroke="${k.HOT}" stroke-width="1.4"`) + ell(cx, y + 0.3, r + 2.6, "none", ` stroke="${k.W}" stroke-opacity=".35" stroke-width="2"`) : band(cx, y + 0.3, r, "#000", 0.2, 0.8)) +
      ell(cx, y + 0.3, r - 2.2, mg(k, c, kind));
  }
  function cagedBulb(k, cx, y, s, cage) {
    const lit = k.lt.on, bulb = `M${f(cx - 3 * s)} ${f(y + 6 * s)}C${f(cx - 3 * s)} ${f(y + 10 * s)} ${f(cx - 9 * s)} ${f(y + 13 * s)} ${f(cx - 9 * s)} ${f(y + 20 * s)}C${f(cx - 9 * s)} ${f(y + 27 * s)} ${f(cx - 4.5 * s)} ${f(y + 30 * s)} ${cx} ${f(y + 30 * s)}C${f(cx + 4.5 * s)} ${f(y + 30 * s)} ${f(cx + 9 * s)} ${f(y + 27 * s)} ${f(cx + 9 * s)} ${f(y + 20 * s)}C${f(cx + 9 * s)} ${f(y + 13 * s)} ${f(cx + 3 * s)} ${f(y + 10 * s)} ${f(cx + 3 * s)} ${f(y + 6 * s)}Z`;
    const fil = `M${f(cx - 2.5 * s)} ${f(y + 11 * s)}L${f(cx - 4 * s)} ${f(y + 21 * s)}L${f(cx - 1.4 * s)} ${f(y + 17 * s)}L${cx} ${f(y + 22 * s)}L${f(cx + 1.4 * s)} ${f(y + 17 * s)}L${f(cx + 4 * s)} ${f(y + 21 * s)}L${f(cx + 2.5 * s)} ${f(y + 11 * s)}`;
    let wires = ""; [-1, -0.45, 0.45, 1].forEach((t) => { const x = cx + 11.5 * s * t; wires += `M${f(cx + 4 * s * t)} ${f(y + 6 * s)}C${f(x)} ${f(y + 11 * s)} ${f(x)} ${f(y + 27 * s)} ${f(cx + 3 * s * t)} ${f(y + 33 * s)}`; });
    return cyl(k, cx, y, y + 6 * s, 4 * s, 4.6 * s, cage, "matte", false) + band(cx, y + 3 * s, 4.3 * s, "#fff", 0.2, 0.8) +
      `<path d="${bulb}" fill="${glass(k, "amber")}"/><path d="${fil}" fill="none" stroke="${lit ? k.HOT : "#7a5a36"}" stroke-width="${lit ? 1.2 : 0.8}" stroke-linejoin="round"/>` +
      `<path d="M${f(cx - 6.5 * s)} ${f(y + 15 * s)}C${f(cx - 7.5 * s)} ${f(y + 19 * s)} ${f(cx - 7 * s)} ${f(y + 24 * s)} ${f(cx - 4.5 * s)} ${f(y + 27 * s)}" stroke="#fff" stroke-opacity=".5" stroke-width="1.3" fill="none" stroke-linecap="round"/>` +
      `<path d="${wires}" fill="none" stroke="${cage}" stroke-width="1.3"/>` + ell(cx, y + 19 * s, 11.2 * s, "none", ` stroke="${cage}" stroke-width="1.3"`) +
      ell(cx, y + 33 * s, 3.2 * s, mg(k, cage, "matte"));
  }
  function barn(k, cx, y, r, c) {
    const d = `M${cx - 4.5} ${y + 5}L${cx + 4.5} ${y + 5}C${cx + 8} ${y + 10} ${f(cx + r - 2)} ${y + 13} ${cx + r} ${y + 18}A${r} ${f(r * PK)} 0 0 1 ${cx - r} ${y + 18}C${f(cx - r + 2)} ${y + 13} ${cx - 8} ${y + 10} ${cx - 4.5} ${y + 5}Z`;
    const inside = k.lt.on ? k.rad("barnin", [[0, k.HOT], [0.5, k.W], [1, sh(k.W, -0.3)]]) : k.rad("barnin", [[0, "#3a3d42"], [1, "#1c1e22"]]);
    return cyl(k, cx, y, y + 5, 3.4, 3.4, c, "metal", false) + `<path d="${d}" fill="${mg(k, c)}"/>` +
      `<path d="M${cx - 2.5} ${y + 7}C${cx - 7} ${y + 11} ${f(cx - r + 6)} ${y + 13} ${f(cx - r + 3)} ${y + 17}" stroke="#fff" stroke-opacity=".35" stroke-width="1.4" fill="none"/>` +
      ell(cx, y + 18, r - 1.3, inside) + ell(cx, y + 18, r, "none", ` stroke="${sh(c, -0.35)}" stroke-width="1.6"`) +
      ell(cx, y + 18.6, f(r * 0.36), k.lt.on ? k.HOT : "#d9d4c8", k.lt.on ? "" : ` fill-opacity=".85"`);
  }
  function bell(k, cx, y, r, dep) {
    const d = `M${cx - 5} ${y}C${cx - 6} ${f(y + dep * 0.35)} ${cx - r} ${f(y + dep * 0.5)} ${cx - r} ${y + dep}A${r} ${f(r * PK)} 0 0 0 ${cx + r} ${y + dep}C${cx + r} ${f(y + dep * 0.5)} ${cx + 6} ${f(y + dep * 0.35)} ${cx + 5} ${y}Z`;
    const seeds = [[-8, 0.62, 0.9], [-3, 0.5, 0.7], [4, 0.58, 0.8], [9, 0.78, 0.7], [-11, 0.86, 0.6], [0, 0.74, 0.9], [6, 0.92, 0.6], [-5, 0.95, 0.7], [2, 0.36, 0.6], [12, 0.97, 0.5]]
      .map(([x, t, rr]) => `<circle cx="${f(cx + x * r / 14)}" cy="${f(y + dep * t)}" r="${rr}" fill="#fff" fill-opacity="${k.lt.on ? 0.75 : 0.45}"/>`).join("");
    return cyl(k, cx, y - 3, y + 1, 5.6, 5.6, C.bronze, "metal", false) + `<path d="${d}" fill="${glass(k, "amber")}"/>` + seeds +
      `<path d="M${cx - 7} ${f(y + dep * 0.45)}C${f(cx - r + 3)} ${f(y + dep * 0.62)} ${f(cx - r + 2)} ${f(y + dep * 0.82)} ${f(cx - r + 3)} ${f(y + dep * 0.95)}" stroke="#fff" stroke-opacity=".45" stroke-width="1.6" fill="none" stroke-linecap="round"/>` +
      ell(cx, y + dep, r, "none", ` stroke="${sh("#c9a46a", -0.2)}" stroke-width="1.6"`);
  }
  function wovenDome(k, cx, y, r, dep, weave, c) {
    const d = `M${cx - 5} ${y}C${f(cx - r * 0.75)} ${y + 2} ${cx - r} ${f(y + dep * 0.55)} ${cx - r} ${y + dep}A${r} ${f(r * PK)} 0 0 0 ${cx + r} ${y + dep}C${cx + r} ${f(y + dep * 0.55)} ${f(cx + r * 0.75)} ${y + 2} ${cx + 5} ${y}Z`;
    const back = k.lt.on ? k.rad("domein", [[0, k.HOT], [0.6, k.W], [1, sh(k.W, -0.25)]], 0.5, 0.7, 0.7) : sh(c, -0.6);
    return cyl(k, cx, y - 3, y + 1, 4.6, 4.6, C.bronze, "metal", false) + `<path d="${d}" fill="${back}"/><path d="${d}" fill="${weave}" opacity="${k.lt.on ? 0.72 : 1}"/>` +
      `<path d="${d}" fill="${k.lin("domesh", [[0, "#000", 0.35], [0.45, "#fff", 0.1], [1, "#000", 0.4]])}"/>` +
      ell(cx, y + dep, r - 1, k.lt.on ? k.HOT : sh(c, -0.7)) + ell(cx, y + dep, r, "none", ` stroke="${sh(c, -0.25)}" stroke-width="2.4"`);
  }

  function sparkle(x, y, s, delay) {
    return `<path class="${P}tw" style="animation-delay:-${delay}s" d="M${x} ${y - s}L${f(x + s * 0.22)} ${f(y - s * 0.22)}L${x + s} ${y}L${f(x + s * 0.22)} ${f(y + s * 0.22)}L${x} ${y + s}L${f(x - s * 0.22)} ${f(y + s * 0.22)}L${x - s} ${y}L${f(x - s * 0.22)} ${f(y - s * 0.22)}Z" fill="#fff"/>`;
  }

  const icons = [];

  icons.push({ id: "classic", name: "Classic wood", colors: ["#8a5a3b", "#c4935a", "#93432a", "#efece6", "#34302e"], picker: true, parts: LK, options: KITOPT, colorLabel: "Blades",
    render(o) { const k = K(o), c = o.color, cx = 100;
      const b = cast(k, cx, 128, 12, 62) + canopy(k, cx, 10, 13, C.bronze) + rod(k, cx, 17, 54, C.bronze) +
        rotor(k, { cx, cy: 72, R: 86, n: 5, phase: 14, r0: 28, disc: c, blade: paddle(k, c, { r0: 28, R: 86, w0: 8.5, w1: 12.5 }) }) +
        motor(k, cx, 50, 82, 25, C.bronze) + cyl(k, cx, 82, 89, 11, 10, C.bronze) + chain(cx + 6, 88, 18) + chain(cx - 6, 88, 13) +
        (k.kit ? cyl(k, cx, 89, 93, 9.5, 9.5, C.brass) + halo(k, cx, 110, 40) + schoolhouse(k, cx, 93) : finial(k, cx, 90.5, C.brass)) + air(k, cx, 72, 86, [-0.9, -0.62, 0.62, 0.9]);
      return k.svg(b); } });

  icons.push({ id: "nickel", name: "Brushed nickel", colors: ["#c9cdd2", "#7a5236", "#2f3035", "#ebe8e1", "#a58b6a"], picker: true, parts: LK, options: KITOPT, colorLabel: "Blades",
    render(o) { const k = K(o), c = o.color, cx = 100;
      const d = "M-7 -20C-15 -34 -17 -58 -12 -78C-9 -88 -2 -92 4 -91C8 -88 9 -80 8 -68C7 -48 9 -32 7 -20Z";
      const bl = `<path d="${d}" fill="${mg(k, c, "satin")}" stroke="${sh(c, -0.55)}" stroke-opacity=".5" stroke-width=".8"/><path d="M-9 -26C-14 -42 -14 -62 -10 -78" stroke="#fff" stroke-opacity=".35" stroke-width="1.8" fill="none" stroke-linecap="round"/>` +
        `<path d="M-3 -6L-5 -22L5 -22L3 -6Z" fill="${mg(k, C.nickel)}"/>`;
      const b = floorShadow(k, cx, 64) + canopy(k, cx, 10, 11, C.nickel, "satin") + rod(k, cx, 17, 50, C.nickel, 4.5, "satin") +
        rotor(k, { cx, cy: 70, R: 91, n: 3, phase: 25, r0: 22, disc: c, blade: bl }) +
        cyl(k, cx, 48, 64, 15, 19, C.nickel, "satin", false) + cyl(k, cx, 64, 78, 19, 18, C.nickel, "satin", true) + band(cx, 64, 19, "#000", 0.3) +
        (k.kit ? glowCast(k, cx, 100, 16, 62, 168) + cyl(k, cx, 78, 83, 9, 9, C.nickel, "satin", false) + halo(k, cx, 96, 46, 0.9) + bowl(k, cx, 83, 22.5, 21) + finial(k, cx, 104.6, C.nickel, 2.5)
          : cyl(k, cx, 78, 82, 6, 4, C.nickel, "metal")) + air(k, cx, 70, 91);
      return k.svg(b, 16); } });

  icons.push({ id: "ledblack", name: "Matte black LED", colors: ["#2c2d31", "#5b4636", "#8c9096", "#efece6", "#3d4a3f"], picker: true, parts: LK, options: KITOPT, colorLabel: "Blades",
    render(o) { const k = K(o), c = o.color, cx = 100;
      const d = "M-10 -22C-22 -40 -24 -64 -14 -84C-10 -90 -2 -91 3 -88C10 -76 12 -56 12 -40C12 -32 10 -26 9 -22Z";
      const bl = `<path d="${d}" fill="${mg(k, c, "matte")}" stroke="${sh(c, 0.25)}" stroke-opacity=".25" stroke-width=".8"/><path d="M-12 -30C-19 -46 -19 -66 -12 -82" stroke="#fff" stroke-opacity=".16" stroke-width="2" fill="none" stroke-linecap="round"/>`;
      const disc = k.lt.on ? k.rad("led", [[0, k.HOT], [0.6, k.lc("#fff1d6", 0.7)], [0.9, k.W], [1, sh(k.W, -0.2)]]) : k.rad("ledoff", [[0, "#d9dbe2"], [0.75, "#a7aab4"], [1, "#6d7079"]], 0.45, 0.4, 0.6);
      const b = cast(k, cx, 76, 26, 70) + canopy(k, cx, 10, 12, C.black, "matte") + rod(k, cx, 17, 56, C.black, 5, "matte") +
        rotor(k, { cx, cy: 68, R: 90, n: 3, phase: 40, r0: 24, disc: sh(c, 0.3), blade: bl }) +
        cyl(k, cx, 54, 62, 14, 18, C.black, "matte", false) + cyl(k, cx, 62, 72, 30, 31, C.black, "matte", false) + band(cx, 62, 30, "#fff", 0.12) +
        ell(cx, 72, 31, mg(k, C.black, "matte")) + ell(cx, 72.5, 27, disc) + (k.lt.on ? ell(cx, 72.5, 27, "none", ` stroke="#fff" stroke-opacity=".7" stroke-width="1"`) : band(cx, 72.5, 27, "#fff", 0.3)) +
        halo(k, cx, 78, 46, 0.8) + air(k, cx, 68, 90);
      return k.svg(b); } });

  icons.push({ id: "hugger", name: "Hugger", colors: ["#efece6", "#8a5a3b", "#c4935a", "#5a5f66", "#34302e"], picker: true, parts: LK, options: KITOPT, colorLabel: "Blades",
    render(o) { const k = K(o), c = o.color, cx = 100;
      const b = cast(k, cx, 62, 20, 66) + ell(cx, 22, 52, k.rad("ceil", [[0, "#000", 0.4], [1, "#000", 0]])) +
        rotor(k, { cx, cy: 40, R: 88, n: 5, phase: 10, r0: 34, disc: c, blade: paddle(k, c, { r0: 34, R: 88, w0: 10, w1: 13, round: 0.45, kind: c === "#efece6" ? "satin" : "wood", grain: c !== "#efece6", ir: C.white, irKind: "satin" }) }) +
        cyl(k, cx, 20, 30, 30, 33, C.white, "satin", false) + cyl(k, cx, 30, 44, 33, 34, C.white, "satin", false) + band(cx, 30, 33, "#000", 0.22) +
        halo(k, cx, 56, 44, 0.9) + bowl(k, cx, 44, 28, 20) + air(k, cx, 40, 88);
      return k.svg(b, 10); } });

  icons.push({ id: "industrial", name: "Industrial cage", colors: ["#8a9097", "#2f3035", "#b5452f", "#3f5f4a", "#c8a24a"], picker: true, parts: LK, options: KITOPT, colorLabel: "Blades",
    render(o) { const k = K(o), c = o.color, cx = 100, cy = 82, Rc = 72, ir = "#4a4c53";
      const bl = `<path d="M-6 -12C-22 -22 -30 -44 -24 -62C-14 -70 4 -70 16 -60C20 -42 14 -22 6 -12Z" fill="${mg(k, c, "metal")}" stroke="${sh(c, -0.6)}" stroke-opacity=".5" stroke-width=".8"/><path d="M-20 -30C-24 -42 -22 -54 -16 -62" stroke="#fff" stroke-opacity=".3" stroke-width="2" fill="none" stroke-linecap="round"/>`;
      let grille = ""; for (let i = 0; i < 16; i++) { const a = (i * Math.PI) / 8; grille += `M${f(Math.cos(a) * 14)} ${f(Math.sin(a) * 14)}L${f(Math.cos(a) * Rc)} ${f(Math.sin(a) * Rc)}`; }
      const rings = [Rc, 56, 40, 26].map((r, i) => `<circle r="${r}" fill="none" stroke="${ir}" stroke-width="${i ? 1.6 : 4.5}"/>`).join("");
      const over = `<g transform="translate(0 16)"><path d="${grille}" stroke="${ir}" stroke-width="1.5"/>${rings}<circle r="${Rc}" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="1"/><circle r="14" fill="${mg(k, ir, "matte")}"/></g>`;
      const under = `<circle r="${Rc}" fill="none" stroke="${ir}" stroke-opacity=".7" stroke-width="3" transform="translate(0 -14)"/><path d="${grille}" stroke="${ir}" stroke-opacity=".45" stroke-width="1.2" transform="translate(0 -14)"/>`;
      let bars = ""; for (let i = 0; i < 12; i++) { const a = (i * Math.PI) / 6, x = cx + Math.cos(a) * Rc, y = cy + Math.sin(a) * Rc * PK; bars += `M${f(x)} ${f(y - 5)}V${f(y + 6)}`; }
      const b = floorShadow(k, cx, 70) + canopy(k, cx, 10, 12, ir, "matte") + rod(k, cx, 17, 52, ir, 6, "matte") +
        cyl(k, cx, 50, 56, 7, 7, ir, "matte", false) + cyl(k, cx, 56, 76, 9, 24, ir, "matte", false) + band(cx, 76, 24, "#fff", 0.15) +
        rotor(k, { cx, cy, R: 66, n: 3, phase: 30, r0: 14, disc: c, blade: bl, over, under }) + `<path d="${bars}" stroke="${ir}" stroke-width="2"/>` +
        (k.kit ? glowCast(k, cx, 128, 15, 64, 174) + halo(k, cx, 112, 44, 0.9) + cagedBulb(k, cx, 86.5, 1.38, ir) : "") + air(k, cx, cy + 6, 70);
      return k.svg(b, 12); } });

  function leaf(k, c, r0, R, W) {
    const L = [], Rt = [], N = 16; let veins = "";
    for (let i = 0; i <= N; i++) { const t = i / N, r = r0 + (R - r0) * t, w = W * Math.pow(Math.sin(Math.PI * Math.min(1, t * 1.05)), 0.75) * (i % 2 ? 0.8 : 1) + (t < 0.05 ? 2 : 0);
      L.push(`${f(-w)} ${f(-r)}`); Rt.push(`${f(w)} ${f(-r)}`);
      if (i > 0 && i < N && i % 2 === 0) veins += `M0 ${f(-r)}L${f(-w * 0.92)} ${f(-r - 5)}M0 ${f(-r)}L${f(w * 0.92)} ${f(-r - 5)}`; }
    const d = `M${L.join("L")}L${Rt.reverse().join("L")}Z`;
    return `<path d="${d}" fill="${k.lin("leaf", [[0, sh(c, -0.45)], [0.45, sh(c, 0.12)], [0.52, sh(c, 0.3)], [0.6, c], [1, sh(c, -0.45)]])}" stroke="${sh(c, -0.55)}" stroke-opacity=".5" stroke-width=".7"/>` +
      `<path d="${veins}" stroke="${sh(c, -0.35)}" stroke-opacity=".7" stroke-width=".8"/><path d="M0 ${-r0}L0 ${-R + 2}" stroke="${sh(c, 0.45)}" stroke-width="1.6"/>` + iron(k, r0 + 2, C.bronze);
  }
  icons.push({ id: "palm", name: "Palm leaf", colors: ["#6e8b3d", "#9a7b4f", "#3f6b3a", "#c7b48a", "#2f4f3a"], picker: true, parts: LK, options: KITOPT, colorLabel: "Blades",
    render(o) { const k = K(o), c = o.color, cx = 100;
      const b = floorShadow(k, cx, 66) + canopy(k, cx, 10, 13, C.bronze) + rod(k, cx, 17, 52, C.bronze) +
        rotor(k, { cx, cy: 72, R: 89, n: 5, phase: 20, r0: 22, disc: c, blade: leaf(k, c, 22, 89, 16) }) +
        motor(k, cx, 50, 80, 24, C.bronze) + band(cx, 66, 21, "#c9a46a", 0.6, 1.4) + (k.kit ? cyl(k, cx, 80, 86, 10, 8, C.bronze, "metal", false) + cast(k, cx, 108, 14, 60, 168) + halo(k, cx, 100, 40, 0.9) + bell(k, cx, 87, 15, 21)
          : cyl(k, cx, 80, 86, 10, 6, C.bronze) + `<circle cx="${cx}" cy="89" r="3.2" fill="${mg(k, C.brass)}"/>`) + air(k, cx, 72, 89);
      return k.svg(b, 16); } });

  icons.push({ id: "rattan", name: "Rattan", colors: ["#c9a46a", "#8b6a3e", "#e2cfa6", "#3b2f25", "#6b7a52"], picker: true, parts: LK, options: KITOPT, colorLabel: "Blades",
    render(o) { const k = K(o), c = o.color, cx = 100, u = k.u;
      k.def("weave", `<pattern id="${u}-weave" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="6" fill="${sh(c, -0.55)}"/><rect x=".6" width="2.2" height="6" fill="${sh(c, 0.1)}"/><rect y=".6" width="6" height="2.2" fill="${c}"/><rect x="3.6" y="3.6" width="2" height="2" fill="${sh(c, -0.35)}"/></pattern>`);
      const bl = `<ellipse cx="0" cy="-57" rx="16" ry="31" fill="url(#${u}-weave)"/><ellipse cx="0" cy="-57" rx="16" ry="31" fill="${k.lin("rsh", [[0, "#000", 0.35], [0.4, "#fff", 0.12], [1, "#000", 0.4]])}"/>` +
        `<ellipse cx="0" cy="-57" rx="16" ry="31" fill="none" stroke="${sh(c, -0.25)}" stroke-width="3.2"/><ellipse cx="0" cy="-57" rx="16" ry="31" fill="none" stroke="#fff" stroke-opacity=".2" stroke-width="1" stroke-dasharray="3 2"/>` +
        `<path d="M0 -27V-87" stroke="${sh(c, -0.3)}" stroke-width="2"/>` + iron(k, 24, C.bronze);
      const b = floorShadow(k, cx, 64) + canopy(k, cx, 10, 13, C.bronze) + rod(k, cx, 17, 52, C.bronze) +
        rotor(k, { cx, cy: 72, R: 88, n: 5, phase: 0, r0: 26, disc: c, blade: bl }) +
        motor(k, cx, 50, 80, 23, C.bronze) + (k.kit ? cyl(k, cx, 80, 85, 9, 8, C.bronze, "metal", false) + cast(k, cx, 104, 16, 60, 168) + halo(k, cx, 98, 40, 0.9) + wovenDome(k, cx, 86, 18, 17, `url(#${u}-weave)`, c)
          : cyl(k, cx, 80, 85, 9, 7, C.bronze) + `<circle cx="${cx}" cy="88" r="3" fill="${mg(k, C.brass)}"/>`) + air(k, cx, 72, 88);
      return k.svg(b, 16); } });

  icons.push({ id: "windmill", name: "Windmill", colors: ["#9aa2a8", "#2f3035", "#a8503a", "#ddd6c6", "#5d7a8c"], picker: true, parts: LK, options: KITOPT, colorLabel: "Blades",
    render(o) { const k = K(o), c = o.color, cx = 100, R = 82, ri = 24, a = 0.2;
      const p = (r, t) => `${f(r * Math.sin(t))} ${f(-r * Math.cos(t))}`;
      const bl = `<path d="M${p(ri, -a * 0.8)}L${p(R - 2, -a)}A${R - 2} ${R - 2} 0 0 1 ${p(R - 2, a)}L${p(ri, a * 0.8)}Z" fill="${mg(k, c, "satin")}" stroke="${sh(c, -0.55)}" stroke-opacity=".55" stroke-width=".8"/>` +
        `<path d="M${p(ri + 4, -a * 0.6)}L${p(R - 6, -a * 0.72)}" stroke="#fff" stroke-opacity=".3" stroke-width="1.6"/><path d="M0 ${-ri}L0 ${-R + 2}" stroke="${sh(c, -0.4)}" stroke-width="1.4"/>`;
      const g = C.galv, over = `<circle r="${R}" fill="none" stroke="${sh(g, -0.35)}" stroke-width="5"/><circle r="${R}" fill="none" stroke="${sh(g, 0.4)}" stroke-width="1.6"/><circle r="${ri}" fill="none" stroke="${sh(g, -0.3)}" stroke-width="4"/>`;
      const rotOver = `<g class="${k.fn.on ? P + "spin" : ""}" style="animation-duration:${(1.45 - k.fn.lv).toFixed(2)}s"><circle r="${R + 8}" fill="none"/>${over}</g>`;
      let riv = ""; for (let i = 0; i < 9; i++) { const t = (i - 4) / 4.6; riv += `<circle cx="${f(cx + 23 * t)}" cy="${f(71 + 23 * PK * Math.sqrt(1 - t * t))}" r=".9" fill="#fff" fill-opacity=".45"/>`; }
      const b = floorShadow(k, cx, 70) + canopy(k, cx, 10, 13, g) + rod(k, cx, 17, 46, g, 6) +
        rotor(k, { cx, cy: 66, R, n: 8, phase: 0, r0: ri, disc: c, blade: bl, over: rotOver }) +
        cyl(k, cx, 44, 50, 9, 9, g, "metal", false) + cyl(k, cx, 50, 74, 22, 23, g, "metal", true) + band(cx, 58, 22.4, "#000", 0.3) + band(cx, 70, 23, "#000", 0.3) + riv +
        (k.kit ? glowCast(k, cx, 99, 23, 66, 170) + halo(k, cx, 100, 46, 0.85) + `<g transform="translate(${cx} 73) scale(1.3) translate(${-cx} -73)">${barn(k, cx, 73, 21, g)}</g>` : `<circle cx="${cx}" cy="74" r="4" fill="${mg(k, sh(g, -0.2))}"/>`) + air(k, cx, 66, R);
      return k.svg(b, 14); } });

  icons.push({ id: "propeller", name: "Propeller", colors: ["#c9ced4", "#7a3e22", "#2a2a2d", "#b23b30", "#d9b16a"], picker: true, parts: LK, options: KITOPT, colorLabel: "Blades",
    render(o) { const k = K(o), c = o.color, cx = 100, a = C.alu;
      const d = "M-4 -16C-9 -26 -12 -40 -11 -56C-10 -72 -8 -84 -4 -91Q0 -95 4 -90C7 -80 8 -60 7 -40C6 -28 5 -20 4 -16Z";
      const bl = `<path d="${d}" fill="${mg(k, c, "metal")}" stroke="${sh(c, -0.6)}" stroke-opacity=".5" stroke-width=".8"/><path d="M-1 -20C-4 -40 -4 -64 -1 -88" stroke="#fff" stroke-opacity=".45" stroke-width="1.6" fill="none"/>` +
        `<path d="M-11 -84C-9 -88 -6 -91 -4 -91Q0 -95 4 -90L5 -86C0 -88 -6 -87 -11 -84Z" fill="#f2d24a" fill-opacity=".85"/>`;
      let riv = ""; for (let i = 0; i < 7; i++) { const t = (i - 3) / 3.6; riv += `<circle cx="${f(cx + 19 * t)}" cy="${f(68 + 19 * PK * Math.sqrt(1 - t * t))}" r=".9" fill="#fff" fill-opacity=".5"/>`; }
      const cone = `<path d="M${cx - 12} 76A12 ${f(12 * PK)} 0 0 0 ${cx + 12} 76C${cx + 11} 84 ${cx + 4} 92 ${cx} 95C${cx - 4} 92 ${cx - 11} 84 ${cx - 12} 76Z" fill="${mg(k, a)}"/><path d="M${cx - 7} 80C${cx - 6} 85 ${cx - 3} 90 ${cx - 1} 93" stroke="#fff" stroke-opacity=".6" stroke-width="1.4" fill="none"/>`;
      const b = floorShadow(k, cx, 72) + canopy(k, cx, 10, 12, a) + rod(k, cx, 17, 52, a, 5) +
        rotor(k, { cx, cy: 72, R: 93, n: 2, phase: 62, r0: 16, disc: c, blade: bl }) +
        cyl(k, cx, 50, 60, 12, 17, a, "metal", false) + cyl(k, cx, 60, 74, 17, 19, a, "metal", false) + band(cx, 60, 17, "#000", 0.3) + riv + (k.kit ? glowCast(k, cx, 78, 18, 64, 170) + ringLight(k, cx, 74.4, 15.6, a, "metal") + halo(k, cx, 84, 40, 0.8) : "") + cone + air(k, cx, 72, 93);
      return k.svg(b, 14); } });

  icons.push({ id: "retract", name: "Retractable", colors: ["#f0eee9", "#2f3035", "#c9cdd2", "#b08d57", "#8a5a3b"], picker: true, parts: LK, options: KITOPT, colorLabel: "Body",
    render(o) { const k = K(o), c = o.color, cx = 100;
      const d = "M-7 -26C-12 -44 -13 -66 -8 -84Q0 -90 8 -84C12 -66 12 -44 7 -26Z";
      const bl = clear(k, "#dbeef7", d, "M-6 -32C-9 -48 -9 -66 -5 -80");
      const disc = k.lt.on ? k.rad("led", [[0, k.HOT], [0.6, k.lc("#fff1d6", 0.7)], [0.9, k.W], [1, sh(k.W, -0.2)]]) : k.rad("ledoff", [[0, "#e6e7ec"], [0.75, "#b4b7c0"], [1, "#7d808a"]], 0.45, 0.4, 0.6);
      const b = cast(k, cx, 64, 30, 70) + canopy(k, cx, 10, 11, c, "satin") + rod(k, cx, 17, 46, c, 4, "satin") +
        (k.fn.on ? rotor(k, { cx, cy: 58, R: 88, n: 4, phase: 45, r0: 30, disc: "#dbeef7", blade: bl }) : "") +
        cyl(k, cx, 44, 50, 26, 36, c, "satin", false) + cyl(k, cx, 50, 62, 36, 36, c, "satin", false) + band(cx, 50, 36, "#000", 0.2) +
        (k.fn.on ? "" : [0, 1, 2, 3].map((i) => { const t = -0.75 + i * 0.5; return `<path d="M${f(cx + 36 * t)} ${f(53 + 36 * PK * Math.sqrt(1 - t * t))}v6" stroke="#000" stroke-opacity=".3" stroke-width="1.2"/>`; }).join("")) +
        ell(cx, 62, 36, mg(k, c, "satin")) + ell(cx, 62.5, 31, disc) + halo(k, cx, 70, 50, 0.85) + (k.fn.on ? air(k, cx, 58, 88) : "");
      return k.svg(b); } });

  icons.push({ id: "orb", name: "Caged orb", colors: ["#2f3035", "#b08d57", "#c9cdd2", "#f0eee9", "#6b4a33"], picker: true, parts: LK, options: KITOPT, colorLabel: "Body",
    render(o) { const k = K(o), c = o.color, cx = 100, cy = 98, R = 64;
      const bl = `<path d="M-8 -16C-18 -26 -20 -42 -14 -52C-6 -58 6 -58 12 -50C16 -38 12 -24 8 -16Z" fill="${mg(k, "#d9d6cf", "satin")}" stroke="#000" stroke-opacity=".3" stroke-width=".8"/><path d="M-14 -30C-16 -40 -14 -48 -10 -52" stroke="#fff" stroke-opacity=".4" stroke-width="1.6" fill="none"/>`;
      const st = sh(c, 0.1), mer = [0.38, 0.72, 0.93].map((s) => `<ellipse cx="${cx}" cy="${cy}" rx="${f(R * s)}" ry="${R}" fill="none" stroke="${st}" stroke-width="1.6"/>`).join("") + `<path d="M${cx} ${cy - R}V${cy + R}" stroke="${st}" stroke-width="1.6"/>`;
      const lat = [-0.62, -0.32, 0.32, 0.62].map((s) => { const r = R * Math.sqrt(1 - s * s); return ell(cx, cy + R * s, r, "none", ` stroke="${st}" stroke-width="1.5"`); }).join("");
      const back = `<g opacity=".38">${mer}</g>`;
      const b = floorShadow(k, cx, 58) + canopy(k, cx, 10, 11, c) + rod(k, cx, 17, 38, c, 5) + back +
        `<circle cx="${cx}" cy="${cy}" r="${R}" fill="${k.lt.on ? k.rad("orbl", [[0, k.W, 0.42], [0.55, k.W, 0.14], [0.85, k.W, 0.06], [1, k.W, 0.18]]) : k.rad("orbg", [[0, "#fff", 0], [0.8, "#fff", 0.03], [1, "#fff", 0.1]])}"/>` + (k.kit ? glowCast(k, cx, cy + R - 4, 26, 62, 176) : "") +
        rod(k, cx, 38, 84, sh(c, -0.1), 4) + rotor(k, { cx, cy: cy - 2, R: 58, n: 4, phase: 20, r0: 16, disc: "#d9d6cf", blade: bl }) + motor(k, cx, 80, 100, 15, sh(c, -0.05)) + (k.kit ? cyl(k, cx, 99, 103, 6, 6, sh(c, -0.05), "metal", false) + halo(k, cx, 112, 30) + bowl(k, cx, 103, 11, 13) : "") +
        mer + lat + ell(cx, cy, R, "none", ` stroke="${st}" stroke-width="2.6"`) +
        `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${mg(k, c)}" stroke-width="3.2"/><path d="M${cx - 44} ${cy - 44}A${R} ${R} 0 0 1 ${cx + 10} ${cy - 63}" stroke="#fff" stroke-opacity=".35" stroke-width="1.6" fill="none"/>` +
        cyl(k, cx, cy - R - 4, cy - R + 3, 9, 9, c) + `<circle cx="${cx}" cy="${cy + R + 1}" r="5" fill="${mg(k, c)}"/>` + air(k, cx, cy, 64, [-0.9, 0.9]);
      return k.svg(b, 8); } });

  icons.push({ id: "bowl", name: "Frosted bowl", colors: ["#4a3324", "#c4935a", "#efece6", "#7d7f84", "#9c4a2f"], picker: true, parts: LK, options: KITOPT, colorLabel: "Blades",
    render(o) { const k = K(o), c = o.color, cx = 100;
      const b = cast(k, cx, 112, 24, 66) + canopy(k, cx, 8, 12, C.nickel, "satin") + rod(k, cx, 15, 54, C.nickel, 4.5, "satin") +
        rotor(k, { cx, cy: 70, R: 87, n: 4, phase: 45, r0: 28, disc: c, blade: paddle(k, c, { r0: 28, R: 87, w0: 9, w1: 14, round: 0.5, kind: "wood", ir: C.nickel, irKind: "satin" }) }) +
        motor(k, cx, 50, 80, 24, C.nickel, "satin") + cyl(k, cx, 80, 86, 14, 13, C.nickel, "satin") +
        (k.kit ? halo(k, cx, 100, 46, 0.9) + bowl(k, cx, 86, 27, 26) + `<circle cx="${cx}" cy="113.5" r="2.6" fill="${mg(k, C.nickel)}"/>` : finial(k, cx, 87.4, C.nickel)) + air(k, cx, 70, 87, [-0.9, -0.6, 0.6, 0.9]);
      return k.svg(b); } });

  icons.push({ id: "twin", name: "Twin head", colors: ["#8a5a3b", "#c9a46a", "#efece6", "#34302e", "#93432a"], picker: true, parts: LK, options: KITOPT, colorLabel: "Blades",
    render(o) { const k = K(o), c = o.color, cx = 100, br = C.bronze;
      const bl = `<ellipse cx="0" cy="-27" rx="8.5" ry="15" fill="${mg(k, c, "wood")}" stroke="${sh(c, -0.6)}" stroke-opacity=".5" stroke-width=".7"/><path d="M-5 -18C-7 -26 -7 -32 -4 -38" stroke="#fff" stroke-opacity=".3" stroke-width="1.4" fill="none"/>` +
        `<path d="M-2 -5L-2.6 -15L2.6 -15L2 -5Z" fill="${mg(k, br)}"/>`;
      const arm = `<path d="M54 62C70 66 130 66 146 62L146 67C130 71 70 71 54 67Z" fill="${k.lin("arm", MAT.metal(br), 0, 0, 0, 1)}"/>`;
      const head = (x) => rotor(k, { cx: x, cy: 74, R: 43, n: 4, phase: 45, key: "r", r0: 12, disc: c, blade: bl }) + cyl(k, x, 60, 66, 7, 7, br, "metal", false) + cyl(k, x, 66, 80, 11, 13, br) + (k.kit ? halo(k, x, 86, 26, 0.85) + ledDisc(k, x, 80.4, 10.6, br) : `<circle cx="${x}" cy="80" r="2.4" fill="${mg(k, C.brass)}"/>`);
      const b = floorShadow(k, 52, 40) + floorShadow(k, 148, 40) + (k.lt.on ? cast(k, 52, 81, 10, 38, 166) + cast(k, 148, 81, 10, 38, 166) : "") + canopy(k, cx, 10, 13, br) + rod(k, cx, 17, 54, br) + arm +
        head(52) + head(148) + motor(k, cx, 52, 76, 15, br) + chain(cx, 76, 16) + air(k, 52, 74, 43, [-0.7, 0.7]) + air(k, 148, 74, 43, [-0.7, 0.7]);
      return k.svg(b, 18); } });

  icons.push({ id: "outdoor", name: "Outdoor lantern", colors: ["#3e2f26", "#2f3035", "#7a6a52", "#efece6", "#55603f"], picker: true, parts: LK, options: KITOPT, colorLabel: "Blades",
    render(o) { const k = K(o), c = o.color, cx = 100, br = "#4a3a2e";
      const gl = k.lt.on ? k.lin("lglass", [[0, k.lc("#ffd58a", 0.3), 0.75], [0.5, k.HOT, 0.85], [1, k.lc("#ffcf7a", 0.25), 0.7]]) : k.lin("lglass", [[0, "#b9c2cc", 0.22], [0.45, "#ffffff", 0.32], [1, "#8c96a3", 0.2]]);
      const flame = `<rect x="${cx - 2.5}" y="111" width="5" height="12" rx="1" fill="#efe6d6"/><path d="M${cx} 99C${cx + 4} 104 ${cx + 4} 110 ${cx} 112C${cx - 4} 110 ${cx - 4} 104 ${cx} 99Z" fill="${k.lt.on ? k.HOT : "#d8d2c4"}" fill-opacity="${k.lt.on ? 1 : 0.6}"/>`;
      const fr = mg(k, br, "matte");
      const lantern = `<path d="M${cx - 9} 88L${cx + 9} 88L${cx + 17} 97L${cx - 17} 97Z" fill="${fr}"/>${flame}` +
        `<path d="M${cx - 16} 97H${cx - 9}V125H${cx - 16}Z" fill="${gl}"/><path d="M${cx - 9} 97H${cx + 9}V125H${cx - 9}Z" fill="${gl}"/><path d="M${cx + 9} 97H${cx + 16}V125H${cx + 9}Z" fill="${gl}"/>` +
        `<path d="M${cx - 16} 97V125M${cx - 9} 97V125M${cx + 9} 97V125M${cx + 16} 97V125M${cx - 16} 111H${cx + 16}" stroke="${sh(br, -0.2)}" stroke-width="2"/><path d="M${cx - 6} 99L${cx - 1} 108" stroke="#fff" stroke-opacity=".5" stroke-width="1.2"/>` +
        `<path d="M${cx - 18} 125H${cx + 18}L${cx + 14} 130H${cx - 14}Z" fill="${fr}"/><path d="M${cx - 3} 130H${cx + 3}L${cx} 137Z" fill="${fr}"/>`;
      const b = cast(k, cx, 126, 18, 62) + canopy(k, cx, 10, 13, br, "matte") + rod(k, cx, 17, 52, br, 5, "matte") +
        rotor(k, { cx, cy: 72, R: 87, n: 5, phase: 12, r0: 28, disc: c, blade: paddle(k, c, { r0: 28, R: 87, w0: 9, w1: 13.5, round: 0.8, kind: "matte", grain: false, ir: br, irKind: "matte" }) }) +
        motor(k, cx, 50, 80, 24, br, "matte") + cyl(k, cx, 80, 88, 9, 8, br, "matte") + (k.kit ? halo(k, cx, 110, 44) + lantern : finial(k, cx, 89.6, br)) + air(k, cx, 72, 87, [-0.9, -0.62, 0.62, 0.9]);
      return k.svg(b); } });

  icons.push({ id: "drum", name: "Drum fan-light", colors: ["#e6dfd0", "#2f3035", "#8a8f96", "#c9b28a", "#4f5f72"], picker: true, parts: LK, options: KITOPT, colorLabel: "Shade",
    render(o) { const k = K(o), c = o.color, cx = 100, u = k.u, r = 58, yT = 34, yB = 80;
      k.def("dclip", `<clipPath id="${u}-dclip"><ellipse cx="${cx}" cy="${yB}" rx="${r - 3}" ry="${f((r - 3) * PK)}"/></clipPath>`);
      k.def("fab", `<pattern id="${u}-fab" width="3" height="3" patternUnits="userSpaceOnUse"><path d="M.5 0V3" stroke="#000" stroke-opacity=".07" stroke-width=".6"/><path d="M0 1.5H3" stroke="#fff" stroke-opacity=".04" stroke-width=".5"/></pattern>`);
      const bl = clear(k, "#e9eef2", "M-6 -10C-12 -20 -13 -34 -8 -42Q0 -46 8 -42C12 -34 11 -20 6 -10Z", "M-5 -16C-8 -24 -8 -32 -5 -39");
      const inside = k.lt.on ? k.rad("din", [[0, k.HOT], [0.55, k.W], [0.85, sh(k.W, -0.15)], [1, sh(c, -0.3)]]) : k.rad("din", [[0, "#2a2a30"], [0.7, "#1d1d22"], [1, sh(c, -0.55)]]);
      const shadeFill = k.lt.on ? k.lin("dsh", [[0, sh(c, -0.25)], [0.3, sh(c, 0.3)], [0.5, mixW(k, c, 0.45)], [0.7, sh(c, 0.2)], [1, sh(c, -0.35)]]) : mg(k, c, "matte");
      const b = cast(k, cx, yB + 8, 46, 76) + canopy(k, cx, 8, 11, C.nickel, "satin") + rod(k, cx, 15, yT + 2, C.nickel, 4, "satin") +
        `<path d="${cylP(cx, yT, yB, r, r)}" fill="${shadeFill}"/><path d="${cylP(cx, yT, yB, r, r)}" fill="url(#${u}-fab)"/>` + band(cx, yT, r, "#fff", 0.25, 1.4) +
        ell(cx, yB, r, sh(c, -0.4)) + ell(cx, yB, r - 3, inside) + ell(cx, yB, r - 3, k.lin("dwall", [[0, "#000", 0], [0.55, "#000", 0], [0.8, k.lt.on ? k.lc("#fff7e6", 0.78) : sh(c, -0.2), k.lt.on ? 0.35 : 0.5], [1, k.lt.on ? k.lc("#fff7e6", 0.78) : sh(c, 0.1), k.lt.on ? 0.5 : 0.7]], 0, 0, 0, 1)) +
        `<g clip-path="url(#${u}-dclip)">${rotor(k, { cx, cy: yB - 4, R: 44, n: 3, phase: 30, r0: 10, disc: "#e9eef2", blade: bl })}</g>` +
        cyl(k, cx, yB - 9, yB - 2, 9, 8, C.nickel, "satin") + halo(k, cx, yB + 6, 60, 0.7) + air(k, cx, yB, 50, [-0.6, 0.6]);
      return k.svg(b); } });
  function mixW(k, c, t) { return H.mix(c, k.lc("#fff4dc", 0.72), t); }

  icons.push({ id: "minimal", name: "Minimal white", colors: ["#f2f1ee", "#2a2b2f", "#c9cdd2", "#b9a17e", "#9fb3a6"], picker: true, parts: LK, options: KITOPT, colorLabel: "Blades",
    render(o) { const k = K(o), c = o.color, cx = 100, w = C.white;
      const d = "M-4 -14C-7 -36 -8 -66 -5 -88Q0 -93 5 -88C7 -66 6 -36 4 -14Z";
      const bl = `<path d="${d}" fill="${mg(k, c, "satin")}" stroke="${sh(c, -0.5)}" stroke-opacity=".4" stroke-width=".7"/><path d="M-3 -20C-5 -42 -5 -66 -3 -84" stroke="#fff" stroke-opacity=".45" stroke-width="1.2" fill="none"/>`;
      const b = floorShadow(k, cx, 60) + canopy(k, cx, 10, 9, w, "satin") + rod(k, cx, 17, 58, w, 3.5, "satin") +
        rotor(k, { cx, cy: 70, R: 92, n: 3, phase: 0, r0: 14, disc: c, blade: bl }) +
        cyl(k, cx, 56, 66, 9, 14, w, "satin", false) + cyl(k, cx, 66, 72, 14, 12, w, "satin") + (k.kit ? glowCast(k, cx, 74, 12, 62, 168) + ringLight(k, cx, 72.4, 12, w) + halo(k, cx, 80, 38, 0.8) + `<circle cx="${cx}" cy="72.7" r="2.4" fill="#9aa0a8"/>` : `<circle cx="${cx}" cy="72" r="2" fill="#9aa0a8"/>`) + air(k, cx, 70, 92);
      return k.svg(b, 16); } });

  icons.push({ id: "crystal", name: "Crystal chandelier", colors: ["#d7ecf7", "#e9d7f5", "#f5e6c8", "#cfd3d8", "#f7d6dc"], picker: true, parts: LK, options: KITOPT, colorLabel: "Blades",
    render(o) { const k = K(o), cx = 100, ch = C.chrome, c = o.color;
      const bl = clear(k, c, "M-8 -26C-13 -46 -14 -66 -9 -82Q0 -88 9 -82C14 -66 13 -46 8 -26Z", "M-7 -32C-10 -48 -10 -66 -6 -78");
      const cr = k.lt.on ? k.lin("crys", [[0, "#fff"], [0.5, k.lc("#ffe9c4", 0.55)], [1, k.lc("#e9b86a", 0.08)]]) : k.lin("crys", [[0, "#ffffff", 0.95], [0.5, "#bfd6ea", 0.75], [1, "#7f97b3", 0.85]]);
      const drop = (x, y, s) => `<path d="M${f(x)} ${f(y - 1)}V${f(y + 4 * s)}" stroke="#d9dee6" stroke-opacity=".7" stroke-width=".6"/><circle cx="${f(x)}" cy="${f(y + 5 * s)}" r="${f(1.3 * s)}" fill="${cr}"/>` +
        `<path d="M${f(x)} ${f(y + 7 * s)}L${f(x + 2.4 * s)} ${f(y + 11 * s)}L${f(x)} ${f(y + 16 * s)}L${f(x - 2.4 * s)} ${f(y + 11 * s)}Z" fill="${cr}" stroke="#fff" stroke-opacity=".6" stroke-width=".4"/>`;
      const tier = (y, r, n, s, front) => { let a = ""; for (let i = 0; i < n; i++) { const t = (i / n) * Math.PI * 2, sn = Math.sin(t); if (front ? sn < 0 : sn >= 0) continue; a += drop(cx + Math.cos(t) * r, y + sn * r * PK, s); } return a; };
      const ring = (y, r) => ell(cx, y, r, "none", ` stroke="${mg(k, ch)}" stroke-width="2.2"`);
      let sp = ""; if (k.lt.on) sp = sparkle(cx - 18, 104, 3.2, 0.3) + sparkle(cx + 14, 116, 2.6, 1.1) + sparkle(cx + 3, 128, 3, 1.7) + sparkle(cx - 6, 112, 2, 0.8);
      const b = cast(k, cx, 112, 26, 70) + canopy(k, cx, 10, 12, ch) + rod(k, cx, 17, 52, ch, 4.5) +
        rotor(k, { cx, cy: 70, R: 86, n: 4, phase: 45, r0: 26, disc: c, blade: bl }) +
        motor(k, cx, 50, 80, 22, ch) + halo(k, cx, 104, 52, 0.95) +
        tier(88, 24, 14, 1, false) + ring(88, 24) + rod(k, cx, 80, 100, ch, 3) + tier(102, 15, 10, 0.9, false) + ring(102, 15) +
        (k.lt.on ? `<circle cx="${cx}" cy="100" r="7" fill="${k.HOT}" opacity=".95"/>` : `<circle cx="${cx}" cy="100" r="5" fill="#e8e3d8" opacity=".6"/>`) +
        tier(102, 15, 10, 0.9, true) + tier(88, 24, 14, 1, true) + drop(cx, 106, 1.5) + sp + air(k, cx, 70, 86, [-0.9, -0.62, 0.62, 0.9]);
      return k.svg(b); } });

  icons.push({ id: "airplane", name: "Airplane", colors: ["#e5483b", "#3b82f6", "#f5b82e", "#3fb67a", "#a06cd5"], picker: true, parts: LK, options: KITOPT, colorLabel: "Blades",
    render(o) { const k = K(o), c = o.color, cx = 100, w = C.white;
      const body = mg(k, c, "satin"), wing = mg(k, sh(c, 0.18), "satin");
      const bl = `<path d="M-2.5 -8L-2.5 -26L2.5 -26L2.5 -8Z" fill="${mg(k, "#9aa0a8")}"/>` +
        `<path d="M-6 -60L-30 -52L-30 -46L-6 -50Z" fill="${wing}"/><path d="M6 -60L30 -52L30 -46L6 -50Z" fill="${wing}"/>` +
        `<path d="M-4 -30L-15 -26L-15 -22L-4 -24Z" fill="${wing}"/><path d="M4 -30L15 -26L15 -22L4 -24Z" fill="${wing}"/>` +
        `<path d="M-6 -24L-6 -76C-6 -84 -3 -88 0 -88C3 -88 6 -84 6 -76L6 -24Z" fill="${body}" stroke="${sh(c, -0.5)}" stroke-opacity=".5" stroke-width=".7"/>` +
        `<path d="M-6 -66H6V-62H-6Z" fill="#fff" fill-opacity=".85"/><ellipse cx="0" cy="-78" rx="3.2" ry="5" fill="#bfe3ff"/><path d="M-1.6 -81V-75" stroke="#fff" stroke-width="1"/>` +
        `<path d="M-9 -88.5H9" stroke="#555" stroke-opacity=".7" stroke-width="1.6"/><circle cy="-88" r="1.6" fill="#ddd"/>`;
      const b = floorShadow(k, cx, 64) + canopy(k, cx, 10, 12, w, "satin") + rod(k, cx, 17, 52, w, 5, "satin") +
        rotor(k, { cx, cy: 72, R: 90, n: 4, phase: 45, r0: 24, disc: sh(c, 0.55), blade: bl }) +
        cyl(k, cx, 50, 62, 14, 22, w, "satin", false) + cyl(k, cx, 62, 76, 22, 21, w, "satin", false) + `<path d="${cylP(cx, 64, 69, 22, 22)}" fill="${body}"/>` +
        ell(cx, 76, 21, k.rad("hub", [[0, "#ffffff"], [0.7, "#dfe3ea"], [1, "#9aa0a8"]], 0.45, 0.35, 0.65)) +
        [0, 1, 2, 3, 4].map((i) => { const t = (i - 2) / 2.6; return `<path d="M${f(cx + 21 * t + 1.6)} ${f(76 + 21 * PK * Math.sqrt(1 - t * t) * 0.5)}l-1.6 -2.8 -1.6 2.8z" fill="#f5b82e"/>`; }).join("") +
        (k.kit ? glowCast(k, cx, 90, 14, 60, 170) + halo(k, cx, 88, 36, 0.85) + bowl(k, cx, 77.5, 13, 12, "milk") + `<circle cx="${cx}" cy="89.5" r="2.2" fill="${body}"/>` : `<circle cx="${cx}" cy="77" r="4.5" fill="${body}"/>`) + air(k, cx, 72, 90);
      return k.svg(b, 14); } });

  icons.push({ id: "vintage", name: "Vintage brass", colors: ["#6e3f24", "#c4935a", "#2e2a28", "#efece6", "#4a5a3c"], picker: true, parts: LK, options: KITOPT, colorLabel: "Blades",
    render(o) { const k = K(o), c = o.color, cx = 100, br = C.brass;
      const curl = `<path d="M-4 -10C-10 -16 -10 -24 -4 -26M4 -10C10 -16 10 -24 4 -26" fill="none" stroke="${sh(br, -0.2)}" stroke-width="2.2"/>`;
      const bl = paddle(k, c, { r0: 30, R: 86, w0: 7, w1: 13, round: 0.9, kind: "wood", ir: br }) + curl;
      const tulip = (x, y, s) => { const gl = glass(k, "amber");
        return `<path d="M${x} ${y - 14 * s}C${x - 2} ${y - 9 * s} ${x - 4} ${y - 6 * s} ${x - 4 * s} ${y - 4 * s}" stroke="${mg(k, br)}" stroke-width="2" fill="none"/>` +
          cyl(k, x, y - 4 * s, y, 3.5 * s, 4.5 * s, br, "metal", false) +
          `<path d="M${f(x - 4.5 * s)} ${y}C${f(x - 6 * s)} ${f(y + 5 * s)} ${f(x - 12 * s)} ${f(y + 9 * s)} ${f(x - 12 * s)} ${f(y + 15 * s)}L${f(x + 12 * s)} ${f(y + 15 * s)}C${f(x + 12 * s)} ${f(y + 9 * s)} ${f(x + 6 * s)} ${f(y + 5 * s)} ${f(x + 4.5 * s)} ${y}Z" fill="${gl}"/>` +
          `<path d="M${f(x - 8 * s)} ${f(y + 6 * s)}C${f(x - 10 * s)} ${f(y + 9 * s)} ${f(x - 10.5 * s)} ${f(y + 12 * s)} ${f(x - 10.5 * s)} ${f(y + 14 * s)}" stroke="#fff" stroke-opacity=".5" stroke-width="1.4" fill="none"/>` +
          ell(x, y + 15 * s, 12 * s, k.lt.on ? k.HOT : "#8a6a44", k.lt.on ? "" : ` fill-opacity=".9"`) + ell(x, y + 15 * s, 12 * s, "none", ` stroke="${rgba("#fff", 0.5)}" stroke-width=".8"`); };
      const arms = `<path d="M${cx} 90C${cx - 10} 92 ${cx - 24} 90 ${cx - 28} 96M${cx} 90C${cx + 10} 92 ${cx + 24} 90 ${cx + 28} 96M${cx} 90V104" stroke="${mg(k, br)}" stroke-width="2.4" fill="none"/>`;
      const b = cast(k, cx, 112, 40, 72) + canopy(k, cx, 8, 13, br) + rod(k, cx, 15, 50, br) + `<circle cx="${cx}" cy="30" r="4.5" fill="${mg(k, br)}"/>` +
        rotor(k, { cx, cy: 70, R: 86, n: 4, phase: 45, r0: 30, disc: c, blade: bl }) +
        motor(k, cx, 48, 80, 25, br) + band(cx, 62, 22, "#000", 0.35) + band(cx, 70, 24, "#fff", 0.25) + cyl(k, cx, 80, 90, 12, 8, br) +
        (k.kit ? halo(k, cx, 108, 52, 0.85) + arms + tulip(cx - 28, 104, 0.9) + tulip(cx + 28, 104, 0.9) + tulip(cx, 114, 1) : finial(k, cx, 91.6, br)) + air(k, cx, 70, 86, [-0.92, -0.65, 0.65, 0.92]);
      return k.svg(b); } });

  (window.HDA = window.HDA || []).push({
    id: "ceilingfan", tab: "Ceiling fans", group: "Fans", kind: "fan",
    intro: "Ceiling fans seen from just below. On, the blades spin with a motion blur (faster with the speed slider) and light kits glow down. Parts: Fan (the blades) and Light (the light kit, in the light's color), each with its own on and level. Light kit option: Fan only (a light kit hidden, a built-in light unlit) or Fan + light (every fan).",
    
    css: `
.hda-ceilingfan-svg{overflow:visible}
.hda-ceilingfan-spin{transform-box:fill-box;transform-origin:50% 50%}
.hda-anim .hda-ceilingfan-spin{animation:hda-ceilingfan-rot 1s linear infinite}
@keyframes hda-ceilingfan-rot{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
.hda-ceilingfan-air{opacity:.7}
.hda-anim .hda-ceilingfan-air{animation:hda-ceilingfan-air 2s ease-in-out infinite}
@keyframes hda-ceilingfan-air{0%{opacity:0;transform:translateY(-4px)}45%{opacity:1}100%{opacity:0;transform:translateY(12px)}}
.hda-ceilingfan-halo{transform-box:fill-box;transform-origin:50% 50%}
.hda-anim .hda-ceilingfan-halo{animation:hda-ceilingfan-breath 4s ease-in-out infinite}
@keyframes hda-ceilingfan-breath{50%{transform:scale(1.06);opacity:.75}}
.hda-anim .hda-ceilingfan-tw{animation:hda-ceilingfan-tw 2.2s ease-in-out infinite}
@keyframes hda-ceilingfan-tw{0%,100%{opacity:0}50%{opacity:1}}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-ceilingfan-spin,.hda-anim .hda-ceilingfan-air,.hda-anim .hda-ceilingfan-halo,.hda-anim .hda-ceilingfan-tw{animation:none}}
`,
    icons,
  });
})();
