window.HDAPV = window.HDAPV || {};
(function () {
  let N = 0;
  const DEF = ["#ef4444", "#f97316", "#facc15", "#22c55e", "#06b6d4", "#3b82f6", "#8b5cf6", "#f8fafc", "#111827"];
  const shade = (hex, f) => { const v = parseInt(String(hex || "#888888").slice(1), 16) || 0;
    const c = [v >> 16, (v >> 8) & 255, v & 255].map((x) => Math.max(0, Math.min(255, Math.round(f < 0 ? x * (1 + f) : x + (255 - x) * f))));
    return "#" + c.map((x) => x.toString(16).padStart(2, "0")).join(""); };
  const f1 = (n) => Math.round(n * 10) / 10;
  const lg = (id, x2, y2, st) => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">`
    + st.map((s) => `<stop offset="${s[0]}" stop-color="${s[1]}"${s[2] != null ? ` stop-opacity="${s[2]}"` : ""}/>`).join("") + `</linearGradient>`;
  const rg = (id, cx, cy, r, st) => `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">`
    + st.map((s) => `<stop offset="${s[0]}" stop-color="${s[1]}"${s[2] != null ? ` stop-opacity="${s[2]}"` : ""}/>`).join("") + `</radialGradient>`;
  function norm(o) {
    o = o || {};
    const cols = (Array.isArray(o.colors) ? o.colors : []).concat(DEF).slice(0, 9);
    const pct = Math.max(0, Math.min(100, +o.pct || 0));
    const tool = Number.isInteger(o.tool) && o.tool >= 0 && o.tool < 9 ? o.tool : -1;
    return { cols, pct, tool, act: o.act || cols[Math.max(0, tool)] || "#9aa0a6", off: !!o.off, run: !!o.run && !o.off };
  }
  const common = (k) => lg(`cyl${k}`, 0, 1, [[0, "#000", .62], [.18, "#000", .15], [.34, "#fff", .32], [.46, "#fff", .06], [.75, "#000", .22], [1, "#000", .7]])
    + lg(`tl${k}`, 1, 0, [[0, "#5d6168"], [.35, "#b9bdc2"], [.6, "#9da1a7"], [1, "#5f636a"]])
    + rg(`sh${k}`, "50%", "50%", "50%", [[0, "#000", .55], [.6, "#000", .22], [1, "#000", 0]])
    + rg(`warm${k}`, "50%", "8%", "85%", [[0, "#ffd9a0", .34], [.4, "#ffb060", .1], [1, "#ff9040", 0]]);

  function spools(x, y, w, h, s, k, hi) {
    const sw = w / 9; let out = "";
    s.cols.forEach((c, i) => {
      const bx = x + i * sw, fw = Math.max(1, sw * .13);
      if (!c) { out += `<rect x="${f1(bx)}" y="${y}" width="${f1(sw + .2)}" height="${h}" fill="#141518"/><rect x="${f1(bx + fw + .4)}" y="${y + 2}" width="${f1(sw - 2 * fw - .8)}" height="${h - 4}" rx="1" fill="none" stroke="#9aa1aa" stroke-opacity=".35" stroke-width=".6" stroke-dasharray="2 1.5"/>`
        + `<rect x="${f1(bx)}" y="${y - 1}" width="${f1(fw)}" height="${h + 2}" fill="#16171a"/><rect x="${f1(bx + sw - fw)}" y="${y - 1}" width="${f1(fw)}" height="${h + 2}" fill="#16171a"/>`; return; }
      out += `<rect x="${f1(bx)}" y="${y}" width="${f1(sw + .2)}" height="${h}" fill="${c}"/>`;
      if (hi) out += `<rect x="${f1(bx + fw)}" y="${y}" width="${f1(sw - 2 * fw)}" height="${h}" fill="url(#wd${k})"/>`;
      out += `<rect x="${f1(bx)}" y="${y - 1}" width="${f1(fw)}" height="${h + 2}" fill="#16171a"/><rect x="${f1(bx + sw - fw)}" y="${y - 1}" width="${f1(fw)}" height="${h + 2}" fill="#16171a"/>`;
      if (hi) out += `<rect x="${f1(bx + fw * .35)}" y="${y}" width=".5" height="${h}" fill="#6b6e75"/><rect x="${f1(bx + sw - fw * .65)}" y="${y}" width=".5" height="${h}" fill="#6b6e75"/>`;
    });
    return out + `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#cyl${k})"/>`;
  }
  function feeders(x, y, w, h, s) {
    const sw = w / 9; let out = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="1.5" fill="#0f1012"/>`;
    s.cols.forEach((c, i) => { const cx = x + (i + .5) * sw;
      out += `<rect x="${f1(cx - sw * .34)}" y="${f1(y + h * .18)}" width="${f1(sw * .68)}" height="${f1(h * .64)}" rx="1" fill="#2a2c31"/><circle cx="${f1(cx)}" cy="${f1(y + h / 2)}" r="${f1(Math.min(1.7, h * .2))}" fill="${c || "#3a3d42"}"/>`; });
    return out;
  }
  function dock(x, y, w, h, s, k, hi) {
    const sw = w / 9; let out = `<rect x="${x}" y="${y - 3}" width="${w}" height="${f1(h + 4)}" fill="#1c1e22"/>`;
    for (let i = 0; i < 9; i++) {
      const cx = x + (i + .5) * sw, tw = sw * .74, tx = cx - tw / 2;
      if (i === s.tool) { out += `<rect x="${f1(cx - tw * .4)}" y="${f1(y + 1)}" width="${f1(tw * .8)}" height="${f1(h * .35)}" rx="1" fill="none" stroke="#4a4d54" stroke-width=".7"/>`; continue; }
      out += `<rect x="${f1(tx)}" y="${y}" width="${f1(tw)}" height="${h}" rx="1.4" fill="url(#tl${k})"/>`
        + `<rect x="${f1(tx)}" y="${y}" width="${f1(tw)}" height="${f1(h * .22)}" rx="1.2" fill="#2b2d32"/>`
        + `<rect x="${f1(tx + tw * .18)}" y="${f1(y + h * .52)}" width="${f1(tw * .64)}" height="${f1(Math.max(1.6, h * .16))}" fill="${s.cols[i] || "#3a3d42"}"/>`
        + `<rect x="${f1(cx - .9)}" y="${f1(y + h)}" width="1.8" height="${f1(h * .18)}" fill="#a3a7ad"/>`;
      if (hi) out += `<rect x="${f1(tx + tw * .2)}" y="${f1(y + h * .3)}" width="${f1(tw * .6)}" height=".5" fill="#5d6168"/><rect x="${f1(tx + tw * .2)}" y="${f1(y + h * .38)}" width="${f1(tw * .6)}" height=".5" fill="#5d6168"/><rect x="${f1(tx + .5)}" y="${y}" width=".6" height="${h}" fill="#fff" opacity=".45"/>`;
    }
    return out + `<rect x="${x}" y="${f1(y + h * 1.18)}" width="${w}" height="${f1(Math.max(2, h * .14))}" fill="#43464c"/>`;
  }
  function head(cx, y, sc, s, k) {
    const w = 16 * sc, h = 21 * sc;
    return `<g class="pa-head"><rect x="${f1(cx - w / 2)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="${f1(2.4 * sc)}" fill="url(#tl${k})"/>`
      + `<rect x="${f1(cx - w / 2)}" y="${f1(y)}" width="${f1(w)}" height="${f1(5 * sc)}" rx="${f1(2 * sc)}" fill="#2b2d32"/>`
      + `<rect x="${f1(cx - w * .34)}" y="${f1(y + h * .5)}" width="${f1(w * .68)}" height="${f1(3 * sc)}" fill="${s.act}"/>`
      + `<path d="M${f1(cx - 3 * sc)} ${f1(y + h)}h${f1(6 * sc)}l${f1(-1.8 * sc)} ${f1(3.6 * sc)}h${f1(-2.4 * sc)}z" fill="#b8bbc0"/></g>`;
  }
  function part(cx, base, maxH, w, s) {
    if (s.pct <= 0) return "";
    const ph = Math.max(1.2, maxH * s.pct / 100);
    return `<rect x="${f1(cx - w / 2)}" y="${f1(base - ph)}" width="${f1(w)}" height="${f1(ph)}" rx="1" fill="${s.act}"/>`
      + `<rect x="${f1(cx - w / 2)}" y="${f1(base - ph)}" width="${f1(w)}" height="1.2" fill="${shade(s.act, .45)}"/>`
      + `<rect x="${f1(cx + w / 2 - w * .25)}" y="${f1(base - ph)}" width="${f1(w * .25)}" height="${f1(ph)}" fill="#000" opacity=".18"/>`;
  }
  function screen(x, y, w, h, s) {
    let out = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="#0b0c0e" stroke="#4a4d53" stroke-width=".8"/>`;
    if (s.off) return out;
    const ix = x + 2, iy = y + 2, iw = w - 4, ih = h - 4;
    return out + `<rect x="${f1(ix)}" y="${f1(iy)}" width="${f1(iw)}" height="${f1(ih)}" rx="1" fill="#111a24"/>`
      + `<rect x="${f1(ix + 2)}" y="${f1(iy + 2)}" width="${f1(iw * .35)}" height="1.4" fill="#cfd8e3" opacity=".8"/>`
      + `<rect x="${f1(ix + 2)}" y="${f1(iy + 5)}" width="${f1(iw * .22)}" height="1.1" fill="#7f8b99"/>`
      + `<rect x="${f1(ix + iw * .58)}" y="${f1(iy + 2)}" width="${f1(iw * .34)}" height="${f1(ih * .55)}" rx="1" fill="#1f2a36"/>`
      + `<rect x="${f1(ix + 2)}" y="${f1(iy + ih - 3)}" width="${f1(iw - 4)}" height="1.4" fill="#2a3542"/>`
      + `<rect x="${f1(ix + 2)}" y="${f1(iy + ih - 3)}" width="${f1((iw - 4) * s.pct / 100)}" height="1.4" fill="${s.act}"/>`;
  }
  function tubes(x0, w, y0, y1, xe, spread, op) {
    let out = ""; const sw = w / 9;
    for (let i = 0; i < 9; i++) { const fx = x0 + (i + .5) * sw, ex = xe + (i - 4) * spread;
      out += `<path d="M${f1(fx)} ${y0}C${f1(fx)} ${f1(y0 + (y1 - y0) * .55)} ${f1(ex)} ${f1(y1 - (y1 - y0) * .5)} ${f1(ex)} ${y1}" fill="none" stroke="#d6dae0" stroke-width=".8" opacity="${op}"/>`; }
    return out;
  }

  function drawA(o) {
    const s = norm(o), k = "h3a" + (++N);
    const d = `<defs>${common(k)}`
      + lg(`sil${k}`, 1, 0, [[0, "#a9adb3"], [.04, "#d9dce0"], [.45, "#e3e5e8"], [.85, "#cfd2d6"], [1, "#a4a8ae"]])
      + lg(`hd${k}`, 0, 1, [[0, "#5b5d63"], [.1, "#34363b"], [.5, "#1d1e22"], [1, "#0f1013"]])
      + lg(`sk${k}`, 0, 1, [[0, "#34363b"], [.5, "#24262a"], [1, "#18191c"]])
      + lg(`ch${k}`, 0, 1, [[0, "#1c1e22"], [.6, "#101114"], [1, "#07080a"]])
      + lg(`gl${k}`, 1, 1, [[0, "#fff", .12], [.3, "#fff", .02], [.55, "#fff", .06], [1, "#fff", 0]])
      + lg(`sm${k}`, 0, 1, [[0, "#fff", .2], [.16, "#d8dce2", .1], [.3, "#16171b", .36], [.7, "#14151a", .48], [1, "#0b0c0f", .66]])
      + `<clipPath id="dc${k}"><rect x="39" y="142" width="130" height="162" rx="2"/></clipPath>`
      + `<clipPath id="wc${k}"><rect x="32" y="14" width="132" height="34" rx="10"/></clipPath></defs>`;
    let g = `<ellipse cx="110" cy="341" rx="104" ry="8" fill="url(#sh${k})"/>`;
    g += `<path d="M30 54H193L189 120H30Z" fill="url(#sk${k})"/><rect x="36" y="64" width="148" height="52" rx="4" fill="#0b0c0e" opacity=".55"/>`
      + tubes(32, 132, 58, 120, 98, 3.2, .22)
      + `<path d="M30 54V120" stroke="#5a5d63" stroke-width="1"/><path d="M175 62L172 118" stroke="#000" stroke-width=".8" opacity=".6"/>`;
    g += `<rect x="24" y="8" width="172" height="50" rx="22" fill="url(#hd${k})"/>`
      + `<g clip-path="url(#wc${k})"><rect x="32" y="14" width="132" height="34" fill="#202226"/>` + spools(33, 15, 130, 32, s, k, false)
      + `<rect x="32" y="14" width="132" height="34" fill="url(#sm${k})"/></g>`
      + `<rect x="32" y="14" width="132" height="34" rx="10" fill="none" stroke="#000" stroke-width="1" opacity=".6"/>`
      + `<path d="M44 11H176" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".16"/>`
      + `<path d="M167 11V56" stroke="#08090b" stroke-width="1.2"/><rect x="172" y="20" width="18" height="26" rx="4" fill="#000" opacity=".28" stroke="#4a4d53" stroke-width=".6"/><rect x="176" y="25" width="10" height="1.3" fill="#62656c"/><rect x="176" y="29" width="10" height="1.3" fill="#62656c"/><rect x="176" y="33" width="10" height="1.3" fill="#62656c"/><rect x="176" y="37" width="10" height="1.3" fill="#62656c"/>`
      + feeders(32, 48.5, 132, 7, s);
    g += `<g transform="translate(0 118) scale(1 1.1) translate(0 -118)">`;
    g += `<rect x="30" y="118" width="160" height="196" rx="5" fill="url(#sil${k})"/><rect x="31" y="118.6" width="158" height="1.2" rx=".6" fill="#fff" opacity=".75"/>`
      + `<rect x="101" y="127" width="18" height="2.2" rx="1.1" fill="#8e9298"/>`
      + `<rect x="37" y="140" width="134" height="166" rx="3" fill="#050607" stroke="#2b2d31" stroke-width=".8"/>`;
    let ins = `<rect x="39" y="142" width="130" height="162" fill="url(#ch${k})"/>` + dock(41, 147, 126, 17, s, k, false)
      + `<rect x="42" y="176" width="2" height="128" fill="#25272b"/><rect x="164" y="176" width="2" height="128" fill="#25272b"/>`
      + `<rect x="39" y="210" width="130" height="5" fill="#3b3e43"/><rect x="39" y="210" width="130" height="1" fill="#6a6e74"/>`
      + head(104, 195, 1, s, k)
      + `<rect x="50" y="262" width="108" height="4" fill="#33363b"/><rect x="50" y="262" width="108" height="1" fill="#5e6268"/>` + part(104, 262, 36, 24, s)
      + (s.off ? "" : `<rect x="46" y="268" width="116" height="1.6" fill="#bcd6ff" opacity=".9"/>`)
      + (s.run ? `<rect x="39" y="142" width="130" height="162" fill="url(#warm${k})"/>` : "")
      + `<rect x="39" y="142" width="130" height="162" fill="url(#gl${k})"/><path d="M118 142H132L62 304H48Z" fill="#fff" opacity=".04"/>`
      + (s.off ? `<rect x="39" y="142" width="130" height="162" fill="#000" opacity=".55"/>` : "");
    g += `<g clip-path="url(#dc${k})">${ins}</g>`
      + `<rect x="33" y="312" width="154" height="8" rx="2" fill="#202125"/><rect x="168" y="314" width="15" height="6" rx="1" fill="#0d0e10"/>`
      + `</g>`
      + screen(33, 107, 31, 21, s);
    return `<svg viewBox="0 0 220 350" xmlns="http://www.w3.org/2000/svg">${d}<g${s.off ? ' opacity=".72"' : ""}>${g}</g></svg>`;
  }

  function drawB(o) {
    const s = norm(o), k = "h3b" + (++N);
    const d = `<defs>${common(k)}`
      + lg(`sf${k}`, 1, 0, [[0, "#bfc3c8"], [.1, "#e2e4e7"], [1, "#d2d5d9"]])
      + lg(`ss${k}`, 1, 0, [[0, "#b3b7bd"], [1, "#9ea2a9"]])
      + lg(`hd${k}`, 0, 1, [[0, "#55575d"], [.15, "#303237"], [1, "#141518"]])
      + lg(`hs${k}`, 1, 0, [[0, "#1d1e22"], [1, "#2c2e33"]])
      + lg(`ch${k}`, 0, 1, [[0, "#1b1d21"], [1, "#08090b"]])
      + lg(`gl${k}`, 1, 1, [[0, "#fff", .12], [.35, "#fff", .02], [1, "#fff", .05]])
      + lg(`sm${k}`, 0, 1, [[0, "#fff", .22], [.16, "#d8dce2", .1], [.3, "#16171b", .36], [.7, "#14151a", .48], [1, "#0b0c0f", .66]])
      + `<clipPath id="dc${k}"><rect x="30" y="170" width="114" height="136"/></clipPath>`
      + `<clipPath id="wc${k}"><rect x="26" y="50" width="118" height="34" rx="9"/></clipPath></defs>`;
    const sk = `translate(18 0) skewY(-4.6) translate(-18 0)`;
    let g = `<ellipse cx="122" cy="339" rx="108" ry="9" fill="url(#sh${k})"/>`;
    g += `<path d="M156 150L214 157L211 98L160 84Z" fill="url(#hs${k})"/>` + `<path d="M166 96C182 112 196 130 204 152" stroke="#d6dae0" stroke-width=".8" fill="none" opacity=".2"/><path d="M172 94C188 112 200 132 208 154" stroke="#d6dae0" stroke-width=".8" fill="none" opacity=".16"/>`
      + `<path d="M22 150H156L158 82L21 92Z" fill="#26282c"/><path d="M28 148H150L151 96L27 102Z" fill="#0c0d0f" opacity=".5"/>` + tubes(26, 124, 96, 150, 80, 3, .22)
      + `<g transform="${sk}"><rect x="18" y="44" width="146" height="50" rx="21" fill="url(#hd${k})"/>`
      + `<g clip-path="url(#wc${k})"><rect x="26" y="50" width="118" height="34" fill="#202226"/>` + spools(27, 51, 116, 32, s, k, false) + `<rect x="26" y="50" width="118" height="34" fill="url(#sm${k})"/></g>`
      + `<path d="M36 47H156" stroke="#fff" stroke-width="1.4" stroke-linecap="round" opacity=".18"/>` + feeders(26, 84.5, 118, 6.5, s) + `</g>`
      + `<path d="M145 34C168 30 192 26 207 30C218 35 221 52 219 70C217 86 213 97 205 101L160 93C151 77 145 56 145 34Z" fill="url(#hd${k})"/><path d="M145 34C145 56 151 77 160 93" stroke="#000" stroke-width="1.1" fill="none" opacity=".6"/><path d="M150 33C172 29 194 26 206 31" stroke="#fff" stroke-width="1.2" fill="none" opacity=".2"/><path d="M211 38C216 52 216 70 212 86" stroke="#fff" stroke-width="1.2" fill="none" opacity=".12"/><path d="M174 48L200 45V78L176 82Z" fill="#000" opacity=".25"/><rect x="180" y="53" width="13" height="1.4" fill="#5e6168" transform="rotate(-6 186 53)"/><rect x="180" y="58" width="13" height="1.4" fill="#5e6168" transform="rotate(-6 186 58)"/>`;
    g += `<g transform="translate(0 150) scale(1 1.12) translate(0 -150)">`;
    g += `<path d="M156 150L214 157V318L156 314Z" fill="url(#ss${k})"/><path d="M163 163L207 168V211L163 206Z" fill="#0e0f11"/>`
      + `<rect x="170" y="172" width="8" height="1.6" fill="#d9dce0" opacity=".7"/><circle cx="196" cy="185" r="2" fill="none" stroke="#9aa0a7" stroke-width=".7"/><rect x="170" y="180" width="5" height="1.2" fill="#9aa0a7"/>`
      + `<path d="M196 309L208 310V317L196 316Z" fill="#141518"/>`
      + `<rect x="22" y="150" width="134" height="164" rx="3" fill="url(#sf${k})"/><path d="M156 151V313" stroke="#fff" stroke-width=".8" opacity=".55"/><path d="M23 150.6H155" stroke="#fff" stroke-width="1" opacity=".7"/>`
      + `<rect x="80" y="158" width="15" height="2" rx="1" fill="#8e9298"/><rect x="28" y="168" width="118" height="140" rx="2" fill="#050607"/>`;
    let ins = `<rect x="30" y="170" width="114" height="136" fill="url(#ch${k})"/>` + dock(31, 174, 112, 15, s, k, false)
      + `<rect x="30" y="214" width="114" height="4" fill="#3b3e43"/><rect x="30" y="214" width="114" height="1" fill="#6a6e74"/>` + head(87, 201, .9, s, k)
      + `<rect x="40" y="266" width="94" height="4" fill="#34373c"/>` + part(87, 266, 32, 20, s)
      + (s.off ? "" : `<rect x="34" y="272" width="106" height="1.5" fill="#bcd6ff" opacity=".9"/>`)
      + (s.run ? `<rect x="30" y="170" width="114" height="136" fill="url(#warm${k})"/>` : "")
      + `<rect x="30" y="170" width="114" height="136" fill="url(#gl${k})"/><path d="M104 170H116L58 306H46Z" fill="#fff" opacity=".045"/>`
      + (s.off ? `<rect x="30" y="170" width="114" height="136" fill="#000" opacity=".55"/>` : "");
    g += `<g clip-path="url(#dc${k})">${ins}</g>`
      + `<rect x="24" y="312" width="132" height="6" rx="1.5" fill="#1d1e22"/><path d="M156 313L212 317V320L156 318Z" fill="#141518"/>`
      + `</g>`
      + screen(25, 138, 30, 21, s);
    return `<svg viewBox="0 0 240 348" xmlns="http://www.w3.org/2000/svg">${d}<g${s.off ? ' opacity=".72"' : ""}>${g}</g></svg>`;
  }

  function slotLed(cx, cy, r, i, loaded, st, glowOnly) {
    var q = function (n) { return Math.round(n * 10) / 10; };
    var sel = !st.off && (st.slot === i || (st.slot == null && !!st.err)), glow = sel && (st.run || !!st.err);
    var C = function (rr, fill, op) { return '<circle cx="' + q(cx) + '" cy="' + q(cy) + '" r="' + q(rr) + '" fill="' + fill + '"' + (op != null ? ' fill-opacity="' + op + '"' : "") + '/>'; };
    if (!glow) { if (glowOnly) return ""; return st.off || !loaded ? C(r, "#2a2c30") : C(r, "#eef2f6", st.slot === i ? .95 : .5); }
    var c = st.err ? "#ef4444" : "#4ade80", core = st.err ? "#f87171" : "#ecfdf5";
    r *= 1.5; return '<g>' + C(r * 4.4, c, .18) + C(r * 2.7, c, .36) + C(r * 1.2, core) + '<animate attributeName="opacity" values=".35;1;.35" dur="2.4s" repeatCount="indefinite"/></g>';
  }
  function dryGlow(o, s, k, x, w, cy, top) {
    const d = !s.off && Array.isArray(o && o.dry) ? [...new Set(o.dry.filter((i) => Number.isInteger(i) && i >= 0 && i < 9))] : [];
    if (!d.length) return ["", ""];
    const sw = w / 9, an = (a, b) => `<animate attributeName="opacity" values="${a};${b};${a}" dur="4s" repeatCount="indefinite"/>`;
    let g = "", m = "";
    d.forEach((i) => { const cx = f1(x + (i + .5) * sw);
      g += `<g>${an(.45, 1)}<ellipse cx="${cx}" cy="${cy}" rx="${f1(sw * 1.25)}" ry="21" fill="url(#dz${k})"/><rect x="${f1(x + i * sw + .6)}" y="${cy - 16}" width="${f1(sw - 1.2)}" height="32" fill="#fb923c" opacity=".16"/></g>`;
      m += `<g>${an(.3, .9)}<ellipse cx="${cx}" cy="${top + 1}" rx="${f1(sw * .9)}" ry="4" fill="url(#dz${k})"/>`
        + [-2.6, 0, 2.6].map((dx) => `<path d="M${f1(+cx + dx)} ${top - 1}c-1.3 -1.6 1.3 -2.6 0 -4.2s1.3 -2.6 0 -4.2" fill="none" stroke="#fb923c" stroke-width=".9" stroke-linecap="round"/>`).join("") + `</g>`; });
    return [g, m];
  }
  function drawC(o) {
    const s = norm(o), k = "h3c" + (++N), dry = dryGlow(o, s, k, 29, 116, 69, 44);
    const d = `<defs>${common(k)}`
      + rg(`dz${k}`, "50%", "50%", "50%", [[0, "#f59e0b", .75], [.5, "#fb923c", .32], [1, "#fb923c", 0]])
      + lg(`sf${k}`, 1, 0, [[0, "#b8bcc2"], [.05, "#e6e8eb"], [.5, "#dcdfe2"], [.96, "#c8cbd0"], [1, "#f2f3f5"]])
      + lg(`sfv${k}`, 0, 1, [[0, "#fff", .25], [.25, "#fff", 0], [1, "#000", .12]])
      + lg(`ss${k}`, 1, 0, [[0, "#c2c6cb"], [.5, "#adb1b7"], [1, "#979ba2"]])
      + lg(`hd${k}`, 0, 1, [[0, "#6a6c72"], [.07, "#3b3d42"], [.4, "#212226"], [1, "#0e0f11"]])
      + lg(`hb${k}`, 1, 0, [[0, "#2c2e33"], [.55, "#3b3d43"], [1, "#16171a"]])
      + lg(`hs${k}`, 1, 0, [[0, "#141518"], [.6, "#24262a"], [1, "#2f3136"]])
      + lg(`fs${k}`, 0, 1, [[0, "#36383d"], [.45, "#26282c"], [1, "#17181b"]])
      + lg(`ch${k}`, 0, 1, [[0, "#202227"], [.55, "#121316"], [1, "#060708"]])
      + lg(`lw${k}`, 1, 0, [[0, "#0b0c0e"], [1, "#1a1c20"]])
      + lg(`gl${k}`, 1, 1, [[0, "#fff", .16], [.22, "#fff", .03], [.5, "#fff", .0], [.62, "#fff", .07], [.7, "#fff", .01], [1, "#fff", .04]])
      + lg(`sm${k}`, 0, 1, [[0, "#fff", .3], [.12, "#e2e6eb", .12], [.26, "#16171b", .34], [.7, "#14151a", .46], [1, "#0b0c0f", .66]])
      + lg(`fl${k}`, 0, 1, [[0, "#000", 0], [1, "#000", .25]])
      + `<pattern id="wd${k}" width="1.3" height="10" patternUnits="userSpaceOnUse"><rect width=".45" height="10" fill="#000" opacity=".22"/></pattern>`
      + `<filter id="bl${k}" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="3.5"/></filter>`
      + `<clipPath id="dc${k}"><rect x="32" y="172" width="116" height="134" rx="1.5"/></clipPath>`
      + `<clipPath id="wc${k}"><rect x="28" y="52" width="118" height="34" rx="9.5"/></clipPath></defs>`;
    const sk = `translate(20 0) skewY(-4.6) translate(-20 0)`;
    let g = `<ellipse cx="128" cy="340" rx="112" ry="9" fill="#000" opacity=".5" filter="url(#bl${k})"/><ellipse cx="122" cy="337" rx="100" ry="3.5" fill="#000" opacity=".55" filter="url(#bl${k})"/>`;
    g += `<path d="M158 152L218 159L215 98L162 85Z" fill="url(#hs${k})"/><path d="M164 150L212 156L210 104L166 94Z" fill="#090a0c" opacity=".45"/>`
      + `<path d="M168 98C184 114 198 132 206 154M174 96C190 114 202 134 210 156M180 96C194 112 206 132 213 154" stroke="#dfe3e8" stroke-width=".7" fill="none" opacity=".2"/>`
      + `<path d="M158 152L162 85" stroke="#55585e" stroke-width=".8"/>`
      + `<path d="M24 152H158L160 84L23 94Z" fill="url(#fs${k})"/><path d="M30 150H152L153 98L29 104Z" fill="#08090b" opacity=".55"/>`
      + `<path d="M36 112H146M36 128H146" stroke="#2c2e33" stroke-width="1.2"/>` + tubes(28, 124, 98, 152, 82, 3.2, .26)
      + `<path d="M40 140C70 132 110 130 146 138" stroke="#e6e9ee" stroke-width=".9" fill="none" opacity=".18"/>`
      + `<path d="M24 152L23 94" stroke="#6d7076" stroke-width="1"/><path d="M26 150H156" stroke="#000" stroke-width="1" opacity=".5"/>`;
    g += `<g transform="${sk}"><rect x="20" y="45" width="146" height="50" rx="21" fill="url(#hd${k})"/>`
      + `<g clip-path="url(#wc${k})"><rect x="28" y="52" width="118" height="34" fill="#1c1d21"/>` + spools(29, 53, 116, 32, s, k, true) + dry[0]
      + `<rect x="28" y="52" width="118" height="34" fill="url(#sm${k})"/><path d="M28 58H146V60.5H28Z" fill="#fff" opacity=".12"/></g>`
      + `<rect x="28" y="52" width="118" height="34" rx="9.5" fill="none" stroke="#000" stroke-width="1.2" opacity=".7"/><rect x="28.8" y="52.8" width="116.4" height="32.4" rx="9" fill="none" stroke="#fff" stroke-width=".5" opacity=".18"/>`
      + `<path d="M40 47.5H158" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".26"/><path d="M24 70C24 80 26 88 32 93" stroke="#fff" stroke-width="1" fill="none" opacity=".15"/>`
      + dry[1] + feeders(28, 86.3, 118, 6.3, s) + [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => slotLed(28 + (i + .5) * 118 / 9, 89.45, 1.5, i, true, { off: s.off, run: s.run, err: !!(o && o.err), slot: o && Number.isInteger(o.slot) ? o.slot : null }, true)).join("") + `<path d="M28 92.6H146" stroke="#000" stroke-width=".8" opacity=".6"/></g>`
      + `<path d="M147 35C170 31 196 26 211 31C222 36 225 54 223 72C221 89 216 100 208 104L162 96C153 79 147 57 147 35Z" fill="url(#hb${k})"/><path d="M147 35C147 57 153 79 162 96" stroke="#000" stroke-width="1.1" fill="none" opacity=".6"/><path d="M148.6 36C149 57 155 78 163.5 94" stroke="#fff" stroke-width=".6" fill="none" opacity=".18"/><path d="M152 34C175 30 198 26 210 32" stroke="#fff" stroke-width="1.4" fill="none" opacity=".26"/><path d="M215 40C220 54 220 72 216 88" stroke="#fff" stroke-width="2" fill="none" opacity=".1"/><path d="M176 48L204 45V80L178 84Z" fill="#000" opacity=".28" stroke="#4a4d53" stroke-width=".6"/><rect x="182" y="52" width="15" height="1.2" fill="#62656c" transform="rotate(-6 189 52)"/><rect x="182" y="56" width="15" height="1.2" fill="#62656c" transform="rotate(-6 189 56)"/><rect x="182" y="60" width="15" height="1.2" fill="#62656c" transform="rotate(-6 189 60)"/><rect x="182" y="64" width="15" height="1.2" fill="#62656c" transform="rotate(-6 189 64)"/><path d="M170 98C182 102 198 104 212 102" stroke="#000" stroke-width="1" fill="none" opacity=".5"/>`;
    g += `<g transform="translate(0 152) scale(1 1.12) translate(0 -152)">`;
    g += `<path d="M157 152L218 159V319L157 315Z" fill="url(#ss${k})"/><path d="M157 152L218 159V161.5L157 154.5Z" fill="#fff" opacity=".35"/>`
      + `<path d="M188 156V317" stroke="#8d9198" stroke-width=".6" opacity=".7"/><path d="M157 246L218 251" stroke="#8d9198" stroke-width=".6" opacity=".6"/>`
      + `<path d="M164 164L211 169V214L164 209Z" fill="#0d0e10" stroke="#3c3f44" stroke-width=".7"/><path d="M165 165L210 170V174L165 169Z" fill="#fff" opacity=".07"/>`
      + `<rect x="170" y="176" width="9" height="1.5" fill="#e3e6ea" opacity=".75"/><rect x="170" y="181" width="6" height="1.2" fill="#9aa0a7"/><rect x="170" y="190" width="11" height="1.2" fill="#6d737a"/><circle cx="198" cy="187" r="2.4" fill="none" stroke="#a5abb2" stroke-width=".7"/><circle cx="204" cy="188" r="1" fill="#a5abb2"/>`
      + `<path d="M197 309L211 310.5V318L197 317Z" fill="#141518"/><path d="M217.4 160V318" stroke="#fff" stroke-width=".6" opacity=".35"/>`
      + `</g>`;
    g += `<g transform="translate(0 152) scale(1 1.12) translate(0 -152)">`;
    g += `<rect x="24" y="152" width="134" height="163" rx="3.5" fill="url(#sf${k})"/><rect x="24" y="152" width="134" height="163" rx="3.5" fill="url(#sfv${k})"/>`
      + `<path d="M26 152.7H156" stroke="#fff" stroke-width="1.2" opacity=".85"/><path d="M157.6 154V313" stroke="#fff" stroke-width="1" opacity=".7"/><path d="M24.6 155V312" stroke="#8f9399" stroke-width=".8"/>`
      + `<rect x="82" y="160" width="15" height="2" rx="1" fill="#8b8f95"/><rect x="130" y="160" width="6" height="2" rx="1" fill="#b0b4b9"/>`
      + `<rect x="30" y="170" width="120" height="138" rx="2.5" fill="#040506" stroke="#9ea2a8" stroke-width=".7"/>`;
    let ins = `<rect x="32" y="172" width="116" height="134" fill="url(#ch${k})"/>`
      + `<path d="M32 172L50 180V296L32 306Z" fill="url(#lw${k})"/><path d="M50 180H148M50 296H148" stroke="#2a2c31" stroke-width=".8"/><path d="M50 180V296" stroke="#2f3237" stroke-width=".8"/>`
      + dock(34, 176, 112, 16, s, k, true) + `<path d="M34 199H146" stroke="#7d8188" stroke-width=".5"/>`
      + `<rect x="54" y="203" width="1.6" height="92" fill="#2b2d32"/><rect x="141" y="203" width="1.6" height="92" fill="#2b2d32"/>`
      + `<rect x="32" y="218" width="116" height="5" fill="#3c3f44"/><rect x="32" y="218" width="116" height="1" fill="#80848a"/><rect x="32" y="222" width="116" height="1" fill="#0b0c0e"/>`
      + head(92, 203, 1, s, k)
      + `<path d="M48 270H142L146 276H40Z" fill="#2f3237"/><path d="M48 270H142" stroke="#686c73" stroke-width=".8"/>` + part(92, 271, 34, 22, s)
      + (s.off ? "" : `<rect x="38" y="277" width="110" height="1.6" fill="#c6dcff" opacity=".95"/><rect x="38" y="275.5" width="110" height="4.5" fill="#9cc2ff" opacity=".18"/>`)
      + `<rect x="32" y="282" width="116" height="24" fill="url(#fl${k})"/>`
      + (s.run ? `<rect x="32" y="172" width="116" height="134" fill="url(#warm${k})"/>` : "")
      + `<rect x="32" y="172" width="116" height="134" fill="url(#gl${k})"/><path d="M98 172H114L60 306H44Z" fill="#fff" opacity=".05"/><path d="M120 172H124L70 306H66Z" fill="#fff" opacity=".05"/>`
      + `<path d="M33 173H147" stroke="#fff" stroke-width=".8" opacity=".25"/>`
      + (s.off ? `<rect x="32" y="172" width="116" height="134" fill="#000" opacity=".55"/>` : "");
    g += `<g clip-path="url(#dc${k})">${ins}</g>`
      + `<rect x="26" y="313" width="132" height="6" rx="1.5" fill="#1c1d20"/><path d="M157 314L217 318V321L157 319Z" fill="#121315"/>`
      + `</g>`
      + `<path d="M25.5 138.5L56.5 137V158.5L25.5 160Z" fill="#2f3136"/>` + `<g transform="translate(0 0)">${screen(26, 139, 30, 20.5, s)}</g>`
      + `<path d="M27 139.6H55" stroke="#fff" stroke-width=".6" opacity=".3"/>`;
    return `<svg viewBox="0 0 244 350" xmlns="http://www.w3.org/2000/svg">${d}<g${s.off ? ' opacity=".72"' : ""}>${g}</g></svg>`;
  }

  window.HDAPV.changer = [
    { name: "Studio front", draw: drawA },
    { name: "3/4 bold", draw: drawB },
    { name: "Hero render", draw: drawC },
  ];
})();
