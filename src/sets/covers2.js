(function () {
  "use strict";
  const P = "hda-covers2-";
  const H = () => window.HDAH;
  const f = (v) => (Math.round(v * 10) / 10).toString();
  const cl = (v, a, b) => Math.max(a, Math.min(b, v));
  const FONT = `font-family="Segoe UI, Roboto, Arial, sans-serif"`;

  function X(o) {
    const d = []; let n = 0;
    const st = (a) => a.map(([of, c, op]) => `<stop offset="${of}" stop-color="${c}"${op == null ? "" : ` stop-opacity="${op}"`}/>`).join("");
    const x = { o, d,
      opt: (k, def) => (o.opt && o.opt[k]) || def,
      c1: o.color || "#f2f2ee", c2: o.color2 || "#f0eee8",
      lv: cl(o.level == null ? .6 : +o.level || 0, 0, 1),
      lg(a, x1, y1, x2, y2) { const id = `${o.uid}-g${n++}`; d.push(`<linearGradient id="${id}" x1="${x1 == null ? 0 : x1}" y1="${y1 == null ? 0 : y1}" x2="${x2 == null ? 0 : x2}" y2="${y2 == null ? 1 : y2}">${st(a)}</linearGradient>`); return `url(#${id})`; },
      rg(a, cx, cy, r) { const id = `${o.uid}-g${n++}`; d.push(`<radialGradient id="${id}" cx="${cx == null ? .5 : cx}" cy="${cy == null ? .5 : cy}" r="${r == null ? .5 : r}">${st(a)}</radialGradient>`); return `url(#${id})`; },
      clip(path) { const id = `${o.uid}-c${n++}`; d.push(`<clipPath id="${id}"><path d="${path}"/></clipPath>`); return `url(#${id})`; },
      blur(sd) { const id = `${o.uid}-b${n++}`; d.push(`<filter id="${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${sd}"/></filter>`); return `url(#${id})`; } };
    x.on = !!o.on; x.anim = !!o.anim;
    return x;
  }
  function pal(c) {
    const h = H(), m = /^#?([0-9a-f]{6})$/i.exec(c || ""), n = m ? parseInt(m[1], 16) : 0xdddddd;
    const lum = (((n >> 16) & 255) * .3 + ((n >> 8) & 255) * .59 + (n & 255) * .11) / 255, lt = lum > .7;
    return { l: h.shade(c, lt ? .5 : .32), m: c, d: h.shade(c, lt ? -.14 : -.3), k: h.shade(c, lt ? -.34 : -.55), lt };
  }
  const shadow = (x, cx, cy, rx, ry, op) => `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="${x.rg([[0, "#000", op == null ? .5 : op], [1, "#000", 0]])}"/>`;
  function wrap(x, bg, item) {
    const c = `${x.o.uid}-card`, vig = x.rg([[0, "#000", 0], [.65, "#000", .06], [1, "#000", .42]], .5, .46, .75);
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><defs><clipPath id="${c}"><rect x="8" y="8" width="184" height="184" rx="16"/></clipPath>${x.d.join("")}</defs>` +
      `<g clip-path="url(#${c})"><g class="hda-bg">${bg}<rect width="200" height="200" fill="${vig}"/></g>${item}</g>` +
      `<g class="hda-bg"><rect x="8.5" y="8.5" width="183" height="183" rx="15.5" fill="none" stroke="#fff" stroke-opacity=".07"/></g></svg>`;
  }
  const firstIs = (op, v) => Object.assign({}, op, { values: [op.values.find((p) => p[0] === v)].concat(op.values.filter((p) => p[0] !== v)) });

  function room(x, tone) {
    const w = tone || "#8d8796";
    return `<rect width="200" height="200" fill="${x.lg([[0, H().shade(w, .08)], [1, H().shade(w, -.22)]])}"/>` +
      `<rect y="170" width="200" height="30" fill="${x.lg([[0, "#7a5638"], [1, "#4e3523"]])}"/><path d="M0 178H200M0 188H200" stroke="#000" stroke-opacity=".18"/>` +
      `<rect y="165" width="200" height="6" fill="#ece8df"/><rect y="170.5" width="200" height="1.5" fill="#000" opacity=".25"/>`;
  }
  function sky(x, h) {
    return `<rect width="200" height="200" fill="${x.lg([[0, "#2f74c4"], [.55, "#79b4e6"], [1, "#cfe6f5"]])}"/>` +
      `<g fill="#fff" opacity=".85"><ellipse cx="146" cy="30" rx="20" ry="5"/><ellipse cx="156" cy="26" rx="11" ry="6"/><ellipse cx="44" cy="44" rx="14" ry="3.6"/></g>` +
      `<path d="M0 ${h - 10}Q40 ${h - 22} 80 ${h - 12}T160 ${h - 14}T200 ${h - 12}V${h}H0Z" fill="#4d8a46" opacity=".8"/>`;
  }
  function siding(x, base) {
    let s = `<rect width="200" height="200" fill="${base || "#c6ccd2"}"/>`;
    for (let y = 0; y < 200; y += 10) s += `<rect y="${y}" width="200" height="4" fill="#fff" opacity=".14"/><path d="M0 ${y + 9.5}H200" stroke="#000" stroke-opacity=".26"/>`;
    return s + `<rect width="200" height="200" fill="${x.lg([[0, "#fff", .05], [1, "#000", .22]])}"/>`;
  }
  function brick(x) {
    let s = `<rect width="200" height="200" fill="#5e3328"/>`, k = 7;
    for (let row = 0, y = 0; y < 200; y += 9, row++) for (let bx = -(row % 2) * 13; bx < 200; bx += 26) { k = (k * 16807) % 2147483647; s += `<rect x="${bx + .7}" y="${y + .7}" width="24.6" height="7.6" rx=".8" fill="${H().mix("#86452f", "#b0664a", (k % 1000) / 1000)}"/>`; }
    return s + `<rect width="200" height="200" fill="${x.lg([[0, "#fff", .05], [1, "#000", .3]])}"/>`;
  }
  function stucco(x) {
    let s = `<rect width="200" height="200" fill="#d9cbb0"/>`, k = 11;
    for (let i = 0; i < 180; i++) { k = (k * 16807) % 2147483647; const a = k % 200; k = (k * 16807) % 2147483647; const b = k % 200; s += `<circle cx="${a}" cy="${b}" r="${f(.4 + (k % 9) / 10)}" fill="${k % 2 ? "#fff" : "#7a6a50"}" opacity=".13"/>`; }
    return s + `<rect width="200" height="200" fill="${x.lg([[0, "#fff", .06], [1, "#000", .26]])}"/>`;
  }
  function chevrons(x, cx, cy, dir, col) {
    const rot = { down: 0, up: 180, left: 90, right: -90 }[dir] || 0;
    let s = ""; for (let i = 0; i < 3; i++) s += `<path class="${P}chev" style="animation-delay:${(i * .25).toFixed(2)}s" d="M-6 ${i * 6 - 6}L0 ${i * 6}L6 ${i * 6 - 6}" fill="none" stroke="${col || "#fff"}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" opacity="${(.5 + i * .2).toFixed(2)}"/>`;
    return `<g transform="translate(${f(cx)} ${f(cy)}) rotate(${rot})"><circle r="13" fill="#000" opacity=".35"/>${s}</g>`;
  }

  function radiator(x, kind) {
    const rc = x.c2, p = pal(rc), heat = x.vpct > 0 && x.mode !== "off";
    let s = room(x, "#8a8494");
    if (kind === "column") {
      const x0 = 16, x1 = 138, y0 = 64, y1 = 160, n = 9, cw = (x1 - x0) / n;
      s += `<rect x="${x0 + 4}" y="${y1}" width="6" height="8" fill="${p.d}"/><rect x="${x1 - 10}" y="${y1}" width="6" height="8" fill="${p.d}"/>`;
      for (let i = 0; i < n; i++) { const cx = x0 + i * cw; s += `<rect x="${f(cx + 1)}" y="${y0}" width="${f(cw - 2)}" height="${y1 - y0}" rx="${f(cw / 2 - 1)}" fill="${x.lg([[0, p.k], [.3, p.l], [.55, p.m], [1, p.k]], 0, 0, 1, 0)}"/>`; }
      s += `<rect x="${x0}" y="${y0 + 8}" width="${x1 - x0}" height="5" fill="${p.d}" opacity=".7"/><rect x="${x0}" y="${y1 - 13}" width="${x1 - x0}" height="5" fill="${p.d}" opacity=".7"/>`;
    } else if (kind === "towel") {
      const x0 = 34, x1 = 128, y0 = 30, y1 = 158;
      const rail = (xx) => `<rect x="${xx - 4}" y="${y0}" width="8" height="${y1 - y0}" rx="4" fill="${x.lg([[0, p.k], [.35, p.l], [.6, p.m], [1, p.k]], 0, 0, 1, 0)}"/>`;
      s += rail(x0) + rail(x1);
      for (let y = y0 + 8; y < y1 - 4; y += 10) s += `<rect x="${x0}" y="${y}" width="${x1 - x0}" height="4.4" rx="2.2" fill="${x.lg([[0, p.l], [.5, p.m], [1, p.k]])}"/>`;
      s += `<path d="M52 40H96V112Q74 118 52 112Z" fill="${x.lg([[0, "#d8e6ee"], [1, "#9fb4c0"]], 0, 0, 1, 0)}"/><path d="M52 40H96" stroke="#000" stroke-opacity=".2" stroke-width="3"/><path d="M58 50V108M66 50V110M74 50V111M82 50V110M90 50V109" stroke="#fff" stroke-opacity=".18"/>`;
      s += `<rect x="${x1 - 4}" y="${y1}" width="8" height="10" fill="${p.d}"/>`;
    } else {
      const x0 = 14, x1 = 140, y0 = 66, y1 = 158;
      s += `<rect x="${x0 + 10}" y="${y1}" width="5" height="9" fill="${p.d}"/><rect x="${x1 - 16}" y="${y1}" width="5" height="9" fill="${p.d}"/>`;
      s += `<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" rx="3" fill="${x.lg([[0, p.l], [.15, p.m], [1, p.d]])}"/>`;
      let g = ""; for (let xx = x0 + 6; xx < x1 - 3; xx += 6) g += `M${xx} ${y0 + 9}V${y1 - 5}`;
      s += `<path d="${g}" stroke="${p.k}" stroke-opacity=".45" stroke-width="1.6"/><path d="${g}" stroke="#fff" stroke-opacity=".22" stroke-width=".6" transform="translate(1.4 0)"/>`;
      s += `<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="8" rx="3" fill="${x.lg([[0, p.l], [1, p.d]])}"/>`;
      for (let xx = x0 + 6; xx < x1 - 3; xx += 4) s += `<rect x="${xx}" y="${y0 + 2}" width="2.2" height="4" rx=".6" fill="${p.k}" opacity=".55"/>`;
    }
    if (heat) {
      const k = x.mode === "boost" ? 1 : x.vpct / 100;
      s += `<rect x="12" y="40" width="130" height="126" fill="${x.lg([[0, "#ff8a3c", 0], [1, "#ff8a3c", (.06 + .1 * k).toFixed(2)]])}"/>`;
      for (let i = 0; i < 4; i++) { const xx = 32 + i * 28; s += `<path class="${P}heat" style="animation-delay:${(i * .45).toFixed(2)}s" d="M${xx} ${kind === "towel" ? 30 : 60}q-5 -8 0 -16t0 -16" fill="none" stroke="#ffd2a8" stroke-width="2" stroke-linecap="round" opacity="${(.2 + .35 * k).toFixed(2)}"/>`; }
    }
    return s;
  }
  function valveBody(x) {
    const ch = x.lg([[0, "#5c6168"], [.35, "#f1f3f5"], [.6, "#b4bac1"], [1, "#4b5057"]]), chH = x.lg([[0, "#5c6168"], [.35, "#f1f3f5"], [.6, "#b4bac1"], [1, "#4b5057"]], 0, 0, 1, 0);
    return shadow(x, 168, 184, 22, 4, .45) +
      `<rect x="161" y="160" width="12" height="24" fill="${chH}"/><rect x="158" y="172" width="18" height="5" rx="1.5" fill="${chH}"/>` +
      `<rect x="132" y="146" width="30" height="11" rx="2" fill="${ch}"/><rect x="138" y="143" width="7" height="17" rx="1.5" fill="${ch}"/>` +
      `<path d="M155 142H181L183 163H153Z" fill="${chH}"/><rect x="151" y="134" width="34" height="9" rx="2" fill="${chH}"/>` +
      `<path d="M153 136H183" stroke="#fff" stroke-opacity=".5" stroke-width=".8"/>`;
  }
  function trvReadout(x, cx, cy, sc, lit) {
    const m = x.mode, col = m === "off" ? "#9aa3ad" : m === "eco" ? "#5fe08a" : m === "boost" ? "#ff6a5a" : "#ffb04a";
    const icon = m === "eco" ? `<path d="M-4 3Q-5 -5 4 -5Q5 3 -4 3ZM-4 3L1 -2" fill="${col}" stroke="${col}" stroke-width=".6"/>`
      : m === "off" ? `<circle r="3.6" fill="none" stroke="${col}" stroke-width="1.3"/><path d="M0 -5V-1" stroke="${col}" stroke-width="1.3" stroke-linecap="round"/>`
      : m === "boost" ? `<path d="M1 -6L-3 1H0L-1 6L3 -1H0Z" fill="${col}"/>`
      : `<path d="M0 -6C3 -2 4 0 4 2A4 4 0 0 1 -4 2C-4 0 -2 -1 -1 -3C-1 -1 0 0 1 0C1 -2 0 -4 0 -6Z" fill="${col}"/>`;
    const big = m === "off" ? "OFF" : `${x.vpct}%`;
    return `<g transform="translate(${f(cx)} ${f(cy)}) scale(${sc})" opacity="${lit ? 1 : .55}">` +
      `<g transform="translate(-13 -5)"${m === "boost" ? ` class="${P}blink"` : ""}>${icon}</g>` +
      `<text x="5" y="3" ${FONT} font-size="9.5" font-weight="700" text-anchor="middle" fill="${lit ? "#fff" : "#9aa3ad"}">${big}</text>` +
      `<text x="0" y="12" ${FONT} font-size="4.6" text-anchor="middle" fill="${col}" letter-spacing=".4">${m === "off" ? "VALVE SHUT" : "VALVE"}</text>` +
      `<rect x="-13" y="14.5" width="26" height="1.6" rx=".8" fill="#fff" opacity=".18"/><rect x="-13" y="14.5" width="${f(26 * x.vpct / 100)}" height="1.6" rx=".8" fill="${col}"/></g>`;
  }
  const HEADS = {
    round(x) {
      const p = pal(x.c1), cx = 168, top = 66, bot = 134, w = 38;
      let s = `<rect x="${cx - w / 2}" y="${top + 6}" width="${w}" height="${bot - top - 6}" rx="5" fill="${x.lg([[0, p.k], [.18, p.d], [.42, p.l], [.62, p.m], [1, p.k]], 0, 0, 1, 0)}"/>`;
      s += `<ellipse cx="${cx}" cy="${top + 6}" rx="${w / 2}" ry="6" fill="${x.lg([[0, p.l], [1, p.m]])}"/><ellipse cx="${cx}" cy="${top + 6}" rx="${w / 2 - 4}" ry="4" fill="none" stroke="${p.d}" stroke-opacity=".5"/>`;
      let rib = ""; for (let i = -16; i <= 16; i += 3.2) rib += `M${f(cx + i)} ${bot - 24}V${bot - 2}`;
      s += `<g clip-path="${x.clip(`M${cx - w / 2} ${bot - 26}H${cx + w / 2}V${bot}H${cx - w / 2}Z`)}"><path d="${rib}" stroke="${p.k}" stroke-opacity=".45" stroke-width="1.2"/><path d="${rib}" stroke="#fff" stroke-opacity=".3" stroke-width=".5" transform="translate(1 0)"/></g>`;
      s += `<path d="M${cx - w / 2} ${bot - 26}H${cx + w / 2}" stroke="${p.k}" stroke-opacity=".35"/>`;
      s += `<circle cx="${cx}" cy="${top + 34}" r="13.5" fill="${p.k}" opacity=".35"/><circle cx="${cx}" cy="${top + 34}" r="12.5" fill="${x.lg([[0, "#0b1016"], [1, "#1b2530"]])}"/>` + trvReadout(x, cx, top + 32, .78, x.mode !== "off");
      s += `<path d="M${cx - 12} ${top + 26}A12 12 0 0 1 ${cx + 4} ${top + 23}" stroke="#fff" stroke-opacity=".18" stroke-width="1.4" fill="none"/>`;
      return s + `<rect x="${cx - w / 2 + 3}" y="${top + 10}" width="4" height="${bot - top - 40}" rx="2" fill="#fff" opacity=".22"/>`;
    },
    square(x) {
      const p = pal(x.c1), x0 = 148, y0 = 72, w = 40, h = 62, lit = x.mode !== "off";
      let s = `<rect x="${x0}" y="${y0}" width="${w}" height="${h}" rx="7" fill="${x.lg([[0, p.l], [.2, p.m], [.8, p.d], [1, p.k]], 0, 0, 1, 0)}"/>`;
      s += `<rect x="${x0}" y="${y0}" width="${w}" height="8" rx="7" fill="${x.lg([[0, p.l], [1, p.m]])}"/>`;
      s += `<rect x="${x0 + 3}" y="${y0 + 3}" width="${w - 6}" height="${h - 6}" rx="5" fill="none" stroke="#fff" stroke-opacity=".12"/>`;
      const col = x.mode === "off" ? "#7a828c" : x.mode === "eco" ? "#5fe08a" : x.mode === "boost" ? "#ff6a5a" : "#ffffff";
      s += `<g opacity="${lit ? 1 : .45}"><text x="${x0 + w / 2}" y="${y0 + 30}" ${FONT} font-size="15" font-weight="800" text-anchor="middle" fill="${col}">${x.mode === "off" ? "OFF" : x.vpct}</text>`;
      let mask = ""; for (let yy = y0 + 16; yy < y0 + 33; yy += 2.2) mask += `M${x0 + 2} ${f(yy)}H${x0 + w - 2}`;
      s += `<path d="${mask}" stroke="${p.m}" stroke-width=".9"/>`;
      let mk = ""; for (let xx = x0 + 3; xx < x0 + w - 2; xx += 2.2) mk += `M${f(xx)} ${y0 + 15}V${y0 + 34}`;
      s += `<path d="${mk}" stroke="${p.m}" stroke-width=".9"/>`;
      s += `<text x="${x0 + w / 2}" y="${y0 + 42}" ${FONT} font-size="5.5" text-anchor="middle" fill="${col}" opacity=".9">${x.mode === "off" ? "" : "% OPEN"}</text></g>`;
      s += `<g transform="translate(${x0 + w / 2} ${y0 + 52})">` + (x.mode === "boost" ? `<g class="${P}blink"><path d="M1 -5L-3 1H0L-1 5L3 -1H0Z" fill="#ff6a5a"/></g>` : x.mode === "eco" ? `<path d="M-4 3Q-5 -5 4 -5Q5 3 -4 3Z" fill="#5fe08a"/>` : x.mode === "heat" ? `<path d="M0 -5C3 -2 4 0 4 2A4 4 0 0 1 -4 2C-4 0 -2 -1 -1 -3C-1 -1 0 0 1 0C1 -2 0 -4 0 -5Z" fill="#ffb04a"/>` : `<circle r="1.4" fill="#5a626b"/>`) + `</g>`;
      return s + `<rect x="${x0 + 4}" y="${y0 + 6}" width="3" height="${h - 14}" rx="1.5" fill="#fff" opacity=".16"/>`;
    },
    display(x) {
      const p = pal(x.c1), cx = 168, top = 62, bot = 134, w = 40;
      let s = `<rect x="${cx - w / 2}" y="${top}" width="${w}" height="${bot - top}" rx="9" fill="${x.lg([[0, p.k], [.16, p.d], [.4, p.l], [.6, p.m], [1, p.k]], 0, 0, 1, 0)}"/>`;
      s += `<rect x="${cx - w / 2}" y="${top}" width="${w}" height="14" rx="9" fill="${x.lg([[0, p.l], [1, p.m]])}"/>`;
      s += `<ellipse cx="${cx}" cy="${top + 4}" rx="13" ry="2.4" fill="#fff" opacity=".25"/>`;
      s += `<rect x="${cx - 15}" y="${top + 18}" width="30" height="40" rx="5" fill="${x.lg([[0, "#0a0e13"], [1, "#18212b"]])}" stroke="${p.k}" stroke-opacity=".5"/>`;
      s += trvReadout(x, cx, top + 36, .95, x.mode !== "off");
      s += `<path d="M${cx - 13} ${top + 21}L${cx + 4} ${top + 21}L${cx - 13} ${top + 40}Z" fill="#fff" opacity=".06"/>`;
      s += `<circle cx="${cx}" cy="${top + 64}" r="2" fill="${x.on && x.mode !== "off" ? "#5fe08a" : p.d}"/>`;
      let rib = ""; for (let i = -17; i <= 17; i += 3) rib += `M${f(cx + i)} ${bot - 12}V${bot - 1}`;
      s += `<g clip-path="${x.clip(`M${cx - w / 2} ${bot - 13}H${cx + w / 2}V${bot}H${cx - w / 2}Z`)}"><path d="${rib}" stroke="${p.k}" stroke-opacity=".4" stroke-width="1.1"/></g>`;
      return s + `<rect x="${cx - w / 2 + 3}" y="${top + 12}" width="3.4" height="${bot - top - 30}" rx="1.7" fill="#fff" opacity=".2"/>`;
    },
  };
  const TRV_OPTS = [
    { id: "mode", name: "Mode", values: [["heat", "Heat"], ["eco", "Eco"], ["off", "Off"], ["boost", "Boost"]] },
    { id: "rad", name: "Radiator", values: [["panel", "Panel"], ["column", "Column"], ["towel", "Towel rail"]] },
  ];
  function trv(o, head, rad) {
    const x = X(o); x.mode = x.opt("mode", "heat");
    x.vpct = x.mode === "off" ? 0 : x.mode === "boost" ? 100 : x.on ? Math.round(x.lv * 100) : 0;
    const bg = radiator(x, x.opt("rad", rad));
    let item = valveBody(x) + HEADS[head](x);
    if (x.mode === "boost") item += `<circle class="${P}ring" cx="168" cy="100" r="30" fill="none" stroke="#ff6a5a" stroke-width="1.6" opacity=".5"/>`;
    return wrap(x, bg, item);
  }
  const trvCard = (id, name, head, rad) => ({ id, name, colors: ["#f2f2ee", "#d6d9dd", "#3a3d42", "#1c1d20", "#c9b48a"], picker: true, colorLabel: "Body",
    colors2: ["#f0eee8", "#2e3135", "#8d939a", "#b84a3a", "#3e5f4a"], picker2: true, colorLabel2: "Radiator",
    options: [TRV_OPTS[0], firstIs(TRV_OPTS[1], rad)], render: (o) => trv(o, head, rad) });

  const PERG_OPTS = [
    { id: "state", name: "State", values: [["open", "Open"], ["closing", "Closing"], ["closed", "Closed"], ["partial", "Partial"]] },
    { id: "lights", name: "Lights", values: [["off", "Off"], ["on", "On"], ["dim", "Dim"]] },
  ];
  function pergAng(x) { const s = x.opt("state", "open"); if (!x.on || s === "closed") return 0; return s === "partial" ? x.lv * .5 : x.lv; }
  function closeCls(x, r) { if (x.opt("state", "open") !== "closing" || !x.on) return ""; const k = 1 / Math.max(r, .15); return P + (k < 1.6 ? "cl1" : k < 2.5 ? "cl2" : k < 4 ? "cl3" : "cl4"); }
  function pergola(o) {
    const x = X(o), a = pergAng(x), p = pal(x.c1), lights = x.opt("lights", "off"), lc = x.c2;
    const lk = lights === "on" ? 1 : lights === "dim" ? .45 : 0;
    let bg = sky(x, 128) + `<path d="M0 118H200V200H0Z" fill="${x.lg([[0, "#9a7a5a"], [1, "#5e4530"]])}"/>`;
    for (let i = 0; i < 14; i++) bg += `<path d="M${-60 + i * 24} 200L${f(40 + i * 9)} 118" stroke="#3a2a1c" stroke-opacity=".35"/>`;
    bg += `<rect x="40" y="128" width="40" height="18" rx="3" fill="#cfc8bc"/><rect x="40" y="122" width="40" height="8" rx="3" fill="#e8e2d6"/><rect x="118" y="126" width="26" height="14" rx="2" fill="#6a5040"/>`;
    const bk = { y: 46, l: 48, r: 152 }, fr = { y: 76, l: 22, r: 178 }, beam = 9;
    const at = (t) => ({ y: bk.y + (fr.y - bk.y) * t, l: bk.l + (fr.l - bk.l) * t, r: bk.r + (fr.r - bk.r) * t });
    const post = (x0, y0, y1, w) => `<rect x="${f(x0 - w / 2)}" y="${y0}" width="${w}" height="${y1 - y0}" fill="${x.lg([[0, p.k], [.3, p.l], [.6, p.m], [1, p.d]], 0, 0, 1, 0)}"/>`;
    let s = shadow(x, 100, 176, 92, 10, .35);
    if (lk) s += `<ellipse cx="100" cy="150" rx="80" ry="22" fill="${x.rg([[0, lc, .55 * lk], [1, lc, 0]])}"/>`;
    s += post(bk.l + 4, bk.y + beam, 146, 7) + post(bk.r - 4, bk.y + beam, 146, 7);
    s += `<path d="M${bk.l} ${bk.y}H${bk.r}V${bk.y + beam}H${bk.l}Z" fill="${p.d}"/>`;
    s += `<path d="M${bk.l} ${bk.y}L${fr.l} ${fr.y}V${fr.y + beam}L${bk.l} ${bk.y + beam}Z" fill="${p.k}"/><path d="M${bk.r} ${bk.y}L${fr.r} ${fr.y}V${fr.y + beam}L${bk.r} ${bk.y + beam}Z" fill="${p.d}"/>`;
    if (lk) s += `<path d="M${bk.l + 2} ${bk.y + beam - 1}H${bk.r - 2}M${bk.l + 1} ${bk.y + beam}L${fr.l + 3} ${fr.y + beam}M${bk.r - 1} ${bk.y + beam}L${fr.r - 3} ${fr.y + beam}" stroke="${H().mix(lc, "#ffffff", .5)}" stroke-width="2" opacity="${(.5 + .5 * lk).toFixed(2)}"/>`;
    const n = 11, ang = a * Math.PI / 2;
    for (let i = 0; i < n; i++) {
      const t0 = (i + .5) / n, c = at(t0), pitch = (fr.y - bk.y) / n, hw = Math.max(.35, pitch / 2 * Math.cos(ang) * 1.05), th = 1.2 + Math.sin(ang) * 4.5 * (.6 + t0 * .5);
      const top = c.y - hw, bot = c.y + hw, cls = closeCls(x, hw / (pitch / 2 * 1.05));
      const blade = x.lg([[0, p.l], [1, p.m]]);
      s += `<g class="${cls}"><path d="M${f(c.l + 1)} ${f(top - th * .5)}H${f(c.r - 1)}V${f(bot - th * .5)}H${f(c.l + 1)}Z" fill="${blade}"/>` +
        `<path d="M${f(c.l + 1)} ${f(bot - th * .5)}H${f(c.r - 1)}V${f(bot + th * .5)}H${f(c.l + 1)}Z" fill="${p.k}"/>` +
        `<path d="M${f(c.l + 1)} ${f(top - th * .5)}H${f(c.r - 1)}" stroke="#fff" stroke-opacity=".3" stroke-width=".5"/></g>`;
    }
    s += post(fr.l + 5, fr.y + beam, 176, 10) + post(fr.r - 5, fr.y + beam, 176, 10);
    s += `<rect x="${fr.l - 2}" y="${fr.y - 1}" width="${fr.r - fr.l + 4}" height="${beam + 3}" fill="${x.lg([[0, p.l], [.3, p.m], [1, p.d]])}"/><path d="M${fr.l - 2} ${fr.y - 1}H${fr.r + 2}" stroke="#fff" stroke-opacity=".3"/>`;
    s += `<rect x="${fr.l + .5}" y="174" width="9" height="3" fill="${p.k}"/><rect x="${fr.r - 9.5}" y="174" width="9" height="3" fill="${p.k}"/>`;
    if (lk) s += `<path d="M${fr.l + 2} ${fr.y + beam + 2}H${fr.r - 2}" stroke="${H().mix(lc, "#ffffff", .5)}" stroke-width="1.6" opacity="${(.4 + .5 * lk).toFixed(2)}"/>`;
    if (x.on && x.opt("state", "open") === "closing") s += chevrons(x, 100, 104, "down");
    return wrap(x, bg, s);
  }
  function pergolaUp(o) {
    const x = X(o), a = pergAng(x), p = pal(x.c1), lights = x.opt("lights", "off"), lc = x.c2;
    const lk = lights === "on" ? 1 : lights === "dim" ? .45 : 0;
    const bg = `<rect width="200" height="200" fill="${x.lg([[0, "#3d84d0"], [1, "#a8d2f2"]], 0, 0, 1, 1)}"/><g fill="#fff" opacity=".85"><ellipse cx="70" cy="80" rx="26" ry="8"/><ellipse cx="84" cy="74" rx="14" ry="8"/><ellipse cx="140" cy="140" rx="20" ry="6"/></g>`;
    const x0 = 34, x1 = 166, y0 = 34, y1 = 166, n = 9, pitch = (y1 - y0) / n, ang = a * Math.PI / 2;
    let s = "";
    for (let i = 0; i < n; i++) {
      const cy = y0 + (i + .5) * pitch, hw = Math.max(.4, pitch / 2 * Math.cos(ang) * 1.04), ed = Math.sin(ang) * 3.4, cls = closeCls(x, hw / (pitch / 2 * 1.04));
      s += `<g class="${cls}"><rect x="${x0}" y="${f(cy - hw)}" width="${x1 - x0}" height="${f(hw * 2)}" fill="${x.lg([[0, p.m], [.5, p.d], [1, p.k]])}"/>` +
        (ed > .3 ? `<rect x="${x0}" y="${f(cy + hw - .2)}" width="${x1 - x0}" height="${f(ed)}" fill="${p.k}"/>` : "") +
        `<path d="M${x0} ${f(cy - hw + .4)}H${x1}" stroke="#fff" stroke-opacity=".18" stroke-width=".6"/></g>`;
    }
    const ring = `M14 14H186V186H14ZM${x0} ${y0}V${y1}H${x1}V${y0}Z`;
    s += `<path d="${ring}" fill-rule="evenodd" fill="${p.d}"/>`;
    s += `<path d="M14 14L${x0} ${y0}H${x1}L186 14Z" fill="${p.k}"/><path d="M14 186L${x0} ${y1}H${x1}L186 186Z" fill="${p.l}"/><path d="M14 14L${x0} ${y0}V${y1}L14 186Z" fill="${p.m}"/><path d="M186 14L${x1} ${y0}V${y1}L186 186Z" fill="${p.d}"/>`;
    s += `<path d="M${x0} ${y0}H${x1}V${y1}H${x0}Z" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="1.5"/>`;
    [[14, 14], [186, 14], [14, 186], [186, 186]].forEach(([cx, cy]) => { s += `<rect x="${cx - 10}" y="${cy - 10}" width="20" height="20" fill="${x.lg([[0, p.l], [1, p.k]], 0, 0, 1, 1)}"/>`; });
    if (lk) {
      const lw = H().mix(lc, "#ffffff", .55);
      s += `<path d="M${x0 + 3} ${y0 + 3}H${x1 - 3}V${y1 - 3}H${x0 + 3}Z" fill="none" stroke="${lc}" stroke-width="6" opacity="${(.3 * lk).toFixed(2)}" filter="${x.blur(3)}"/>`;
      s += `<path d="M${x0 + 2} ${y0 + 2}H${x1 - 2}V${y1 - 2}H${x0 + 2}Z" fill="none" stroke="${lw}" stroke-width="1.8" opacity="${(.55 + .45 * lk).toFixed(2)}"/>`;
    }
    s += `<rect x="${x1 + 2}" y="92" width="7" height="16" rx="2" fill="${p.k}"/><circle cx="${x1 + 5.5}" cy="96" r="1.2" fill="${x.on ? "#5fe08a" : "#555"}"/>`;
    if (x.on && x.opt("state", "open") === "closing") s += chevrons(x, 100, 100, "down");
    return wrap(x, bg, s);
  }
  const FRAME = ["#3a3d42", "#f2f2ee", "#6b5a48", "#cfc6b4", "#1e2024"], LIGHT = ["#ffd8a8", "#fff3e0", "#a5d8ff", "#ffc9de", "#b5f5c8"];
  const pergCard = (id, name, fn) => ({ id, name, colors: FRAME, picker: true, colorLabel: "Frame", colors2: LIGHT, picker2: true, colorLabel2: "Lights",
    options: PERG_OPTS, render: fn });

  const MOTION = { id: "motion", name: "Motion", values: [["stopped", "Stopped"], ["opening", "Extending"], ["closing", "Retracting"]] };
  function sail(o) {
    const x = X(o), e = x.on ? cl(x.lv, .06, 1) : .06, p = pal(x.c1), mv = x.opt("motion", "stopped");
    let bg = sky(x, 150) + `<path d="M0 140H200V200H0Z" fill="${x.lg([[0, "#4f8c44"], [1, "#2e5a2a"]])}"/>` + `<path d="M0 150L200 132V200H0Z" fill="#c9b9a0" opacity=".9"/>`;
    bg += `<rect x="0" y="20" width="26" height="160" fill="${x.lg([[0, "#e2d8c6"], [1, "#b8ac98"]], 0, 0, 1, 0)}"/><path d="M26 20V180" stroke="#000" stroke-opacity=".25" stroke-width="2"/>`;
    const A1 = [28, 66], A2 = [28, 40], B1 = [172, 98], B2 = [152, 62];
    const L = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
    const E1 = L(A1, B1, e), E2 = L(A2, B2, e);
    let s = "";
    s += `<path d="M${f(40)} 158L${f(40 + 120 * e)} ${f(158 - 8 * e)}L${f(30 + 112 * e)} ${f(146 - 6 * e)}L30 146Z" fill="#000" opacity="${(.12 + .18 * e).toFixed(2)}" filter="${x.blur(2)}"/>`;
    const post = (pt, y1, w) => `<rect x="${f(pt[0] - w / 2)}" y="${f(pt[1])}" width="${w}" height="${f(y1 - pt[1])}" fill="${x.lg([[0, "#3a3d42"], [.4, "#c8ccd1"], [1, "#3a3d42"]], 0, 0, 1, 0)}"/>`;
    s += shadow(x, B2[0], 150, 10, 2.5, .4) + post(B2, 150, 4) + shadow(x, B1[0], 180, 12, 3, .45) + post(B1, 180, 5);
    s += `<path d="M${A1[0]} ${A1[1]}L${B1[0]} ${B1[1]}M${A2[0]} ${A2[1]}L${B2[0]} ${B2[1]}" stroke="#d8dde2" stroke-width=".9" opacity=".8"/>`;
    const folds = 7;
    for (let i = 0; i < folds; i++) {
      const t0 = i / folds * e, t1 = (i + 1) / folds * e, a1 = L(A1, B1, t0), a2 = L(A2, B2, t0), b1 = L(A1, B1, t1), b2 = L(A2, B2, t1), sag = 2 + 5 * e;
      const mid1 = L(a1, b1, .5), mid2 = L(a2, b2, .5);
      s += `<path d="M${f(a2[0])} ${f(a2[1])}Q${f(mid2[0])} ${f(mid2[1] + sag)} ${f(b2[0])} ${f(b2[1])}L${f(b1[0])} ${f(b1[1])}Q${f(mid1[0])} ${f(mid1[1] + sag)} ${f(a1[0])} ${f(a1[1])}Z" fill="${x.lg([[0, p.l], [.5, p.m], [1, p.d]], 0, 0, 1, 1)}" stroke="${p.k}" stroke-opacity=".35" stroke-width=".6"/>`;
      s += `<path d="M${f(b2[0])} ${f(b2[1])}L${f(b1[0])} ${f(b1[1])}" stroke="${p.k}" stroke-width="1.1" opacity=".55"/>`;
    }
    s += `<path d="M${A2[0]} ${A2[1]}L${f(E2[0])} ${f(E2[1])}L${f(E1[0])} ${f(E1[1])}L${A1[0]} ${A1[1]}Z" fill="${x.lg([[0, "#fff", .22], [.5, "#fff", 0]], 0, 0, 1, 1)}"/>`;
    s += `<path d="M${f(E1[0])} ${f(E1[1])}L${f(E2[0])} ${f(E2[1])}" stroke="${H().shade(x.c1, -.5)}" stroke-width="2.6" stroke-linecap="round"/><circle cx="${f(E1[0])}" cy="${f(E1[1])}" r="2" fill="#9aa1a9"/><circle cx="${f(E2[0])}" cy="${f(E2[1])}" r="1.8" fill="#9aa1a9"/>`;
    s += `<rect x="20" y="34" width="12" height="38" rx="3" fill="${x.lg([[0, "#f2f2ee"], [1, "#a8adb3"]], 0, 0, 1, 0)}"/><circle cx="26" cy="38" r="1.3" fill="${mv !== "stopped" && x.on ? "#5fe08a" : "#777"}"/>`;
    if (x.on && mv !== "stopped") s += chevrons(x, 100, 124, mv === "opening" ? "right" : "left");
    return wrap(x, bg, s);
  }
  function awning(o) {
    const x = X(o), e = x.on ? x.lv : 0, mv = x.opt("motion", "stopped"), fab = x.c1, fab2 = x.c2;
    let bg = siding(x, "#bfc5cc");
    bg += `<rect x="62" y="82" width="76" height="98" fill="#2a3038"/><rect x="66" y="86" width="68" height="94" fill="${x.lg([[0, "#4a5a6a"], [1, "#1c232c"]])}"/><path d="M100 86V180" stroke="#e8e8e4" stroke-width="3"/><path d="M68 88L96 88L68 140Z" fill="#fff" opacity=".1"/>`;
    bg += `<rect x="58" y="78" width="84" height="5" fill="#e8e8e4"/><rect x="0" y="180" width="200" height="20" fill="#8a8478"/><rect y="178" width="200" height="3" fill="#a8a294"/>`;
    const y0 = 40, l0 = 22, r0 = 178, y1 = y0 + 6 + e * 74, l1 = l0 - e * 10, r1 = r0 + e * 10;
    let s = "";
    if (e > .05) s += `<path d="M${l0} ${y0 + 10}H${r0}L${f(r1)} ${f(y1 + 40 * e)}H${f(l1)}Z" fill="#000" opacity="${(.1 + .15 * e).toFixed(2)}" filter="${x.blur(3)}"/>`;
    if (e > .05) {
      [[l0 + 18, l1 + 18], [r0 - 18, r1 - 18]].forEach(([ax, bx]) => {
        const ex = (ax + bx) / 2 + (ax < 100 ? 16 : -16) * (1 - e), ey = y0 + 18 + (y1 - y0) * .5 + 6;
        s += `<path d="M${f(ax)} ${y0 + 16}L${f(ex)} ${f(ey)}L${f(bx)} ${f(y1)}" fill="none" stroke="#5a6068" stroke-width="2.6" stroke-linejoin="round"/><circle cx="${f(ex)}" cy="${f(ey)}" r="2.2" fill="#8a9098"/>`;
      });
    }
    if (e > .02) {
      const nS = 10; let stripes = "";
      for (let i = 0; i < nS; i++) {
        const u0 = i / nS, u1 = (i + 1) / nS, xa0 = l0 + (r0 - l0) * u0, xa1 = l0 + (r0 - l0) * u1, xb0 = l1 + (r1 - l1) * u0, xb1 = l1 + (r1 - l1) * u1;
        stripes += `<path d="M${f(xa0)} ${y0 + 6}H${f(xa1)}L${f(xb1)} ${f(y1)}H${f(xb0)}Z" fill="${i % 2 ? fab2 : fab}"/>`;
      }
      s += stripes + `<path d="M${l0} ${y0 + 6}H${r0}L${f(r1)} ${f(y1)}H${f(l1)}Z" fill="${x.lg([[0, "#000", .3], [.4, "#000", .05], [1, "#fff", .12]])}"/>`;
      const vh = 9; let v = `M${f(l1)} ${f(y1)}`;
      const nV = 10; for (let i = 0; i < nV; i++) { const xa = l1 + (r1 - l1) * i / nV, xb = l1 + (r1 - l1) * (i + 1) / nV; v += `L${f(xa)} ${f(y1 + vh - 2)}Q${f((xa + xb) / 2)} ${f(y1 + vh + 3)} ${f(xb)} ${f(y1 + vh - 2)}`; }
      v += `L${f(r1)} ${f(y1)}Z`;
      s += `<g clip-path="${x.clip(v)}">` + Array.from({ length: nV }, (_, i) => `<rect x="${f(l1 + (r1 - l1) * i / nV)}" y="${f(y1)}" width="${f((r1 - l1) / nV + .3)}" height="${vh + 4}" fill="${i % 2 ? fab2 : fab}"/>`).join("") + `<rect x="${f(l1)}" y="${f(y1)}" width="${f(r1 - l1)}" height="${vh + 4}" fill="${x.lg([[0, "#000", .05], [1, "#000", .3]])}"/></g>`;
      s += `<rect x="${f(l1 - 2)}" y="${f(y1 - 2.5)}" width="${f(r1 - l1 + 4)}" height="4" rx="1.5" fill="${x.lg([[0, "#f2f2ee"], [1, "#8d939a"]])}"/>`;
    }
    s += `<rect x="${l0 - 4}" y="${y0 - 4}" width="${r0 - l0 + 8}" height="12" rx="5" fill="${x.lg([[0, "#ffffff"], [.5, "#d8dce0"], [1, "#8d939a"]])}"/><path d="M${l0} ${y0 + 6}H${r0}" stroke="#000" stroke-opacity=".3"/>`;
    s += `<circle cx="${r0 - 2}" cy="${y0 + 2}" r="1.3" fill="${mv !== "stopped" && x.on ? "#5fe08a" : "#888"}"/>`;
    if (x.on && mv !== "stopped") s += chevrons(x, 100, Math.min(160, y1 + 30), mv === "opening" ? "down" : "up");
    return wrap(x, bg, s);
  }

  const SCREEN_OPTS = [
    { id: "mount", name: "Mount", values: [["case", "Ceiling case"], ["recessed", "In the ceiling"]] },
    { id: "pic", name: "Picture", values: [["blank", "Blank"], ["movie", "Movie playing"]] },
    { id: "motion", name: "Motion", values: [["stopped", "Stopped"], ["opening", "Lowering"], ["closing", "Raising"]] },
  ];
  function screen(o) {
    const x = X(o), e = x.on ? x.lv : 0, p = pal(x.c1), rec = x.opt("mount", "case") === "recessed", mv = x.opt("motion", "stopped");
    let bg = room(x, "#57525e") + `<rect width="200" height="30" fill="${x.lg([[0, "#d8d4cc"], [1, "#b8b2a8"]])}"/><rect y="29" width="200" height="3" fill="#e8e4dc"/>`;
    bg += `<rect x="150" y="120" width="40" height="46" rx="3" fill="#3a2e26"/><rect x="152" y="116" width="36" height="6" rx="2" fill="#4a3c32"/>`;
    bg += `<rect x="10" y="130" width="34" height="36" rx="4" fill="#26282c"/><circle cx="27" cy="144" r="8" fill="#16181b"/><circle cx="27" cy="144" r="3" fill="#3a3d42"/>`;
    const top = rec ? 30 : 42, x0 = 30, x1 = 170, drop = 10 + e * 112, yb = top + drop;
    let s = "";
    if (!rec) s += `<rect x="${x0 - 8}" y="31" width="${x1 - x0 + 16}" height="12" rx="5" fill="${x.lg([[0, p.l], [.5, p.m], [1, p.d]])}"/><rect x="${x0 - 8}" y="31" width="5" height="12" rx="2" fill="${p.d}"/><rect x="${x1 + 3}" y="31" width="5" height="12" rx="2" fill="${p.d}"/>`;
    else s += `<rect x="${x0 - 6}" y="27" width="${x1 - x0 + 12}" height="4" fill="#1a1a1a"/><rect x="${x0 - 8}" y="26" width="${x1 - x0 + 16}" height="1.6" fill="${p.m}"/>`;
    s += `<rect x="${x0}" y="${top}" width="${x1 - x0}" height="${f(drop)}" fill="#141518"/>`;
    const fieldTop = top + Math.max(0, drop - 92), fh = Math.min(drop, 92) - 3;
    if (fh > 2) {
      s += `<rect x="${x0 + 3}" y="${f(fieldTop)}" width="${x1 - x0 - 6}" height="${f(fh)}" fill="${x.lg([[0, "#f6f6f2"], [1, "#d6d6d0"]])}"/>`;
      if (x.opt("pic", "blank") === "movie" && e > .3) {
        const fx0 = x0 + 3, fw = x1 - x0 - 6, fy = fieldTop, fhh = fh;
        s += `<g clip-path="${x.clip(`M${fx0} ${f(fy)}H${fx0 + fw}V${f(fy + fhh)}H${fx0}Z`)}">` +
          `<rect x="${fx0}" y="${f(fy)}" width="${fw}" height="${f(fhh)}" fill="${x.lg([[0, "#f2994a"], [.55, "#f7c873"], [1, "#2d5f6e"]])}"/>` +
          `<circle cx="${fx0 + fw * .64}" cy="${f(fy + fhh * .52)}" r="${f(fhh * .16)}" fill="#fff4c8"/>` +
          `<path d="M${fx0} ${f(fy + fhh * .7)}L${fx0 + fw * .2} ${f(fy + fhh * .5)}L${fx0 + fw * .38} ${f(fy + fhh * .66)}L${fx0 + fw * .56} ${f(fy + fhh * .46)}L${fx0 + fw} ${f(fy + fhh * .72)}V${f(fy + fhh)}H${fx0}Z" fill="#2a3a4a"/>` +
          `<rect class="${P}flick" x="${fx0}" y="${f(fy)}" width="${fw}" height="${f(fhh)}" fill="#fff" opacity="0"/></g>`;
      }
    }
    s += `<rect x="${x0}" y="${top}" width="${x1 - x0}" height="${f(drop)}" fill="${x.lg([[0, "#000", .12], [.2, "#fff", .06], [.6, "#000", 0], [1, "#000", .18]], 0, 0, 1, 0)}"/>`;
    s += `<rect x="${x0 - 1}" y="${f(yb - 1)}" width="${x1 - x0 + 2}" height="5" rx="2" fill="${x.lg([[0, "#4a4e55"], [1, "#16181b"]])}"/>`;
    s += `<path d="M98 ${f(yb + 4)}V${f(yb + 10)}" stroke="#888" stroke-width=".8"/><circle cx="98" cy="${f(yb + 11)}" r="1.4" fill="#2a2a2a"/>`;
    s += shadow(x, 100, yb + 12, 70, 3, .25);
    if (x.on && mv !== "stopped") s += chevrons(x, 184 - 6, Math.min(150, yb), mv === "opening" ? "down" : "up");
    return wrap(x, bg, s);
  }

  function detect(x, cx, cy, col) {
    if (!x.on) return "";
    let s = `<path d="M${cx} ${cy}L${cx - 70} ${cy + 80}A106 106 0 0 0 ${cx + 70} ${cy + 80}Z" fill="${x.lg([[0, col, .32], [1, col, 0]])}"/>`;
    for (let i = 0; i < 3; i++) s += `<path class="${P}wave" style="animation-delay:${(i * .5).toFixed(2)}s" d="M${cx - 20} ${cy + 22}A30 30 0 0 0 ${cx + 20} ${cy + 22}" transform="translate(0 0)" fill="none" stroke="${col}" stroke-width="2" stroke-linecap="round" opacity="${(.8 - i * .2).toFixed(2)}"/>`;
    return s;
  }
  function fresnel(x, cx, cy, r, dome) {
    let s = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${x.rg([[0, "#f4f4f0"], [.6, "#d6d6d0"], [1, "#8d8d88"]], .38, .32, .8)}"/>`;
    let g = ""; for (let i = -r + 4; i < r; i += 4.5) { const hh = Math.sqrt(Math.max(0, r * r - i * i)); g += `M${f(cx + i)} ${f(cy - hh)}V${f(cy + hh)}`; }
    if (dome) for (let j = -r + 5; j < r; j += 6) { const ww = Math.sqrt(Math.max(0, r * r - j * j)); g += `M${f(cx - ww)} ${f(cy + j)}H${f(cx + ww)}`; }
    s += `<path d="${g}" stroke="#7a7a74" stroke-opacity=".4" stroke-width=".6"/>`;
    return s + `<ellipse cx="${f(cx - r * .3)}" cy="${f(cy - r * .4)}" rx="${f(r * .38)}" ry="${f(r * .2)}" fill="#fff" opacity=".55"/>`;
  }
  const PIR_STYLES = {
    dome(x) {
      const p = pal(x.c1), cx = 100, cy = 92;
      let s = shadow(x, 104, 150, 40, 8, .35);
      s += `<rect x="70" y="44" width="60" height="78" rx="12" fill="${x.lg([[0, p.l], [.5, p.m], [1, p.d]], 0, 0, 1, 0)}"/>`;
      s += `<path d="M62 70Q62 40 100 40Q138 40 138 70V96Q138 88 100 86Q62 88 62 96Z" fill="${x.lg([[0, p.l], [.6, p.m], [1, p.k]])}"/>`;
      s += `<path d="M66 70Q68 46 100 45Q132 46 134 70" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1.2"/>`;
      s += `<circle cx="${cx}" cy="${cy + 6}" r="24" fill="${p.k}"/>` + fresnel(x, cx, cy + 6, 21, true);
      s += `<path d="M64 96Q100 84 136 96" stroke="${p.k}" stroke-width="2.4" fill="none"/>`;
      return [s, cx, cy + 6, `<circle class="${x.on ? P + "blink" : ""}" cx="120" cy="118" r="2" fill="${x.on ? "#ff4d4d" : "#55302f"}"/>`];
    },
    box(x) {
      const p = pal(x.c1), cx = 100, cy = 104;
      let s = shadow(x, 104, 154, 40, 8, .35);
      s += `<rect x="64" y="56" width="72" height="84" rx="6" fill="${x.lg([[0, p.l], [.55, p.m], [1, p.d]], 0, 0, 1, 0)}"/>`;
      s += `<path d="M58 52H142L138 74H62Z" fill="${x.lg([[0, p.l], [1, p.k]])}"/><path d="M58 52H142" stroke="#fff" stroke-opacity=".35"/>`;
      s += `<rect x="72" y="80" width="56" height="48" rx="5" fill="${p.k}"/>`;
      s += `<rect x="75" y="83" width="50" height="42" rx="4" fill="${x.lg([[0, "#f2f2ee"], [.5, "#cfcfca"], [1, "#9a9a94"]])}"/>`;
      let g = ""; for (let i = 79; i < 124; i += 5) g += `M${i} 84V124`; g += "M76 98H124M76 112H124";
      s += `<path d="${g}" stroke="#6a6a64" stroke-opacity=".35" stroke-width=".7"/><rect x="77" y="85" width="20" height="8" rx="3" fill="#fff" opacity=".4"/>`;
      return [s, cx, cy, `<circle class="${x.on ? P + "blink" : ""}" cx="100" cy="134" r="2" fill="${x.on ? "#ff4d4d" : "#55302f"}"/>`];
    },
    swivel(x) {
      const p = pal(x.c1), cx = 104, cy = 108;
      let s = shadow(x, 106, 154, 36, 7, .35);
      s += `<rect x="64" y="50" width="34" height="58" rx="8" fill="${x.lg([[0, p.l], [.5, p.m], [1, p.d]], 0, 0, 1, 0)}"/>`;
      s += `<path d="M80 92L96 104" stroke="${p.d}" stroke-width="12" stroke-linecap="round"/><path d="M80 92L96 104" stroke="${p.l}" stroke-width="4" stroke-linecap="round" opacity=".6"/>`;
      s += `<circle cx="${cx}" cy="${cy}" r="30" fill="${x.rg([[0, p.l], [.7, p.m], [1, p.k]], .35, .3, .8)}"/>`;
      s += `<path d="M${cx - 30} ${cy - 4}A30 30 0 0 1 ${cx + 30} ${cy - 4}Q${cx} ${cy - 16} ${cx - 30} ${cy - 4}Z" fill="${p.l}" opacity=".6"/>`;
      s += fresnel(x, cx, cy + 4, 19, true);
      return [s, cx, cy + 4, `<circle class="${x.on ? P + "blink" : ""}" cx="${cx + 22}" cy="${cy + 20}" r="1.8" fill="${x.on ? "#ff4d4d" : "#55302f"}"/>`];
    },
  };
  const PIR_OPT = { id: "style", name: "Style", values: [["dome", "Hooded dome"], ["box", "Box with hood"], ["swivel", "Swivel ball"]] };
  function pirOut(o, wall, def) {
    const x = X(o), st = x.opt("style", def);
    const bg = (wall === "brick" ? brick(x) : wall === "stucco" ? stucco(x) : siding(x, "#7d8a96")) + `<rect x="0" y="176" width="200" height="24" fill="#3e6a36"/>`;
    const [body, lx, ly, led] = PIR_STYLES[st](x);
    return wrap(x, bg, detect(x, lx, ly, "#ff6b5a") + body + led);
  }
  const pirCard = (id, name, wall, def) => ({ id, name, colors: ["#f2f2ee", "#26282c", "#8d939a", "#5a4a3a"], picker: true, colorLabel: "Body",
    options: [firstIs(PIR_OPT, def)], render: (o) => pirOut(o, wall, def) });

  function curtain(o) {
    const x = X(o), p = pal(x.c1), side = x.opt("mount", "top") === "side";
    let bg = room(x, "#a49cae");
    const wx0 = 40, wx1 = 160, wy0 = 46, wy1 = 152;
    bg += `<rect x="${wx0}" y="${wy0}" width="${wx1 - wx0}" height="${wy1 - wy0}" fill="${x.lg([[0, "#3a8ad8"], [.6, "#8ac4ee"], [1, "#d6edf8"]])}"/>`;
    bg += `<path d="M${wx0} 126Q100 116 ${wx1} 124V${wy1}H${wx0}Z" fill="#5a9a48"/><circle cx="70" cy="110" r="14" fill="#3f7f38"/><rect x="69" y="112" width="3" height="20" fill="#5a3e2a"/>`;
    bg += `<path d="M${wx0 - 10} ${wy0 - 10}H${wx1 + 10}V${wy1 + 10}H${wx0 - 10}Z M${wx0} ${wy0}V${wy1}H${wx1}V${wy0}Z" fill-rule="evenodd" fill="${x.lg([[0, "#f6f4ef"], [1, "#c8c4ba"]], 0, 0, 1, 1)}"/>`;
    bg += `<path d="M100 ${wy0}V${wy1}M${wx0} 100H${wx1}" stroke="#eeeae2" stroke-width="5"/><rect x="${wx0 - 14}" y="${wy1 + 8}" width="${wx1 - wx0 + 28}" height="6" rx="1" fill="#e8e4dc"/>`;
    bg += `<path d="M${wx0} ${wy0}L${wx0 + 40} ${wy0}L${wx0} ${wy0 + 50}Z" fill="#fff" opacity=".1"/>`;
    let s = "";
    if (!side) {
      const sx = 100, sy = 34;
      if (x.on) {
        for (let i = 0; i < 5; i++) { const t = -1 + i * .5, bx = sx + t * 62; s += `<path class="${P}curt" style="animation-delay:${(i * .18).toFixed(2)}s" d="M${sx - 2} ${sy + 4}L${f(bx - 7)} ${wy1}H${f(bx + 7)}L${sx + 2} ${sy + 4}Z" fill="${x.lg([[0, "#ff4d4d", .5], [1, "#ff4d4d", .04]])}"/>`; }
      }
      s += shadow(x, sx, sy + 9, 34, 2.5, .4);
      s += `<rect x="${sx - 32}" y="${sy - 5}" width="64" height="11" rx="5.5" fill="${x.lg([[0, p.l], [.5, p.m], [1, p.d]])}"/>`;
      s += `<rect x="${sx - 14}" y="${sy + 1}" width="28" height="5" rx="2.5" fill="${x.lg([[0, "#f2f2ee"], [1, "#9a9a94"]])}"/>`;
      let g = ""; for (let i = sx - 12; i < sx + 13; i += 3) g += `M${i} ${sy + 1.4}V${sy + 5.6}`; s += `<path d="${g}" stroke="#6a6a64" stroke-opacity=".4" stroke-width=".5"/>`;
      s += `<rect x="${sx - 30}" y="${sy - 4}" width="60" height="2.4" rx="1.2" fill="#fff" opacity=".35"/><circle class="${x.on ? P + "blink" : ""}" cx="${sx + 22}" cy="${sy + 1}" r="1.6" fill="${x.on ? "#ff4d4d" : "#7a4040"}"/>`;
    } else {
      const sx = 172, sy = 70;
      if (x.on) {
        for (let i = 0; i < 5; i++) { const t = -1 + i * .5, by = 100 + t * 50; s += `<path class="${P}curt" style="animation-delay:${(i * .18).toFixed(2)}s" d="M${sx - 4} ${sy + 18}L${wx0} ${f(by - 6)}V${f(by + 6)}L${sx - 4} ${sy + 22}Z" fill="${x.lg([[0, "#ff4d4d", .04], [1, "#ff4d4d", .45]], 0, 0, 1, 0)}"/>`; }
      }
      s += shadow(x, sx + 3, sy + 22, 3, 30, .35);
      s += `<rect x="${sx - 6}" y="${sy - 10}" width="12" height="64" rx="6" fill="${x.lg([[0, p.l], [.5, p.m], [1, p.d]], 0, 0, 1, 0)}"/>`;
      s += `<rect x="${sx - 5}" y="${sy + 8}" width="5" height="26" rx="2.5" fill="${x.lg([[0, "#9a9a94"], [1, "#f2f2ee"]], 0, 0, 1, 0)}"/>`;
      s += `<rect x="${sx + 2}" y="${sy - 8}" width="2.2" height="58" rx="1.1" fill="#fff" opacity=".3"/><circle class="${x.on ? P + "blink" : ""}" cx="${sx}" cy="${sy - 2}" r="1.6" fill="${x.on ? "#ff4d4d" : "#7a4040"}"/>`;
    }
    return wrap(x, bg, s);
  }

  function handle(o) {
    const x = X(o), pos = x.opt("pos", "closed"), hp = pal(x.c1), fc = x.c2, fp = pal(fc);
    const open = pos === "open", tilt = pos === "tilt", sx = open ? 98 : 84;
    let bg = room(x, "#9a92a4");
    bg += `<rect x="72" y="0" width="128" height="200" fill="${x.lg([[0, "#3a8ad8"], [.6, "#8ac4ee"], [1, "#d6edf8"]])}"/><path d="M72 150Q130 136 200 146V200H72Z" fill="#5a9a48"/>`;
    bg += `<rect x="24" y="0" width="${50}" height="200" fill="${x.lg([[0, fp.d], [.4, fp.l], [1, fp.m]], 0, 0, 1, 0)}"/><path d="M74 0V200" stroke="${fp.k}" stroke-width="2"/>`;
    bg += `<rect x="12" y="0" width="12" height="200" fill="#e6e0d4"/>`;
    let s = "";
    const sash = (dx, top) => `<path d="M${sx + dx} ${top}H200V200H${sx}Z" fill="${x.lg([[0, fp.l], [.25, fp.m], [1, fp.d]], 0, 0, 1, 0)}"/>` +
      `<path d="M${sx + dx + 28} ${top + 10}H200V200H${sx + 28}Z" fill="${x.lg([[0, "#fff", .2], [.3, "#fff", .03], [.6, "#fff", .1], [1, "#fff", 0]], 0, 0, 1, 1)}" stroke="#000" stroke-opacity=".25"/>` +
      `<path d="M${sx + dx + 28} ${top + 10}V200" stroke="#000" stroke-opacity=".3" stroke-width="2"/>`;
    if (tilt) s += `<path d="M74 0L${sx + 14} 0L${sx} 200H74Z" fill="#000" opacity=".25"/>` + sash(14, 0);
    else if (open) s += `<rect x="74" y="0" width="${sx - 74}" height="200" fill="#000" opacity=".12"/>` + sash(0, 0);
    else s += sash(0, 0);
    const hx = sx + 14 + (tilt ? 7 : 0), hy = 100;
    s += `<rect x="${hx - 9}" y="${hy - 30}" width="18" height="60" rx="9" fill="#000" opacity=".25" transform="translate(1.5 2)"/>`;
    s += `<rect x="${hx - 9}" y="${hy - 30}" width="18" height="60" rx="9" fill="${x.lg([[0, hp.l], [.5, hp.m], [1, hp.d]], 0, 0, 1, 0)}"/>`;
    s += `<rect x="${hx - 5}" y="${hy + 12}" width="10" height="14" rx="4" fill="${hp.lt ? "#e2e2de" : H().shade(x.c1, -.4)}"/>`;
    s += `<circle class="${x.on ? P + "blink" : ""}" cx="${hx}" cy="${hy + 22}" r="1.6" fill="${x.on ? (pos === "closed" ? "#5fe08a" : "#ffb04a") : "#555"}"/>`;
    if (x.on) s += `<path class="${P}wave" d="M${hx + 12} ${hy + 14}a8 8 0 0 1 0 12M${hx + 16} ${hy + 10}a13 13 0 0 1 0 20" fill="none" stroke="#7dd3fc" stroke-width="1.4" stroke-linecap="round" opacity=".7"/>`;
    const rot = pos === "open" ? 90 : pos === "tilt" ? 180 : 0;
    s += `<g transform="rotate(${rot} ${hx} ${hy - 8})"><path d="M${hx - 7} ${hy - 8}A7 7 0 0 1 ${hx + 7} ${hy - 8}V${hy}H${hx - 7}Z" fill="${hp.d}"/>` +
      `<circle cx="${hx}" cy="${hy - 8}" r="8" fill="${x.rg([[0, hp.l], [.7, hp.m], [1, hp.k]], .35, .3, .8)}"/>` +
      `<path d="M${hx - 4.5} ${hy - 6}L${hx - 3.5} ${hy + 46}Q${hx} ${hy + 51} ${hx + 3.5} ${hy + 46}L${hx + 4.5} ${hy - 6}Z" fill="${x.lg([[0, hp.k], [.35, hp.l], [.6, hp.m], [1, hp.d]], 0, 0, 1, 0)}"/>` +
      `<path d="M${hx - 1.6} ${hy}L${hx - 1.2} ${hy + 42}" stroke="#fff" stroke-opacity=".45" stroke-width="1"/></g>`;
    const word = pos === "open" ? "OPEN" : pos === "tilt" ? "TILTED" : "CLOSED";
    s += `<g transform="translate(${hx} 170)"><rect x="-22" y="-8" width="44" height="14" rx="7" fill="#000" opacity=".45"/><text y="2.5" ${FONT} font-size="7" font-weight="700" text-anchor="middle" fill="${pos === "closed" ? "#5fe08a" : "#ffb04a"}" letter-spacing=".5">${word}</text></g>`;
    return wrap(x, bg, s);
  }

  const icons = [
    trvCard("trvround", "Round valve head", "round", "panel"),
    trvCard("trvsquare", "Square LED valve", "square", "column"),
    trvCard("trvdisplay", "Display valve", "display", "towel"),
    pergCard("pergola", "Louvered pergola", pergola),
    pergCard("pergolaup", "Pergola from below", pergolaUp),
    { id: "sail", name: "Retractable sail", colors: ["#efe6d2", "#3a3d42", "#c84a3a", "#2e6a8a", "#7a9a5a"], picker: true, colorLabel: "Fabric", options: [MOTION], render: sail },
    { id: "awning", name: "Patio awning", colors: ["#2e6a8a", "#c84a3a", "#3e7a4a", "#3a3d42", "#d9a03a"], picker: true, colorLabel: "Stripe", colors2: ["#f2ede0", "#d8d2c4", "#3a3d42"], picker2: true, colorLabel2: "Fabric", options: [MOTION], render: awning },
    { id: "projscreen", name: "Projector screen", colors: ["#f2f2ee", "#26282c", "#b8bdc3"], picker: true, colorLabel: "Case", options: SCREEN_OPTS, render: screen },
    pirCard("pirdome", "Outdoor motion", "siding", "dome"),
    pirCard("pirbox", "Hooded motion box", "brick", "box"),
    { id: "curtainpir", name: "Curtain motion", colors: ["#f2f2ee", "#d6d9dd", "#26282c", "#8d939a"], picker: true, colorLabel: "Body", options: [{ id: "mount", name: "Mount", values: [["top", "Top of frame"], ["side", "Side of frame"]] }], render: curtain },
    { id: "handle", name: "Window handle", colors: ["#c9ccd0", "#f2f2ee", "#26282c", "#b8955a"], picker: true, colorLabel: "Handle", colors2: ["#f4f3ef", "#3a3d42", "#6a4a32", "#8d939a"], picker2: true, colorLabel2: "Frame",
      options: [{ id: "pos", name: "Position", values: [["closed", "Closed"], ["tilt", "Tilted"], ["open", "Open"]] }], render: handle },
  ];

  const css = `
@keyframes hda-covers2-chev{0%{opacity:.1}50%{opacity:1}100%{opacity:.1}}
.hda-anim .hda-covers2-chev{animation:hda-covers2-chev 1s ease-in-out infinite}
@keyframes hda-covers2-heat{0%{opacity:0;transform:translateY(8px)}40%{opacity:1}100%{opacity:0;transform:translateY(-14px)}}
.hda-anim .hda-covers2-heat{animation:hda-covers2-heat 2.6s ease-in infinite;transform-box:fill-box}
@keyframes hda-covers2-blink{0%,55%{opacity:1}65%,100%{opacity:.25}}
.hda-anim .hda-covers2-blink{animation:hda-covers2-blink 1.1s steps(1) infinite}
@keyframes hda-covers2-ring{0%{opacity:.7;transform:scale(.8)}100%{opacity:0;transform:scale(1.25)}}
.hda-anim .hda-covers2-ring{animation:hda-covers2-ring 1.6s ease-out infinite;transform-box:fill-box;transform-origin:center}
@keyframes hda-covers2-wave{0%{opacity:.9;transform:translateY(0) scale(.6)}100%{opacity:0;transform:translateY(34px) scale(1.8)}}
.hda-anim .hda-covers2-wave{animation:hda-covers2-wave 1.5s ease-out infinite;transform-box:fill-box;transform-origin:center}
@keyframes hda-covers2-curt{0%,100%{opacity:.35}50%{opacity:1}}
.hda-anim .hda-covers2-curt{animation:hda-covers2-curt .9s ease-in-out infinite}
@keyframes hda-covers2-flick{0%,100%{opacity:0}30%{opacity:.08}60%{opacity:.02}80%{opacity:.1}}
.hda-anim .hda-covers2-flick{animation:hda-covers2-flick 2.2s linear infinite}
@keyframes hda-covers2-cl1{0%{transform:scaleY(1)}80%,100%{transform:scaleY(1.4)}}
@keyframes hda-covers2-cl2{0%{transform:scaleY(1)}80%,100%{transform:scaleY(2)}}
@keyframes hda-covers2-cl3{0%{transform:scaleY(1)}80%,100%{transform:scaleY(3)}}
@keyframes hda-covers2-cl4{0%{transform:scaleY(1)}80%,100%{transform:scaleY(5)}}
.hda-anim .hda-covers2-cl1,.hda-anim .hda-covers2-cl2,.hda-anim .hda-covers2-cl3,.hda-anim .hda-covers2-cl4{transform-box:fill-box;transform-origin:center;animation-duration:3s;animation-timing-function:ease-in-out;animation-iteration-count:infinite}
.hda-anim .hda-covers2-cl1{animation-name:hda-covers2-cl1}.hda-anim .hda-covers2-cl2{animation-name:hda-covers2-cl2}
.hda-anim .hda-covers2-cl3{animation-name:hda-covers2-cl3}.hda-anim .hda-covers2-cl4{animation-name:hda-covers2-cl4}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-covers2-chev,.hda-anim .hda-covers2-heat,.hda-anim .hda-covers2-blink,.hda-anim .hda-covers2-ring,.hda-anim .hda-covers2-wave,.hda-anim .hda-covers2-curt,.hda-anim .hda-covers2-flick{animation:none}}`;

  (window.HDA = window.HDA || []).push({
    id: "covers2", tab: "Pergolas, valves & sensors", group: "Home", kind: "device", levelLabel: "Position", onWord: "On", offWord: "Off",
    intro: "Radiator valves, outdoor covers and the missing sensors. The slider sets the valve opening (shown on its display), how far the pergola louvers turn, how far the sail and awning reach and how far the screen drops. Menus set the mode, cover state, motion and the handle position.",
    css, icons,
  });
})();
